import { NextResponse } from 'next/server';
import { chromium, Browser, BrowserContext } from 'playwright-core';
import {
  createVercelOptimizedBrowserContext,
  setupResourceBlocking,
  scrapCafeData,
  getVercelOptimizedChromiumArgs,
  getProductionExecutablePath,
  handleScrappingError,
  BrowserConfig,
  ScrappingConfig,
} from '@/lib/data/scrapper';

export const runtime = 'nodejs';

let globalBrowser: Browser | null = null;
let browserInitializing = false;

interface ContextPoolItem {
  context: BrowserContext;
  isBeingUsed: boolean;
  lastUsed: number;
  isClosed: boolean;
}

const contextPool: ContextPoolItem[] = [];
const MAX_CONTEXTS = 3;
const CONTEXT_TIMEOUT = 5 * 60 * 1000;

/** 글로벌 브라우저 인스턴스
 * @description 브라우저 인스턴스를 반환하는 비동기 함수, 모든 유저가 재사용할 수 있도록 글로벌 변수로 관리
 */
async function getBrowserInstance(): Promise<Browser> {
  if (browserInitializing) {
    while (browserInitializing) await new Promise(resolve => setTimeout(resolve, 100));
    if (globalBrowser && globalBrowser.isConnected()) return globalBrowser;
  }

  if (globalBrowser && globalBrowser.isConnected()) return globalBrowser;

  browserInitializing = true;

  try {
    globalBrowser = await chromium.launch({
      args: getVercelOptimizedChromiumArgs(),
      executablePath: await getProductionExecutablePath(),
      headless: true,
    });

    return globalBrowser;
  } finally {
    browserInitializing = false;
  }
}

/**
 * Context Pool에서 사용 가능한 컨텍스트를 가져오거나 새로 생성하는 함수
 */
async function getAvailableContext(browser: Browser, config: BrowserConfig): Promise<ContextPoolItem> {
  // 사용 중이지 않은 컨텍스트 찾기
  const availableItem = contextPool.find(item =>
    !item.isBeingUsed &&
    !item.isClosed &&
    Date.now() - item.lastUsed < CONTEXT_TIMEOUT
  );

  if (availableItem) {
    availableItem.isBeingUsed = true;
    availableItem.lastUsed = Date.now();
    console.log(`♻️ Context 재사용 (Pool 크기: ${contextPool.length})`);
    return availableItem;
  }

  // 새 컨텍스트 생성
  if (contextPool.length < MAX_CONTEXTS) {
    console.log(`🆕 새 Context 생성 (Pool 크기: ${contextPool.length + 1}/${MAX_CONTEXTS})`);
    const newContext = await createVercelOptimizedBrowserContext(browser, config);
    const newItem: ContextPoolItem = {
      context: newContext,
      isBeingUsed: true,
      lastUsed: Date.now(),
      isClosed: false
    };
    contextPool.push(newItem);
    return newItem;
  }

  // Pool이 가득 찬 경우 대기 후 재시도
  console.log(`⏳ 컨텍스트 풀 대기...`);
  await new Promise(resolve => setTimeout(resolve, 200));
  return getAvailableContext(browser, config);
}

/**
 * 컨텍스트 사용 완료 후 Pool에 반환하는 함수
 */
function releaseContext(contextItem: ContextPoolItem) {
  contextItem.isBeingUsed = false;
  contextItem.lastUsed = Date.now();
  console.log(`🔄 Context Pool에 반환 (사용 가능: ${contextPool.filter(item => !item.isBeingUsed).length}/${contextPool.length})`);
}

/**
 * 오래된 컨텍스트들을 정리하는 함수
 */
function cleanupOldContexts() {
  const now = Date.now();
  const itemsToRemove = contextPool.filter(item =>
    !item.isBeingUsed &&
    (now - item.lastUsed > CONTEXT_TIMEOUT || item.isClosed)
  );

  itemsToRemove.forEach(item => {
    const index = contextPool.indexOf(item);
    if (index > -1) {
      if (!item.isClosed) {
        item.context.close().catch(() => { });
        item.isClosed = true;
      }
      contextPool.splice(index, 1);
      console.log(`🧹 오래된 Context 정리 (Pool 크기: ${contextPool.length})`);
    }
  });
}

// 주기적으로 오래된 컨텍스트 정리
setInterval(cleanupOldContexts, 2 * 60 * 1000);

// Keep-Alive: 브라우저 인스턴스 생명주기 관리
let browserKeepAliveTimeout: ReturnType<typeof setTimeout> | null = null;

function resetBrowserKeepAlive() {
  if (browserKeepAliveTimeout) {
    clearTimeout(browserKeepAliveTimeout);
  }

  // 10분간 사용되지 않으면 브라우저 종료
  browserKeepAliveTimeout = setTimeout(async () => {
    console.log('브라우저 종료 Keep-Alive 타임아웃');

    contextPool.forEach(item => {
      if (!item.isClosed) {
        item.context.close().catch(() => { });
        item.isClosed = true;
      }
    });
    contextPool.length = 0;

    if (globalBrowser && globalBrowser.isConnected()) {
      await globalBrowser.close().catch(() => { });
      globalBrowser = null;
    }
  }, 10 * 60 * 1000);
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: '유효하지 않은 카페 ID입니다' }, { status: 400 });

  let contextItem: ContextPoolItem | null = null;

  try {
    const browser = await getBrowserInstance();

    const browserConfig: BrowserConfig = {
      viewport: { width: 1280, height: 720 },
    };

    const scrapingConfig: ScrappingConfig = {
      waitUntil: 'networkidle',
      timeout: 8000,
      selectorTimeout: 3000,
      minWaitTime: 3000,
      resourceBlocking: {
        blockImages: true,
        blockFonts: true,
        blockStylesheets: true,
      },
    };

    contextItem = await getAvailableContext(browser, browserConfig);
    const page = await contextItem.context.newPage();

    resetBrowserKeepAlive();

    await setupResourceBlocking(page, scrapingConfig.resourceBlocking);

    const data = await scrapCafeData(page, id, scrapingConfig);

    await page.close().catch(() => { });

    if (contextItem) releaseContext(contextItem);

    return NextResponse.json(data);
  } catch (error) {
    console.error('카페 상세정보 크롤링 실패:', error);

    if (contextItem) releaseContext(contextItem);

    const errorResponse = handleScrappingError(error);
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.status }
    );
  }
}
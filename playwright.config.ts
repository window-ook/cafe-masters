import { defineConfig, devices } from '@playwright/test';

/**
 * 운영 스모크 검사 설정
 * @description 운영 URL을 직접 확인하므로 개발 서버를 띄우지 않습니다.
 * 다른 환경을 확인할 때는 SMOKE_BASE_URL로 덮어씁니다. (예: Preview 배포 URL)
 */
export default defineConfig({
  testDir: './tests/smoke',
  forbidOnly: !!process.env.CI,
  /* 외부 네트워크를 거치므로 일시적인 실패는 한 번 재시도합니다 */
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: process.env.SMOKE_BASE_URL ?? 'https://www.cafe-masters.com',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

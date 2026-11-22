'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import LazyPackOpeningViewer from '@/components/opening/LazyPackOpeningViewer';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import type { DrawnMaterial } from '@/utils/shared/material';

interface IPackOpeningModal {
  /** 서버가 저장한 재질. null이면 모달을 닫습니다 */
  material: DrawnMaterial | null;
  /** 연출 끝·건너뛰기·닫기·Esc에서 호출됩니다. 저장은 이미 끝난 상태입니다 */
  onCloseAction: () => void;
}

/**
 * 카드팩 개봉 모달
 * @description 네이티브 dialog를 써서 포커스를 안에 가두고 배경을 비활성화합니다.
 * 뷰어 청크를 받는 동안에는 건너뛰기 버튼이 없으므로 닫기 버튼은 항상 보입니다.
 * 바깥 탭에는 반응하지 않습니다. 전체 화면이라 바깥 영역이 없습니다.
 */
export default function PackOpeningModal({
  material,
  onCloseAction,
}: IPackOpeningModal) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = material !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  /* 모달 뒤의 문서가 스크롤되지 않게 막고, 닫으면 원래대로 돌립니다 */
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="카드팩 개봉"
      /* Esc는 브라우저가 닫기 전에 완료 처리로 보냅니다 */
      onCancel={event => {
        event.preventDefault();
        onCloseAction();
      }}
      /* 캐러셀의 window 방향키 핸들러가 배경을 움직이지 않게 막습니다 */
      onKeyDown={event => event.stopPropagation()}
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-none bg-neutral-950 p-0 backdrop:bg-black/80"
    >
      {material && (
        <>
          <ErrorBoundaryWrapper
            featureName="카드팩 개봉"
            message="개봉 연출을 불러오지 못했어요. 닫으면 저장된 카드를 볼 수 있어요."
          >
            <LazyPackOpeningViewer
              material={material}
              onComplete={onCloseAction}
            />
          </ErrorBoundaryWrapper>
          <button
            type="button"
            aria-label="개봉 화면 닫기"
            onClick={onCloseAction}
            className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white hover:cursor-pointer hover:bg-black/80"
          >
            <X className="size-6" />
          </button>
        </>
      )}
    </dialog>
  );
}

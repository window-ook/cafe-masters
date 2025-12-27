export interface ICafeDetailSkeleton {
  withHeader?: boolean;
}

export default function CafeDetailSkeleton({
  withHeader = false,
}: ICafeDetailSkeleton) {
  return (
    <>
      {withHeader && (
        <header className="flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="skeleton-shimmer size-8 rounded-full" />
          </div>
          <div className="skeleton-shimmer size-8 rounded-full" />
        </header>
      )}

      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4">
        {/* 이미지 섹션 */}
        <section className="shadow-main/10 relative flex flex-col items-center gap-4 rounded-md shadow-sm">
          <button
            type="button"
            aria-label="카페 이미지 슬라이드 왼쪽으로 이동"
            disabled
            className="slide-images-button left-0 bg-white/30 opacity-50"
          >
            <span className="text-main">◀</span>
          </button>

          {/* 이미지 스켈레톤 */}
          <div className="scrollbar-hide flex w-full max-w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden">
            <div className="h-60 shrink-0 snap-center py-2">
              <div className="skeleton-shimmer h-[240px] w-[340px] rounded-md" />
            </div>
          </div>

          <button
            type="button"
            aria-label="카페 이미지 슬라이드 오른쪽으로 이동"
            disabled
            className="slide-images-button right-0 bg-white/30 opacity-50"
          >
            <span className="text-main">▶</span>
          </button>
        </section>

        {/* 카페 정보 섹션 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            {/* 카페 이름 */}
            <div className="skeleton-shimmer h-8 w-48 rounded" />
            {/* 공유 버튼 */}
            <div className="skeleton-shimmer size-8 rounded-full" />
          </div>

          {/* 주소 */}
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-1 flex items-center gap-1">
              <div className="skeleton-shimmer size-4 rounded" />
              <div className="skeleton-shimmer h-5 w-12 rounded" />
            </div>
            <div className="col-span-2">
              <div className="skeleton-shimmer h-5 w-full rounded" />
            </div>
          </div>

          {/* 전화번호 */}
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-1 flex items-center gap-1">
              <div className="skeleton-shimmer size-4 rounded" />
              <div className="skeleton-shimmer h-5 w-16 rounded" />
            </div>
            <div className="col-span-1">
              <div className="skeleton-shimmer h-5 w-32 rounded" />
            </div>
          </div>

          {/* 운영시간 */}
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-1 flex items-center gap-1">
              <div className="skeleton-shimmer size-4 rounded" />
              <div className="skeleton-shimmer h-5 w-16 rounded" />
            </div>
            <div className="col-span-1">
              <div className="skeleton-shimmer h-5 w-32 rounded" />
            </div>
          </div>
        </section>

        {/* 액션 버튼 섹션 */}
        <section className="flex gap-2">
          <div className="skeleton-shimmer h-10 flex-1 rounded" />
          <div className="skeleton-shimmer h-10 flex-1 rounded" />
        </section>

        {/* 메뉴 섹션 */}
        <div className="w-full">
          <div className="skeleton-shimmer mb-4 h-12 w-full rounded-lg" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-lg p-3 shadow-md">
                <div className="flex items-start justify-between">
                  <div className="skeleton-shimmer h-5 w-24 rounded" />
                  <div className="skeleton-shimmer h-5 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

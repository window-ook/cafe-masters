export interface ICafeDetailSkeleton {
  withHeader?: boolean;
}

export default function CafeDetailSkeleton({ withHeader = false }: ICafeDetailSkeleton) {
  return (
    <>
      {withHeader && (
        <header className="w-full p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="size-8 skeleton-shimmer rounded-full" />
          </div>
          <div className="size-8 skeleton-shimmer rounded-full" />
        </header>
      )}

      <main className="overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 flex-1">
        {/* 이미지 섹션 */}
        <section className="relative shadow-sm shadow-main/10 rounded-md flex flex-col items-center gap-4">
          <button
            type="button"
            aria-label="카페 이미지 슬라이드 왼쪽으로 이동"
            disabled
            className="slide-images-button left-0 bg-white/30 opacity-50"
          >
            <span className='text-main'>◀</span>
          </button>

          {/* 이미지 스켈레톤 */}
          <div className="w-full max-w-full overflow-x-auto overflow-y-hidden flex gap-4 scrollbar-hide snap-x snap-mandatory">
            <div className="h-60 py-2 snap-center shrink-0">
              <div className="w-[340px] h-[240px] skeleton-shimmer rounded-md" />
            </div>
          </div>

          <button
            type="button"
            aria-label="카페 이미지 슬라이드 오른쪽으로 이동"
            disabled
            className="slide-images-button right-0 bg-white/30 opacity-50"
          >
            <span className='text-main'>▶</span>
          </button>
        </section>

        {/* 카페 정보 섹션 */}
        <section className="space-y-4">
          <div className='flex items-center justify-between'>
            {/* 카페 이름 */}
            <div className="h-8 w-48 skeleton-shimmer rounded" />
            {/* 공유 버튼 */}
            <div className="size-8 skeleton-shimmer rounded-full" />
          </div>

          {/* 주소 */}
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-1 flex gap-1 items-center">
              <div className="size-4 skeleton-shimmer rounded" />
              <div className="h-5 w-12 skeleton-shimmer rounded" />
            </div>
            <div className="col-span-2">
              <div className="h-5 w-full skeleton-shimmer rounded" />
            </div>
          </div>

          {/* 전화번호 */}
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-1 flex gap-1 items-center">
              <div className="size-4 skeleton-shimmer rounded" />
              <div className="h-5 w-16 skeleton-shimmer rounded" />
            </div>
            <div className="col-span-1">
              <div className="h-5 w-32 skeleton-shimmer rounded" />
            </div>
          </div>

          {/* 운영시간 */}
          <div className="col-span-2 grid grid-cols-3">
            <div className="col-span-1 flex gap-1 items-center">
              <div className="size-4 skeleton-shimmer rounded" />
              <div className="h-5 w-16 skeleton-shimmer rounded" />
            </div>
            <div className="col-span-1">
              <div className="h-5 w-32 skeleton-shimmer rounded" />
            </div>
          </div>
        </section>

        {/* 액션 버튼 섹션 */}
        <section className="flex gap-2">
          <div className="h-10 flex-1 skeleton-shimmer rounded" />
          <div className="h-10 flex-1 skeleton-shimmer rounded" />
        </section>

        {/* 메뉴 섹션 */}
        <div className="w-full">
          <div className="w-full h-12 mb-4 skeleton-shimmer rounded-lg" />
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 shadow-md rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="w-24 h-5 skeleton-shimmer rounded" />
                  <div className="w-16 h-5 skeleton-shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

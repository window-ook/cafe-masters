export default function SideBarSkeleton() {
  return (
    <aside className="flex h-screen w-screen max-w-92 bg-transparent">
      <div className="relative z-10 w-full rounded-none px-1">
        <section className="flex h-full flex-col">
          {/* 헤더 */}
          <header className="top-0 flex w-full max-w-108 flex-none flex-col gap-2 bg-transparent py-4">
            {/* 로고 영역 */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-8 animate-pulse rounded-md bg-gray-200" />
                <div className="h-8 w-40 animate-pulse rounded-md bg-gray-200" />
              </div>
            </div>
          </header>

          {/* 탭 리스트 */}
          <ul className="flex flex-1 flex-col">
            {/* 검색 결과 */}
            <li className="flex w-full justify-between rounded-lg px-3 py-4">
              <div className="flex items-center gap-2">
                <div className="size-6 animate-pulse rounded-md bg-gray-200" />
                <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200" />
              </div>
            </li>

            {/* 내가 수집한 카페 */}
            <li className="flex w-full justify-between rounded-lg px-3 py-4">
              <div className="flex items-center gap-2">
                <div className="size-6 animate-pulse rounded-md bg-gray-200" />
                <div className="h-6 w-40 animate-pulse rounded-md bg-gray-200" />
              </div>
            </li>

            {/* 북마크한 카페 */}
            <li className="flex w-full justify-between rounded-lg px-3 py-4">
              <div className="flex items-center gap-2">
                <div className="size-6 animate-pulse rounded-md bg-gray-200" />
                <div className="h-6 w-36 animate-pulse rounded-md bg-gray-200" />
              </div>
            </li>

            {/* 개발자 PICK 추천 카페 */}
            <li className="flex w-full justify-between rounded-lg px-3 py-4">
              <div className="flex items-center gap-2">
                <div className="size-6 animate-pulse rounded-md bg-gray-200" />
                <div className="h-6 w-48 animate-pulse rounded-md bg-gray-200" />
              </div>
            </li>

            {/* 버그 제보 */}
            <li className="flex w-full justify-between rounded-lg px-3 py-4">
              <div className="flex items-center gap-2">
                <div className="size-6 animate-pulse rounded-md bg-gray-200" />
                <div className="h-6 w-24 animate-pulse rounded-md bg-gray-200" />
              </div>
            </li>
          </ul>

          {/* 푸터 */}
          <footer className="flex w-full max-w-108 flex-none flex-col items-center gap-6 pb-4">
            {/* 로그인 버튼 */}
            <div className="h-14 w-full animate-pulse rounded-lg bg-gray-200" />
          </footer>
        </section>
      </div>
    </aside>
  );
}

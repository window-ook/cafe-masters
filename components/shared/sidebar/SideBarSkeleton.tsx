export default function SideBarSkeleton() {
  return (
    <aside className="flex w-screen h-screen max-w-108 border-r-1 border-main-400/20 bg-sidebar-background">
      <div className="relative z-10 w-full px-1 rounded-none">
        <section className="h-full flex flex-col">
          {/* 헤더 */}
          <header className="top-0 w-full max-w-108 py-4 flex-none bg-sidebar-background flex flex-col gap-2">
            {/* 로고 영역 + 다크모드 토글 */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-md bg-gray-200 animate-pulse" />
                <div className="w-40 h-8 rounded-md bg-gray-200 animate-pulse" />
              </div>
              <div className="size-10 rounded-full bg-gray-200 animate-pulse" />
            </div>

            {/* 검색 바 */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-12 rounded-lg bg-gray-200 animate-pulse" />
              <div className="w-16 h-12 rounded-lg bg-gray-200 animate-pulse" />
            </div>
          </header>

          {/* 탭 리스트 */}
          <ul className="flex-1 flex flex-col">
            {/* 검색 결과 */}
            <li className="w-full px-3 py-4 rounded-lg flex justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md bg-gray-200 animate-pulse" />
                <div className="w-24 h-6 rounded-md bg-gray-200 animate-pulse" />
              </div>
            </li>

            {/* 내가 수집한 카페 */}
            <li className="w-full px-3 py-4 rounded-lg flex justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md bg-gray-200 animate-pulse" />
                <div className="w-40 h-6 rounded-md bg-gray-200 animate-pulse" />
              </div>
            </li>

            {/* 북마크한 카페 */}
            <li className="w-full px-3 py-4 rounded-lg flex justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md bg-gray-200 animate-pulse" />
                <div className="w-36 h-6 rounded-md bg-gray-200 animate-pulse" />
              </div>
            </li>

            {/* 개발자 PICK 추천 카페 */}
            <li className="w-full px-3 py-4 rounded-lg flex justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md bg-gray-200 animate-pulse" />
                <div className="w-48 h-6 rounded-md bg-gray-200 animate-pulse" />
              </div>
            </li>

            {/* 버그 제보 */}
            <li className="w-full px-3 py-4 rounded-lg flex justify-between">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md bg-gray-200 animate-pulse" />
                <div className="w-24 h-6 rounded-md bg-gray-200 animate-pulse" />
              </div>
            </li>
          </ul>

          {/* 푸터 */}
          <footer className="flex-none w-full max-w-108 pb-4 flex flex-col gap-6 items-center">
            {/* 구분선 */}
            <div className="h-[0.1rem] w-[97%] bg-gray-200 rounded-full" />

            {/* 로그인 버튼 */}
            <div className="w-full h-14 rounded-lg bg-gray-200 animate-pulse" />
          </footer>
        </section>
      </div>
    </aside>
  );
}

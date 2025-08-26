interface IPageConverter {
  isDarkTheme: boolean;
  currentPage: number;
  totalPages: number;
  handlePreviousPageAction: () => void;
  handleNextPageAction: () => void;
  scrollContainerSelector?: string;
}

export default function PageConverter({
  isDarkTheme,
  currentPage,
  totalPages,
  handlePreviousPageAction,
  handleNextPageAction,
  scrollContainerSelector = '.pagination-sidebar-list',
}: IPageConverter) {

  const scrollToTop = () => {
    const scrollContainer = document.querySelector(scrollContainerSelector);
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handlePreviousWithScroll = () => {
    handlePreviousPageAction();
    scrollToTop();
  };

  const handleNextWithScroll = () => {
    handleNextPageAction();
    scrollToTop();
  };
  return (
    <nav aria-label="페이지 이동" className={`w-full py-4 ${isDarkTheme ? 'bg-dark-background' : 'bg-sidebar-background'} font-dunggeunmo`}>
      <div className="flex justify-between items-center">
        <button
          type="button"
          aria-label="이전 페이지 번호"
          onClick={handlePreviousWithScroll}
          disabled={currentPage === 1}
          className={`px-4 py-2 ${currentPage === 1 ? 'opacity-50' : 'opacity-100'} cursor-pointer`}
        >
          <span className="text-3xl ">{'<'}</span>
        </button>
        <p className="text-2xl ">
          {currentPage} / {totalPages}
        </p>
        <button
          type="button"
          aria-label="다음 페이지 번호"
          onClick={handleNextWithScroll}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 ${currentPage === totalPages ? 'opacity-50' : 'opacity-100'} cursor-pointer`}
        >
          <span className="text-3xl ">{'>'}</span>
        </button>
      </div>
    </nav>
  );
}

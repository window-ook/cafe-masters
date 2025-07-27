interface IPageConverter {
  isDarkTheme: boolean;
  currentPage: number;
  totalPages: number;
  handlePreviousPageAction: () => void;
  handleNextPageAction: () => void;
}

export default function PageConverter({
  isDarkTheme,
  currentPage,
  totalPages,
  handlePreviousPageAction,
  handleNextPageAction,
}: IPageConverter) {
  return (
    <section className={`w-full py-4 ${isDarkTheme ? 'bg-main-dark' : 'bg-gray-100'}`}>
      <div className="flex justify-between items-center">
        <button
          type="button"
          aria-label="이전 페이지 번호"
          onClick={handlePreviousPageAction}
          disabled={currentPage === 1}
          className={`px-4 py-2 ${currentPage === 1 ? 'opacity-50' : 'opacity-100'
            }`}
        >
          <span className="text-3xl ">{'<'}</span>
        </button>
        <p className="text-2xl ">
          {currentPage} / {totalPages}
        </p>
        <button
          type="button"
          aria-label="다음 페이지 번호"
          onClick={handleNextPageAction}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 ${currentPage === totalPages ? 'opacity-50' : 'opacity-100'
            }`}
        >
          <span className="text-3xl ">{'>'}</span>
        </button>
      </div>
    </section>
  );
}

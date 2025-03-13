interface PageConverterProps {
  isDarkTheme: boolean;
  handlePreviousPage: () => void;
  currentPage: number;
  totalPages: number;
  handleNextPage: () => void;
}

export default function PageConverter({
  isDarkTheme,
  handlePreviousPage,
  currentPage,
  totalPages,
  handleNextPage,
}: PageConverterProps) {
  return (
    <div
      className={`${isDarkTheme ? 'bg-darkbg' : 'bg-gray-100'} z-20 w-full sticky bottom-0 py-4 font-dpixel`}
    >
      <div className="flex justify-between items-center">
        <button
          type="button"
          aria-label="이전 페이지 번호"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-3xl ${
            currentPage === 1 ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {'<'}{' '}
        </button>
        <span className="text-2xl">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          aria-label="다음 페이지 번호"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-3xl ${
            currentPage === totalPages ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
}

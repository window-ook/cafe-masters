interface PageConverterProps {
  isDarkTheme: boolean;
  handlePreviousPage: () => void;
  currentPage: number;
  totalPages: number;
  handleNextPage: () => void;
}

export default function PageConverter({
  isDarkTheme,
  currentPage,
  totalPages,
  handlePreviousPage,
  handleNextPage,
}: PageConverterProps) {
  return (
    <div className={`w-full py-4 ${isDarkTheme ? 'bg-darkbg' : 'bg-gray-100'}`}>
      <div className="flex justify-between items-center">
        <button
          type="button"
          aria-label="이전 페이지 번호"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 ${
            currentPage === 1 ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <span className="text-3xl font-dpixel">{'<'}</span>
        </button>
        <span className="text-2xl font-dpixel">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          aria-label="다음 페이지 번호"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 ${
            currentPage === totalPages ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <span className="text-3xl font-dpixel">{'>'}</span>
        </button>
      </div>
    </div>
  );
}

import { getPageConverterStyle } from 'utils/styles';

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
    <div className={getPageConverterStyle(isDarkTheme)}>
      <div className="flex justify-between items-center">
        <button
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

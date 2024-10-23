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
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 ${
            currentPage === 1 ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {'<'}{' '}
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 ${
            currentPage === totalPages ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
}

import { useCheckStore } from 'utils/store';
import { CheckStore } from 'types/store';

export default function LightDarkToggle() {
  const isDarkTheme = useCheckStore((state: CheckStore) => state.isDarkTheme);
  const setIsDarkTheme = useCheckStore(
    (state: CheckStore) => state.setIsDarkTheme,
  );

  const handleToggle = () => setIsDarkTheme();

  return (
    <button
      aria-label="라이트/다크 테마 토글 버튼"
      onClick={handleToggle}
      className="w-14 h-14 hover:opacity-70 transform duration-300 ease-out"
    >
      {isDarkTheme ? (
        <i className="fa-regular fa-sun text-white text-3xl"></i>
      ) : (
        <i className="fa-solid fa-moon text-main text-3xl"></i>
      )}
    </button>
  );
}

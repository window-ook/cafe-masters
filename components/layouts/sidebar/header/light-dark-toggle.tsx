import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useCheckStore } from 'utils/store';

export default function LightDarkToggle() {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const setIsDarkTheme = useCheckStore(state => state.setIsDarkTheme);

  const handleToggle = () => setIsDarkTheme();

  return (
    <button
      aria-label="라이트/다크 테마 토글 버튼"
      onClick={handleToggle}
      className="w-14 h-14 hover:opacity-70 transform duration-300 ease-out"
    >
      {isDarkTheme ? (
        <FontAwesomeIcon icon={faMoon} className="text-white text-3xl" />
      ) : (
        <FontAwesomeIcon icon={faSun} className="text-main text-3xl" />
      )}
    </button>
  );
}

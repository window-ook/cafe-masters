import { useCheckStore } from 'utils/store';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function LightDarkToggle() {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const setIsDarkTheme = useCheckStore(state => state.setIsDarkTheme);

  const handleToggle = () => setIsDarkTheme();

  return (
    <button
      type="button"
      aria-label="라이트/다크 테마 토글 버튼"
      onClick={handleToggle}
      className="w-14 h-14 hover:opacity-70 transform duration-300 ease-out"
    >
      {isDarkTheme ? (
        <DarkModeIcon fontSize="large" />
      ) : (
        <LightModeIcon fontSize="large" />
      )}
    </button>
  );
}

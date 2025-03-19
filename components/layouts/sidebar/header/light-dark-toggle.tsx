import { useCheckStore } from 'utils/store';
import { MdSunny } from 'react-icons/md';
import { FaMoon } from 'react-icons/fa';

export default function LightDarkToggle() {
  const isDarkTheme = useCheckStore(state => state.isDarkTheme);
  const setIsDarkTheme = useCheckStore(state => state.setIsDarkTheme);

  const handleToggle = () => setIsDarkTheme();

  return (
    <button
      type="button"
      aria-label="라이트/다크 테마 토글 버튼"
      onClick={handleToggle}
      className="relative w-20 h-10 z-0 flex items-center rounded-full cursor-pointer transition-colors duration-300 ease-in-out"
    >
      <div
        className={`absolute w-full h-full rounded-full transition-colors duration-300 ${
          isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'
        }`}
      />
      <div
        className={`z-10 w-8 h-8 rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
          isDarkTheme ? 'translate-x-11 bg-gray-800' : 'translate-x-1 bg-white'
        }`}
      >
        {isDarkTheme ? (
          <FaMoon className="text-white text-sm" />
        ) : (
          <MdSunny className="text-main text-lg" />
        )}
      </div>
    </button>
  );
}

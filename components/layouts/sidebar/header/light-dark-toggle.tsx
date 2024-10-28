import { useCheckStore } from 'utils/store';

export default function LightDarkToggle() {
  const isDarkTheme = useCheckStore((state: any) => state.isDarkTheme);
  const setIsDarkTheme = useCheckStore((state: any) => state.setIsDarkTheme);

  const handleToggle = () => setIsDarkTheme();

  return (
    <button
      aria-label="라이트/다크 테마 토글 버튼"
      onClick={handleToggle}
      className="w-14 h-14"
    >
      {isDarkTheme ? (
        <i className="fa-regular fa-sun text-white text-3xl"></i>
      ) : (
        <i className="fa-solid fa-moon text-main text-3xl"></i>
      )}
    </button>
  );
}

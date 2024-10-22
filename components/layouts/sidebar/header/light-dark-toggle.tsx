import { useCheckStore } from 'utils/store';

export default function LightDarkToggle() {
  const isDarkTheme = useCheckStore((state) => state.isDarkTheme);
  const setIsDarkTheme = useCheckStore((state) => state.setIsDarkTheme);

  const handleToggle = () => setIsDarkTheme();

  return (
    <button onClick={handleToggle} className="w-14 h-14">
      {isDarkTheme ? (
        <i className="fa-regular fa-sun text-white text-2xl"></i>
      ) : (
        <i className="fa-solid fa-moon text-main text-2xl"></i>
      )}
    </button>
  );
}

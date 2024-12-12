import { useCheckStore } from 'utils/store';

interface MenuItem {
  menu: string;
  price: string;
}

interface MenuGridProps {
  isDarkTheme: boolean;
  handleMenuOpen: () => void;
  menu: MenuItem[];
}

export default function MenuGrid({
  isDarkTheme,
  handleMenuOpen,
  menu,
}: MenuGridProps) {
  const isMenuOpen = useCheckStore(state => state.isMenuOpen);

  return (
    <div className="col-span-2">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg">메뉴</span>
          <button aria-label="메뉴 보기 버튼" onClick={handleMenuOpen}>
            {isMenuOpen ? (
              <i
                className={`fa-solid fa-angle-up text-lg ${isDarkTheme ? 'text-white' : ''}`}
              />
            ) : (
              <i
                className={`fa-solid fa-angle-down text-lg ${isDarkTheme ? 'text-white' : ''}`}
              />
            )}
          </button>
        </div>
        <ul>
          {isMenuOpen &&
            menu.map((item, index) => (
              <li key={index} className="flex flex-col gap-1 mb-2">
                <div className="w-30 border-t border-solid border-gray-400"></div>
                <span className="font-bold text-lg">{item?.menu}</span>
                <span className="text-lg">{item?.price}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

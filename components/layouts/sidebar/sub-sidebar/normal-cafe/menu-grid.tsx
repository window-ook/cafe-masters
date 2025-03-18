import { useCheckStore } from 'utils/store';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface MenuItem {
  name: string;
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
          <p className="font-dpixel text-lg">메뉴</p>
          <button
            type="button"
            aria-label="메뉴 보기 버튼"
            onClick={handleMenuOpen}
          >
            {isMenuOpen ? (
              <FaChevronUp
                className={`fa-solid fa-angle-up text-lg ${isDarkTheme ? 'text-white' : ''}`}
              />
            ) : (
              <FaChevronDown
                className={`fa-solid fa-angle-down text-lg ${isDarkTheme ? 'text-white' : ''}`}
              />
            )}
          </button>
        </div>
        <ul>
          {isMenuOpen &&
            menu?.map((item, index) => (
              <li key={index} className="flex flex-col gap-1 mb-2">
                <div className="w-30 border-t border-solid border-gray-400"></div>
                <p className="font-bold text-lg">{item?.name}</p>
                <p className="text-lg">{item?.price}</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

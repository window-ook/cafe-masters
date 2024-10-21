import { IconButton } from '@mui/material';

export default function MenuGrid({
  isDarkTheme,
  handleMenuOpen,
  menuOpen,
  menu,
}) {
  return (
    <div className="col-span-2">
      <div>
        <div className="flex items-center">
          <span className="text-lg">메뉴</span>
          <IconButton onClick={handleMenuOpen}>
            {menuOpen ? (
              <i
                className={`fa-solid fa-angle-up text-md ${isDarkTheme ? 'text-white' : ''}`}
              />
            ) : (
              <i
                className={`fa-solid fa-angle-down text-md ${isDarkTheme ? 'text-white' : ''}`}
              />
            )}
          </IconButton>
        </div>
        <ul>
          {menuOpen &&
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

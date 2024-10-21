export const getListTabStyle = (isDarkTheme) => {
  return `text-xl font-dpixel transition ease-in-out delay-100 hover:text-opacity-30 ${isDarkTheme ? 'text-white' : 'text-black'}`;
};

export const getSidebarStyle = (isDarkTheme) => {
  return `h-[100vh] max-h-screen w-full max-w-[22rem] px-6 rounded-none shadow-xl shadow-mainShadow flex flex-col justify-between z-10 relative overflow-y-scroll ${isDarkTheme ? 'bg-darkbg text-white' : 'bg-white'}`;
};

export const getPageConverterStyle = (isDarkTheme) => {
  return `sticky bottom-0 z-20 py-1 font-dpixel ${isDarkTheme ? 'bg-darkbg' : 'bg-white'}`;
};

export const getSubSidebarStyle = (isSubSidebarOpen, isDarkTheme) => {
  return `h-[90vh] w-[100vw] max-w-[24rem] p-2 transition-transform duration-500 ease-in-out transform static left-0 z-10 overflow-y-scroll font-dpixel shadow-md
  ${isSubSidebarOpen ? 'translate-x-[2rem] opacity-100' : 'translate-x-0 opacity-0'} ${isDarkTheme ? 'bg-darkbg text-white' : ''}`;
};

export const getMemoInputStyle = (isDarkTheme) => {
  return `rounded-lg ${isDarkTheme ? 'text-black' : ''}`;
};

export const getMemoSubmitStyle = (isDarkTheme) => {
  return `${isDarkTheme ? 'shadow-mainShadow' : ''} shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70 p-4`;
};

export const getMemoBackStyle = (isDarkTheme) => {
  return `${isDarkTheme ? 'shadow-mainShadow' : ''} shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70 py-2 px-6`;
};

export const getSubsidebarCloseIconStyle = () => {
  return 'fa-solid fa-circle-xmark text-main text-2xl hover:text-opacity-70';
};

export const getDetailHeaderStyle = (isDarkTheme) => {
  return `flex justify-between items-center shadow-md rounded-md ${isDarkTheme ? 'shadow-mainShadow' : ''}`;
};

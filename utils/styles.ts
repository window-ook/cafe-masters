export const getListTabStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'text-white' : 'text-black'} text-xl font-dpixel transition ease-in-out delay-100 hover:text-opacity-30`;
};

export const getSidebarStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'bg-darkbg text-white' : 'bg-white'} h-[100vh] max-h-screen w-full max-w-[22rem] px-6 rounded-none shadow-xl shadow-mainShadow flex flex-col justify-between z-10 relative overflow-y-scroll`;
};

export const getPageConverterStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'bg-darkbg' : 'bg-white'} sticky bottom-0 z-20 py-1 font-dpixel`;
};

export const getSubSidebarStyle = (
  isSubSidebarOpen: boolean,
  isDarkTheme: boolean
) => {
  return `${isSubSidebarOpen ? 'translate-x-[2rem] opacity-100' : 'translate-x-0 opacity-0'} ${isDarkTheme ? 'bg-darkbg text-white' : ''} h-[90vh] w-[100vw] max-w-[24rem] p-2 transition-transform duration-500 ease-in-out transform static left-0 z-10 overflow-y-scroll font-dpixel shadow-md`;
};

export const getSubsidebarCloseIconStyle = () => {
  return 'fa-solid fa-circle-xmark text-main text-2xl hover:text-opacity-70';
};

export const getMemoInputStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'text-black' : ''} rounded-lg`;
};

export const getMemoSubmitStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-mainShadow' : ''} shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70 p-4`;
};

export const getMemoBackStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-mainShadow' : ''} shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70 py-2 px-6`;
};

export const getDetailHeaderStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-mainShadow' : ''} flex justify-between items-center shadow-md rounded-md`;
};

export const getDetailBodyStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-mainShadow' : ''} flex flex-col gap-4 p-2 shadow-md rounded-md`;
};

export const getDetailCollectButtonStyle = () => {
  return 'bg-red-400 hover:bg-opacity-70 text-white font-paperexbold rounded-2xl';
};

export const getExpertTierStyle = (addOn: string = '') => {
  return `${addOn} bg-gradient-to-r from-expert-side via-expert-via to-expert-side bg-[length:200%_200%] animate-gradient text-black shadow-md shadow-amber-700`;
};

export const getMasterEffectStyle = (width: string) => {
  return `${width} absolute inset-0 h-7 bg-gradient-to-r from-master-effect-left via-master-effect-mid to-master-effect-right rounded-xl blur-sm animate-tilt z-0`;
};

export const getMasterTierStyle = (addOn: string = '') => {
  return `${addOn} relative z-10 bg-gradient-to-r from-master-side via-master-via to-master-side bg-[length:200%_200%] animate-gradient text-white shadow-md`;
};

export const getSearchInputStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'placeholder:text-gray-200 text-white' : 'placeholder:text-slate-400 text-slate-700'} w-full bg-transparent text-md border border-slate-200 rounded-md pl-3 pr-28 py-4 transition duration-300 ease focus:outline-none focus:border-main hover:border-slate-300 shadow-sm focus:shadow`;
};

export const getSearchButtonStyle = () => {
  return 'absolute top-1 right-1 flex items-center gap-2 rounded bg-main py-3.5 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-purple-300 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none';
};

export const getNormalCardStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'border-darkaccent bg-darkbg text-white shadow-mainShadow' : 'border-gray-700'} h-50 p-4 border-4 rounded-2xl shadow-md flex flex-col gap-2 cursor-pointer font-dpixel`;
};

export const getCollectedCardStyle = (
  bgRatings: string,
  isDarkTheme: boolean
) => {
  return `${bgRatings} ${isDarkTheme ? 'border-mainShadow' : 'border-gray-600'} h-50 p-4 border-4 rounded-2xl flex flex-col gap-2 drop-shadow-3xl cursor-pointer font-dpixel`;
};

export const getCollectedBadgeStyle = () => {
  return 'bg-gradient-to-r from-success via-indigo to-success bg-[length:200%_200%] animate-gradient text-white shadow-md';
};

export const getUniqueCardStyle = () => {
  return 'bg-gradient-to-tl from-unique-card-right via-unique-card-mid to-unique-card-left bg-[length:200%_200%] animate-gradient text-white shadow-md border-gray-400 h-50 p-4 border-4 rounded-2xl flex flex-col gap-2 drop-shadow-3xl cursor-pointer font-dpixel';
};

export const getUniqueCardEffectStyle = () => {
  return `-z-10 absolute inset-0 w-[100%] h-[100%] bg-gradient-to-r from-unique-effect-left via-unique-effect-mid to-unique-effect-right rounded-xl blur-sm animate-tilt`;
};

export const getOverThreeRatingStyle = () => {
  return 'bg-gradient-to-tl from-silver-side via-silver-via to-silver-side bg-[length:200%_200%] animate-gradient shadow-md text-gray-600 shadow-gray-300';
};

export const getOverFiveRatingStyle = () => {
  return 'bg-gradient-to-tl from-gold-side via-gold-via to-gold-side bg-[length:200%_200%] animate-gradient text-black shadow-md shadow-amber-700';
};

export const getRatingCircleStyle = () => {
  return 'relative flex items-center justify-center w-5 h-5 rounded-full bg-red-500 shadow-md shadow-yellow-100';
};

export const getRatingStarStyle = () => {
  return 'fa-solid fa-star absolute text-yellow-300 text-xs';
};

export const getLogoutButtonStyle = () => {
  return 'bg-main rounded-xl shadow-md w-[10vw] py-2 hover:bg-opacity-70 transition duration-300 ease-in';
};

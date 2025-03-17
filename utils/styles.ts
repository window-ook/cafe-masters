export const getSubSidebarStyle = (
  isSubSidebarOpen: boolean,
  isDarkTheme: boolean,
  isExtend: boolean,
) => {
  const baseStyle = `${isDarkTheme ? 'bg-main-dark text-white' : 'bg-white text-black'} 
   static left-0 z-10 w-[100vw] max-w-[27rem] p-2 
   transition-transform duration-500 ease-in-out 
   overflow-y-auto shadow-md overflow-x-hidden`;

  const openStyle = isSubSidebarOpen
    ? `${isExtend ? 'translate-y-[13rem] h-[calc(100vh-13rem)]' : 'translate-y-[35rem]'} 
      rounded-t-3xl sm:translate-y-0 sm:h-[90vh] sm:translate-x-[2rem] sm:rounded-md opacity-100`
    : 'hidden sm:block opacity-0';

  return `${baseStyle} ${openStyle}`;
};

export const SubsidebarCloseIconStyle =
  'text-main text-3xl hover:text-opacity-70';

export const KakaoMapStyle =
  'z-0 fixed top-0 sm:translate-x-[27rem] sm:w-[calc(100vw-27rem)] w-screen h-screen';

export const getMemoInputStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'text-black' : ''} rounded-lg`;
};

export const getMemoSubmitStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-main-shadow' : ''} p-4 shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70`;
};

export const getMemoBackStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-main-shadow' : ''} py-2 px-6 shadow-sm rounded-xl bg-main text-white hover:bg-opacity-70`;
};

export const getDetailHeaderStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-main-shadow' : ''} flex justify-between items-center shadow-md rounded-md p-2`;
};

export const getDetailBodyStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-main-shadow' : ''} p-2 flex flex-col gap-4 shadow-md rounded-md`;
};

export const DetailCollectButtonStyle =
  'bg-red-400 hover:bg-opacity-70 rounded-2xl px-3 py-2 hover:scale-105 transition duration-200 ease text-white font-bold font-pretendard';

export const getNormalCardStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'border-main-dark-border bg-main-dark text-white shadow-main-shadow' : 'border-gray-700'} h-[20rem] p-4 border-4 rounded-2xl shadow-md flex flex-col justify-between cursor-pointer hover:scale-105 transition duration-300 ease`;
};

export const getCollectedCardStyle = (
  bgRatings: string,
  isDarkTheme: boolean,
) => {
  return `${bgRatings} ${isDarkTheme ? 'border-main-shadow' : 'border-gray-600'} h-[20rem] p-4 border-4 rounded-2xl flex flex-col justify-between drop-shadow-3xl cursor-pointer hover:scale-105 transition duration-300 ease`;
};

export const getExpertTierStyle = (addOn: string = '') => {
  return `${addOn} bg-gradient-to-r from-expert-side via-expert-via to-expert-side bg-[length:200%_200%] animate-gradient text-black shadow-md shadow-amber-700`;
};

export const getMasterEffectStyle = (width: string) => {
  return `${width} z-0 absolute inset-0 h-9 bg-gradient-to-r from-master-effect-left via-master-effect-mid to-master-effect-right rounded-xl blur-sm animate-tilt`;
};

export const ModalMasterEffectStyle = `w-[27%] sm:w-[9%] z-0 -top-0.5 inset-0 h-9 absolute bg-gradient-to-r from-master-effect-left via-master-effect-mid to-master-effect-right rounded-xl blur-sm animate-tilt`;

export const getMasterTierStyle = (addOn: string = '') => {
  return `${addOn} z-10 relative bg-gradient-to-r from-master-side via-master-via to-master-side bg-[length:200%_200%] animate-gradient text-white shadow-md`;
};

export const SearchButtonStyle =
  'absolute top-1 right-1 py-4 px-2.5 flex items-center gap-2 rounded bg-main border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-purple-300 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none';

export const CollectedBadgeStyle =
  'rounded-xl w-[7rem] h-6 py-4 flex items-center justify-center bg-gradient-to-r from-collected-side via-collected-center to-collected-side bg-[length:200%_200%] animate-gradient shadow-md';

export const BadgeCommon =
  'rounded-xl w-20 h-6 py-4 flex items-center justify-center';

export const UniqueCardStyle =
  'bg-gradient-to-tl from-unique-card-right via-unique-card-mid to-unique-card-left bg-[length:200%_200%] animate-gradient text-white shadow-md border-red-300 h-[20rem] p-4 border-4 rounded-2xl flex flex-col justify-between drop-shadow-3xl cursor-pointer font-dpixel font-bold transition duration-300 ease hover:scale-105 hover:bg-gradient-to-tr ';

export const UniqueCardEffectStyle = `-z-10 absolute inset-0 w-[100%] h-[100%] bg-gradient-to-r from-unique-effect-left via-unique-effect-mid to-unique-effect-right rounded-xl blur-md animate-tilt`;

export const OverThreeRatingStyle =
  'bg-gradient-to-tl from-silver-side via-silver-via to-silver-side bg-[length:200%_200%] animate-gradient shadow-md text-gray-600 shadow-gray-300';

export const OverFiveRatingStyle =
  'bg-gradient-to-tl from-gold-side via-gold-via to-gold-side bg-[length:200%_200%] animate-gradient text-black shadow-md shadow-amber-700';

export const RatingCircleStyle =
  'relative flex items-center justify-center w-5 h-5 rounded-full bg-red-500 shadow-md shadow-yellow-100';

export const RatingStarStyle = 'absolute text-yellow-300 text-xs';

export const AuthFormCardStyle =
  'p-5 rounded-xl bg-white shadow-main-shadow z-10';

export const AuthFormTitleStyle = 'text-center text-3xl font-bold font-dpixel';

export const AuthFormMentionStyle =
  'flex items-center justify-center gap-4 text-center font-dpixel';

export const KakaoButtonStyle =
  'bg-yellow-500 w-full py-1 hover:bg-opacity-70 hover:cursor-pointer';

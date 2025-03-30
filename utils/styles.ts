export const getSubSidebarStyle = (
  isSubSidebarOpen: boolean,
  isDarkTheme: boolean,
  isExtend: boolean,
) => {
  const baseStyle = `static left-0 z-10 translate-y-4 w-[100vw] max-w-[27rem] p-2 overflow-y-auto overflow-x-hidden shadow-md ${isDarkTheme ? 'bg-main-dark text-white' : 'bg-gray-100 text-black backdrop-blur-lg bg-opacity-20'} transition-transform duration-300 ease-in-out`;
  const openned = isSubSidebarOpen
    ? `${isExtend ? 'translate-y-[13rem] h-[calc(100vh-13rem)]' : 'translate-y-[35rem]'} rounded-t-3xl opacity-100 sm:h-[90vh] sm:translate-y-4 sm:translate-x-[2rem] sm:rounded-md`
    : 'sm:pointer-events-none opacity-0';
  return `${baseStyle} ${openned}`;
};

export const getDetailHeaderStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-main-shadow' : ''} flex justify-between items-center shadow-md rounded-md p-2`;
};

export const getDetailBodyStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-main-shadow' : ''} p-2 flex flex-col gap-4 shadow-md rounded-md`;
};

export const getExpertTierStyle = (addOn: string = '') => {
  return `${addOn} bg-gradient-to-r from-expert-side via-expert-via to-expert-side bg-[length:200%_200%] animate-gradient text-black shadow-md shadow-amber-700`;
};

export const getMasterTierStyle = (addOn: string = '') => {
  return `${addOn} z-10 relative bg-gradient-to-r from-master-side via-master-via to-master-side bg-[length:200%_200%] animate-gradient text-white shadow-md`;
};

export const masterTierBadgeStyle =
  'w-[100%] z-0 absolute inset-0 h-9 bg-gradient-to-r from-master-effect-left via-master-effect-mid to-master-effect-right rounded-xl blur-sm animate-tilt"';

export const masterTierModalStyle = `w-[27%] sm:w-[10%] z-0 -top-0.5 inset-0 h-9 absolute bg-gradient-to-r from-master-effect-left via-master-effect-mid to-master-effect-right rounded-xl blur-sm animate-tilt`;

export const uniqueCardStyle =
  'h-[20rem] p-4 border-4 rounded-2xl bg-gradient-to-tl from-unique-card-right via-unique-card-mid to-unique-card-left bg-[length:200%_200%] animate-gradient shadow-md drop-shadow-3xl border-red-300 text-white font-dpixel font-bold flex flex-col justify-between cursor-pointer hover:scale-105 hover:bg-gradient-to-tr transition duration-300 ease';

export const uniqueCardEffectStyle = `-z-10 absolute inset-0 w-[100%] h-[100%] bg-gradient-to-r from-unique-effect-left via-unique-effect-mid to-unique-effect-right rounded-xl blur-md animate-tilt`;

export const overThreeRatingStyle =
  'bg-gradient-to-tl from-silver-side via-silver-via to-silver-side bg-[length:200%_200%] animate-gradient shadow-md text-gray-600 shadow-gray-300';

export const overFiveRatingStyle =
  'bg-gradient-to-tl from-gold-side via-gold-via to-gold-side bg-[length:200%_200%] animate-gradient text-black shadow-md shadow-amber-700';

export const ratingCircleStyle =
  'relative flex items-center justify-center w-5 h-5 rounded-full bg-red-500 shadow-md shadow-yellow-100';

export const ratingStarStyle = 'absolute text-yellow-300 text-xs';

export const authFormCardStyle =
  'p-5 rounded-xl bg-white shadow-main-shadow z-10';

export const authFormTitleStyle = 'text-center text-3xl font-bold font-dpixel';

export const authFormMentionStyle =
  'flex items-center justify-center gap-4 text-center font-dpixel';

export const kakaoButtonStyle =
  'w-full py-1 bg-yellow-500 hover:bg-opacity-70 hover:cursor-pointer';

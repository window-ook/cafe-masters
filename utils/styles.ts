export const getDetailHeaderStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-main-shadow' : ''} flex justify-between items-center shadow-md rounded-md p-2`;
};

export const getDetailBodyStyle = (isDarkTheme: boolean) => {
  return `${isDarkTheme ? 'shadow-main-shadow' : ''} p-2 flex flex-col gap-4 shadow-md rounded-md`;
};

export const getExpertTierStyle = (addOn: string = '') => {
  return `${addOn} bg-linear-to-r from-expert-side via-expert-via to-expert-side bg-size-[200%_200%] animate-gradient text-black shadow-md shadow-amber-700`;
};

export const getMasterTierStyle = (addOn: string = '') => {
  return `${addOn} z-10 relative bg-linear-to-r from-master-side via-master-via to-master-side bg-size-[200%_200%] animate-gradient text-white shadow-md`;
};

export const masterTierBadgeStyle =
  'w-full z-0 absolute inset-0 h-9 bg-linear-to-r from-master-effect-left via-master-effect-mid to-master-effect-right rounded-xl blur-sm animate-tilt"';

export const masterTierModalStyle = `w-[27%] sm:w-[10%] z-0 -top-0.5 inset-0 h-9 absolute bg-linear-to-r from-master-effect-left via-master-effect-mid to-master-effect-right rounded-xl blur-sm animate-tilt`;

export const ratingCircleStyle =
  'relative flex items-center justify-center w-5 h-5 rounded-full bg-red-500 shadow-md shadow-yellow-100';

export const ratingStarStyle = 'absolute text-yellow-300 text-xs';

export const authFormCardStyle =
  'p-5 rounded-xl bg-white shadow-main-shadow z-10';

export const authFormTitleStyle = 'text-center text-3xl font-bold ';

export const authFormMentionStyle =
  'flex items-center justify-center gap-4 text-center ';

export const kakaoButtonStyle =
  'w-full py-1 bg-yellow-500 hover:bg-opacity-70 hover:cursor-pointer';

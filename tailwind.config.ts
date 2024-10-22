import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        main: '#7c24c9',
        mainShadow: '#875aad',

        darkbg: '#1f1926',
        darkaccent: '#5f018a',

        success: '#15ed79',
        indigo: '#6366f1',

        beginner: '#8a919c',
        junior: '#030ffc',
        senior: '#f77a05',
        'expert-via': '#f5e902',
        'expert-side': '#8c6a01',
        'master-via': '#f5248c',
        'master-side': '#8a24b9',
        'master-effect-left': '#44BCFF',
        'master-effect-mid': '#FF44EC',
        'master-effect-right': '#FF675E',

        'unique-card-left': '#5f018a',
        'unique-card-mid': '#8a24b9',
        'unique-card-right': '#f5248c',
        'unique-effect-left': '#44BCFF',
        'unique-effect-mid': '#FF44EC',
        'unique-effect-right': '#FF675E',

        'silver-via': '#fff',
        'silver-side': '#8c8c8c',
        'gold-via': '#f5e902',
        'gold-side': '#8c6a01',
      },

      backgroundImage: {
        'expert-gradient': 'linear-gradient(90deg, #f5e902 0%, #bd9b04 100%)',
        'master-gradient': 'linear-gradient(90deg, #8a24b9 0%, #f5248c 100%)',
      },

      keyframes: {
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },

      animation: {
        gradient: 'gradient 3s ease infinite',
      },

      dropShadow: {
        '3xl': '14px 14px 11px -7px rgba(47,49,51,0.75)',
      },

      fontFamily: {
        dpixel: ['DungGeunMo'],
        paperexbold: ['Paperlogy-8ExtraBold'],
      },

      fontSize: {
        '2xs': '.3rem',
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};

export default config;

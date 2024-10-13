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
        bgDark: '#292825',
        success: '#15ed79',
        indigo: '#6366f1',
        beginner: '#8a919c',
        junior: '#030ffc',
        senior: '#f77a05',
        'expert-via': '#f5e902',
        'expert-side': '#bd9b04',
        'master-via': '#f5248c',
        'master-side': '#8a24b9',
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

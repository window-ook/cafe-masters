import type { Config } from 'tailwindcss';
import withMT from '@material-tailwind/react/utils/withMT';

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
        emerald: '#15ed79',
        indigo: '#6366f1',
      },

      boxShadow: {
        'right-only': '0.5px 0 5px -1px #875aad',
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
  plugins: [require('@tailwindcss/typography')],
};

export default withMT(config);

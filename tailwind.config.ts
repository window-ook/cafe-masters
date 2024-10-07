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
        bgDark: '#292825',
        success: '#15ed79',
        indigo: '#6366f1',
        beginner: '#8a919c',
        novice: '#d6e884',
        expert: '#e30b6c',
        master: '', // 마스터부터는 그라데이션
        grand_master: '',
        king: '',
      },

      backgroundImage: {
        'master-gradient': 'linear-gradient(90deg, #8a24b9 0%, #f5248c 100%)',
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

export default withMT(config);

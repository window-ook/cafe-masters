import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  mode: 'jit',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        dpixel: ['var(--font-dunggeunmo)'],
        pretendard: ['var(--font-pretendard)'],
      },

      colors: {
        main: '#7c24c9',
        mainShadow: '#875aad',
        darkbg: '#1f1926',
        darkaccent: '#5f018a',
        success: '#03fc73',
        indigo: '#6366f1',
        // 티어 뱃지 스타일
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
        // 유니크 카드 스타일
        'unique-card-left': '#5f018a',
        'unique-card-mid': '#8a24b9',
        'unique-card-right': '#f5248c',
        'unique-effect-left': '#44BCFF',
        'unique-effect-mid': '#FF44EC',
        'unique-effect-right': '#FF675E',
        // 실버 카드, 골드 카드 스타일
        'silver-via': '#fff',
        'silver-side': '#8c8c8c',
        'gold-via': '#f5e902',
        'gold-side': '#8c6a01',
      },

      textShadow: {
        black: '0 2px 4px rgba(0, 0, 0, 0.8)',
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
        reveal: {
          from: { clipPath: 'inset(0 100% 0 0)' },
          to: { clipPath: 'inset(0 0 0 0)' },
        },
        textReveal: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          from: { transform: 'translateX(-100%) rotate(45deg)' },
          to: { transform: 'translateX(200%) rotate(45deg)' },
        },
      },

      fontSize: {
        '2xs': '.3rem',
      },

      animation: {
        gradient: 'gradient 3s ease infinite',
        reveal: 'reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1)',
        textReveal: 'textReveal 0.8s cubic-bezier(0.77, 0, 0.175, 1)',
        float: 'float 6s ease-in-out infinite',
        shine: 'shine 1.5s',
      },

      dropShadow: {
        '3xl': '14px 14px 11px -7px rgba(47,49,51,0.75)',
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': value => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') },
      );
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hidden': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    }),
  ],
};

export default config;

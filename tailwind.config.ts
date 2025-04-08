import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: ['class'],
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
        'main-light': '#f5ccff',
        'main-shadow': '#875aad',
        'main-dark': '#1f1926',
        'main-dark-border': '#5f018a',
        'collected-side': '#03fc73',
        'collected-center': '#6366f1',
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

        'silver-base': '#e5e7eb',
        'silver-via': '#9ca3af',
        'silver-side': '#4b5563',

        'gold-base': '#fde68a',
        'gold-via': '#facc15',
        'gold-side': '#a16207',
        'gold-effect-left': '#fde68a',
        'gold-effect-mid': '#f2d73f',
        'gold-effect-right': '#c9ac08',

        'emerald-base': '#6ee7b7',
        'emerald-via': '#34d399',
        'emerald-side': '#0f766e',
        'emerald-effect-left': '#5effda',
        'emerald-effect-mid': '#2c9952',
        'emerald-effect-right': '#053303',

        'hidden-badge-left': '#ff3a9d',
        'hidden-badge-mid': '#f5ccff',
        'hidden-badge-right': '#ff3a9d',
        'hidden-card-left': '#5f018a',
        'hidden-card-mid': '#8a24b9',
        'hidden-card-right': '#f5248c',
        'hidden-effect-left': '#44BCFF',
        'hidden-effect-mid': '#FF44EC',
        'hidden-effect-right': '#FF675E',
        recommended: '#18f282',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },

      textShadow: {
        black: '0 2px 4px rgba(0, 0, 0, 0.8)',
        main: '0 2px 4px rgba(135, 90, 173, 1)',
      },

      backgroundImage: {
        'expert-gradient': 'linear-gradient(90deg, #f5e902 0%, #bd9b04 100%)',
        'master-gradient': 'linear-gradient(90deg, #8a24b9 0%, #f5248c 100%)',
      },

      keyframes: {
        gradient: {
          '0%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
          '100%': {
            'background-position': '0% 50%',
          },
        },
        reveal: {
          from: {
            clipPath: 'inset(0 100% 0 0)',
          },
          to: {
            clipPath: 'inset(0 0 0 0)',
          },
        },
        textReveal: {
          from: {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        shine: {
          from: {
            transform: 'translateX(-100%) rotate(45deg)',
          },
          to: {
            transform: 'translateX(200%) rotate(45deg)',
          },
        },
        skeleton: {
          '0%': {
            'background-color': 'var(--skeleton-start)',
          },
          '100%': {
            'background-color': 'var(--skeleton-end)',
          },
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
        skeleton: 'skeleton 1s ease-in-out infinite alternate',
      },

      dropShadow: {
        '3xl': '14px 14px 11px -7px rgba(47,49,51,0.75)',
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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

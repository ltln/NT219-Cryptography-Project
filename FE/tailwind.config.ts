import type { Config } from 'tailwindcss';

const colors = {
  ferra: {
    '50': '#faf7f6',
    '100': '#f5efee',
    '200': '#ecdfdf',
    '300': '#dcc5c5',
    '400': '#c8a4a4',
    '500': '#b28183',
    '600': '#996568',
    '700': '#774c50',
    '800': '#6b464a',
    '900': '#5d3e42',
    '950': '#321f21',
  },
  casal: {
    '50': '#f2f9f9',
    '100': '#ddeff0',
    '200': '#bfdfe2',
    '300': '#92c7ce',
    '400': '#5ea7b2',
    '500': '#438b97',
    '600': '#3a7280',
    '700': '#335c67',
    '800': '#314f59',
    '900': '#2d444c',
    '950': '#1a2b32',
  },
  'donkey-brown': {
    '50': '#f8f6f4',
    '100': '#efece5',
    '200': '#ddd7cb',
    '300': '#c8bca9',
    '400': '#b09c85',
    '500': '#a1876e',
    '600': '#947762',
    '700': '#7b6253',
    '800': '#655147',
    '900': '#53433b',
    '950': '#2c221e',
  },
  'smalt-blue': {
    '50': '#f3f8f8',
    '100': '#dfecee',
    '200': '#c3dcde',
    '300': '#9ac2c6',
    '400': '#69a0a7',
    '500': '#508991',
    '600': '#436e77',
    '700': '#3b5b63',
    '800': '#364e54',
    '900': '#314348',
    '950': '#1d2a2f',
  },
  'tower-gray': {
    '50': '#f7f8f8',
    '100': '#eef0f0',
    '200': '#d8dedf',
    '300': '#aab7b8',
    '400': '#8fa0a1',
    '500': '#718486',
    '600': '#5b6c6e',
    '700': '#4b5859',
    '800': '#404b4c',
    '900': '#384142',
    '950': '#252b2c',
  },
  'banana-mania': {
    '50': '#fdf9ed',
    '100': '#f7e4b2',
    '200': '#f4da93',
    '300': '#eec15b',
    '400': '#eaa935',
    '500': '#e28a1e',
    '600': '#c86917',
    '700': '#a64a17',
    '800': '#883b18',
    '900': '#703017',
    '950': '#401808',
  },
  eunry: {
    '50': '#faf6f6',
    '100': '#f5ebeb',
    '200': '#eedada',
    '300': '#e1c0c0',
    '400': '#d4a5a5',
    '500': '#bb7878',
    '600': '#a45e5e',
    '700': '#894c4c',
    '800': '#734141',
    '900': '#613b3b',
    '950': '#331c1c',
  },
};

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      colors: {
        primary: colors.ferra,
        ...colors,
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;

export default config;
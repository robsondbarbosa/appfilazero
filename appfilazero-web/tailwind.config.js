/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F2C75B',
          dark: '#B8960C',
          50: '#FDF9E8',
          100: '#F9F0C8',
          200: '#F2E295',
          300: '#EBD462',
          400: '#E5C73F',
          500: '#D4AF37',
          600: '#B8960C',
          700: '#8A7009',
          800: '#5C4B06',
          900: '#2E2503',
        },
        dark: {
          DEFAULT: '#1A1A1A',
          50: '#404040',
          100: '#363636',
          200: '#2D2D2D',
          300: '#242424',
          400: '#1A1A1A',
          500: '#171717',
          600: '#141414',
          700: '#111111',
          800: '#0D0D0D',
          900: '#0A0A0A',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F2C75B 100%)',
        'gradient-dark': 'linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%)',
      },
    },
  },
  plugins: [],
}

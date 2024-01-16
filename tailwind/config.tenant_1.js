/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'white': '#ffffff',
        'gray': '#c0c0c0',
        'black': '#000000',
        'gold': '#f5a400',
        'warn': '#fff600',
        'gold-hover': '#ffbc28',
        'gold-active': '#c2890d',
        'outline': '#729db0',
        'slides': '#101d2d',
        'footer': '#090b0f',
        'app-bg': '#0e1118',
        'navy-accent': '#161b26',
        'navy-2': '#0e1018',
        'app-bg-split': '#273031',
        'app-success':  '#b1e365' ,
        'app-error': '#b92551',
        'app-accent': '#383a9b',
        'app-accent2': '#1b4d67',
        'app-white': '#f9fbfa',
        'navy': '#12151e',
        'bgalt': "rgb(211,28,91,.3)",
      },
      screens: {
        mobile: '520px',
        sinvest: '700px',
        collap: '900px',
        midcol: '1000px',
        custom: '1100px',
        // tablet: '1200px',
        invest: '1420px',
        '3xl': '1820px',
      },
      margin: {
        '15': '3.75rem',
      },
      inset: {
        '12': '1.5rem',
      },
      width: {
        '14': '2.5rem',
        '15': '3rem',
        '16': '3.5rem',
        '18': '4rem',
      },
      height: {
        '14': '2.5rem',
        '15': '3rem',
        '16': '3.5rem',
        '17': '3.75rem;',

        '18': '4rem',
      },
      spacing: {
        '25': '5.5rem',
        '28': '7.5rem',
        '35': '10rem',
      },
      gridTemplateRows: {
        // Simple 8 row grid
        '8': 'repeat(8, minmax(0, 1fr))',
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        '14': 'repeat(14, minmax(0, 1fr))',
      },
      fontFamily: {
        'body':  ['Montserrat', 'sans-serif'],
        'accent': ['Work Sans', 'sans-serif'] ,
      },
      fontSize: {
        'xxs': ['10px', {lineHeight: '1.375'}],
        'hero': ['48px', {lineHeight: '1.375'}]
      },
      fontWeight: {
        // extrabold: '800',
      }
    },
  },
  plugins: [],
}


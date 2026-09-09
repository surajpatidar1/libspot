/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: '#0a1628',
        ocean: '#1F4959',
        slateTeal: '#5C7C89',
        charcoal: '#242424',
        pureWhite: '#FFFFFF',
        // Extended shades
        'ocean-dark': '#13313d',
        'ocean-light': '#2c6276',
        'slate-dark': '#435c67',
        'slate-light': '#7a9caa',
        'midnight-soft': '#0f1f35',
        'charcoal-card': '#1a1d20',
        'charcoal-light': '#2f3438',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

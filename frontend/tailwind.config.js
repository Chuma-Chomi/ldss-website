/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1B5E20',
        accent: '#A5D6A7',
        muted: '#F4F6F3',
        forest: '#0D1F16',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 20px 60px rgba(27, 94, 32, 0.25)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6B35',
          blue: '#1B4965',
          green: '#2D936C',
          red: '#D64045',
          gray: '#4A4A4A',
          light: '#E8E8E8',
        }
      }
    },
  },
  plugins: [],
};

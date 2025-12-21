/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Brand colors from Clover app
        brand: {
          pink: '#E91E63',
          'pink-light': '#EBC7DD',
          'pink-dark': '#D85A83',
        },
        accent: {
          violet: '#6B73FF',
          'violet-dark': '#2D3748',
        },
        // Amenity colors
        amenity: {
          'blue-light': '#ADE5FB',
          'blue-dark': '#0875A0',
          'orange-light': '#F5BB77',
          'orange-dark': '#A25D0C',
          'green-light': '#CBE49A',
          'green-dark': '#55711E',
        },
        // Status colors
        success: '#34D399',
        info: '#3B82F6',
        warning: '#F59E0B',
        error: '#EF4444',
        // Neutral colors
        neutral: {
          100: '#F3F4F6',
          300: '#E5E7EB',
          500: '#6B7280',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

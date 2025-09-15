/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    files: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
    safelist: [
      'bg-blue-600',
      'border-blue-600',
      'text-blue-600',
      'text-white',
      'ring-blue-100',
      'cursor-pointer',
      'group-hover:bg-blue-600',
      'group-hover:border-blue-600',
      'group-hover:text-white',
      'group-hover:text-blue-600',
    ],
  },
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          dark: 'var(--primary-dark)',
          light: 'var(--primary-light)',
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          dark: 'var(--secondary-dark)',
          light: 'var(--secondary-light)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        gray: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
        },
      },
      fontFamily: {
        'heebo': ['Heebo', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 
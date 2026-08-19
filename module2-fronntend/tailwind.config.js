/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#0B1220',
        brand: {
          DEFAULT: '#22C55E',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        ink: '#0F172A',
        muted: '#64748B',
        canvas: '#F1F5F9',
        card: '#FFFFFF',
        border: '#E2E8F0',
        status: {
          approvedBg: '#DCFCE7',
          approvedText: '#16A34A',
          pendingBg: '#FEF9C3',
          pendingText: '#CA8A04',
          overdueBg: '#FEE2E2',
          overdueText: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px 0 rgb(15 23 42 / 0.04)',
        'card-hover': '0 4px 12px 0 rgb(15 23 42 / 0.08), 0 2px 4px 0 rgb(15 23 42 / 0.04)',
      },
    },
  },
  plugins: [],
};

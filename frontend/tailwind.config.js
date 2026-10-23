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
        setu: {
          blue: "#1A3A6B",
          'blue-dark': "#12284C",
          'blue-light': "#2952A3",
          saffron: "#FF6B00",
          'saffron-dark': "#E05E00",
          green: "#138808",
          'green-dark': "#0E6606",
          bg: "#F5F7FA",
          ash: "#E2E8F0",
        }
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-ring': 'pulseRing 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
          '70%': { transform: 'scale(1.15)', boxShadow: '0 0 0 12px rgba(239, 68, 68, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}

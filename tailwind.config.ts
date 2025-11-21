import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        brand: {
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          gold: '#F59E0B',
          amber: '#D97706',
        }
      },
      animation: {
        'blob': 'blob 20s infinite alternate',
        'flow': 'flow 6s linear infinite',
        'marquee': 'marquee 60s linear infinite', // Slower for better readability
        'gold-shimmer': 'goldShimmer 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        flow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' } // ✅ CHANGED TO -50% FOR SEAMLESS LOOP
        },
        goldShimmer: {
          '0%': { transform: 'translateX(-150%) skewX(-20deg)' },
          '30%': { transform: 'translateX(250%) skewX(-20deg)' },
          '100%': { transform: 'translateX(250%) skewX(-20deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        }
      }
    },
  },
  plugins: [],
};
export default config;
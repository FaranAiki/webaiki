// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: "class", 
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }, // Adjust -10px to make it float higher or lower
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },

      animation: {
        float: 'float 4s ease-in-out infinite', // 4s duration, smooth easing, repeats forever
        'page-entrance': 'fade-in-up 0.4s cubic-bezier(0.21, 0.47, 0.32, 0.98) forwards',
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
        serif: ['ui-serif', 'Georgia', 'Cambria', '"Hoefler Text"', 'Garamond', 'serif'],
      },
    },
  },

  plugins: [
    ({ addVariant }: { addVariant: (name: string, definition: string) => void }) => {
      addVariant('presentation-mode', 'body.presentation-mode &')
    }
  ],
}
export default config

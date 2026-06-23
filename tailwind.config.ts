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
        }
      },

      animation: {
        float: 'float 4s ease-in-out infinite', // 4s duration, smooth easing, repeats forever
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
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

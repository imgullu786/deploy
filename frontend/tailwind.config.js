/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color system
        'bg-primary': '#0a0a0d',
        'bg-secondary': '#111115',
        'bg-tertiary': '#1a1a20',
        'accent-primary': '#00e599',
        'accent-secondary': '#00b377',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a8',
        'text-muted': '#6b6b73',
        'border-primary': 'rgba(255, 255, 255, 0.1)',
        'border-accent': 'rgba(0, 229, 153, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 229, 153, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 229, 153, 0.4)' },
        },
        slideUp: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(30px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 229, 153, 0.15)',
        'glow-lg': '0 0 40px rgba(0, 229, 153, 0.2)',
        'soft': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
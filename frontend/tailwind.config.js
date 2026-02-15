/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0faff',
          100: '#e0f2ff',
          200: '#bae2ff',
          300: '#7dccff',
          400: '#40b3ff',
          500: '#007AFF', // Apple System Blue
          DEFAULT: '#007AFF',
          600: '#0062CC',
          700: '#004A99',
          800: '#003166',
          900: '#001933',
          950: '#000c1a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          DEFAULT: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#64748b', // Darkened from 94a3b8
          500: '#475569', // Darkened from 64748b
          600: '#334155', // Darkened from 475569
          700: '#1e293b',
          800: '#0f172a',
          900: '#020617',
          950: '#01040a',
        },
        success: {
          100: '#e8f5e9',
          500: '#34C759', // Apple System Green
          DEFAULT: '#34C759',
          800: '#1B5E20',
        },
        warning: {
          100: '#fff3e0',
          500: '#FF9500', // Apple System Orange
          DEFAULT: '#FF9500',
          800: '#E65100',
        },
        danger: {
          100: '#ffebee',
          500: '#FF3B30',  // Apple System Red
          DEFAULT: '#FF3B30',
          800: '#C62828',
        },
        info: {
          100: '#dbeafe',
          500: '#3b82f6',    // Blue 500
          800: '#1e40af',
        },
        background: '#f8fafc', // Slate 50
        surface: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'premium': '0 10px 30px -10px rgb(0 0 0 / 0.1), 0 4px 10px -5px rgb(0 0 0 / 0.05)',
        'glow-primary': '0 0 20px rgb(0 122 255 / 0.4)',
        'glow-success': '0 0 20px rgb(52 199 89 / 0.4)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'spin-fast': 'spin 0.8s linear infinite',
        'bounce-soft': 'bounce 1s infinite',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }
    },
  },
  plugins: [],
}

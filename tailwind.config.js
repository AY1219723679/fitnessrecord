/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0d0f',
        surface: '#141418',
        panel: '#1b1c21',
        line: '#2d3038',
        muted: '#8f96a3',
        accent: '#c7ff6b'
      },
      boxShadow: {
        panel: '0 12px 30px rgba(0, 0, 0, 0.18)'
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      }
    }
  },
  plugins: []
};

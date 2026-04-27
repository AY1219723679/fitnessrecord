/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16324f',
        surface: '#ffffff',
        panel: '#eef5ff',
        line: '#cfe0f5',
        muted: '#5f7388',
        accent: '#4f8cc9'
      },
      boxShadow: {
        panel: '0 14px 30px rgba(79, 140, 201, 0.12)'
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        'dk-base': '#0f1117',
        'dk-surface': '#1a1d27',
        'dk-elevated': '#141720',
        'dk-border': '#2a2d3a',
        'dk-primary': '#e8eaf0',
        'dk-secondary': '#8b8fa8',
        'dk-dim': '#5a5d70',
        'status-waiting': '#f59e0b',
        'status-failed': '#ef4444',
        'status-running': '#3b82f6',
        'status-completed': '#22c55e',
        'status-idle': '#6b7280',
        'status-unknown': '#374151',
        'status-snoozed': '#8b5cf6',
        accent: '#6366f1',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'sans-serif'],
        mono: ["'Consolas'", 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx"
    ],
    theme: {
        extend: {
            colors: {
                'binance-yellow': '#F0B90B',
            },
            fontFamily: {
                'ui': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                'hei': ['"Noto Sans SC"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                'song': ['"Noto Serif SC"', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
                'code': ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
            },
            animation: {
                'dot-breathe': 'dotBreathe 3s infinite',
                'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                dotBreathe: {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.6', transform: 'scale(0.8)' },
                }
            }
        },
    },
    plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#ff4b82",
                    dark: "#e03e72",
                },
                secondary: {
                    DEFAULT: "#8a2be2",
                    dark: "#721acb",
                },
            },
            backgroundImage: {
                'gradient-main': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                'gradient-accent': 'linear-gradient(135deg, #ff4b82 0%, #8a2be2 100%)',
            },
            animation: {
                'glow': 'glow 2s infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(255, 75, 130, 0.5)' },
                    '100%': { boxShadow: '0 0 20px rgba(255, 75, 130, 0.8), 0 0 30px rgba(138, 43, 226, 0.6)' },
                }
            }
        },
    },
    plugins: [],
}

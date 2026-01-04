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
                    400: '#34d399',
                    500: 'var(--primary)',
                    600: '#059669',
                },
                accent: {
                    400: '#60a5fa',
                    500: 'var(--accent)',
                    600: '#2563eb',
                },
            },
        },
    },
    plugins: [],
}

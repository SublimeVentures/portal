/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            fontSize: {
                xxs: ["10px", { lineHeight: "1.375" }],
                hero: ["55px", { lineHeight: "1.1" }],
            },
            fontWeight: {
                // extrabold: '800',
            },
        },
    },
    plugins: [
        function({ addUtilities }) {
            const newUtilities = {
                ".page-header-text": {
                    "font-weight": 300,
                    "font-family": "Work Sans, sans-serif",
                },
                ".page-content-text": {
                    "font-weight": 300,
                    "font-family": "Work Sans, sans-serif",
                },
            }

            addUtilities(newUtilities);
        }
    ],
};

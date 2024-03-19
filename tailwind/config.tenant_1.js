/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            colors: {
                "app-bg": "#0e1118",
                "navy-accent": "#161b26",
                "navy-2": "#0e1018",
                "app-success": "#b1e365",
                "app-error": "#b92551",
            },
            fontFamily: {
                body: ["Montserrat", "sans-serif"],
                accent: ["Work Sans", "sans-serif"],
            },
            fontSize: {
                xxs: ["10px", { lineHeight: "1.375" }],
                hero: ["48px", { lineHeight: "1.375" }],
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
                    "font-weight": 800,
                }
            }

            addUtilities(newUtilities);
        }
    ],
};

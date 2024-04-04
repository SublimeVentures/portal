/** @type {import('tailwindcss').Config} */
//
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
        },
    },
    plugins: [
        function ({ addUtilities }) {
            // font-medium - 'font-weight': 500
            // text-[1.7rem] - font-size: 1.7rem

            const newUtilities = {
                ".button-container": {},
                ".card-content-dedicated": {
                    "font-weight": 500,
                    "font-size": "1.7rem",
                },
                ".card-table-header": {
                    "font-weight": 500,
                    "font-size": "1.7rem",
                    "background-color": "rgb(14 16 24)",
                },
                ".card-content-description": {
                    "font-weight": 500,
                },
                ".glow-normal": {
                    "text-shadow": "rgba(255, 255, 255, 0.3) 0px 0px 12px",
                },
                ".header-text-dedicated": {
                    "font-weight": 500,
                },
                ".navbar-item": {
                    "font-weight": 500,
                },
                ".page-header-text": {
                    "font-weight": 800,
                },
                ".bordered-box": {
                    "border-radius": "0.75rem",
                },
                ".bordered-box-right": {
                    "border-radius": "0 0.75rem 0.75rem 0",
                },
                ".bordered-box-left": {
                    "border-radius": "0.75rem 0 0 0.75rem",
                },
                ".bordered-container": {
                    "border-radius": "0.75rem",
                    overflow: "hidden",
                },
                ".page-table-header": {
                    "font-weight": 500,
                    "font-size": "1.7rem",
                    "background-color": "rgb(18 21 30)",
                },
                ".background-text-dedicated": {
                    color: "rgb(245 164 0)",
                },
                ".background-text-description": {
                    color: "rgb(114 157 176)",
                },
            };
            addUtilities(newUtilities);
        },
    ],
};

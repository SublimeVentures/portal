/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            colors: {
                "app-bg": "#000",
                "navy-accent": "#000",
                "navy-2": "#0e1018",
                "app-success": "#b1e365",
                "app-capital": "#FFCC00",
                "app-error": "#f5a400",
            },
            fontSize: {
                xxs: ["10px", { lineHeight: "1.375" }],
                hero: ["55px", { lineHeight: "1.1" }],
            },
            fontFamily: {
                accent: ["Black Han Sans", "sans-serif"],
            },
            fontWeight: {
                bold: 300,
                "extra-bold": 500,
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            const newUtilities = {
                ".card-content-dedicated": {
                    "font-weight": 300,
                    color: "rgb(245 163 0)",
                    "text-transform": "uppercase",
                    "font-size": "1.5rem",
                },
                ".card-table-header": {
                    "font-family": "Work Sans, sans-serif",
                    color: "rgb(245 163 0)",
                    "font-weight": 300,
                    "font-size": "1.5rem",
                    "background-color": "rgb(0 0 0)",
                    "text-transform": "uppercase",
                },
                ".card-content-description": {
                    "font-weight": 300,
                    "font-family": "Work Sans, sans-serif",
                },
                ".glow-normal": {
                    "text-shadow": "rgba(211, 28, 91, 1) 0px 0px 12px",
                },
                ".header-text-dedicated": {
                    color: "rgb(245 163 0)",
                    "text-transform": "uppercase",
                    "font-weight": 300,
                },
                ".page-header-text": {
                    "font-weight": 300,
                    "font-family": "Work Sans, sans-serif",
                },
                ".page-content-text": {
                    "font-weight": 300,
                    "font-family": "Work Sans, sans-serif",
                },
                ".page-table-header": {
                    "font-family": "Work Sans, sans-serif",
                    color: "rgb(245 163 0)",
                    "font-weight": 300,
                    "font-size": "1.5rem",
                    "background-color": "rgb(0 0 0)",
                    "text-transform": "uppercase",
                },
                ".background-text-dedicated": {
                    color: "rgb(185 37 81)",
                    fill: "rgb(245 164 0)",
                },
                ".background-text-description": {
                    "font-family": "Work Sans, sans-serif",
                },
            };

            addUtilities(newUtilities);
        },
    ],
};

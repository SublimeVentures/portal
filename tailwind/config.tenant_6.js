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
        function ({ addUtilities }) {
            // font-light - font-weight: 300
            // font-accent - font-family: Work Sans, sans-serif
            const newUtilities = {
                ".card-content-dedicated": {
                    "font-weight": 300,
                    color: "rgb(185 37 81)",
                    "text-transform": "uppercase",
                    "font-size": "1.5rem",
                },
                ".card-table-header": {
                    "font-family": "Work Sans, sans-serif",
                    color: "rgb(185 37 81)",
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
                    color: "rgb(185 37 81)",
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
                    color: "rgb(185 37 81)",
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
                ".absolute-center-loading": {
                    position: "absolute",
                    top: "calc(50% - 150px)",
                    left: "calc(50% - 200px)",
                },
                ".skeleton": {
                    "background-color": "rgb(185 37 81)",
                },
            };

            addUtilities(newUtilities);
        },
    ],
};

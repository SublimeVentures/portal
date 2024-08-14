/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "app-accent": "#383a9b",
                "app-bg": "#000000",
                "app-bg-split": "#273031",
                "app-success": "#00c853",
                "app-error": "#D31C5B",
                "app-accent2": "#1b4d67",
                "app-white": "#f9fbfa",
                black: "#000000",
                bgalt: "rgb(211,28,91,.3)",
                footer: "#090b0f",
                gold: "#f5a400",
                "gold-hover": "#ffbc28",
                gray: "#c0c0c0",
                "gold-active": "#c2890d",
                kongping: "#E133B6",
                outline: "#729db0",
                "navy-accent": "rgba(0,0,0,0.2)",
                "navy-2": "rgba(0,0,0,0.2)",
                navy: "#12151e",
                slides: "#101d2d",
                white: "#ffffff",
                warn: "#fff600",
                turquoise: "#0BB0C8",
                "gray-500": "rgba(188,188,188,0.5)",
            },
            screens: {
                mobile: "520px",
                sinvest: "700px",
                collap: "900px",
                midcol: "1000px",
                custom: "1100px",
                tablet: "1200px",
                invest: "1420px",
                "3xl": "1820px",
            },
            fontWeight: {
                bold: 700,
                "extra-bold": 800,
            },
            margin: {
                15: "3.75rem",
            },
            inset: {
                12: "1.5rem",
            },
            width: {
                14: "2.5rem",
                15: "3rem",
                16: "3.5rem",
                18: "4rem",
                20: "5rem",
            },
            height: {
                14: "2.5rem",
                15: "3rem",
                16: "3.5rem",
                17: "3.75rem;",

                18: "4rem",
            },
            spacing: {
                25: "5.5rem",
                28: "7.5rem",
                35: "10rem",
            },
            gridTemplateRows: {
                // Simple 8 row grid
                8: "repeat(8, minmax(0, 1fr))",
            },
            gridTemplateColumns: {
                // Simple 16 column grid
                14: "repeat(14, minmax(0, 1fr))",
            },
            fontFamily: {
                body: ["Inter", "sans-serif"],
                accent: ["Roboto Mono", "sans-serif"],
            },
        },
    },
    plugins: [],
};

/** @type {import('tailwindcss').Config} */

const primary = {
    DEFAULT: "#ffcc00",
    500: "#ffcc00",
    600: "#b38b00",
    700: "#8a6d00",
    800: "#5c4800",
    900: "#3d3000",
    950: "#1f1900",
};

const secondary = {
    DEFAULT: "#ffcc00",
    500: "#ffcc00",
    600: "#b38b00",
};

module.exports = {
    theme: {
        extend: {
            colors: {
                primary,
                secondary,
            },
            fontFamily: {
                button: ["var(--accent-font)", "sans-serif"],
            },
        },
    },
};

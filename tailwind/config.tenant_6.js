/** @type {import('tailwindcss').Config} */

const primary = {
    DEFAULT: "#ba2652",
    500: "#ba2652",
    600: "#961D42",
    700: "#711532",
    800: "#4C0D21",
    900: "#2A0814",
    950: "#15020A",
};

const secondary = {
    DEFAULT: "#01c853",
    500: "#01c853",
    600: "#01B04A",
};

module.exports = {
    theme: {
        extend: {
            borderRadius: {
                none: "0",
                sm: "0",
                DEFAULT: "0",
                md: "0",
                lg: "0",
                xl: "0",
                "4xl": "0",
            },
            colors: {
                primary,
                secondary,
            },
        },
    },
};

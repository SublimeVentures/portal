/** @type {import('tailwindcss').Config} */

const primary = {
    DEFAULT: "#0BB0C8",
    500: "#0BB0C8",
    600: "#174763",
    700: "#113651",
    800: "#082536",
    900: "#0A1728",
    950: "#05060B",
};

const secondary = {
    DEFAULT: "#DBB479",
    500: "#DBB479",
    600: "#BC9F72",
};

const success = {
    DEFAULT: "#44DA66",
    500: "#44DA66",
    800: "#226D33",
};

const error = {
    50: "#FCEDED",
    100: "#F9D7D7",
    200: "#F3AFAF",
    300: "#ED8787",
    400: "#E76060",
    500: "#E13A3A",
    600: "#C31E1E",
    700: "#921616",
    800: "#610F0F",
    900: "#3F2334",
    950: "#1B0404",
    DEFAULT: "#E13A3A",
};

module.exports = {
    content: ["app/**/*.js", "src/components/**/*.js"],
    theme: {
        extend: {
            screens: {
                "3xl": "1800px",
                "4xl": "1920px",
                "5xl": "2560px",
            },
            colors: {
                primary,
                secondary,
                success,
                error,
            },
            spacing: {
                13: "3.25rem", // 52px
                17: "4.25rem", // 68px
                18: "4.5rem", // 72px
                19: "4.75rem", // 76px
                22: "5.5rem", // 88px
                26: "6.5rem", // 104px
                30: "7.5rem", // 120px
                46: "11.5rem", // 184px
                50: "12.5rem", // 200px
                116: "29rem", // 464px
            },
            fontSize: {
                "3xs": ".5rem", // 8px
                "2xs": ".625rem", // 10px
            },
            fontFamily: {
                body: ["var(--base-font)", "sans-serif"],
            },
            borderRadius: {
                "4xl": "2rem",
            },
            backgroundImage: {
                gradient: "linear-gradient(var(--tw-gradient-angle), var(--tw-gradient-stops))",
            },
            gridTemplateColumns: {
                cards: "repeat(auto-fill, minmax(450px, 1fr))",
            },
            boxShadow: {
                DEFAULT: "0px 3px 30px var(--tw-shadow-color, rgb(0 0 0 / 0.05))",
                accent: "0 3px 30px #FDC171",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.1s ease-out",
                "accordion-up": "accordion-up 0.1s ease-out",
            },
        },
        angle: {
            30: "30deg",
            80: "80deg",
            130: "130deg",
            140: "140deg",
        },
        aspectRatio: {
            "a4-vertical": "210 / 297",
            "a4-horizontal": "297 / 210",
        },
    },
    plugins: [
        function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    angle: (angle) => ({
                        "--tw-gradient-angle": angle,
                    }),
                },
                {
                    values: theme("angle"),
                },
            );
        },
        function ({ addUtilities }) {
            addUtilities({
                ".backface-visible": {
                    "backface-visibility": "visible",
                },
                ".backface-hidden": {
                    "backface-visibility": "hidden",
                },
            });
        },
    ],
};

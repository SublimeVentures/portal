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

const accent = {
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
                foreground: "hsla(0, 0%, 100%)",
                primary,
                accent,
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
                body: ["Poppins", "sans-serif"],
            },
            borderRadius: {
                "4xl": "2rem",
            },
            backgroundImage: {
                "primary-gradient": `linear-gradient(122deg, ${primary[900]} 0%, ${primary[600]} 47%, ${primary[900]} 100%)`,
                "primary-dark-gradient": `linear-gradient(270deg, hsla(211, 73%, 13%, 1) 0%, hsla(210, 17%, 5%, 0) 100%)`,
                "banner-gradient": `linear-gradient(-90deg, #092039 25%, #0A0C0E00 75%);`,
                "sheet-gradient": `linear-gradient(151deg, ${primary[950]} 0%, ${primary[700]} 49%, ${primary[950]} 100%)`,
                "navbar-gradient": `linear-gradient(to top, ${primary[950]} 0%, ${primary[950]} 50%, transparent 100%)`,
                "settings-gradient": `linear-gradient(125deg, ${primary[900]} 0%, ${primary[700]} 49%, ${primary[700]} 50%, ${primary[900]} 100%)`,

                "premium-banner": "url('/img/premium-banner.png')",
                "empty-investment-pattern": "url('/img/bg/investments/empty@1400.jpg')",
                "empty-investment-top-pattern": "url('/img/empty-investment-top-pattern.png')",
                "sheet-pattern": "url('/img/sheet-pattern.png')",
                gradient: "linear-gradient(var(--tw-gradient-angle), var(--tw-gradient-stops))",
                pattern:
                    "linear-gradient(0deg, rgba(9, 32, 57, 1) 0%, rgba(9, 32, 57, 1) 60%, rgba(9, 29, 51, 0.85) 70%, rgba(10, 12, 14, 0.75) 100%), url('/img/sheet-pattern.png')",
            },
            gridTemplateColumns: {
                cards: "repeat(auto-fill, minmax(450px, 1fr))",
            },
            boxShadow: {
                DEFAULT: "0px 3px 30px var(--tw-shadow-color, rgb(0 0 0 / 0.05))",
                accent: "0 3px 30px #FDC171",
            },
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

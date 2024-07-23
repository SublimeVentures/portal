/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["app/**/*.{js}", "src/components/**/*.{js}"],
    theme: {
        extend: {
            screens: {
                "3xl": "1800px",
                "4xl": "1920px",
                "5xl": "2560px",
            },
            colors: {
                foreground: "hsla(0, 0%, 100%)",
                accent: "hsla(36, 65%, 71%)",
                "accent-light": "hsla(34, 97%, 72%)",
                destructive: "hsla(0, 74%, 55%)",
                "destructive-dark": "hsla(324, 29%, 19%)",

                "navy-50": "hsla(188, 91%, 38%)", // #09A0B8
                "navy-100": "hsla(188, 91%, 37%)", // #099DB5
                "navy-200": "hsla(194, 96%, 22%)", // #025770;
                "navy-300": "hsla(206, 64%, 24%)", // #164263
                "navy-400": "hsla(207, 64%, 24%)", // #164062
                "navy-500": "hsla(205, 65%, 19%)", // #113651
                "navy-600": "hsla(211, 62%, 11%)", // #0A1A2B
                "navy-700": "hsla(214, 60%, 10%)", // #0A1728
                "navy-800": "hsla(211, 58%, 15%)", // #10263d
                "gray-100": "hsla(210, 7%, 70%)", // #AEB3B8
                "gray-200": "hsla(206, 18%, 46%)", // #60788a
                "gray-300": "hsla(203, 72%, 11%)", // #082131
                "gray-400": "hsla(209, 77%, 9%)", // #051626

                primary: {
                    DEFAULT: "#0BB0C8",
                    500: "#099DB5",
                    600: "#086377",
                    700: "#095A6E",
                    800: "#08374A",
                    900: "#092B3D",
                },
            },
            spacing: {
                13: "3.25rem", // 52px
                17: "4.25rem", // 68px
                19: "4.75rem", // 76px
            },
            fontSize: {
                "3xs": "10px",
                xxs: "11px",
                xs: "12px",
                sm: "13px",
                md: "14px",
                lg: "16px",
                xl: "17px",
                "2xl": "18px",
                "3xl": "20px",
                "4xl": "21px",
                "5xl": "22px",
                "6xl": "23px",
                "7xl": "26px",
                "8xl": "28px",
                "9xl": "29px",
                "10xl": "34px",
                "11xl": "39px",
            },
            fontWeight: {
                light: 300,
                regular: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
            },
            fontFamily: {
                body: ["Poppins", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "5px",
                lg: "64px",
            },
            backgroundImage: {
                "primary-gradient": `linear-gradient(122deg, #06162E 0%, #184A66 47%, #06162E 100%)`,
                "primary-light-gradient": `linear-gradient(324deg, #164062 0%, hsl(188, 91%, 38%) 100%)`,
                "primary-dark-gradient": `linear-gradient(270deg, hsla(211, 73%, 13%, 1) 0%, hsla(210, 17%, 5%, 0) 100%)`,
                "banner-gradient": `linear-gradient(-90deg, #092039 25%, #0A0C0E00 75%);`,
                "sheet-gradient": `linear-gradient(151deg, #051626 0%, #1A3754 49%, #051626 100%)`,
                "navbar-gradient": "linear-gradient(to top, #071321 0%, #071321 50%, transparent 100%)",
                "settings-gradient": "linear-gradient(125deg, #06162E 0%, #11364B 49%, #11354B 50%, #06162E 100%)",

                "upgrade-to-premium-pattern": "url('/img/upgrade-to-premium-bg.png')",
                "upgrade-to-premium-banner-pattern": "url('/img/upgrade-to-premium-banner.png')",
                "premium-banner": "url('/img/premium-banner.png')",
                "empty-investment-pattern": "url('/img/empty-investment-pattern.png')",
                "empty-investment-top-pattern": "url('/img/empty-investment-top-pattern.png')",
                "sheet-pattern": "url('/img/sheet-pattern.png')",
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
    },
    plugins: [],
};

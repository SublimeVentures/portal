/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["app/**/*.{js}", "src/components/**/*.{js}"],
    theme: {
        extend: {
            colors: {
                primary: "hsla(var(--primary-color))",
                accent: "hsla(var(--accent-color))",
                foreground: "hsla(var(--foreground-color))",
                destructive: "hsla(var(--destructive-color))",
            },
            fontSize: {
                xxs: "var(--text-xxs)",
                xs: "var(--text-xs)",
                sm: "var(--text-sm)",
                md: "var(--text-md)",
                lg: "var(--text-lg)",
                xl: "var(--text-xl)",
                "2xl": "var(--text-2xl)",
                "3xl": "var(--text-3xl)",
                "4xl": "var(--text-4xl)",
                "5xl": "var(--text-5xl)",
                "6xl": "var(--text-6xl)",
                "7xl": "var(--text-7xl)",
                "8xl": "var(--text-8xl)",
                "9xl": "var(--text-9xl)",
                "10xl": "var(--text-10xl)",
                "11xl": "var(--text-11xl)",
            },
            fontWeight: {
                light: 300,
                regular: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
            },
            fontFamily: {
                poppins: "var(--font-poppins)",
            },
            borderRadius: {
                DEFAULT: "var(--radius)",
                lg: "var(--radius-lg)",
            },
            backgroundImage: {
                "primary-gradient": `linear-gradient(122deg, #06162E 0%, #184A66 47%, #06162E 100%)`,
                "primary-light-gradient": `linear-gradient(324deg, #164062 0%, hsl(var(--primary-color)) 100%)`,
                "primary-dark-gradient": `linear-gradient(270deg, hsla(211, 73%, 13%, 1) 0%, hsla(210, 17%, 5%, 0) 100%)`,
                "banner-gradient": `linear-gradient(-90deg, #092039 25%, #0A0C0E00 75%);`,
                "sheet-gradient": `linear-gradient(151deg, #051626 0%, #1A3754 49%, #051626 100%)`,
                "dialog-gradient": `linear-gradient(102deg, #06162E 0%, #11364B 49%, #11354B 50%, #06162E 100%)`,
                "sidebar-gradient": `linear-gradient(333deg, #0A1728 0%, #082536 100%)`,

                "upgrade-to-premium-pattern": "url('/img/upgrade-to-premium-bg.png')",
                "upgrade-to-premium-banner-pattern": "url('/img/upgrade-to-premium-banner.png')",
                "empty-investment-pattern": "url('/img/empty-investment-pattern.png')",
                "empty-investment-top-pattern": "url('/img/empty-investment-top-pattern.png'§)",
                "sheet-pattern": "url('/img/sheet-pattern.png')",
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
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
        },
    },
    plugins: [],
}

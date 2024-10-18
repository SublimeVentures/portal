import { Poppins, Black_Han_Sans } from "next/font/google";

const base = Poppins({
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
    variable: "--base-font",
});

const accent = Black_Han_Sans({
    weight: ["400"],
    style: ["normal"],
    subsets: ["latin"],
    display: "swap",
    variable: "--accent-font",
});

const fonts = {
    base,
    accent,
};

export default fonts;

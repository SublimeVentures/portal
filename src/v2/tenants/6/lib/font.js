import { Roboto_Mono } from "next/font/google";

const font = Roboto_Mono({
    weight: ["300", "400", "500", "600", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
    variable: "--base-font",
});

export default font;

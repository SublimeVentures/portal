import { Poppins } from "next/font/google";

const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    style: ["normal", "italic"],
    subsets: ["latin"],
    display: "swap",
    variable: "--base-font",
});

export default poppins;

import Link from "next/link";
import Lottie from "lottie-react";
import { GoHome } from "react-icons/go";
import PAGE from "@/routes";
import error from "@/assets/lottie/error.json";
import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";

const BasedUnexpectedErrorPage = () => {
    return (
        <div className={"max-h-screen overflow-hidden"}>
            <Lottie animationData={error} loop={true} autoplay={true} style={{ width: "100%", margin: "5px auto" }} />
            <Link href={PAGE.App} className="absolute top-10 left-0 right-0">
                <RoundButton
                    text={"HOME"}
                    is3d={true}
                    isPrimary={false}
                    isWide={true}
                    zoom={1.1}
                    size={"text-sm sm"}
                    icon={<GoHome className={ButtonIconSize.hero} />}
                />
            </Link>
            <div className="background-text-dedicated absolute bottom-5 text-6xl">Something went wrong...</div>
        </div>
    );
};

export default BasedUnexpectedErrorPage;

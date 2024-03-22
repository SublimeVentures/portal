import Link from "next/link";
import Lottie from "lottie-react";
import PAGE from "@/routes";
import error from "@/assets/lottie/error.json";
import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";
import IconDashboard from "@/assets/svg/Home.svg";

const BaseUnexpectedErrorPage = () => {
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
                    icon={<IconDashboard className={ButtonIconSize.hero} />}
                />
            </Link>
            <div className="background-text-dedicated absolute bottom-5 text-6xl">Something went wrong...</div>
        </div>
    );
};

export default BaseUnexpectedErrorPage;

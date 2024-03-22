import Link from "next/link";
import Lottie from "lottie-react";
import PAGE from "@/routes";
import lottie500 from "@/assets/lottie/500v1.json";
import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";
import IconDashboard from "@/assets/svg/Home.svg";

const BaseInternalErrorPage = () => {
    return (
        <div className={"max-h-screen overflow-hidden"}>
            <Lottie
                animationData={lottie500}
                loop={true}
                autoplay={true}
                style={{ width: "100%", margin: "5px auto" }}
            />
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
            <div className="background-text-dedicated absolute bottom-10 text-2xl">500 Internal Server Error</div>
        </div>
    );
};

export default BaseInternalErrorPage;

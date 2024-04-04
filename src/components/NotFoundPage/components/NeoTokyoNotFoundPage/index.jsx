import Link from "next/link";
import Lottie from "lottie-react";
import { GoHome } from "react-icons/go";
import PAGE from "@/routes";
import lottie404 from "@/assets/lottie/404.json";
import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";

const NeoTokyoNotFoundPage = () => {
    return (
        <div className={"max-h-screen overflow-hidden"}>
            <Lottie
                animationData={lottie404}
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
                    icon={<GoHome className={ButtonIconSize.hero} />}
                />
            </Link>
            <div className="background-text-dedicated absolute bottom-5 text-8xl">404</div>
        </div>
    );
};

export default NeoTokyoNotFoundPage;

import Link from "next/link";
import Lottie from "lottie-react";
import { BsLightningCharge as IconLight } from "react-icons/bs";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import PAGE from "@/routes";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";

import lottieVault from "@/assets/lottie/vault.json";

export default function EmptyVault() {
    return (
        <>
            <Lottie
                animationData={lottieVault}
                loop={true}
                autoplay={true}
                style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: "400px",
                    maxWidth: "400px",
                    margin: "0 auto",
                    marginTop: "-50px",
                }}
            />

            <div className="text-2xl -mt-5 sm:-mt-10 uppercase text-hero font-medium !text-3xl tracking-wider ">
                <Link href={PAGE.Opportunities} className={"flex justify-center"}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={"Invest to unlock"}
                        isWide={true}
                        is3d={true}
                        isPrimary={false}
                        zoom={1.1}
                        size={"text-sm sm"}
                        icon={<IconLight className={ButtonIconSize.hero} />}
                    />
                </Link>
            </div>
        </>
    );
}

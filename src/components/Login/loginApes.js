import { useEffect } from "react";
import { IoPlay as PlayIcon } from "react-icons/io5";
import HeroBg from "@/components/Home/HeroBg";
import Linker from "@/components/link";
import { ButtonCitCapIconSize, CitCapButton } from "@/components/Button/CitCapButton";
import useLoginFlow from "@/components/Login/useLoginFlow";
import LoginModal from "@/components/SignupFlow/LoginModal";
import { getTenantConfig } from "@/lib/tenantHelper";

const { externalLinks } = getTenantConfig();

export default function LoginApesCapital({}) {
    const { isLoginLoading, handleConnect, setPartner, loginData } = useLoginFlow();

    useEffect(() => {
        setPartner(Number(process.env.NEXT_PUBLIC_TENANT));
    }, []);

    const renderOptions = () => {
        return (
            <div className={"flex flex-1 justify-between flex-wrap gap-10"}>
                <div className="flex flex-col p-10 sm:p-20 w-full sm:w-max font-accent blurred glareBg bg-black lg:flex-row ">
                    <div className="flex flex-col flex-1 ">
                        <div className={"pb-2"}>Login with BAYC / MAYC NFT</div>
                        <div className={"pb-10"}>
                            <Linker url={externalLinks.DELEGATED_ACCESS} text={"Delegated access?"} />
                        </div>
                        <div className="flex flex-col gap-5 justify-end flex-1 mt-10 lg:mt-0">
                            <CitCapButton
                                text={"CONNECT"}
                                isLoading={isLoginLoading}
                                handler={() => {
                                    handleConnect();
                                }}
                                isWhite={true}
                                icon={<PlayIcon className={ButtonCitCapIconSize.hero} />}
                            />
                        </div>
                    </div>
                </div>
                <div className={"hidden lg:flex  items-center md:justify-end"}>
                    <img src={"https://cdn.basedvc.fund/webapp/logo_alt_19.png"} className={"w-[280px]"} />
                </div>
            </div>
        );
    };

    return (
        <>
            <HeroBg subtitle={"Welcome to"} title={"Apes Capital"} content={renderOptions()} />
            <LoginModal loginModalProps={loginData} />
        </>
    );
}

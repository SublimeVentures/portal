import { ButtonCitCapIconSize, CitCapButton } from "@/components/Button/CitCapButton";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import useLoginFlow from "@/components/Login/useLoginFlow";
import DynamicIcon from "@/components/Icon";
const LoginModal = dynamic(() => import("@/components/SignupFlow/LoginModal"), {
    ssr: false,
});

export default function Hero({}) {
    const { isLoginLoading, handleConnect, setPartner, loginData } = useLoginFlow();

    useEffect(() => {
        setPartner(Number(process.env.NEXT_PUBLIC_TENANT));
    }, []);

    return (
        <div className="min-h-screen bg flex flex-col justify-center hero select-none">
            <div className="flex flex-col w-full md:mx-auto justify-center items-center mt-10">
                <div className="flex flex-col p-10 text-white font-medium md:max-w-[600px] md:justify-center text-hero">
                    <img src={"https://vc-cdn.s3.eu-central-1.amazonaws.com/webapp/hero_14.png"} />
                </div>

                <div className={"w-[300px] flex flex-col mt-10"}>
                    <CitCapButton
                        text={"CONNECT"}
                        isLoading={isLoginLoading}
                        handler={() => {
                            handleConnect();
                        }}
                        isWhite={true}
                        icon={<DynamicIcon name={"Play"} style={ButtonCitCapIconSize.hero} />}
                    />
                </div>
            </div>
            <LoginModal loginModalProps={loginData} />
        </div>
    );
}

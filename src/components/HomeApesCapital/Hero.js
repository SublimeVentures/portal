import dynamic from "next/dynamic";
import { useEffect } from "react";
import { ButtonCitCapIconSize, CitCapButton } from "@/components/Button/CitCapButton";
import useLoginFlow from "@/components/Login/useLoginFlow";
import DynamicIcon from "@/components/Icon";
import { CitCapGlitchButton } from "@/components/Button/CitCapGlitchButton";
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
                <div className="flex flex-col p-10 text-white font-medium md:max-w-[700px] md:justify-center text-hero">
                    <img src={"https://vc-cdn.s3.eu-central-1.amazonaws.com/webapp/hero_19.png"} />
                </div>

                <div className={"w-[300px] flex flex-col mt-10"}>
                    <CitCapGlitchButton
                        text={`CONNECT`}
                        state={"bayc"}
                        isLoading={isLoginLoading}
                        handler={() => {
                            handleConnect();
                        }}
                    />
                </div>
            </div>
            <LoginModal loginModalProps={loginData} />
        </div>
    );
}

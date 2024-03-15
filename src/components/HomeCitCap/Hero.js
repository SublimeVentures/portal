import {
    ButtonCitCapIconSize,
    CitCapButton,
} from "@/components/Button/CitCapButton";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import useLoginFlow from "@/components/Login/useLoginFlow";
import DynamicIcon from "@/components/Icon";
const LoginModal = dynamic(() => import("@/components/SignupFlow/LoginModal"), {
    ssr: false,
});

export default function Hero({}) {
    const { isLoginLoading, handleConnect, setPartner, loginData } =
        useLoginFlow();

    useEffect(() => {
        setPartner(Number(process.env.NEXT_PUBLIC_TENANT));
    }, []);

    return (
        <div className="min-h-screen bg flex flex-col justify-center hero select-none">
            <div className="flex flex-col w-full md:max-w-[80%] md:mx-auto xl:max-w-[1200px]">
                <div className="flex flex-col p-10 text-white font-medium md:max-w-[600px] md:justify-center">
                    <div className={`font-accent ml-1 text-base mb-1`}>
                        OFFICIAL INVESTMENT ARM OF NEO TOKYO
                    </div>
                    <div className="text-hero">
                        <h2
                            className="heroFont  glitch layers font-bold"
                            data-text="CITIZEN CAPITAL"
                        >
                            CITIZEN CAPITAL
                        </h2>
                    </div>
                </div>

                <div className="flex mx-auto mt-10 md:mt-0 md:items-center md:p-10 md:left-0 md:right-0 md:absolute md:bottom-20 md:mx-auto md:justify-center">
                    <div className={"w-[300px] flex flex-col"}>
                        <CitCapButton
                            text={"CONNECT"}
                            isLoading={isLoginLoading}
                            handler={() => {
                                handleConnect();
                            }}
                            isWhite={true}
                            icon={
                                <DynamicIcon
                                    name={"Play"}
                                    style={ButtonCitCapIconSize.hero}
                                />
                            }
                        />
                    </div>
                </div>
            </div>
            <LoginModal loginModalProps={loginData} />
        </div>
    );
}

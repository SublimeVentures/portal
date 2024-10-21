import { useRouter } from "next/router";
import { IoPlay as PlayIcon } from "react-icons/io5";
import { RoundButton, ButtonIconSize } from "@/components/Button/RoundButton";
import PAGE from "@/routes";

export default function Hero({ account }) {
    const router = useRouter();
    const login = () => {
        if (account) {
            router.push(PAGE.App);
        } else {
            router.push(PAGE.Login);
        }
    };

    return (
        <div className="min-h-screen bg-[url(https://cdn.basedvc.fund/webapp/bg.jpg)] bg-cover flex flex-col justify-center hero select-none tracking-[0.2em]">
            <div className="flex flex-col w-full md:max-w-[80%] md:mx-auto xl:max-w-[1200px]">
                <div className="flex flex-col p-10 text-white font-medium md:max-w-[600px] md:justify-center">
                    <div className="ml-1 text-xs mb-2.5">INVEST GROUND FLOOR</div>
                    <div className="text-5xl leading-tight">DON'T BE EXIT LIQUIDITY</div>
                </div>

                <div className="flex mx-auto mt-10 md:mt-0 md:items-center md:p-10 md:left-0 md:right-0 md:absolute md:bottom-20 md:mx-auto md:justify-center">
                    <RoundButton
                        text={"invest"}
                        is3d={true}
                        isPrimary={false}
                        isWider={true}
                        zoom={1.1}
                        size={
                            "text-2xl lg border border-white rounded-full text-white h-19 px-14 uppercase tracking-[0.5rem] font-light shadow shadow-white/25"
                        }
                        handler={login}
                        icon={<PlayIcon className={ButtonIconSize.hero} />}
                    />
                </div>
            </div>
        </div>
    );
}

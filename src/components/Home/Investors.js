import { useEffect } from "react";
import Glide, { Autoplay, Breakpoints, Swipe } from "@glidejs/glide/dist/glide.modular.esm";
import Multicoin from "@/assets/svg/logo/Multicoin.svg?component";
import Binance from "@/assets/svg/logo/BinanceLabs.svg?component";
import CryptoCom from "@/assets/svg/logo/CryptoCom.svg?component";
import Coinbase from "@/assets/svg/logo/Coinbase.svg?component";
import A16z from "@/assets/svg/logo/A16z.svg?component";
import Animoca from "@/assets/svg/logo/Animoca.svg?component";
import Qcp from "@/assets/svg/logo/Qcp.svg?component";
import Sequoia from "@/assets/svg/logo/Sequoia.svg?component";
import DynamicIcon from "@/components/Icon";
import { TENANT } from "@/lib/tenantHelper";
import { tenantIndex } from "@/lib/utils";

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

export default function Investors() {
    useEffect(() => {
        new Glide("div.glide", {
            type: "carousel",
            perView: 3,
            peek: 50,
            focusAt: "center",
            autoplay: 2000,
            perTouch: 1,
            breakpoints: {
                720: {
                    perView: 1,
                },
            },
            throttle: 50,
        }).mount({ Breakpoints, Autoplay, Swipe });
    }, []);

    return (
        <div className="investorGradient flex flex-col justify-center text-white pt-10 uppercase pb-10">
            <div className="px-10 py-25 flex flex-col gap-10 flex-1">
                <div className="flex flex-col text-white font-medium  text-center pb-10">
                    <div className="font-accent text-xs ml-1">WHO WE WORK with</div>
                    <div className="leading-snug text-3xl">Co-Investors</div>
                </div>
                <div></div>
                <div className="glide">
                    <div className="glide__track" data-glide-el="track">
                        <div className="glide__slides glide__slides-custom">
                            <div className="glide__slide glide__slide-custom">
                                <Multicoin className="!w-[280px] max-h-[220px]" />
                            </div>
                            <div className="glide__slide glide__slide-custom">
                                <Binance className="!w-[280px] max-h-[220px]" />
                            </div>
                            <div className="glide__slide glide__slide-custom">
                                <DynamicIcon
                                    name={`logo_${isBaseVCTenant ? TENANT.NeoTokyo : TENANT.basedVC}`}
                                    style={"!w-[280px] max-h-[220px]"}
                                />
                            </div>
                            <div className="glide__slide glide__slide-custom">
                                <CryptoCom className="!w-[280px] max-h-[220px]" />
                            </div>
                            <div className="glide__slide glide__slide-custom">
                                <Coinbase className="!w-[280px] max-h-[220px]" />
                            </div>
                            <div className="glide__slide glide__slide-custom">
                                <A16z className="!w-[280px] max-h-[220px]" />
                            </div>
                            <div className="glide__slide glide__slide-custom">
                                <Animoca className="!w-[280px] max-h-[220px]" />
                            </div>
                            <div className="glide__slide glide__slide-custom">
                                <Qcp className="!w-[280px] max-h-[220px]" />
                            </div>
                            <div className="glide__slide glide__slide-custom">
                                <Sequoia className="!w-[280px] max-h-[220px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import Slider from "react-slick";
import Multicoin from '@/assets/svg/logo/Multicoin.svg?component'
import Binance from '@/assets/svg/logo/BinanceLabs.svg?component'
import CitCap from '@/assets/svg/logo/CitCap.svg?component'
import CryptoCom from '@/assets/svg/logo/CryptoCom.svg?component'
import Coinbase from '@/assets/svg/logo/Coinbase.svg?component'
import A16z from '@/assets/svg/logo/A16z.svg?component'
import Animoca from '@/assets/svg/logo/Animoca.svg?component'
import Qcp from '@/assets/svg/logo/Qcp.svg?component'
import Sequoia from '@/assets/svg/logo/Sequoia.svg?component'
import {isBased} from "@/lib/utils";

export default function Investors() {

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 3,
        speed: 500,
        autoplaySpeed: 2000,
        autoplay: true,
        dots: false,
        slidesToScroll: 1,
        arrows: false,
        responsive: [

            {
                breakpoint: 720,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },
        ]
    };

    return (
        <div className="investorGradient flex flex-col justify-center text-white pt-10 uppercase pb-10">
            <div className="px-10 py-25 flex flex-col gap-10 flex-1">
                <div className="flex flex-col text-white font-medium  text-center pb-10">
                    <div className="font-accent text-xs ml-1">WHO WE WORK with</div>
                    <div className="leading-snug text-3xl">
                        Co-Investors
                    </div>
                </div>
                <div>

                </div>
                <Slider {...settings}>
                    <div>
                        <div className="customSlide justify-center flex min-h-[250px]"><Multicoin
                            className="!w-[280px] max-h-[220px]"/></div>
                    </div>
                    <div>
                        <div className="customSlide justify-center flex min-h-[250px]"><Binance
                            className="!w-[280px] max-h-[220px]"/></div>
                    </div>
                    <div>
                         <div className="customSlide justify-center flex min-h-[250px]">
                             {isBased ?<CitCap className="!w-[280px] max-h-[220px]"/> : <img src={"/img/logo.png"} className="!w-[280px] max-h-[220px]" alt={"based"}/>}
                         </div>
                    </div>
                    <div>
                        <div className="customSlide justify-center flex min-h-[250px]"><CryptoCom
                            className="!w-[280px] max-h-[220px]"/></div>
                    </div>
                    <div>
                        <div className="customSlide justify-center flex min-h-[250px]"><Coinbase
                            className="!w-[280px] max-h-[220px]"/></div>
                    </div>
                    <div>
                        <div className="customSlide justify-center flex min-h-[250px]"><A16z
                            className="!w-[280px] max-h-[220px]"/></div>
                    </div>
                    <div>
                        <div className="customSlide justify-center flex min-h-[250px]"><Animoca
                            className="!w-[280px] max-h-[220px]"/></div>
                    </div>
                    <div>
                        <div className="customSlide justify-center flex min-h-[250px]"><Qcp
                            className="!w-[280px] max-h-[220px]"/></div>
                    </div>
                    <div>
                        <div className="customSlide justify-center flex min-h-[250px]"><Sequoia
                            className="!w-[280px] max-h-[220px]"/></div>
                    </div>

                </Slider>


            </div>

        </div>

    )
}

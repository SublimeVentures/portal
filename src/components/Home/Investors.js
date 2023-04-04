import Slider from "react-slick";
import Multicoin from '@/svg/logo/Multicoin.svg?component'
import Binance from '@/svg/logo/BinanceLabs.svg?component'
import CitCap from '@/svg/logo/CitCap.svg?component'
import CryptoCom from '@/svg/logo/CryptoCom.svg?component'
import Coinbase from '@/svg/logo/Coinbase.svg?component'
import A16z from '@/svg/logo/A16z.svg?component'
import Animoca from '@/svg/logo/Animoca.svg?component'
import Qcp from '@/svg/logo/Qcp.svg?component'
import Sequoia from '@/svg/logo/Sequoia.svg?component'

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
                    <div className="f-work text-xs ml-1">WHO WE WORK with</div>
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
                        <div className="customSlide justify-center flex min-h-[250px]"><CitCap
                            className="!w-[280px] max-h-[220px]"/></div>
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

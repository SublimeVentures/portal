import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Thumbs, FreeMode} from 'swiper';
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {useState} from "react";
import useWidth from "@/lib/hooks/useScreenWidth";
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";

const MEDIA_TYPE = {
    IMAGE: 0,
    YOUTUBE: 1,
}

export default function OfferDetailsMediaSlider({offer}) {
    const {cdn} = useEnvironmentContext();

    const { slug, media} = offer;
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const haveMedia = media ? media?.length > 0 : false
    const slides = haveMedia ? media : []

    if (!haveMedia) return;

    const size = useWidth();
    const isVertical = size > 1280

    return (<>
        <div className={`mt-5 flex flex-col xl:flex-row ${isVertical ? "max-h-[500px]" : ""}`}>
            <div className={`sliderMain ${isVertical ? "max-w-[80%]" : ""}`}>
                <Swiper
                    style={{
                        "--swiper-navigation-color": "#fff",
                        "--swiper-pagination-color": "#fff",
                    }}
                    loop={true}
                    spaceBetween={10}
                    navigation={true}
                    keyboard={{
                        enabled: true,
                    }}
                    thumbs={{swiper: thumbsSwiper}}
                    modules={[FreeMode, Navigation, Thumbs]}
                >
                    {slides.map((el, i) => {
                        return <SwiperSlide key={i} >
                            {
                                el.type === MEDIA_TYPE.IMAGE ?
                                    <img src={`${cdn}/research/${slug}/slide/${el.url}`} alt={"img"}/> :
                                    <iframe width="100%" height="500" className={"rounded-xl "} src={el.url}
                                            title="YouTube video player" frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen></iframe>
                            }
                        </SwiperSlide>
                    })}
                </Swiper>
            </div>

            <div className={`sliderThumb -mt-[5px] ${isVertical ? "-mr-2 ml-2" : "mt-5"}`}>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={0}
                    slidesPerView={3}
                    freeMode={true}
                    direction={isVertical ? "vertical" : "horizontal"}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                >
                    {slides.map((el, i) => {
                        return (
                            <SwiperSlide key={i}>
                                <div className={"thumb rounded-xl m-2"}>
                                    <img
                                        src={`${cdn}/research/${slug}/slide/${el.type === MEDIA_TYPE.IMAGE ? el.url : el.thumb}`}
                                        alt={"img"}/>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </div>
    </>)

}

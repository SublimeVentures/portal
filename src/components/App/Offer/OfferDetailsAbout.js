import IconDownload from "@/assets/svg/Download.svg";
import IconDiscord from "@/assets/svg/Discord.svg";
import IconWebsite from "@/assets/svg/Website.svg";
import IconTwitter from "@/assets/svg/Twitter.svg";
import {IconButton} from "@/components/Button/IconButton";
import Script from "next/script";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Thumbs, FreeMode} from 'swiper';
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {useState} from "react";


const MEDIA_TYPE = {
    IMAGE: 0,
    YOUTUBE: 1,
}

export default function OfferDetailsAbout({offer}) {
    const {url_web, url_twitter, url_discord, cdn, slug, description, media} = offer;
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    function createMarkup() {
        return {__html: description};
    }


    const haveMedia = media ? media?.length>0 : false
    const slides = haveMedia ? media : []

    return (
        <>

            <div className="rounded-xl relative offerWrap overflow-hidden">
                <div className={"rounded-xl bg-navy-accent flex flex-wrap items-center justify-center py-5 gap-5 midcol:justify-between "}>
                    <div className="flex mx-10 text-[1.7rem]  font-medium glowNormal midcol:mr-0">About</div>
                    <div className="flex mx-10 gap-5 items-center justify-center midcol:ml-0">


                        {url_web && <a href={`${url_web}`} target="_blank">
                            <IconButton zoom={1.1} size={'w-12 p-3'} icon={<IconWebsite />} />
                        </a> }

                        {url_twitter && <a href={`${url_twitter}`} target="_blank">
                            <IconButton zoom={1.1} size={'w-12 p-3'} icon={<IconTwitter />}/>
                        </a> }

                        {url_discord && <a href={`${url_discord}`} target="_blank">
                            <IconButton zoom={1.1} size={'w-12 p-3'} icon={<IconDiscord />}/>
                        </a> }

                        <a href={`${cdn}${slug}/ResearchReport.pdf`} target="_blank">
                            <IconButton zoom={1.1} size={'w-17 p-3'} icon={<IconDownload />}/>
                        </a>

                    </div>
                    {description && <div className="my-5 mx-10" dangerouslySetInnerHTML={createMarkup()} />}
                </div>

            </div>
            {haveMedia && <div className={"flex flex-col"}>
                <Swiper
                    style={{
                        "--swiper-navigation-color": "#fff",
                        "--swiper-pagination-color": "#fff",
                    }}
                    loop={true}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mt-5"
                >
                    {slides.map((el,i)=> {
                        return <SwiperSlide key={i}>
                            {
                                el.type === MEDIA_TYPE.IMAGE ?
                                    <img src={`${cdn}${slug}/slide/${el.url}`} alt={"img"}/> :
                                    <iframe width="100%" height="500" className={"rounded-xl"} src={el.url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                            }
                        </SwiperSlide>
                    })}
                </Swiper>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mt-5"
                >
                    {slides.map((el,i)=> {
                        return (
                            <SwiperSlide key={i}>
                                <div className={"thumb rounded-xl"}>
                                    <img src={`${cdn}${slug}/slide/${el.type === MEDIA_TYPE.IMAGE  ? el.url : el.thumb}`} alt={"img"}/>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div> }


            <div className="my-10">
                <Script src="/browser/index-d5086682.js"/>
                <div id="flipbook"></div>
            </div>
        </>


    )
}

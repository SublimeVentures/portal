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


    console.log("0,",media)


    const slides = [
        {type: MEDIA_TYPE.IMAGE, url: "https://polkastarter.com/_next/image?url=https%3A%2F%2Fassets.polkastarter.com%2Fv3gfgnzhxtvx2ztijji1k1f19vxb&w=2048&q=95"},
        {type: MEDIA_TYPE.IMAGE, url: "https://polkastarter.com/_next/image?url=https%3A%2F%2Fassets.polkastarter.com%2F94jk0mjyoxqojsokqqmddcwyepnn&w=2048&q=95"},
        {type: MEDIA_TYPE.IMAGE, url: "https://polkastarter.com/_next/image?url=https%3A%2F%2Fassets.polkastarter.com%2Fv3gfgnzhxtvx2ztijji1k1f19vxb&w=2048&q=95"},
        {type: MEDIA_TYPE.YOUTUBE, url: "https://www.youtube.com/embed/V2cF4uE0mXs?enablejsapi=1&html5=1&rel=0", thumb: "https://i3.ytimg.com/vi/V2cF4uE0mXs/hqdefault.jpg"},
    ]

    return (
        <>

            <div className="rounded-xl relative offerWrap">
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


                {/*<Swiper*/}
                {/*    style={{*/}
                {/*        "--swiper-navigation-color": "#fff",*/}
                {/*        "--swiper-pagination-color": "#fff",*/}
                {/*    }}*/}
                {/*    loop={true}*/}
                {/*    spaceBetween={10}*/}
                {/*    navigation={true}*/}
                {/*    thumbs={{ swiper: thumbsSwiper }}*/}
                {/*    modules={[FreeMode, Navigation, Thumbs]}*/}
                {/*    className="mt-5"*/}
                {/*>*/}
                {/*    {slides.map((el,i)=> {*/}
                {/*        return <SwiperSlide key={i}>{el.type === MEDIA_TYPE.IMAGE ? <img src={el.url} alt={"img"}/> :*/}
                {/*            <iframe width="100%" height="500" className={"rounded-xl"}*/}
                {/*                    src={el.url}*/}
                {/*                    frameBorder="0" allowFullScreen iframe-video={"true"}></iframe>}</SwiperSlide>*/}
                {/*    })}*/}
                {/*</Swiper>*/}
                {/*<Swiper*/}
                {/*    onSwiper={setThumbsSwiper}*/}
                {/*    loop={true}*/}
                {/*    spaceBetween={10}*/}
                {/*    slidesPerView={4}*/}
                {/*    freeMode={true}*/}
                {/*    watchSlidesProgress={true}*/}
                {/*    modules={[FreeMode, Navigation, Thumbs]}*/}
                {/*    className="mt-5"*/}
                {/*>*/}
                {/*    {slides.map((el,i)=> {*/}
                {/*        return (*/}
                {/*            <SwiperSlide key={i}>*/}
                {/*                <div className={"thumb rounded-xl"}>*/}
                {/*                        <img src={el.type === MEDIA_TYPE.IMAGE  ? el.url : el.thumb} alt={"img"}/>*/}
                {/*                </div>*/}
                {/*            </SwiperSlide>*/}
                {/*        )*/}
                {/*    })}*/}
                {/*</Swiper>*/}




            <div className="my-10">
                <Script src="/browser/index-d5086682.js"/>
                <div id="flipbook"></div>
            </div>
        </>


    )
}

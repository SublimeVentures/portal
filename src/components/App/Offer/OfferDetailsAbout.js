import IconDownload from "@/assets/svg/Download.svg";
import IconDiscord from "@/assets/svg/Discord.svg";
import IconWebsite from "@/assets/svg/Website.svg";
import IconTwitter from "@/assets/svg/Twitter.svg";
import {IconButton} from "@/components/Button/IconButton";
import {isBased} from "@/lib/utils";
import OfferDetailsMediaSlider from "@/components/App/Offer/OfferDetailsMediaSlider";
import { useEffect, useState, useMemo } from "react";
import Flipbook from "@/components/Flipbook/Flipbook";

export default function OfferDetailsAbout({offer}) {
    const {url_web, url_twitter, url_discord, cdn, slug, description} = offer;
    const [amount, setAmount] = useState(0);
    function createMarkup() {
        return {__html: description};
    }

    const parsePages = useMemo(() => {
        let pages = [];
        for (let i = 1; i < amount; i++) {
            const paddedNumber = String(i).padStart(4, '0');
            pages.push(`${cdn}/research/${slug}/ResearchReport_page-${paddedNumber}.jpg`);
        }
        return pages;
    }, [amount, slug]);

    const fetchMeta = async () => {
        const response = await fetch(`${cdn}/research/${slug}/meta.json`);
        const data = await response.json();
        if (data) {
            setAmount(Number(data.pages));
        }
    };

    useEffect(() => {
        setAmount(0);
        fetchMeta();
    }, [slug]);


    return (
        <>
            <div className={`${isBased ? "rounded-xl" : ""} relative offerWrap overflow-hidden`}>
                <div className={`${isBased ? "rounded-xl" : ""} bg-navy-accent flex flex-wrap items-center justify-center py-5 gap-5 midcol:justify-between `}>

                    <div className={`${isBased ? " font-medium text-[1.7rem]" : "text-app-error font-accent glowRed uppercase font-light text-2xl"} flex mx-10  glowNormal midcol:mr-0`}>About</div>
                    <div className="flex mx-10 gap-5 items-center justify-center midcol:ml-0">


                        {url_web && <a href={`${url_web}`} target="_blank">
                            <IconButton zoom={1.1} size={'w-12 p-3'} icon={<IconWebsite />} noBorder={!isBased} />
                        </a> }

                        {url_twitter && <a href={`${url_twitter}`} target="_blank">
                            <IconButton zoom={1.1} size={'w-12 p-3'} icon={<IconTwitter />} noBorder={!isBased}/>
                        </a> }

                        {url_discord && <a href={`${url_discord}`} target="_blank">
                            <IconButton zoom={1.1} size={'w-12 p-3'} icon={<IconDiscord />} noBorder={!isBased}/>
                        </a> }

                        <a href={`${cdn}/research/${slug}/ResearchReport.pdf`} target="_blank">
                            <IconButton zoom={1.1} size={'w-17 p-3'} icon={<IconDownload />} noBorder={!isBased}/>
                        </a>

                    </div>
                    {description && <div className="my-5 mx-10 w-full" dangerouslySetInnerHTML={createMarkup()} />}
                </div>

            </div>
            <OfferDetailsMediaSlider offer={offer}/>

            <div className="my-10">
                {parsePages.length > 0 && amount > 0 && <div id="flipbook">
                    <Flipbook
                        pages={parsePages}
                        startPage={1}
                        zooms={[1, 1.5, 2]}
                    />
                </div>}
            </div>
        </>


    )
}

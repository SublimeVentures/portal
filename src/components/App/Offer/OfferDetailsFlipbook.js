import IconDownload from "@/assets/svg/Download.svg";
import IconDiscord from "@/assets/svg/Discord.svg";
import IconWebsite from "@/assets/svg/Website.svg";
import IconTwitter from "@/assets/svg/Twitter.svg";
import {IconButton} from "@/components/Button/IconButton";
import Script from "next/script";


export default function OfferDetailsFlipbook({offer}) {
    const {url_web, url_twitter, url_discord, research, slug, description, name} = offer;

    function createMarkup() {
        return {__html: description};
    }

    return (
        <>

            <div className="rounded-xl bg-navy-accent relative flex flex-wrap items-center justify-center py-5 gap-5 midcol:justify-between">
                <div className="flex mx-10 text-xl uppercase font-medium text-outline midcol:mr-0">About&nbsp;<span className="text-gold">{name}</span></div>
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

                    <a href={`${research}${slug}/ResearchReport.pdf`} target="_blank">
                        <IconButton zoom={1.1} size={'w-17 p-3'} icon={<IconDownload />}/>
                    </a>

                </div>
                {description && <div className="my-5 mx-10" dangerouslySetInnerHTML={createMarkup()} />}
            </div>


            <div className="my-10">
                <Script src="/browser/index-d5086682.js"/>
                <div id="flipbook"></div>
            </div>

        </>


    )
}

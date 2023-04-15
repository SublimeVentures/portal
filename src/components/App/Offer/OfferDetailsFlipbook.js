import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconDownload from "@/assets/svg/Download.svg";
import "@/webComponents/my-flip.js";
import IconDiscord from "@/assets/svg/Discord.svg";
import IconWebsite from "@/assets/svg/Website.svg";
import IconTwitter from "@/assets/svg/Twitter.svg";


export default function OfferDetailsFlipbook({offer}) {
    const {url_web, url_twitter, url_discord, research, slug, description, rrPages} = offer;

    function createMarkup() {
        return {__html: description};
    }
    return (
        <>
            <div className="px-10 py-8  rounded-xl bg-navy-accent relative">
                <div className="text-xl uppercase font-medium text-outline">About <span className="text-gold">{name}</span></div>
                <div className="flex gap-5 absolute right-10 top-4">
                    {url_web && <a href={`${url_web}`} target="_blank">
                        <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'}
                                     icon={<IconWebsite className={ButtonIconSize.vsmall}/>}/>
                    </a> }

                    {url_twitter && <a href={`${url_twitter}`} target="_blank">
                        <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'}
                                     icon={<IconTwitter className={ButtonIconSize.vsmall}/>}/>
                    </a> }

                    {url_discord && <a href={`${url_discord}`} target="_blank">
                        <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'}
                                     icon={<IconDiscord className={ButtonIconSize.vsmall}/>}/>
                    </a> }


                    <a href={`${research}${slug}/Research.pdf`} target="_blank">
                        <div className="hidden sm:flex">
                            <RoundButton text={'PDF'} isWide={true} zoom={1.1} size={'text-sm sm'}
                                         icon={<IconDownload className={ButtonIconSize.hero}/>}/>

                        </div>
                        <div className="flex sm:hidden">
                            <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'}
                                         icon={<IconDownload className={ButtonIconSize.vsmall}/>}/>
                        </div>
                    </a>

                </div>
                {description && <div className="mt-5  " dangerouslySetInnerHTML={createMarkup()} />}
            </div>

            <div className="my-10">
                <my-flip url={`${research}${slug}/`} amount={rrPages}></my-flip>
            </div>

        </>


    )
}

import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconDownload from "@/assets/svg/Download.svg";
import "@/webComponents/my-flip.js";
import IconDiscord from "@/assets/svg/Discord.svg";
import IconWebsite from "@/assets/svg/Website.svg";
import IconTwitter from "@/assets/svg/Twitter.svg";
import {useEffect, useRef, useState} from "react";


export default function OfferDetailsFlipbook({offer}) {


    function createMarkup() {
        return {__html: offer.description};
    }
    return (
        <>
            <div className="px-10 py-8  rounded-xl bg-navy-accent relative">
                <div className="text-xl uppercase font-medium text-outline">About <span className="text-gold">{offer.name}</span></div>
                <div className="flex gap-5 absolute right-10 top-4">
                    {offer.url_web && <a href={`${offer.url_web}`} target="_blank">
                        <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'}
                                     icon={<IconWebsite className={ButtonIconSize.vsmall}/>}/>
                    </a> }

                    {offer.url_twitter && <a href={`${offer.url_twitter}`} target="_blank">
                        <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'}
                                     icon={<IconTwitter className={ButtonIconSize.vsmall}/>}/>
                    </a> }

                    {offer.url_discord && <a href={`${offer.url_discord}`} target="_blank">
                        <RoundButton text={''} isWide={true} zoom={1.1} size={'text-sm icon'}
                                     icon={<IconDiscord className={ButtonIconSize.vsmall}/>}/>
                    </a> }


                    <a href={`${offer.research}${offer.slug}/Research.pdf`} target="_blank">
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
                {offer.description && <div className="mt-5  " dangerouslySetInnerHTML={createMarkup()} />}
            </div>

            <div className="my-10">
                <my-flip url={`${offer.research}${offer.slug}/`} amount={offer.rrPages}></my-flip>
            </div>

        </>


    )
}

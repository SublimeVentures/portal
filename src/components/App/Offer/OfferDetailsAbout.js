import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
    IoCloudDownloadOutline as IconDownload,
    IoOpenOutline as IconWebsite,
    IoLogoTwitter as IconTwitter,
} from "react-icons/io5";
import { FaDiscord as IconDiscord } from "react-icons/fa";
import { IconButton } from "@/components/Button/IconButton";
import { tenantIndex } from "@/lib/utils";
import OfferDetailsMediaSlider from "@/components/App/Offer/OfferDetailsMediaSlider";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { TENANT } from "@/lib/tenantHelper";

const Flipbook = dynamic(() => import("@/components/Flipbook/Flipbook"), {
    ssr: false,
});

const isIconsBordered = tenantIndex !== TENANT.basedVC;

export default function OfferDetailsAbout({ offer }) {
    const { cdn } = useEnvironmentContext();
    const { url_web, url_twitter, url_discord, slug, description } = offer;
    const [amount, setAmount] = useState(0);
    function createMarkup() {
        return { __html: description };
    }

    const parsePages = useMemo(() => {
        let pages = [];
        for (let i = 1; i < amount; i++) {
            const paddedNumber = String(i).padStart(4, "0");
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
            <div className="bordered-container relative offerWrap overflow-hidden">
                <div className="bordered-container bg-navy-accent flex flex-wrap items-center justify-center py-5 gap-5 midcol:justify-between">
                    <div className="card-content-dedicated flex mx-10 glowNormal midcol:mr-0">About</div>
                    <div className="flex mx-10 gap-5 items-center justify-center midcol:ml-0">
                        {url_web && (
                            <a href={`${url_web}`} target="_blank">
                                <IconButton
                                    zoom={1.1}
                                    size={"w-12 p-3"}
                                    icon={<IconWebsite className="text-2xl" />}
                                    noBorder={isIconsBordered}
                                />
                            </a>
                        )}

                        {url_twitter && (
                            <a href={`${url_twitter}`} target="_blank">
                                <IconButton
                                    zoom={1.1}
                                    size={"w-12 p-3"}
                                    icon={<IconTwitter className="text-2xl" />}
                                    noBorder={isIconsBordered}
                                />
                            </a>
                        )}

                        {url_discord && (
                            <a href={`${url_discord}`} target="_blank">
                                <IconButton
                                    zoom={1.1}
                                    size={"w-12 p-3"}
                                    icon={<IconDiscord className="text-2xl" />}
                                    noBorder={isIconsBordered}
                                />
                            </a>
                        )}

                        <a href={`${cdn}/research/${slug}/ResearchReport.pdf`} target="_blank">
                            <IconButton
                                zoom={1.1}
                                size={"w-17 h-18 p-3"}
                                icon={<IconDownload className="text-2xl" />}
                                noBorder={isIconsBordered}
                            />
                        </a>
                    </div>
                    {description && <div className="my-5 mx-10 w-full" dangerouslySetInnerHTML={createMarkup()} />}
                </div>
            </div>
            <OfferDetailsMediaSlider offer={offer} />

            <div className="my-10">
                {parsePages.length > 0 && amount > 0 && (
                    <div id="flipbook">
                        <Flipbook pages={parsePages} startPage={1} zooms={[1, 1.5, 2]} />
                    </div>
                )}
            </div>
        </>
    );
}

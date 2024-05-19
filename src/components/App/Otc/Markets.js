import Link from "next/link";
import { CiBitcoin, CiDollar, CiCircleInfo, CiCircleMore } from "react-icons/ci";
import Image from "next/image";
import PAGE from "@/routes";
import { Tooltiper, TooltipType } from "@/components/Tooltip";

import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

const getPayoutStructure = (isManaged, ticker) => {
    return isManaged ? (
        <Tooltiper
            wrapper={<CiDollar className={"text-2xl"} />}
            text={"Payout in stablecoins"}
            type={TooltipType.Primary}
        />
    ) : (
        <Tooltiper
            wrapper={<CiBitcoin className={"text-2xl"} />}
            text={`Payout in $${ticker}`}
            type={TooltipType.Primary}
        />
    );
};

const getMarketRow = (el, cdn, currentMarket, changeMarket) => {
    return (
        <div
            key={el.slug}
            onClick={() => changeMarket(el.slug)}
            className={`group p-2 flex items-center cursor-pointer transition duration-300 hover:bg-app-success hover:text-black ${el?.slug === currentMarket?.slug ? "bg-app-success text-black" : ""}`}
        >
            <div className={"flex flex-row"}>
                <div className={"flex items-center pr-2 relative"}>
                    <Image
                        src={`${cdn}/research/${el.slug}/icon.jpg`}
                        className={"p-1 rounded-full boxshadow"}
                        alt={el.slug}
                        width={60}
                        height={60}
                    />
                </div>
                <div>
                    <div className={"flex flex-row text-lg font-medium"}>{el.name}</div>

                    <div className={"text-sm"}>{el.genre}</div>
                    <div className={"flex flex-row gap-1 items-center"}>
                        <Tooltiper
                            wrapper={<img src={el.partnerLogo} className={"max-w-[27px] rounded-2xl"} />}
                            text={`Launched in ${el.partnerName}`}
                            type={TooltipType.Primary}
                        />
                        {getPayoutStructure(el.isManaged, el.ticker)}
                        <Tooltiper
                            wrapper={<CiCircleInfo className={"text-2xl"} />}
                            text={`${el.dealStructure ? `${el.dealStructure}, ` : ""}Price: ${el.ppu ? `$${el.ppu}` : "TBA"}`}
                            type={TooltipType.Primary}
                        />
                        <Tooltiper
                            wrapper={
                                <span
                                    className={`rounded-count border-white group-hover:border-black group-hover:text-black transition duration-90 ${el?.slug === currentMarket?.slug ? "!border-black" : ""}`}
                                >
                                    {el.activeDealsCount}
                                </span>
                            }
                            text={"Listed offers"}
                            type={TooltipType.Primary}
                        />

                        <Tooltiper
                            wrapper={
                                <Link href={`${PAGE.OTC}/${el.slug}`}>
                                    <CiCircleMore
                                        className={
                                            "text-2xl text-black opacity-0 group-hover:opacity-100 transition duration-300"
                                        }
                                    />
                                </Link>
                            }
                            text={"Offer details"}
                            type={TooltipType.Primary}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function OtcMarkets({ propMarkets }) {
    let { otc, changeMarket, currentMarket } = propMarkets;
    const { cdn } = useEnvironmentContext();

    return (
        <div className="bordered-container offerWrap  flex flex-1 maxHeight">
            <div className="overflow-x-auto flex flex-col bg-navy-accent">
                <div className="page-table-header flex p-5 glowNormal header">Markets</div>
                <div>
                    {otc.map((el) => {
                        return getMarketRow(el, cdn, currentMarket, changeMarket);
                    })}
                </div>
            </div>
        </div>
    );
}

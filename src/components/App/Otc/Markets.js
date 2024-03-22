import Link from "next/link";
import { AiOutlineInfoCircle as IconInfo } from "react-icons/ai";
import PAGE from "@/routes";
import { IconButton } from "@/components/Button/IconButton";

export default function OtcMarkets({ propMarkets }) {
    let { otc, changeMarket, currentMarket } = propMarkets;

    return (
        <div className="bordered-container offerWrap  flex flex-1 maxHeight">
            <div className="overflow-x-auto flex flex-col bg-navy-accent bordered-container">
                <div className="page-table-header flex p-5 glowNormal header">Markets</div>

                <table>
                    <tbody>
                        {otc.map((el) => {
                            return (
                                <tr
                                    key={el.offerId}
                                    onClick={() => changeMarket(el.slug)}
                                    className={`cursor-pointer transition duration-300 hover:bg-app-success hover:text-black ${el?.slug === currentMarket?.slug ? "bg-app-success text-black" : ""}`}
                                >
                                    <td className="group text-sm px-5 py-3 relative text-left sm:py-4">
                                        {el.name}
                                        <span
                                            className={
                                                "absolute right-2 -mt-[5px] opacity-0 group-hover:opacity-100 transition duration-300"
                                            }
                                        >
                                            <Link href={`${PAGE.Opportunities}/${el.slug}`}>
                                                <IconButton zoom={1.1} size={"w-8"} icon={<IconInfo />} />
                                            </Link>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

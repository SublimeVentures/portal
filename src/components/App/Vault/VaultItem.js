import VanillaTilt from "vanilla-tilt";
import { useEffect, useRef } from "react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { IoEllipsisHorizontalOutline as IconMore } from "react-icons/io5";
import PropTypes from "prop-types";
import PAGE from "@/routes";
import { parseVesting } from "@/lib/vesting";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

export default function VaultItem({ item, passData }) {
    const { cdn } = useEnvironmentContext();
    const { createdAt, invested, tge, ppu, claimed, claims, isManaged } = item;
    const tilt = useRef(null);
    const participated = moment(createdAt).utc().local().format("YYYY-MM-DD");
    const normalized_tgeDiff = Number((100 * (tge - ppu)) / ppu)?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
    });
    const normalized_invested = Number(invested).toLocaleString();
    const tgeParsed = tge > 0 ? `+${normalized_tgeDiff}%` : "TBA";

    const { vestedPercentage, nextUnlock, nextSnapshot, nextClaim, isInstant, isSoon, claimStage, payoutId } =
        parseVesting(item.payouts);
    const awaitingClaim = claims.some((claim) => !claim.isClaimed) && payoutId > 0;
    const performance = (claimed / invested) * 100;

    const setPassData = () => ({
        ...item,
        participated,
        normalized_tgeDiff,
        normalized_invested,
        tgeParsed,
        vestedPercentage,
        nextUnlock,
        nextSnapshot,
        nextClaim,
        isInstant,
        isSoon,
        claimStage,
    });

    useEffect(() => {
        VanillaTilt.init(tilt.current, {
            scale: 1,
            speed: 1000,
            max: 1,
        });
    }, []);

    return (
        <div className="bordered-box boxshadow vaultItem timeline flex col-span-12 lg:col-span-6 3xl:col-span-4">
            <div className="sm:bordered-box-left lg:bordered-box xl:bordered-box-left relative bg-navy-accent flex flex-1 flex-col p-5">
                <div className="font-bold text-2xl flex items-center glowNormal">
                    <div className="flex flex-1">{item.name}</div>
                    {(isSoon || awaitingClaim) && (
                        <div className="bordered-container text-sm text-black bg-app-success px-3 py-1 rounded-xl select-none">
                            {" "}
                            {awaitingClaim ? "CLAIM" : "UNLOCK SOON"}
                        </div>
                    )}
                </div>
                <div className="pt-1 text-xs text-gray text-left">Participated {participated}</div>

                <div className="card-content-description text-md pt-2">
                    <div className="detailRow">
                        <p>Invested</p>
                        <hr className="spacer" />
                        <p>${normalized_invested}</p>
                    </div>
                    <div className="detailRow">
                        <p>Vested</p>
                        <hr className="spacer" />
                        <p>{vestedPercentage}%</p>
                    </div>
                    {isManaged ? (
                        <div className="detailRow">
                            <p>Performance</p>
                            <hr className="spacer" />
                            <p>
                                <span
                                    className={`${tgeParsed !== "TBA" && performance > 0 ? "text-app-success" : " text-white"}`}
                                >
                                    {performance > 0
                                        ? `+${Number(performance).toLocaleString(undefined, { minimumFractionDigits: 0 })}%`
                                        : "TBA"}
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className={"detailRow disabled"}>
                            <p>ATH profit</p>
                            <hr className={"spacer"} />
                            <p>
                                <span>soon</span>
                            </p>
                        </div>
                    )}
                    <div className="detailRow">
                        <p>Next unlock</p>
                        <hr className="spacer" />
                        <p>{nextClaim !== 0 ? nextClaim : "TBA"}</p>
                    </div>
                </div>

                <div className="moreVault opacity-0 text-center absolute -bottom-5 mx-auto left-0 right-0">
                    <div className="flex items-center justify-center moreVaultIcon">
                        <div className="icon z-10 w-15 h-15 cursor-pointer" onClick={() => passData(setPassData())}>
                            <IconMore className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="bordered-box-right relative w-[200px] cursor-pointer flex hidden sm:flex lg:hidden xl:!flex"
                ref={tilt}
            >
                <Link href={`${PAGE.Opportunities}/${item.slug}`}>
                    <Image
                        src={`${cdn}/research/${item.slug}/logo.jpg`}
                        fill
                        className={`imageOfferList bg-cover bordered-box-right`}
                        alt={item.slug}
                        sizes="(max-width: 2000px) 200px"
                    />
                </Link>
            </div>
        </div>
    );
}

VaultItem.propTypes = {
    item: PropTypes.shape({
        claimed: PropTypes.number,
        claims: PropTypes.arrayOf(
            PropTypes.shape({
                isClaimed: PropTypes.bool,
            }),
        ),
        payouts: PropTypes.arrayOf(
            PropTypes.shape({
                snapshotDate: PropTypes.number,
                claimDate: PropTypes.number,
                percentage: PropTypes.number,
                unlockDate: PropTypes.string,
            }),
        ),
        createdAt: PropTypes.string,
        id: PropTypes.number,
        invested: PropTypes.number,
        isManaged: PropTypes.bool,
        locked: PropTypes.number,
        name: PropTypes.string,
        offerId: PropTypes.number,
        ppu: PropTypes.number,
        slug: PropTypes.string,
        t_unlock: PropTypes.arrayOf(
            PropTypes.shape({
                c: PropTypes.number,
                u: PropTypes.string,
                s: PropTypes.number,
                p: PropTypes.number,
            }),
        ),
        tge: PropTypes.number,
        ticker: PropTypes.string,
    }),
};

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { NETWORKS } from "@/lib/utils";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import GenericRightModal from "@/components/Modal/GenericRightModal";
import { fetchInvestmentPayout } from "@/fetchers/payout.fetcher";
import DynamicIcon from "@/components/Icon";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import ClaimPayoutModal from "@/components/App/Vault/ClaimPayoutModal";
import DetailsTimeline from "@/components/App/Vault/DetailsTimeline";

export default function DetailsSidebar({ model, setter, claimModalProps, userId }) {
    const { cdn } = useEnvironmentContext();
    const [payoutClaimOpen, setPayoutClaimOpen] = useState(false);

    const {
        id: offerId,
        name,
        slug,
        participated,
        tgeParsed,
        vestedPercentage,
        nextSnapshot,
        nextClaim,
        nextUnlock,
        isManaged,
        ticker,
        refetchVault,
        vaultData,
        invested,
    } = claimModalProps;

    const {
        isSuccess: isSuccessPayouts,
        data: payouts,
        refetch: refetchPayouts,
    } = useQuery({
        queryKey: ["userPayouts", userId, offerId],
        queryFn: () => fetchInvestmentPayout(offerId),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 30 * 1000,
        enabled: offerId > 0,
    });

    const availablePayouts = isSuccessPayouts ? payouts.reduce((acc, obj) => acc + obj.amount, 0) : 0;
    const isNextPayout = isSuccessPayouts && payouts.length > 0;
    const nextPayout = isNextPayout ? payouts[0] : {};
    const symbol = isNextPayout ? nextPayout.currencySymbol : isManaged ? "USD" : ticker;
    const currency = {
        symbol: symbol,
        precision: nextPayout.precision,
        chainId: nextPayout.chainId,
    };

    const claimed = offerId > 0 ? vaultData.find((el) => el.id === offerId)?.claimed : 0;
    const performance = (claimed / invested) * 100;

    const payoutClaimProps = {
        ...claimModalProps,
        currency,
        nextPayout,
        refetchPayouts,
        refetchVault,
    };

    const closeModal = async () => {
        setter();

        setTimeout(() => {}, 400);
    };

    const closeClaimPayoutModal = () => {
        setPayoutClaimOpen(false);
        setTimeout(() => {
            refetchPayouts();
        }, 100);
    };

    const openPayoutClaim = () => {
        if (!isNextPayout) return;
        setPayoutClaimOpen(true);
    };

    const title = () => {
        return (
            <div className={"flex flex-row gap-5 flex-1 items-center select-none"}>
                <div className="rounded-lg">
                    <Image
                        src={`${cdn}/research/${slug}/icon.jpg`}
                        className="p-1 rounded-full boxshadow"
                        alt={slug}
                        width={100}
                        height={100}
                    />
                </div>
                <div>
                    <div className="text-4xl font-bold flex flex-1 glow">{name}</div>
                </div>
            </div>
        );
    };

    const content = () => {
        return (
            <div className="flex flex-1 flex-col">
                <div className="card-content-description text-md pt-2">
                    <div className="flex pt-5 pb-2 text-xl font-bold">Status</div>
                    <div className="detailRow">
                        <p>Progress</p>
                        <hr className="spacer" />
                        <p className="font-mono">{vestedPercentage}%</p>
                    </div>
                    <div className="detailRow">
                        <p>Invested</p>
                        <hr className="spacer" />
                        <p className="font-mono">
                            {Number(invested).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                            })}{" "}
                            USD
                        </p>
                    </div>
                    <div className="detailRow">
                        <p>Vested</p>
                        <hr className="spacer" />
                        <p className="font-mono">
                            {Number(claimed).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                            })}{" "}
                            {currency?.symbol}
                        </p>
                    </div>
                    {availablePayouts > 0 && (
                        <div className="detailRow text-app-success">
                            <p className="font-mono">Available payout</p>
                            <hr className="spacer" />
                            <p className="flex gap-1 h-[18px] font-mono">
                                <DynamicIcon name={NETWORKS[currency?.chainId]} style={ButtonIconSize.clicksLow} />
                                {Number(availablePayouts).toLocaleString()} {currency?.symbol}
                            </p>
                        </div>
                    )}

                    <div className="flex pt-5 pb-2 text-xl font-bold">Performance</div>
                    <div className="detailRow">
                        <p>TGE gain</p>
                        <hr className="spacer" />
                        <p className="font-mono">
                            <span className={`${tgeParsed !== "TBA" ? "text-app-success" : " text-white"}`}>
                                {tgeParsed}
                            </span>
                        </p>
                    </div>
                    {isManaged ? (
                        <div className="detailRow">
                            <p>Return</p>
                            <hr className="spacer" />
                            <p className="font-mono">
                                <span className={`${tgeParsed !== "TBA" ? "text-app-success" : " text-white"}`}>
                                    +{Number(performance).toLocaleString(undefined, { minimumFractionDigits: 2 })}%
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="detailRow disabled">
                            <p>ATH profit</p>
                            <hr className="spacer" />
                            <p>
                                <span>soon</span>
                            </p>
                        </div>
                    )}

                    <div className="flex pt-5 pb-2 text-xl font-bold">Dates</div>
                    <div className="detailRow mb-2">
                        <p>Participated</p>
                        <hr className="spacer" />
                        <p className="font-mono">{participated}</p>
                    </div>
                    <div className="detailRow">
                        <p>Next unlock</p>
                        <hr className="spacer" />
                        <p className="font-mono">{nextUnlock !== 0 ? nextUnlock : "TBA"}</p>
                    </div>
                    <div className="detailRow">
                        <p>Allocation snapshot</p>
                        <hr className="spacer" />
                        <p className="font-mono">{nextSnapshot !== 0 ? nextSnapshot : "TBA"}</p>
                    </div>
                    <div className="detailRow">
                        <p>Claim date</p>
                        <hr className="spacer" />
                        <p className="font-mono">{nextClaim !== 0 ? nextClaim : "TBA"}</p>
                    </div>
                    <DetailsTimeline offerId={offerId} />
                </div>
                <div className="mt-auto fullWidth">
                    <UniButton
                        type={ButtonTypes.BASE}
                        isWide={true}
                        isDisabled={!isNextPayout}
                        size="text-sm sm"
                        state="danger"
                        text="Payout"
                        handler={() => {
                            openPayoutClaim();
                        }}
                    />
                </div>
                {isNextPayout && (
                    <ClaimPayoutModal
                        model={payoutClaimOpen}
                        setter={() => closeClaimPayoutModal()}
                        props={payoutClaimProps}
                    />
                )}
            </div>
        );
    };

    return (
        <GenericRightModal
            isOpen={model}
            closeModal={() => closeModal()}
            title={title()}
            content={content()}
            persistent={false}
        />
    );
}

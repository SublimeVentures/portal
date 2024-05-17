import Image from "next/image";
import { useState } from "react";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { NETWORKS } from "@/lib/utils";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import GenericRightModal from "@/components/Modal/GenericRightModal";
import ReferralClaimPayoutModal from "./ReferralClaimPayoutModal";

export default function DetailsSidebar({ model, setter, claimModalProps }) {
    const { cdn } = useEnvironmentContext();
    const [payoutClaimOpen, setPayoutClaimOpen] = useState(false);

    const {
        claimModalDetails,
        refetchReferralClaims,
    } = claimModalProps;

    const isNextPayout = claimModalDetails?.referralPayouts?.length > 0;
    const nextPayout = isNextPayout ? claimModalDetails?.referralPayouts[0] : {};
    const symbol = isNextPayout ? nextPayout?.currencySymbol : "USD";
    const currency = {
        symbol: symbol,
        precision: nextPayout.precision,
        chainId: nextPayout.chainId,
    };

    const payoutClaimProps = {
        ...claimModalDetails,
        currency,
        refetchReferralClaims
    };

    const closeModal = () => {
        setter();
    };

    const closeClaimPayoutModal = () => {
        setPayoutClaimOpen(false);
        setTimeout(() => {
            refetchReferralClaims();
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
                        src={`${cdn}/research/${claimModalDetails?.offer?.slug}/icon.jpg`}
                        className="p-1 rounded-full boxshadow"
                        alt={claimModalDetails?.offer?.slug}
                        width={100}
                        height={100}
                    />
                </div>
                <div>
                    <div className="text-4xl font-bold flex flex-1 glow">{claimModalDetails?.offer?.name}</div>
                </div>
            </div>
        );
    };

    const content = () => {
        return (
            <div className="flex flex-1 flex-col">
                <div className="card-content-description text-md pt-2">
                    <div className="flex pt-5 pb-2 text-xl font-bold">Payout Summary</div>
                    <div className="detailRow">
                        <p>Investment Stage</p>
                        <hr className="spacer" />
                        <p className="font-mono">{claimModalDetails?.investmentStage}</p>
                    </div>
                    <div className="detailRow">
                        <p>Total Payout</p>
                        <hr className="spacer" />
                        <p className="font-mono">
                            {Number(claimModalDetails?.amount).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                            })}{" "}
                            USD
                        </p>
                    </div>
                    <div className="detailRow">
                        <p>Chain</p>
                        <hr className="spacer" />
                        <p className="font-mono">{claimModalDetails?.referralPayouts && NETWORKS[claimModalDetails.referralPayouts[0].chainId]}</p>
                    </div>
                    <div className="flex pt-5 pb-2 text-xl font-bold">Payout Breakdown</div>
                    {claimModalDetails?.referralPayouts?.map((payout, index) => (
                        <div key={index} className="detailRow">
                            <p>Referral {index + 1}</p>
                            <hr className="spacer" />
                            <p className="font-mono">
                                {Number(payout.totalAmount).toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                })}{' '}
                                {payout?.currencySymbol}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="mt-auto fullWidth">
                    <UniButton
                        type={ButtonTypes.BASE}
                        isWide={true}
                        isDisabled={!claimModalDetails?.isEnabled}
                        size="text-sm sm"
                        state="danger"
                        text="Payout"
                        handler={() => {
                            openPayoutClaim();
                        }}
                    />
                </div>
                {isNextPayout && (
                    <ReferralClaimPayoutModal
                        model={payoutClaimOpen}
                        setter={() => closeClaimPayoutModal()}
                        props={payoutClaimProps}
                    />
                )}
            </div >
        );
    };

    return (
        <GenericRightModal
            isOpen={model}
            closeModal={closeModal}
            title={title()}
            content={content()}
            persistent={false}
        />
    );
}

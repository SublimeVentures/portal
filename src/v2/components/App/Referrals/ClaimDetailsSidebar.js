import Image from "next/image";
import { useState } from "react";
import { NETWORKS } from "@/lib/utils";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/v2/components/ui/sheet";
import { Button } from "@/v2/components/ui/button";
import ReferralClaimPayout from "@/v2/modules/referrals/Payout";

export default function ClaimDetailsSidebar({ claimModalProps, payoutProps }) {
    const { cdn } = useEnvironmentContext();
    const { claimDetailsModal } = claimModalProps;

    const [isClaimDetailsOpen, setIsClaimDetailsOpen] = useState(false);

    return (
        <Sheet open={isClaimDetailsOpen} onOpenChange={setIsClaimDetailsOpen}>
            <SheetTrigger asChild>
                <Button variant="accent">CLAIM</Button>
            </SheetTrigger>
            <SheetContent className="h-full flex flex-col">
                <SheetHeader>
                    <Image
                        src={`${cdn}/research/${claimDetailsModal?.offer?.slug}/icon.jpg`}
                        className="inline mx-2 rounded-full"
                        alt=""
                        width={100}
                        height={100}
                    />
                    <SheetTitle className="text-white">{claimDetailsModal.offer?.name}</SheetTitle>
                    <SheetDescription className="text-white">{claimDetailsModal.offer?.genre}</SheetDescription>
                </SheetHeader>

                <SheetBody>
                    <div className="flex flex-col items-center h-full justify-between pt-8 mx-10">
                        <div className="flex flex-col w-full text-md pt-8 px-8 text-white gap-2 definition-section">
                            <div className="flex pt-5 pb-2 text-xl font-bold">Payout Summary</div>
                            <div className="flex justify-between">
                                <p>Investment Stage</p>
                                <hr className="spacer" />
                                <p className="font-mono">{claimDetailsModal?.investmentStage}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Total Payout</p>
                                <hr className="spacer" />
                                <p className="font-mono">
                                    {Number(claimDetailsModal?.amount).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}{" "}
                                    USD
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p>Chain</p>
                                <hr className="spacer" />
                                <p className="font-mono">
                                    {claimDetailsModal?.referralPayouts &&
                                        NETWORKS[claimDetailsModal.referralPayouts[0].chainId]}
                                </p>
                            </div>
                            <div className="flex pt-8 pb-2 text-xl font-bold">Payout Breakdown</div>
                            {claimDetailsModal?.referralPayouts?.map((payout, index) => (
                                <div key={index} className="flex justify-between">
                                    <p>Referral {index + 1}</p>
                                    <hr className="spacer" />
                                    <p className="font-mono">
                                        {Number(payout.totalAmount).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}{" "}
                                        {payout?.currencySymbol}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <ReferralClaimPayout props={payoutProps}/>
                    </div>
                </SheetBody>
                <SheetFooter></SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

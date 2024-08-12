import Image from "next/image";

// import { Card } from "@/v2/components/ui/card";
// import DynamicIcon from "@/components/Icon";
// import { ButtonIconSize } from "@/components/Button/RoundButton";
// import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
// import { NETWORKS } from "@/lib/utils";
// import { IoCloseCircleOutline as IconCancel } from "react-icons/io5";
// import { Tooltiper, TooltipType } from "@/components/Tooltip";

// import { IoCloseCircleOutline as IconCancel } from "react-icons/io5";
// import { Tooltiper, TooltipType } from "@/components/Tooltip";

// @todo 
import { Button } from "@/v2/components/ui/button"
import { NETWORKS } from "@/lib/utils";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import DynamicIcon from "@/components/Icon";

import { Card } from "@/v2/components/ui/card";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { cn } from "@/lib/cn";
import DefinitionItem from "./DefinitionItem";
import TakeOfferModal from "../Modals/TakeOfferModal"
import CancelOfferModal from "../Modals/CancelOfferModal"
import { useSession } from "../logic/store";

const isUserOffer = (userWallets, checkWallet, account) => ({ ok: userWallets.includes(checkWallet), isActive: account?.address === checkWallet });

export default function SingleOfferCard({ currentMarket, offer }) {
    const { isSell, amount, price, multiplier, currency, chainId, maker } = offer;

    const { cdn, account, getCurrencySymbolByAddress } = useEnvironmentContext();
    const { wallets } = useSession();

    const ownership = isUserOffer(wallets, maker, account);

    return (
        <Card variant="static" className="p-0 h-max flex flex-col rounded-none rounded-b-[25px]">
            <div className="h-2 rounded bg-primary-light-gradient" />

            <div className="m-3 mb-6 rounded bg-foreground/[0.05]">
                <div className="p-4">
                    <dl className="px-4 py-2 grid grid-cols-3 grid-rows-4 grid-flow-col gap-x-12">
                        <DefinitionItem valueOnly term="Market">
                            <Image
                                src={`${cdn}/research/${currentMarket.slug}/icon.jpg`}
                                className="mt-1 rounded-full"
                                alt={`Cover image of ${currentMarket.name} token`}
                                width={50}
                                height={50}
                            />
                        </DefinitionItem>
                        <DefinitionItem term="Type">
                          <span className={cn("font-bold", isSell ? "text-destructive" : "text-green-500" )}>{isSell ? "Sell" : "Buy"}</span>
                        </DefinitionItem>
                        <DefinitionItem term="Allocation">${amount}</DefinitionItem>
                        <DefinitionItem term="Multiplier">{multiplier.toFixed(2)}x</DefinitionItem>
                        <DefinitionItem term="Price">${price}</DefinitionItem>
                        <DefinitionItem valueOnly term="Chain">
                            <span className="flex flex-row flex-1 h-full">
                                <DynamicIcon name={getCurrencySymbolByAddress(currency)} style={ButtonIconSize.hero3} />
                                <DynamicIcon name={NETWORKS[chainId]} style={ButtonIconSize.hero3} />
                            </span>
                        </DefinitionItem>
                    </dl>

                    <div className="flex flex-row justify-end gap-1 lg:justify-start">
                        {ownership.ok &&
                            (ownership.isActive ? (
                                <CancelOfferModal className="w-full" offerDetails={offer} />
                            ) : (
                                <Tooltiper
                                    wrapper={
                                        <div className="disabled duration-300 hover:text-destructive cursor-pointer">
                                            <IconCancel className="w-6 h-6" />
                                        </div>
                                    }
                                    text="Created from other wallet"
                                    type={TooltipType.Error}
                                />
                            )
                        )}

                        {!ownership.ok && <TakeOfferModal className="w-full" offerDetails={offer} />}
                    </div>
                </div>
            </div>
        </Card>
    );
};

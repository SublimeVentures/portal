import Image from "next/image";

import { Card } from "@/v2/components/ui/card";
import DynamicIcon from "@/components/Icon";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { NETWORKS } from "@/lib/utils";
import { cn } from "@/lib/cn";
import { IoCloseCircleOutline as IconCancel } from "react-icons/io5";
import { Tooltiper, TooltipType } from "@/components/Tooltip";
import TakeOfferModal from "@/v2/modules/otc/components/TakeOfferModal";
import CancelOfferModal from '@/v2/modules/otc/components/CancelOfferModal';
import OffersDefinitionItem from "./OffersDefinitionItem";

const isUserOffer = (userWallets, checkWallet, account) => ({ ok: userWallets.includes(checkWallet), isActive: account?.address === checkWallet });

export default function OffersMobileList({ market, data, wallets, propOffers }) {
  const { cdn, account, getCurrencySymbolByAddress } = useEnvironmentContext();
    const { offers, isLoading } = data;

    if (isLoading) {
      return <div className="text-foreground text-center">Loading...</div>
    }

    return (
        <ul className="flex flex-col gap-6">
            {offers.map(offer => {
              const { offerId, isSell, amount, price, multiplier, currency, chainId, maker } = offer;
              const ownership = isUserOffer(wallets, maker, account);

              return (
                <li key={offerId}>
                    <Card variant="static" className="p-0 h-max flex flex-col md:overflow-hidden rounded-[25px]">
                        <div className="p-2 h-5 rounded bg-primary-light-gradient" />

                        <div className="px-8 pt-4 pb-12">
                            <dl class="mb-4 grid grid-cols-3 grid-rows-4 grid-flow-col">
                                <OffersDefinitionItem valueOnly term="Market">
                                    <span className="row-span-">
                                        <Image
                                          src={`${cdn}/research/${market.slug}/icon.jpg`}
                                          className="inline rounded-full"
                                          alt={`Cover image of ${market.name} token`}
                                          width={50}
                                          height={50}
                                        />
                                    </span>
                                </OffersDefinitionItem>
                                <OffersDefinitionItem term="Type">
                                  <span className={cn("font-bold", isSell ? "text-destructive" : "text-green-500" )}>{isSell ? "Sell" : "Buy"}</span>
                                </OffersDefinitionItem>
                                <OffersDefinitionItem term="Allocation">${amount}</OffersDefinitionItem>
                                <OffersDefinitionItem term="Multiplier">{multiplier.toFixed(2)}x</OffersDefinitionItem>
                                <OffersDefinitionItem term="Price">${price}</OffersDefinitionItem>
                                <OffersDefinitionItem valueOnly term="Chain">
                                    <span className="flex flex-row flex-1">
                                        <DynamicIcon name={getCurrencySymbolByAddress(currency)} style={ButtonIconSize.hero3} />
                                        <DynamicIcon name={NETWORKS[chainId]} style={ButtonIconSize.hero3} />
                                    </span>
                                </OffersDefinitionItem>
                            </dl>

                            <div className="flex flex-row justify-end gap-1 lg:justify-start">
                                {ownership.ok &&
                                    (ownership.isActive ? (
                                        <CancelOfferModal className="w-full" {...propOffers} offerDetails={offer} />
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

                                {!ownership.ok && <TakeOfferModal className="w-full" {...propOffers} offerDetails={offer} />}
                            </div>
                        </div>
                    </Card>
                </li>
            )})}
        </ul>
    )
};

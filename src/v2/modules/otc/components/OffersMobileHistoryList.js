import Image from "next/image";
import moment from "moment";

import { Card } from "@/v2/components/ui/card";
import DynamicIcon from "@/components/Icon";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { NETWORKS } from "@/lib/utils";
import { cn } from "@/lib/cn";
import OffersDefinitionItem from "./OffersDefinitionItem";

export default function OffersMobileHistoryList({ market, data }) {
    const { cdn, getCurrencySymbolByAddress } = useEnvironmentContext();
    const { history, isLoading } = data;

    if (isLoading) {
      return <div className="text-foreground text-center">Loading...</div>
    }

    return (
        <ul className="flex flex-col gap-6">
            {history.map(item => {
                const { id, isSell, amount, price, multiplier, currency, chainId, updatedAt } = item;

              return (
                <li key={id}>
                    <Card variant="static" className="p-0 h-max flex flex-col md:overflow-hidden rounded-[25px]">
                        <div className="p-2 h-5 rounded bg-primary-light-gradient" />

                        <div className="px-8 pt-4">
                            <dl class="mb-4 grid grid-cols-4 grid-rows-4 grid-flow-col">
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
                                <OffersDefinitionItem term="Date">{moment(updatedAt).utc().local().format("YYYY-MM-DD")}</OffersDefinitionItem>
                            </dl>
                        </div>
                    </Card>
                </li>
            )})}
        </ul>
    )
};

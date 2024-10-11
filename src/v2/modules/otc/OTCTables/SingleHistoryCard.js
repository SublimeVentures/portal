import Image from "next/image";
import moment from "moment";

// import { Card } from "@/v2/components/ui/card";
// import DynamicIcon from "@/components/Icon";
// import { ButtonIconSize } from "@/components/Button/RoundButton";
// import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
// import { NETWORKS } from "@/lib/utils";
// import { IoCloseCircleOutline as IconCancel } from "react-icons/io5";
// import { Tooltiper, TooltipType } from "@/components/Tooltip";
// import TakeOfferModal from "@/v2/modules/otc/components/TakeOfferModal";
// import CancelOfferModal from '@/v2/modules/otc/components/CancelOfferModal';
// import DefinitionItem from "./DefinitionItem";
// import { IoCloseCircleOutline as IconCancel } from "react-icons/io5";
// import { Tooltiper, TooltipType } from "@/components/Tooltip";
// import TakeOfferModal from "@/v2/modules/otc/components/TakeOfferModal";
// import CancelOfferModal from '@/v2/modules/otc/components/CancelOfferModal';

// @todo
import DefinitionItem from "./DefinitionItem";
import { NETWORKS } from "@/lib/utils";
import { DynamicIconGroup, DynamicIcon } from "@/v2/components/ui/dynamic-icon";

import { Card } from "@/v2/components/ui/card";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { cn } from "@/lib/cn";

export default function SingleHistoryCard({
    currentMarket,
    isSell,
    amount,
    price,
    multiplier,
    currency,
    chainId,
    updatedAt,
}) {
    const { cdn, getCurrencySymbolByAddress } = useEnvironmentContext();

    return (
        <Card variant="static" className="p-0 h-max flex flex-col rounded-none rounded-b">
            <div className="h-2 rounded bg-gradient-to-r from-primary to-primary-600" />

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
                            <span className={cn("font-bold", isSell ? "text-error" : "text-success-500")}>
                                {isSell ? "Ask" : "Bid"}
                            </span>
                        </DefinitionItem>
                        <DefinitionItem term="Allocation">${amount}</DefinitionItem>
                        <DefinitionItem term="Multiplier">{multiplier.toFixed(2)}x</DefinitionItem>
                        <DefinitionItem term="Price">${price}</DefinitionItem>
                        <DefinitionItem valueOnly term="Chain">
                            <DynamicIconGroup className="mt-2">
                                <DynamicIcon name={getCurrencySymbolByAddress(currency)} />
                                <DynamicIcon name={NETWORKS[chainId]} />
                            </DynamicIconGroup>
                        </DefinitionItem>
                        <DefinitionItem term="Date">
                            {moment(updatedAt).utc().local().format("YYYY-MM-DD")}
                        </DefinitionItem>
                    </dl>
                </div>
            </div>
        </Card>
    );
}

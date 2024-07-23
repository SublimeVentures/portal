import Image from "next/image";
import moment from "moment";

import { Card } from "@/v2/components/ui/card";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { cn } from "@/lib/cn";
import DefinitionItem from "./DefinitionItem";

export default function SingleLatestDealsCard({ slug, isSell, multiplier, updatedAt }) {
    const { cdn } = useEnvironmentContext();

    return (
        <Card variant="static" className="p-0 h-max flex flex-col rounded-none rounded-b-[25px]">
            <div className="h-2 rounded bg-primary-light-gradient" />

            <div className="m-3 mb-6 rounded bg-foreground/[0.05]">
                <div className="p-4">
                    <dl class="py-2 px-4 grid grid-cols-2 grid-rows-4 grid-flow-col">
                        <DefinitionItem valueOnly term="Market">
                            <Image
                                src={`${cdn}/research/${slug}/icon.jpg`}
                                className="mt-1 rounded-full shrink-0"
                                alt={`Cover image of ${slug} token`}
                                width={50}
                                height={50}
                            />
                        </DefinitionItem>
                        <DefinitionItem term="Date">{moment(updatedAt).utc().local().format("YYYY-MM-DD")}</DefinitionItem>
                        <DefinitionItem term="Type">
                          <span className={cn("font-bold", isSell ? "text-destructive" : "text-green-500" )}>{isSell ? "Sell" : "Buy"}</span>
                        </DefinitionItem>
                        <DefinitionItem term="Multiplier">{multiplier.toFixed(2)}x</DefinitionItem>
                    </dl>
                </div>
            </div>
        </Card>
    );
};

import Link from "next/link";
import Image from "next/image";
import moment from "moment";

import DefinitionItem from "./DefinitionItem";
import { Button } from "@/v2/components/ui/button";
import { Card } from "@/v2/components/ui/card";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { cn } from "@/lib/cn";
import { routes } from "@/v2/routes";

export default function SingleLatestDealsCard({ slug, isSell, multiplier, updatedAt }) {
    const { cdn } = useEnvironmentContext();

    return (
        <Card variant="static" className="p-0 h-max flex flex-col rounded-none rounded-b">
            <div className="h-2 rounded bg-gradient-to-r from-primary to-primary-600" />

            <div className="m-3 mb-6 rounded bg-white/5">
                <div className="p-4">
                    <dl className="py-2 px-4 grid grid-cols-2 grid-rows-4 grid-flow-col">
                        <DefinitionItem valueOnly term="Market">
                            <Image
                                src={`${cdn}/research/${slug}/icon.jpg`}
                                className="mt-1 rounded-full shrink-0"
                                alt={`Cover image of ${slug} token`}
                                width={50}
                                height={50}
                            />
                        </DefinitionItem>
                        <DefinitionItem term="Date">
                            {moment(updatedAt).utc().local().format("YYYY-MM-DD")}
                        </DefinitionItem>
                        <DefinitionItem term="Type">
                            <span className={cn("font-bold", isSell ? "text-error" : "text-success-500")}>
                                {isSell ? "Ask" : "Bid"}
                            </span>
                        </DefinitionItem>
                        <DefinitionItem term="Multiplier">{multiplier.toFixed(2)}x</DefinitionItem>
                    </dl>

                    <Button asChild variant="accent" className="w-full">
                        <Link href={`${routes.Opportunities}/${slug}`}>Details</Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}

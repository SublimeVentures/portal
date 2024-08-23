import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import ReferalsSteps from "@/v2/modules/settings/Referals/ReferalsSteps";
import ReferalsTable from "@/v2/modules/settings/Referals/ReferalsTable";
import {
    RewardStatisticCard,
    DiscountsStatisticCard,
    InvitersStatisticCard,
} from "@/v2/components/App/Vault/StatisticsCard";

export default function Referals() {
    return (
        <div className="grid grid-cols-1 gap-5 box-border 3xl:grid-cols-3">
            <div className="bg-gray-800 rounded-lg col-span-1 md:row-span-12">
                <Card variant="none" className="py-6 px-12 flex flex-col gap-8 h-full bg-settings-gradient pb-23">
                    <div>
                        <CardTitle className="text-base md:text-lg font-medium text-white mb-1">
                            Join Based Referral program
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm font-light">
                            Get free discounts and earn allocations. For more information, please read the{" "}
                            <Link className="text-[#4BD4E7] font-normal" href="/#">
                                referral program
                            </Link>{" "}
                            details.
                        </CardDescription>
                    </div>
                    <ReferalsSteps />
                </Card>
            </div>

            <div className="bg-gray-800 pb-0 rounded-lg col-span-1 3xl:col-span-2 max-h-28 flex gap-10">
                <RewardStatisticCard />
                <InvitersStatisticCard />
                <DiscountsStatisticCard value="10%" />
            </div>

            <div className="bg-gray-800 rounded-lg col-span-1 3xl:col-span-2 md:row-span-11">
                <ReferalsTable />
            </div>
        </div>
    );
}

import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import ReferralsSteps from "@/v2/modules/settings/Referrals/ReferralsSteps";
import ReferralsTable from "@/v2/modules/settings/Referrals/ReferralsTable";
import {
    RewardStatisticCard,
    DiscountsStatisticCard,
    InvitersStatisticCard,
} from "@/v2/components/App/Vault/StatisticsCard";

export default function Referrals() {
    return (
        <div className="flex flex-col gap-4 2xl:grid 2xl:grid-cols-3 2xl:h-full">
            <div className="order-2 rounded 2xl:row-span-12 2xl:order-2">
                <Card variant="none" className="py-6 px-12 flex flex-col gap-8 h-full bg-settings-gradient">
                    <div>
                        <CardTitle className="text-base md:text-lg font-medium text-white mb-1">
                            Join Based Referral Program
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm font-light">
                            Get free discounts and earn allocations. For more information, please read the{" "}
                            <Link className="text-primary font-normal" href="/#">
                                referral program
                            </Link>{" "}
                            details.
                        </CardDescription>
                    </div>
                    <ReferralsSteps />
                </Card>
            </div>

            <div className="order-1 w-full flex gap-4 2xl:order-2 2xl:row-span-1 2xl:col-span-2">
                <RewardStatisticCard />
                <InvitersStatisticCard />
                <DiscountsStatisticCard value="10%" />
            </div>

            <div className="order-3 2xl:col-span-2 2xl:row-span-11">
                <ReferralsTable />
            </div>
        </div>
    );
};

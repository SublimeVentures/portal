import {
    RewardStatisticCard,
    DiscountsStatisticCard,
    InvitersStatisticCard,
} from "@/v2/components/App/Vault/StatisticsCard";

export default function ReferralsStatistics() {
    return (
        <div className="flex flex-col shrink-0 overflow-hidden">
            <div className="flex flex-wrap gap-2 2xl:order-2 2xl:row-span-1 2xl:col-span-2 2xl:gap-4">
                <RewardStatisticCard />
                <InvitersStatisticCard />
                <DiscountsStatisticCard value="10%" />
            </div>
        </div>
    );
}

import ReferralsStatistics from "./ReferralsStatistics";
import ReferralsSteps from "@/v2/modules/settings/Referrals/ReferralsSteps";
import ReferralsTable from "@/v2/modules/settings/Referrals/ReferralsTable";

export default function Referrals() {
    return (
        <div className="mb-4 md:mb-12 flex flex-col gap-4 xl:mb-0 xl:h-full xl:overflow-hidden xl:grid xl:grid-cols-[440px_1fr] xl:grid-rows-1 xl:gap-8 3xl:grid-cols-[520px_1fr]">
            <div className="block xl:hidden">
                <ReferralsStatistics />
            </div>
            <div className="flex flex-col h-full overflow-hidden xl:order-1 xl:shrink-0">
                <ReferralsSteps />
            </div>
            <div className="flex flex-col gap-4 xl:pb-0 xl:order-2 xl:gap-8">
                <div className="hidden xl:block">
                    <ReferralsStatistics />
                </div>
                <ReferralsTable />
            </div>
        </div>
    );
}

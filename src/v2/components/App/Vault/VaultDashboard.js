import Investments from "@/v2/modules/vault/Investments";
import Payouts from "@/v2/modules/vault/Payouts";
import Statistics from "@/v2/modules/vault/Statistics";
import Announcements from "@/v2/modules/vault/Announcements";

export default function VaultDashboard() {
    return (
        <div className="grow flex flex-col gap-8 md:grid md:grid-cols-10 md:px-12 md:overflow-y-auto md:gap-8 3xl:gap-x-13 3xl:gap-y-10 3xl:grid-cols-6 3xl:px-19 3xl:pb-12 3xl:pt-14 3xl:overflow-hidden">
            <Statistics className="md:col-span-3 3xl:col-span-2" />
            <Investments className="md:col-span-7 3xl:col-span-4" />
            <Announcements className="md:col-span-6 3xl:col-span-2" />
            <div className="md:col-span-10 3xl:col-span-4 3xl:grid 3xl:grid-cols-subgrid 3xl:grid-rows-1 3xl:gap-9 3xl:overflow-hidden">
                <Payouts className="3xl:col-span-3 flex flex-col" />
            </div>
        </div>
    );
}

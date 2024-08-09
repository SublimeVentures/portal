import Investments from "@/v2/modules/vault/Investments";
import Payouts from "@/v2/modules/vault/Payouts";
import Statistics from "@/v2/modules/vault/Statistics";
import Announcements from "@/v2/modules/vault/Announcements";
import UpgradeBanner from "@/v2/components/App/Vault/UpgradeBanner";

export default function VaultDashboard() {
    return (
        <div className="grow flex flex-col gap-8 mb-40 md:mb-0 md:grid md:grid-cols-10 md:px-12 md:overflow-y-auto md:gap-8 3xl:gap-x-13 3xl:gap-y-10 3xl:grid-cols-6 3xl:px-19 3xl:pb-12 3xl:pt-14 3xl:overflow-hidden">
            <Statistics className="md:col-span-3 3xl:col-span-2" />
            <Investments className="md:col-span-7 3xl:col-span-4" />
            <div className="flex flex-col gap-8 md:col-span-10 3xl:col-span-6 md:grid md:grid-cols-subgrid 3xl:grid-rows-1 3xl:gap-9 3xl:overflow-hidden">
                <Announcements className="md:col-span-5 3xl:col-span-2 md:order-1 3xl:order-1" />
                <UpgradeBanner className="md:col-span-5 3xl:col-span-1 3xl:mt-9 md:order-2 3xl:order-3" />
                <Payouts className="md:col-span-10 3xl:col-span-3 flex flex-col md:order-3 3xl:order-2" />
            </div>
        </div>
    );
}

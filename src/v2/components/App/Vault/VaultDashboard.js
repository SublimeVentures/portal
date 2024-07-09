import { PartnershipCard } from "@/v2/components/App/Vault";
import Investments from "@/v2/modules/vault/Investments";
import Payouts from "@/v2/modules/vault/Payouts";
import Statistics from "@/v2/modules/vault/Statistics";

const testEmpty = false;

let statisticsInvestments = { size: "$10.151,18", returns: "$38.593,92", projects: "4" };
if (testEmpty) Object.keys(statisticsInvestments).forEach((key) => (statisticsInvestments[key] = "0"));

const mockedPartnership = {
    title: "Based.VC & Steady Stack",
    description:
        "The partnership operates in the technology sector, specializing in developing software solutions for small businesses.",
    partners: [{ id: 1 }, { id: 2, styles: "bg-primary shadow-primary" }],
};

export default function VaultDashboard({ viewOptions: { views, handleChangeView } = {}, isLoading }) {
    return (
        <div className="overflow-y-auto">
            <div className="flex p-4 flex-col gap-8 xl:grid xl:grid-cols-9 2xl:grid-cols-8 md:mb-12 md:px-19">
                <Statistics />

                <Investments />

                <div className="col-span-4 h-full flex flex-col 2xl:col-span-3">
                    <div className="h-full grow mb-20">
                        <h3 className="text-nowrap text-2xl text-foreground">Community Partnership</h3>
                    </div>

                    <PartnershipCard
                        title={mockedPartnership.title}
                        description={mockedPartnership.description}
                        partners={mockedPartnership.partners}
                        isLoading={isLoading}
                    />
                </div>

                <Payouts />
            </div>
        </div>
    );
}

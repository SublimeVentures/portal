import Link from "next/link";
import { InvestmentCard, PartnershipCard, EmptyInvestments } from "@/v2/components/App/Vault";
import PayoutTable, { PayoutTableVariants } from "@/v2/components/App/Vault/PayoutTable";
import {
    SizeStatisticCard,
    ReturnStatisticCard,
    InvestedStatisticCard,
} from "@/v2/components/App/Vault/StatisticsCard";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Button } from "@/v2/components/ui/button";
import { useInvestments } from "@/pages/app/vault/investments";
import { usePayoutsInfiniteQuery } from "@/pages/app/vault/payouts";

const testEmpty = false;

let statisticsInvestments = { size: "$10.151,18", returns: "$38.593,92", projects: "4" };
if (testEmpty) Object.keys(statisticsInvestments).forEach((key) => (statisticsInvestments[key] = "0"));

const mockedPartnership = {
    title: "Based.VC & Steady Stack",
    description:
        "The partnership operates in the technology sector, specializing in developing software solutions for small businesses.",
    partners: [{ id: 1 }, { id: 2, styles: "bg-primary shadow-primary" }],
};

const Investments = () => {
    const isDesktop = useMediaQuery(breakpoints.md);
    const { data: investments = [], isLoading } = useInvestments({ limit: 3 });
    return (
        <div className="h-full flex flex-col col-span-5">
            <div className="mb-4 h-12 lg:h-20 lg:mb-0">
                <div className="flex items-center gap-4 lg:block">
                    <h3 className="text-nowrap text-2xl text-foreground">My Investments</h3>
                    <div className="w-full flex items-center justify-between gap-4">
                        {isDesktop ? (
                            <p className="text-lg text-[#C4C4C4] whitespace-pre-line">
                                Your Investment portfolio has a
                                <span className="text-[#4BD4E7] font-medium"> +20% </span>
                                growth since last month
                            </p>
                        ) : (
                            <p className="text-xs text-[#C4C4C4] whitespace-pre-line">
                                <span className="text-primary font-medium"> +20% </span>
                                growth
                            </p>
                        )}

                        <Button variant="link" className="ml-auto text-accent" asChild>
                            <Link href="/app/vault/investments">see all</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {investments.length <= 0 && !isLoading ? (
                <EmptyInvestments />
            ) : (
                <ul className="grid grid-test grow gap-4 xl:grid-cols-3 lg:gap-8">
                    {isLoading ? (
                        <>
                            <li className="h-full">
                                <InvestmentCard details={{}} isLoading={isLoading} />
                            </li>
                            <li className="h-full">
                                <InvestmentCard details={{}} isLoading={isLoading} />
                            </li>
                            <li className="h-full">
                                <InvestmentCard details={{}} isLoading={isLoading} />
                            </li>
                        </>
                    ) : (
                        investments.map((item) => (
                            <li key={item.id} className="h-full">
                                <InvestmentCard details={item} isLoading={isLoading} />
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

const Payouts = () => {
    const { data: { pages = [] } = {}, isLoading } = usePayoutsInfiniteQuery({ limit: 5 });
    const isLargeDesktop = useMediaQuery(breakpoints.xxl);
    const tableVariant = isLargeDesktop ? PayoutTableVariants.vertical : PayoutTableVariants.horizontal;
    return (
        <div className="col-span-5">
            <div className="mb-4 w-full flex items-center justify-between gap-4">
                <h3 className="text-nowrap text-2xl text-foreground">Payout table</h3>
                <Button variant="link" className="ml-auto text-accent" asChild>
                    <Link href="/app/vault/payouts">see all</Link>
                </Button>
            </div>
            <PayoutTable variant={tableVariant} isLoading={isLoading} pages={pages} />
        </div>
    );
};

export default function VaultDashboard({ viewOptions: { views, handleChangeView } = {}, isLoading }) {
    return (
        <div className="overflow-y-auto">
            <div className="flex p-4 flex-col gap-8 xl:grid xl:grid-cols-9 2xl:grid-cols-8 md:mb-24">
                <div className="flex flex-col grow col-span-4 2xl:col-span-3">
                    <div className="h-12 lg:h-20">
                        <div className="flex items-center justify-between">
                            <p className="text-2xl text-foreground">My Statistics</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 grow lg:flex-col">
                        <SizeStatisticCard value={statisticsInvestments.size} isLoading={isLoading} />
                        <ReturnStatisticCard value={statisticsInvestments.returns} isLoading={isLoading} />
                        <InvestedStatisticCard value={statisticsInvestments.projects} isLoading={isLoading} />
                    </div>
                </div>

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

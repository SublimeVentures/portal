import { InvestmentCard, PartnershipCard, EmptyInvestments } from "@/v2/components/App/Vault";
import PayoutTable, { PayoutTableVariants } from "@/v2/components/App/Vault/PayoutTable";
import { SizeStatisticCard, ReturnStatisticCard, InvestedStatisticCard } from "@/v2/components/App/Vault/StatisticsCard";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Button } from "@/v2/components/ui/button";

const testEmpty = false;

let statisticsInvestments = { size: "$10.151,18", returns: "$38.593,92", projects: "4" }
if (testEmpty) Object.keys(statisticsInvestments).forEach(key => statisticsInvestments[key] = "0");

let mockedInvestments = [
    { id: 1, title: "GMRX", coin: "Gaimin", invested: "5000", vested: "10", performance: "+78,68", nextUnlock: true, isAvaiable: true },
    { id: 2, title: "GMRX", coin: "Gaimin", invested: "5000", vested: "10", performance: "+78,68", nextUnlock: true, participatedDate: "1.02.2024", athProfit: true },
    { id: 3, title: "Portal", coin: "Portalcoin", invested: "7500" },
]
if (testEmpty) mockedInvestments = []

let mockedPayoutTable = [
    { id: "1", name: "Limewire", coin: "LMWR", status: "Upcoming", percentageUnlocked: "12", moneyUnlocked: "2000000", lastPayout: "03.04.2024" },
    { id: "2", name: "Portal", coin: "Portal", status: "Upcoming", percentageUnlocked: "2.50", moneyUnlocked: "125000", lastPayout: "02.04.2024" },
    { id: "3", name: "Gaimin", coin: "GMRX", status: "Pending", percentageUnlocked: "10", moneyUnlocked: "95000", lastPayout: "01.04.2024" },
]
if (testEmpty) mockedPayoutTable = []

const mockedPartnership = {
    title: 'Based.VC & Steady Stack',
    description: 'The partnership operates in the technology sector, specializing in developing software solutions for small businesses.',
    partners: [{ id: 1 }, { id: 2, styles: "bg-primary shadow-primary" }]
}

export default function VaultDashboard({ viewOptions: { views, handleChangeView } = {}, isLoading }) {
    const isDesktop = useMediaQuery(breakpoints.md);
    const isLargeDesktop = useMediaQuery(breakpoints.xxl);
    const [gridView] = views;

    const tableVariant = isLargeDesktop
        ? PayoutTableVariants.vertical
        : PayoutTableVariants.horizontal;

    return (
        <div className="p-4 md:p-16 overflow-y-auto">
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

                                <Button variant='link' className="ml-auto text-accent" onClick={() => handleChangeView(gridView)}>see all</Button>
                            </div>
                        </div>
                    </div>

                    {mockedInvestments.length <= 0
                        ? <EmptyInvestments />
                        :  (
                            <ul className="grid grid-test grow gap-4 xl:grid-cols-3 lg:gap-8">
                                {mockedInvestments.map(item => (
                                    <li key={item.id} className="h-full">
                                        <InvestmentCard details={item} isLoading={isLoading} />
                                    </li>
                                ))}
                            </ul>
                        )
                    }        
                </div>

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
            
                <div className="col-span-5">
                    <div className="mb-4 w-full flex items-center justify-between gap-4">
                        <h3 className="text-nowrap text-2xl text-foreground">Payout table</h3>
                        <div className="flex items-center flex-wrap gap-4">
                            <Button variant="tertiary">Filters</Button>
                            <Button variant="secondary">Progress</Button>
                            <Button variant="secondary">Progress</Button>
                        </div>
                    </div>

                    <PayoutTable variant={tableVariant} isLoading={isLoading} items={mockedPayoutTable} />
                </div>
            </div>
        </div>
    );
}

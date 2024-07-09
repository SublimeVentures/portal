import Link from "next/link";
import { InvestmentCard, EmptyInvestments } from "@/v2/components/App/Vault";
import { useInvestments } from "@/pages/app/vault/investments";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Button } from "@/v2/components/ui/button";

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

export default Investments;

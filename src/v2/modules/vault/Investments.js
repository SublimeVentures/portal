import Link from "next/link";
import { InvestmentCard, EmptyInvestments } from "@/v2/components/App/Vault";
import { useInvestments } from "@/pages/app/vault/investments";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Button } from "@/v2/components/ui/button";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";

const Investments = ({ className }) => {
    const isDesktop = useMediaQuery(breakpoints.md);
    const { data: investments = [], isLoading } = useInvestments({ limit: 4 });
    return (
        <div className={cn("flex flex-col", className)}>
            <div className="h-10 md:h-20 shrink-0">
                <div className="flex md:items-center gap-4 lg:block">
                    <h3 className="text-nowrap text-md md:text-2xl text-foreground">My Investments</h3>
                    <div className="w-full flex md:items-center justify-between gap-4">
                        {isDesktop ? (
                            <p className="text-md text-[#C4C4C4] whitespace-pre-line">
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

                        <Button variant="link" className="!py-0 md:!py-2 ml-auto text-accent capitalize" asChild>
                            <Link href="/app/vault/investments">
                                see all <ArrowIcon className="size-2.5 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {investments.length <= 0 && !isLoading ? (
                <EmptyInvestments />
            ) : (
                <div className="relative">
                    <ul className="-m-4 p-4 grid grid-cols-[repeat(4,50%)] grid-test grow overflow-x-auto no-scrollbar gap-2.5 md:grid-cols-3 3xl:grid-cols-4 3xl:gap-9">
                        {isLoading ? (
                            <>
                                <li className="h-full ">
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
                                <li key={item.id} className="h-full snap-start md:last:hidden 3xl:last:block">
                                    <InvestmentCard details={item} isLoading={isLoading} />
                                </li>
                            ))
                        )}
                    </ul>
                    <div className="absolute inset-y-0 right-0 -mr-4 w-1/3 z-10 md:hidden pointer-events-none bg-gradient-to-l to-transparent from-[#071321]"></div>
                </div>
            )}
        </div>
    );
};

export default Investments;

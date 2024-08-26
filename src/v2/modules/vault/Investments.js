import Link from "next/link";
import { InvestmentCard, EmptyInvestments } from "@/v2/components/App/Vault";
import { useInvestments } from "@/pages/app/vault/investments";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { Button } from "@/v2/components/ui/button";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import Title from "@/v2/modules/vault/components/Dashboard/Title";

const Investments = ({ className }) => {
    const isDesktop = useMediaQuery(breakpoints.md);
    const { data: investments = [], isLoading } = useInvestments({ limit: 4 });
    return (
        <div className={cn("flex flex-col", className)}>
            <div className="flex justify-between items-center mb-5 sm:mb-4">
                <Title
                    subtitle={
                        <>
                            {isDesktop ? (
                                <>
                                    Your Investment portfolio has a<span className="text-[#4BD4E7]"> +20% </span>
                                    growth since last month
                                </>
                            ) : (
                                <>
                                    <span className="text-primary"> +20% </span>
                                    growth
                                </>
                            )}
                        </>
                    }
                >
                    My Investments
                </Title>
                <Button variant="link" className="ml-auto text-accent capitalize text-xs md:text-sm p-0" asChild>
                    <Link href="/app/vault/investments">
                        see all <ArrowIcon className="size-2.5 ml-2" />
                    </Link>
                </Button>
            </div>

            {investments.length <= 0 && !isLoading ? (
                <EmptyInvestments />
            ) : (
                <div className="relative md:grow md:flex md:flex-col">
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

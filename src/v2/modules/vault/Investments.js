import Link from "next/link";
import { InvestmentCard, EmptyInvestments } from "@/v2/components/App/Vault";
import { Button } from "@/v2/components/ui/button";
import { cn } from "@/lib/cn";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import Title from "@/v2/modules/vault/components/Dashboard/Title";
import useInvestmentsQuery from "@/v2/hooks/useInvestmentsQuery";

export const INVESTMENTS_QUERY = {
    limit: 4,
};

const Investments = ({ className }) => {
    const { data: { rows: investments } = { rows: [] }, isLoading, refetch } = useInvestmentsQuery(INVESTMENTS_QUERY);
    return (
        <div className={cn("flex flex-col", className)}>
            <div className="flex justify-between items-center mb-5 sm:mb-4">
                <Title>My Investments</Title>
                {investments.length > 0 && (
                    <Button variant="link" className="ml-auto text-secondary capitalize text-xs md:text-sm p-0" asChild>
                        <Link href="/app/vault/investments">
                            see all <ArrowIcon className="size-2.5 ml-2" />
                        </Link>
                    </Button>
                )}
            </div>

            {investments.length <= 0 && !isLoading ? (
                <EmptyInvestments />
            ) : (
                <div className="relative md:grow md:flex md:flex-col">
                    <ul className="-m-4 p-4 grid grid-cols-[repeat(4,50%)] grid-test grow overflow-x-auto no-scrollbar gap-2.5 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 3xl:gap-9">
                        {isLoading ? (
                            <>
                                <li className="h-full" key="temp-1">
                                    <InvestmentCard details={{}} isLoading={isLoading} />
                                </li>
                                <li className="h-full" key="temp-2">
                                    <InvestmentCard details={{}} isLoading={isLoading} />
                                </li>
                                <li className="h-full" key="temp-3">
                                    <InvestmentCard details={{}} isLoading={isLoading} />
                                </li>
                            </>
                        ) : (
                            investments.map((item) => (
                                <li
                                    key={item.id}
                                    className="h-full snap-start md:[&:nth-last-child(n+3)]:hidden sm:[&:nth-last-child(n+4)]:hidden xl:[&:nth-last-child(2)]:block 3xl:[&:nth-last-child(3)]:block"
                                >
                                    <InvestmentCard refetch={refetch} details={item} isLoading={isLoading} />
                                </li>
                            ))
                        )}
                    </ul>
                    <div className="absolute inset-y-0 right-0 -mr-4 w-1/3 z-10 md:hidden pointer-events-none bg-gradient-to-l to-transparent from-primary-950"></div>
                </div>
            )}
        </div>
    );
};

export default Investments;

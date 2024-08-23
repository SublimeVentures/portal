import { useQuery } from "@tanstack/react-query";
import {
    SizeStatisticCard,
    ReturnStatisticCard,
    InvestedStatisticCard,
} from "@/v2/components/App/Vault/StatisticsCard";
import { fetchVaultStats } from "@/fetchers/vault.fetcher";
import { shortCurrencyFormatterWithSuffix } from "@/v2/lib/currency";
import { cn } from "@/lib/cn";
import Title from "@/v2/modules/vault/components/Dashboard/Title";

const useFetchVaultStatistics = () => {
    return useQuery({
        queryKey: [],
        queryFn: fetchVaultStats,
    });
};

export default function Statistics({ className }) {
    const { data: { invested = 0, count = 0, ...stats } = {}, isLoading } = useFetchVaultStatistics();
    return (
        <div className={cn("flex flex-col grow", className)}>
            <div className="mb-5 sm:mb-4 lg:h-13">
                <Title>My Statistics</Title>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-4 grow lg:flex-col">
                <InvestedStatisticCard value={shortCurrencyFormatterWithSuffix(invested)} isLoading={isLoading} />
                <ReturnStatisticCard value={shortCurrencyFormatterWithSuffix(stats.return)} isLoading={isLoading} />
                <SizeStatisticCard value={count} isLoading={isLoading} last />
            </div>
        </div>
    );
}

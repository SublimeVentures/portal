import { useQuery } from "@tanstack/react-query";
import {
    SizeStatisticCard,
    ReturnStatisticCard,
    InvestedStatisticCard,
} from "@/v2/components/App/Vault/StatisticsCard";
import { fetchVaultStats } from "@/fetchers/vault.fetcher";
import { shortCurrencyFormatterWithSuffix } from "@/v2/lib/currency";

const useFetchVaultStatistics = () => {
    return useQuery({
        queryKey: [],
        queryFn: fetchVaultStats,
    });
};

export default function Statistics() {
    const { data: { invested = 0, count = 0, ...stats } = {}, isLoading } = useFetchVaultStatistics();
    return (
        <div className="flex flex-col grow col-span-4 2xl:col-span-3">
            <div className="h-12 lg:h-20">
                <div className="flex items-center justify-between">
                    <p className="text-2xl text-foreground">My Statistics</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-4 grow lg:flex-col">
                <InvestedStatisticCard value={shortCurrencyFormatterWithSuffix(invested)} isLoading={isLoading} />
                <ReturnStatisticCard value={shortCurrencyFormatterWithSuffix(stats.return)} isLoading={isLoading} />
                <SizeStatisticCard value={count} isLoading={isLoading} />
            </div>
        </div>
    );
}

import { useQuery } from "@tanstack/react-query";

export const fetchNetworkList = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: "eth",
                    name: "Ethereum",
                    isSupported: true,
                },
                {
                    id: "matic",
                    name: "Polygon",
                    isSupported: true,
                },
                {
                    id: "bsn",
                    name: "Binance",
                    isSupported: true,
                },
                {
                    id: "solana",
                    name: "Solana",
                    isSupported: false,
                },
            ]);
        }, 1000);
    });
};

export const useNetworkList = () => {
    return useQuery({
        queryKey: ["networkList"],
        queryFn: fetchNetworkList,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
    });
};

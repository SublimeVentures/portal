import { http, createConfig, fallback } from "wagmi";
import { mainnet, polygon, bsc, avalanche, sepolia } from "wagmi/chains";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";
import { RPCs } from "@/lib/blockchain";
import { getTenantConfig } from "@/lib/tenantHelper";

const { walletConnectProjectId } = getTenantConfig();

const retryOptions = {
    retryCount: 7,
    retryDelay: 150,
    timeout: 10_000,
    batch: true,
};

const fallbackOptions = {
    retryCount: 5,
    retryDelay: 150,
};

const isProductionEnv = process.env.ENV === "production";

export const config = createConfig({
    chains: [...(isProductionEnv ? [mainnet] : [sepolia]), polygon, bsc],
    batch: { multicall: true },
    ssr: true,
    cacheTime: 0, //default: 4_000
    pollingInterval: 4_000,
    connectors: [
        walletConnect({
            projectId: walletConnectProjectId,
        }),
        coinbaseWallet({
            appName: "Venture Capital",
        }),
    ],
    transports: {
        ...(isProductionEnv
            ? {
                  [mainnet.id]: fallback(
                      [
                          http(RPCs[mainnet.id].main, retryOptions),
                          http(RPCs[mainnet.id].fallback1, retryOptions),
                          http(RPCs[mainnet.id].fallback2, retryOptions),
                          http(RPCs[mainnet.id].fallback3, retryOptions),
                      ],
                      fallbackOptions,
                  ),
              }
            : {
                  [sepolia.id]: fallback([http(RPCs[sepolia.id].main, retryOptions)], fallbackOptions),
              }),
        [polygon.id]: fallback(
            [
                http(RPCs[polygon.id].main, retryOptions),
                http(RPCs[polygon.id].fallback1, retryOptions),
                http(RPCs[polygon.id].fallback2, retryOptions),
                http(RPCs[polygon.id].fallback3, retryOptions),
            ],
            fallbackOptions,
        ),
        [bsc.id]: fallback(
            [
                http(RPCs[bsc.id].main, retryOptions),
                http(RPCs[bsc.id].fallback1, retryOptions),
                http(RPCs[bsc.id].fallback2, retryOptions),
            ],
            fallbackOptions,
        ),
        [avalanche.id]: fallback(
            [
                http(RPCs[avalanche.id].main, retryOptions),
                http(RPCs[avalanche.id].fallback1, retryOptions),
                http(RPCs[avalanche.id].fallback2, retryOptions),
            ],
            fallbackOptions,
        ),
    },
});

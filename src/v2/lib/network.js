import dynamic from "next/dynamic";

export const NetworkEnum = Object.freeze({
    eth: 1,
    matic: 137,
    bsc: 56,
    base: 8453,
    sepolia_base: 84532,
    sepolia: 11155111,
});

export const NETWORKS = Object.freeze({
    [NetworkEnum.eth]: "eth",
    [NetworkEnum.matic]: "matic",
    [NetworkEnum.bsc]: "bsc",
});

export const AirdropNetworkEnum = Object.freeze({
    sol: 501,
    eth: 1,
    matic: 137,
    bsc: 56,
    avax: 43114,
    sepolia: 11155111,
});

export const AIRDROP_NETWORKS = Object.freeze({
    [AirdropNetworkEnum.sol]: "solana",
});

export const ICONS = {
    [NetworkEnum.eth]: dynamic(() => import(`@/v2/assets/svg/chains/1.svg`)),
    [NetworkEnum.bsc]: dynamic(() => import(`@/v2/assets/svg/chains/56.svg`)),
    [NetworkEnum.matic]: dynamic(() => import(`@/v2/assets/svg/chains/137.svg`)),
    [NetworkEnum.base]: dynamic(() => import(`@/v2/assets/svg/chains/8453.svg`)),
    [NetworkEnum.sepolia_base]: dynamic(() => import(`@/v2/assets/svg/chains/84532.svg`)),
    [NetworkEnum.sepolia]: dynamic(() => import(`@/v2/assets/svg/chains/11155111.svg`)),
    [AirdropNetworkEnum.avax]: dynamic(() => import(`@/v2/assets/svg/chains/43114.svg`)),
    [AirdropNetworkEnum.sol]: dynamic(() => import(`@/v2/assets/svg/chains/501.svg`)),
};

export const COLORS = {
    [NetworkEnum.eth]: "#627eeb",
    [NetworkEnum.sepolia]: "#627eeb",
    [NetworkEnum.bsc]: "#f0b90c",
    [NetworkEnum.matic]: "#6d00f6",
    [NetworkEnum.base]: "#0052ff",
    [NetworkEnum.sepolia_base]: "#0052ff",
    [AirdropNetworkEnum.avax]: "#ff394a",
    [AirdropNetworkEnum.sol]: "linear-gradient(145deg, #00FFA3 0%, #DC1FFF 50%, #3A30D0 100%)",
};

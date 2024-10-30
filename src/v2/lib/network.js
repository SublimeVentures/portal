export const NetworkEnum = Object.freeze({
    eth: 1,
    matic: 137,
    bsc: 56,
    base: 8453,
    sepolia_base: 84532,
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

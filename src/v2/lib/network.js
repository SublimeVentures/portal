export const NetworkEnum = Object.freeze({
    eth: 1,
    matic: 137,
    bsc: 56,
});

export const NETWORKS = Object.freeze({
    [NetworkEnum.eth]: "eth",
    [NetworkEnum.matic]: "matic",
    [NetworkEnum.bsc]: "bsc",
});

export const AirdropNetworkEnum = Object.freeze({
    sol: 501,
});

export const AIRDROP_NETWORKS = Object.freeze({
    [NetworkEnum.sol]: "solana",
});

import { TENANT } from "@/lib/tenantHelper";

const PAGE = {
    Landing: "/",
    Join: "/join",
    Login: "https://spring.net/discover/basedvc",
    Investments: "/investments",
    Tokenomics: "/tokenomics",
    ToS: "/terms",
    Privacy: "/privacy",
    App: "/app",
    Opportunities: "/app/offer",
    Launchpad: "/app/launchpad",
    OTC: "/app/otc",
    Notifs: "/app/latest",
    Mysterybox: "/app/mysterybox",
    Upgrades: "/app/upgrades",
    Settings: "/app/settings",
};

export const API = {
    fetchWallets: "/api/settings/wallets",
    settingsWallet: "/api/settings/wallets/",
    settingsStake: "/api/settings/stake",
    fetchVault: "/api/vault/all",
    fetchPayout: "/api/payout/",
    fetchClaim: "/api/claim",
    claimMysterybox: "/api/mysterybox/claim",
    fetchStore: "/api/store",
    fetchStoreItemsOwned: "/api/store/owned",
    publicInvestments: "/api/public/investments",
    offerList: "/api/offer",
    offerAllocation: "/api/offer/allocation/",
    offerDetails: "/api/offer/",
    auth: "/api/auth/login",
    environment: "/api/environment",
    publicPartners: "/api/public/partners",
    publicNeoTokyoEnvs: "/api/public/nt-calculator",
    publicKongzEnvs: "/api/public/kongz-calculator",
};

const ExternalLinksBased = {
    BOOKING_SYSTEM:
        "https://info.basedvc.fund/overview/faq#how-does-the-booking-system-work-for-investments-on-the-basedvc-platform",
    OFFER_PHASES: "https://info.basedvc.fund/overview/the-investment-process#the-investment-phases-are-as-follows",
    AFTER_INVESTMENT: "https://info.basedvc.fund/overview/managing-your-investments",
    SUPPORTED_NETWORKS: "https://info.basedvc.fund/overview/multichain",
    UPGRADES: "https://info.basedvc.fund/overview/upgrades",
    LOOTBOX: "https://info.basedvc.fund/overview/mystery-boxes",
    HOW_TO_ACCESS: "https://info.basedvc.fund/overview/how-to-join",
    DELEGATED_ACCESS: "https://info.basedvc.fund/overview/faq#how-does-wallet-delegation-work",
    VAULT: "https://info.basedvc.fund/overview/managing-your-investments",
    WIKI: "https://info.basedvc.fund",
    DISCORD: "https://discord.gg/AsGvs6uRU8",
    TWITTER: "https://twitter.com/basedvcfund",
    OTC: "https://info.basedvc.fund/overview/otc-sales",
    APPLY: "https://tally.so/r/mK5Pvk",
    WHALE_CLUB: "https://info.basedvc.fund/3VC-Whale-Club-5fea374623c1493d8af2b4b04914ab3e",
};

const ExternalLinksCitCap = {
    WIKI: "https://info.citizencapital.fund",
    DISCORD: "https://discord.com/invite/neotokyocitadel",
    TWITTER: "https://twitter.com/NTLaunchpad",
    GETBYTES: "https://app.uniswap.org/#/swap?outputCurrency=0xa19f5264f7d7be11c451c093d8f92592820bea86",
    STAKE_NT: "https://neotokyo.codes/profile",
    BOOKING_SYSTEM: "https://info.citizencapital.fund/overview/faq#how-does-allocation-booking-system-works",
    OFFER_PHASES:
        "https://info.citizencapital.fund/overview/the-investment-process#the-investment-phases-are-as-follows",
    AFTER_INVESTMENT: "https://info.citizencapital.fund/overview/managing-your-investments",
    SUPPORTED_NETWORKS: "https://info.citizencapital.fund/overview/multichain",
    UPGRADES: "https://info.citizencapital.fund/overview/the-investment-process#the-investment-phases-are-as-follows",
    LOOTBOX: "https://info.citizencapital.fund/overview/mysterybox",
    HOW_TO_ACCESS: "https://info.citizencapital.fund/overview/how-to-join",
    DELEGATED_ACCESS: "#",
    VAULT: "https://info.citizencapital.fund/overview/managing-your-investments",
    APPLY: "https://tally.so/r/wLPg0l",

    OTC: "https://info.citizencapital.fund/OTC-08ce38805290416eb073b139bd54e3f7",
    STAKING: "https://info.citizencapital.fund/BYTES-Staking-Requirement-f1621bfe909b41d797fd77ca784a8fa0",
};

const ExternalLinksCyberKongz = {
    WIKI: "#",
    DISCORD: "https://discord.com/invite/cyberkongz",
    TWITTER: "https://twitter.com/KongzCapital",
    GET_BANANA_ETH: "https://app.uniswap.org/#/swap?outputCurrency=0x94e496474f1725f1c1824cb5bdb92d7691a4f03a",
    GET_BANANA_MATIC:
        "https://app.uniswap.org/swap?outputCurrency=0xbc91347e80886453f3f8bbd6d7ac07c122d87735&chain=polygon",
    BOOKING_SYSTEM: "#",
    OFFER_PHASES: "#",
    AFTER_INVESTMENT: "#",
    SUPPORTED_NETWORKS: "#",
    UPGRADES: "#",
    LOOTBOX: "#",
    HOW_TO_ACCESS: "#",
    DELEGATED_ACCESS: "#",
    VAULT: "#",
    OTC: "#",
    STAKING: "#",
};

const ExternalLinksBAYC = {
    WIKI: "https://info.apes.capital/",
    DISCORD: "https://discord.gg/apesplus",
    TWITTER: "https://twitter.com/Apes_Capital",
    GET_APE: "https://app.uniswap.org/#/swap?outputCurrency=0x4d224452801aced8b2f0aebe155379bb5d594381",
    BOOKING_SYSTEM: "https://info.apes.capital/overview/faq#how-does-allocation-booking-system-works",
    OFFER_PHASES: "https://info.apes.capital/overview/the-investment-process",
    AFTER_INVESTMENT: "https://info.apes.capital/overview/managing-your-investments",
    SUPPORTED_NETWORKS: "https://info.apes.capital/overview/multichain",
    UPGRADES: "https://info.apes.capital/overview/upgrades",
    LOOTBOX: "https://info.apes.capital/overview/mystery-boxes",
    HOW_TO_ACCESS: "https://info.apes.capital/overview/how-to-join",
    DELEGATED_ACCESS: "https://info.apes.capital/overview/faq#how-to-setup-a-delegated-wallet-for-login",
    VAULT: "https://info.apes.capital/overview/managing-your-investments",
    OTC: "https://info.apes.capital/overview/otc-sales",
    STAKING: "https://info.apes.capital/overview/how-to-join",
};

function getTenantLinks() {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return ExternalLinksBased;
        }
        case TENANT.NeoTokyo: {
            return ExternalLinksCitCap;
        }
        case TENANT.CyberKongz: {
            return ExternalLinksCyberKongz;
        }
        case TENANT.BAYC: {
            return ExternalLinksBAYC;
        }
    }
}

export const ExternalLinks = getTenantLinks();

export default PAGE;

import { tenantIndex } from "./lib/utils";
import { TENANT } from "@/lib/tenantHelper";

const standardRoutes = {
    Landing: "/",
    Join: "/join",
    Login: "/login",
    Investments: "/investments",
    Tokenomics: "/tokenomics",
    ToS: "/terms",
    Privacy: "/privacy",
    App: "/app/vault",
    Opportunities: "/app/offer",
    Launchpad: "/app/launchpad",
    OTC: "/app/otc",
    Notifs: "/app/latest",
    Mysterybox: "/app/mysterybox",
    Upgrades: "/app/upgrades",
    Settings: "/app/settings",
    Notifications: "/app/notifications",
};

const basedRoutes = {
    Landing: "/",
    Join: "/join",
    Login: "/login",
    Investments: "/investments",
    Tokenomics: "/tokenomics",
    ToS: "/terms",
    Privacy: "/privacy",
    App: "/vault",
    Opportunities: "/offer",
    Launchpad: "/launchpad",
    OTC: "/otc",
    Notifs: "/latest",
    Mysterybox: "/mysterybox",
    Upgrades: "/upgrades",
    Settings: "/settings",
    Notifications: "/notifications",
};

const PAGE = tenantIndex === TENANT.basedVC ? Object.freeze(basedRoutes) : Object.freeze(standardRoutes);

export const API = {
    settingsWallets: "/api/settings/wallets",
    settingsStake: "/api/settings/stake",
    fetchVault: "/api/vault",
    reassignVault: "/api/reassign",
    fetchPayout: "/api/payout/",
    fetchClaim: "/api/claim",
    claimMysterybox: "/api/mysterybox/claim",
    fetchStore: "/api/store",
    fetchStoreItemsOwned: "/api/store/owned",
    publicInvestments: "/api/public/investments",
    offerList: "/api/offer",
    offerStats: "/api/offer/stats",
    offerProgress: "/api/offer/progress",
    offerAllocation: "/api/offer/allocation/",
    offerDetails: "/api/offer/",
    auth: "/api/auth/login",
    environment: "/api/environment",
    publicPartners: "/api/public/partners",
    publicNeoTokyoEnvs: "/api/public/nt-calculator",
    publicKongzEnvs: "/api/public/kongz-calculator",
    notificationList: "/api/notifications",
    notificationChannels: "/api/notifications/channels",
    notificationPreferences: "/api/notifications/preferences",
    pushSubscription: "/api/notifications/subscription",
    user: "/api/auth/user",
    reserveMysteryBox: "/api/mysterybox/reserve",
    reserveUpgrade: "/api/store/reserve",
};

const ExternalLinksBased = {
    BOOKING_SYSTEM: "https://info.basedvc.fund/overview/how-to-invest",
    OFFER_PHASES: "https://info.basedvc.fund", //TODO: not used
    AFTER_INVESTMENT: "https://info.basedvc.fund/overview/managing-your-investments",
    SUPPORTED_NETWORKS: "https://info.basedvc.fund", //TODO: not used
    UPGRADES: "https://info.basedvc.fund", //TODO: not used
    LOOTBOX: "https://info.basedvc.fund/overview/mystery-boxes",
    HOW_TO_ACCESS: "https://info.basedvc.fund/overview/how-to-join",
    DELEGATED_ACCESS: "https://info.basedvc.fund",
    VAULT: "https://info.basedvc.fund", //TODO: not used
    WIKI: "https://info.basedvc.fund",
    DISCORD: "https://discord.gg/44bsJc7S",
    TWITTER: "https://twitter.com/basedvcfund",
    OTC: "https://info.basedvc.fund/overview/otc-sales",
    APPLY: "https://tally.so/r/mK5Pvk",
    WHALE_CLUB: "https://info.basedvc.fund", //TODO: not used
    REFERRAL_PROGRAM: "https://info.basedvc.fund", //TODO: not used
    SUPPORT: "https://info.basedvc.fund/support",
    //todo: https://www.notion.so/basedvc/Investment-Cap-Model-5b685123fe3c43e9a29e6d8fa67be2a3 - to be fixed
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
    REFERRAL_PROGRAM: "https://info.citizencapital.fund/",
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
    REFERRAL_PROGRAM: "#",
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
    REFERRAL_PROGRAM: "https://info.apes.capital/",
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

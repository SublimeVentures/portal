import {isBased} from "@/lib/utils";


const PAGE = {
    Landing: "/",
    Join: "/join",
    Login: "/login",
    Investments: "/investments",
    Tokenomics: "/tokenomics",
    App: "/app",
    Opportunities: "/app/offer",
    Accelerator: "/app/accelerator",
    OTC: "/app/otc",
    Notifs: "/app/latest",
    Mysterybox: "/app/mysterybox",
    Upgrades: "/app/upgrades",
    Settings: "/app/settings",
}

export const API = {
    fetchVault: "/api/vault/all",
    claimMysterybox: "/api/mysterybox/claim",
    fetchStore: "/api/store",
    fetchStoreItemsOwned: "/api/store/owned",
    fetchVaultOfferDetails: "/api/vault?offer=",
    publicInvestments: "/api/public/investments",
    offerList: "/api/offer",
    offerDetails: "/api/offer/",
    auth: "/api/auth/login",
    updateSession_CitCapStaking: "/api/auth/login/stake",
    publicPartners: "/api/public/partners",
    publicNeoTokyoEnvs: "/api/public/nt-calculator",
}

const ExternalLinksBased = {
    BOOKING_SYSTEM: "https://info.basedvc.fund/Allocation-Booking-System-2f93893f882c49d0ab305159aa7099c4",
    OFFER_PHASES: "https://info.basedvc.fund/Offer-phases-cf284a30c16f4586a8f2fa6b49df1e8d",
    AFTER_INVESTMENT: "https://info.basedvc.fund/After-Investing-7a44086b917545029d95574c53c66a7d",
    SUPPORTED_NETWORKS: "https://info.basedvc.fund/Supported-networks-safe-gas-3d50096070d54efebae0590d02acbcdb",
    UPGRADES: "https://info.basedvc.fund/Upgrades-adb5bd92e38644ef95433d23be612bf1",//todo: fix images
    LOOTBOX: "https://info.basedvc.fund/MysteryBox-0b34290a907543049b2cef882ba72e5c",//todo: fix
    HOW_TO_ACCESS: "https://info.basedvc.fund/How-to-access-3VC-f40a1142d93f4b0ba38e13114189a877",
    DELEGATED_ACCESS: "https://info.basedvc.fund/Delegated-access-dc60abd8a5654641a7bd77d537256aa7",
    VAULT: "https://info.basedvc.fund/App-Navigation-2f8097958f69467aaa03bbfda0ecd89e",
    WIKI: "https://info.basedvc.fund",
    DISCORD: "https://discord.gg/AsGvs6uRU8",
    TWITTER:"https://twitter.com/basedvcfund",
    OTC_ANNOUNCE: "https://discord.com/channels/1031176608729550849/1156911245602078832",
    OTC: "https://info.basedvc.fund/OTC-fdad47130a0a49bbaa1a1e4c9fd95907",

    APPLY:"https://tally.so/r/mK5Pvk",
    WHALE_CLUB: "https://info.basedvc.fund/3VC-Whale-Club-5fea374623c1493d8af2b4b04914ab3e",
    //todo: https://www.notion.so/basedvc/Investment-Cap-Model-5b685123fe3c43e9a29e6d8fa67be2a3 - to be fixed
}

const ExternalLinksCitCap = {
    WIKI: "https://info.citizencapital.fund",
    DISCORD: "https://discord.com/invite/neotokyocitadel",
    TWITTER:"https://twitter.com/NTLaunchpad",
    GETBYTES: "https://app.uniswap.org/#/swap?outputCurrency=0xa19f5264f7d7be11c451c093d8f92592820bea86",
    STAKE_NT: "https://neotokyo.codes/profile",
    BOOKING_SYSTEM: "https://info.citizencapital.fund/overview/faq#how-does-allocation-booking-system-works",
    OFFER_PHASES: "https://info.citizencapital.fund/overview/the-investment-process#the-investment-phases-are-as-follows",
    AFTER_INVESTMENT: "https://info.citizencapital.fund/overview/managing-your-investments",
    SUPPORTED_NETWORKS: "https://info.citizencapital.fund/overview/multichain",
    UPGRADES: "https://info.citizencapital.fund/overview/the-investment-process#the-investment-phases-are-as-follows",
    LOOTBOX: "https://info.citizencapital.fund/overview/mysterybox",
    HOW_TO_ACCESS: "https://info.citizencapital.fund/overview/how-to-join",
    DELEGATED_ACCESS: "#",
    VAULT: "https://info.citizencapital.fund/overview/managing-your-investments",
    APPLY:"https://tally.so/r/wLPg0l",

    OTC: "https://info.citizencapital.fund/OTC-08ce38805290416eb073b139bd54e3f7",
    OTC_ANNOUNCE: "https://discord.com/channels/959614664386424884/1038006855445774347",
    STAKING: "https://info.citizencapital.fund/BYTES-Staking-Requirement-f1621bfe909b41d797fd77ca784a8fa0",

}

export const ExternalLinks = isBased ? ExternalLinksBased : ExternalLinksCitCap

export default PAGE;

import {isBased} from "@/lib/utils";


const PAGE = {
    Landing: "/",
    Join: "/join",
    Login: "/login",
    Investments: "/investments",
    App: "/app",
    Opportunities: "/app/offer",
    Accelerator: "/app/accelerator",
    OTC: "/app/otc",
    Notifs: "/app/latest",
    Lootbox: "/app/lootbox",
    Settings: "/app/settings",
}

export const API = {
    fetchVault: "/api/vault/all",
    fetchLootbox: "/api/lootbox",
    fetchVaultOfferDetails: "/api/vault?offer=",
    publicInvestments: "/api/public/investments",
    offerList: "/api/offer",
    offerDetails: "/api/offer/",
    auth: "/api/auth/login",
    updateSession_CitCapStaking: "/api/auth/login/stake",
    publicPartners: "/api/public/partners",
}

const ExternalLinksBased = {
    INVESTMENT_RETURN: "https://info.3vc.fund/Return-from-the-investment-0656411b2d4c44078c675d3f87e8b136",
    BOOKING_SYSTEM: "https://info.3vc.fund/Allocation-Booking-System-2f93893f882c49d0ab305159aa7099c4",
    OFFER_PHASES: "https://info.3vc.fund/Offer-phases-cf284a30c16f4586a8f2fa6b49df1e8d",
    AFTER_INVESTMENT: "https://info.3vc.fund/After-investment-7a44086b917545029d95574c53c66a7d",
    WHALE_CLUB: "https://info.3vc.fund/3VC-Whale-Club-5fea374623c1493d8af2b4b04914ab3e",
    SUPPORTED_NETWORKS: "https://info.3vc.fund/Supported-networks-safe-gas-3d50096070d54efebae0590d02acbcdb",
    LOOTBOX: "https://info.3vc.fund/Supported-networks-safe-gas-3d50096070d54efebae0590d02acbcdb",
    HOW_TO_ACCESS: "https://info.3vc.fund/How-to-access-3VC-f40a1142d93f4b0ba38e13114189a877",
    DELEGATED_ACCESS: "https://info.3vc.fund/Delegated-access-dc60abd8a5654641a7bd77d537256aa7",
    VAULT: "https://info.3vc.fund/Investor-Vault-2f8097958f69467aaa03bbfda0ecd89e",
    WIKI: "https://info.3vc.fund",
    DISCORD: "https://discord.gg/3SaqVVdzUH",
    TWITTER:"https://twitter.com/3vcfund",
}

const ExternalLinksCitCap = {
    INVESTMENT_RETURN: "#",
    BOOKING_SYSTEM: "#",
    OFFER_PHASES: "#",
    AFTER_INVESTMENT: "#",
    SUPPORTED_NETWORKS: "#",
    LOOTBOX: "#",
    HOW_TO_ACCESS: "#",
    DELEGATED_ACCESS: "#",
    VAULT: "#",
    GETBYTES: "https://app.uniswap.org/#/swap?outputCurrency=0xa19f5264f7d7be11c451c093d8f92592820bea86",

    WIKI: "https://info.citizencapital.fund",
    DISCORD: "https://discord.gg/CX7ChfhYbf",
    TWITTER:"https://twitter.com/CitCapFund",
}

export const ExternalLinks = isBased ? ExternalLinksBased : ExternalLinksCitCap

export default PAGE;

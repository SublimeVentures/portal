const is3VC = process.env.NEXT_PUBLIC_SITE === "3VC"


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
    fetchVaultOfferDetails: "/api/vault?offer=",
    publicInvestments: "/api/public/investments",
    offerList: "/api/offer",
    offerDetails: "/api/offer/",
    auth: "/api/auth/login",
    updateSession_CitCapStaking: "/api/auth/login/stake",
    publicPartners: "/api/public/partners",
}

const ExternalLinks3VC = {
    INVESTMENT_RETURN: "https://3vcfund.notion.site/Return-from-the-investment-0656411b2d4c44078c675d3f87e8b136",
    BOOKING_SYSTEM: "https://3vcfund.notion.site/Allocation-Booking-System-2f93893f882c49d0ab305159aa7099c4",
    OFFER_PHASES: "https://3vcfund.notion.site/Offer-phases-cf284a30c16f4586a8f2fa6b49df1e8d",
    AFTER_INVESTMENT: "https://3vcfund.notion.site/After-investment-7a44086b917545029d95574c53c66a7d",
    WHALE_CLUB: "https://3vcfund.notion.site/3VC-Whale-Club-5fea374623c1493d8af2b4b04914ab3e",
    SUPPORTED_NETWORKS: "https://3vcfund.notion.site/Supported-networks-safe-gas-3d50096070d54efebae0590d02acbcdb",
    LOOTBOX: "https://3vcfund.notion.site/Supported-networks-safe-gas-3d50096070d54efebae0590d02acbcdb",
    HOW_TO_ACCESS: "https://3vcfund.notion.site/How-to-access-3VC-f40a1142d93f4b0ba38e13114189a877",
    DELEGATED_ACCESS: "https://3vcfund.notion.site/Delegated-access-dc60abd8a5654641a7bd77d537256aa7",
    VAULT: "https://3vcfund.notion.site/Investor-Vault-2f8097958f69467aaa03bbfda0ecd89e",
    WIKI: "https://info.3vc.fund",
    DISCORD: "https://discord.gg/3SaqVVdzUH",
    TWITTER:"https://twitter.com/3vcfund",
}

const ExternalLinksCitCap = {
    INVESTMENT_RETURN: "https://3vcfund.notion.site/Return-from-the-investment-0656411b2d4c44078c675d3f87e8b136",
    BOOKING_SYSTEM: "https://3vcfund.notion.site/Allocation-Booking-System-2f93893f882c49d0ab305159aa7099c4",
    OFFER_PHASES: "https://3vcfund.notion.site/Offer-phases-cf284a30c16f4586a8f2fa6b49df1e8d",
    AFTER_INVESTMENT: "https://3vcfund.notion.site/After-investment-7a44086b917545029d95574c53c66a7d",
    SUPPORTED_NETWORKS: "https://3vcfund.notion.site/Supported-networks-safe-gas-3d50096070d54efebae0590d02acbcdb",
    LOOTBOX: "https://3vcfund.notion.site/Supported-networks-safe-gas-3d50096070d54efebae0590d02acbcdb",
    HOW_TO_ACCESS: "https://3vcfund.notion.site/How-to-access-3VC-f40a1142d93f4b0ba38e13114189a877",
    DELEGATED_ACCESS: "https://3vcfund.notion.site/Delegated-access-dc60abd8a5654641a7bd77d537256aa7",
    VAULT: "https://3vcfund.notion.site/Investor-Vault-2f8097958f69467aaa03bbfda0ecd89e",

    WIKI: "https://info.citizencapital.fund",
    DISCORD: "https://discord.gg/CX7ChfhYbf",
    TWITTER:"https://twitter.com/CitCapFund",
}

export const ExternalLinks = is3VC ? ExternalLinks3VC : ExternalLinksCitCap

export default PAGE;

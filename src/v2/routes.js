export const OTC_API_ROUTES = Object.freeze({
    getMarkets: "/api/otc/markets",
    getUserAllocation: "/api/otc/allocation",
    getOffers: "/api/otc/offers",
    getHistory: "/api/otc/history",
    getLatest: "/api/otc/latest",
});

export const NETWORK_API_ROUTES = Object.freeze({
    getNetwork: "/api/network",
});

export const API_ROUTES = Object.freeze({
    otc: OTC_API_ROUTES,
    network: NETWORK_API_ROUTES,
});

export const routes = Object.freeze({
    Landing: "/",
    Join: "/join",
    Login: "/login",
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
});

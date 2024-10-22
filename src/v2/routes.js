import { TENANT } from "@/lib/tenantHelper";
import { tenantIndex } from "@/lib/utils";

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

export const API_REFERRALS = Object.freeze({
    referral: "/api/referral",
    referrals: "/api/referral/referrals",
    fetchReferralClaim: "/api/referral-claim",
    fetchReferralClaimSign: "/api/referral-claim/sign",
});

const basedRoutes = Object.freeze({
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
});

const standardRoutes = Object.freeze({
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
});

export const routes = tenantIndex === TENANT.basedVC ? basedRoutes : standardRoutes;

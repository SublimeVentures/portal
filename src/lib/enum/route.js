const { tenantIndex } = require("../utils");
const { TENANT } = require("./tenant");

const isTenantBased = tenantIndex === TENANT.basedVC;

const dynamicTenantRoutes = (routeMap) => {
    return Object.fromEntries(
        Object.entries(routeMap).map(([key, value]) => {
            if (isTenantBased && value === "/app") {
                return [key, "/"];
            } else if (isTenantBased && value.startsWith("/app")) {
                return [key, value.substring(4)];
            } else {
                return [key, value];
            }
        }),
    );
};

const PAGE = {
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
    NotFound: "/404",
};

module.exports = {
    PAGE: dynamicTenantRoutes(PAGE),
};

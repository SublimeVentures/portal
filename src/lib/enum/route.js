const { tenantIndex } = require("../utils");
const { TENANT } = require("./tenant");

const isTenantBased = tenantIndex === TENANT.basedVC;

const PAGE = {
    Landing: "/",
    Join: "/join",
    Login: "/login",
    Investments: "/investments",
    Tokenomics: "/tokenomics",
    ToS: "/terms",
    Privacy: "/privacy",
    App: isTenantBased ? "/" : "/app",
    Opportunities: isTenantBased ? "/offer" : "/app/offer",
    Launchpad: isTenantBased ? "/launchpad" : "/app/launchpad",
    OTC: isTenantBased ? "/otc" : "/app/otc",
    Notifs: isTenantBased ? "/latest" : "/app/latest",
    Mysterybox: isTenantBased ? "/mysterybox" : "/app/mysterybox",
    Upgrades: isTenantBased ? "/upgrades" : "/app/upgrades",
    Settings: isTenantBased ? "/settings" : "/app/settings",
    NotFound: "/404",
};

module.exports = {
    PAGE,
};

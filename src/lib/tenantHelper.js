const { tenantIndex } = require("../lib/utils");
const { getSEOTenantConfig } = require("./config/seo.config");
const WALLET_CONNECT_ID = require("./config/walletconnect.config");
const TENANTS_STAKING = require("./config/staking.config");
const TENANT_FAVICON = require("./config/favicon.config");
const { EXTERNAL_LINKS } = require("./config/route.config");
const TENANT = require("./enum/tenant").TENANT;

function getTenantConfig() {
    if (!Object.values(TENANT).includes(tenantIndex)) {
        console.error(`ERROR:: getTenantConfig - configuration for ${tenantIndex} is not exist`);
        return null;
    }

    return {
        tenantIndex,
        walletConnectProjectId: WALLET_CONNECT_ID,
        seo: getSEOTenantConfig(tenantIndex),
        staking: TENANTS_STAKING,
        favicon: TENANT_FAVICON,
        externalLinks: EXTERNAL_LINKS,
    };
}

module.exports = {
    TENANT,
    getTenantConfig,
};

const { getSEOTenantConfig } = require("./config/seo.config");

const TENANT = require("./enum/tenant").TENANT;

function getTenantConfig(tenantIndex) {
    if (!Object.values(TENANT).includes(tenantIndex)) {
        console.error(`ERROR:: getTenantConfig - configuration for ${tenantIndex} is not exist`);
        return null;
    }

    return {
        tenantIndex,
        seo: getSEOTenantConfig(tenantIndex),
    };
}

module.exports = {
    TENANT,
    getTenantConfig,
};

const { tenantIndex } = require("../src/lib/utils");
const { TENANT } = require("../src/lib/tenantHelper");

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

const checkTenant = (req, res, next) => {
    if (isBaseVCTenant) {
        next();
    } else {
        res.status(403).json({ error: "Not allowed on current tenant" });
    }
};

module.exports = checkTenant
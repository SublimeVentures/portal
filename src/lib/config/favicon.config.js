const { TENANT } = require("../enum/tenant");

const TENANT_FAVICON = () => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return "/1/favicon.png";
        }
        case TENANT.NeoTokyo: {
            return "/6/favicon.png";
        }
        case TENANT.CyberKongz: {
            return "/14/favicon.png";
        }
        case TENANT.BAYC: {
            return "/19/favicon.png";
        }
    }
};

module.exports = TENANT_FAVICON();

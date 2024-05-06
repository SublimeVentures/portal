const { TENANT } = require("../enum/tenant");

const TENANT_FAVICON = () => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return "/favicon.svg";
        }
        case TENANT.NeoTokyo: {
            return "/img/favicon.png";
        }
        case TENANT.CyberKongz: {
            return "/favicon_14.png";
        }
        case TENANT.BAYC: {
            return "/favicon_19.png";
        }
    }
};

module.exports = TENANT_FAVICON();

const { TENANT } = require("../enum/tenant");

const TENANT_WALLETCONNECT = () => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return "fd985de17a4eed15096ed191f885cbcb";
        }
        case TENANT.NeoTokyo: {
            return "595f43a2eed724f824aa5ff2b5dc75c2";
        }
        case TENANT.CyberKongz: {
            return "5a606cf907328fefe28f0bdae67052b4";
        }
        case TENANT.BAYC: {
            return "7320735cf0faaa591d2e4cb8da253dc4";
        }
    }
};

const WALLET_CONNECT_ID = TENANT_WALLETCONNECT();

module.exports = WALLET_CONNECT_ID;

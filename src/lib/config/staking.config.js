const { TENANT } = require("../enum/tenant");

function TENANTS_STAKING() {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return [];
        }
        case TENANT.NeoTokyo: {
            return ["S1", "S2"];
        }
        case TENANT.CyberKongz: {
            return ["Genesis Kong", "Baby Kong"];
        }
        case TENANT.BAYC: {
            return ["BAYC", "MAYC"];
        }
    }
}

module.exports = TENANTS_STAKING();

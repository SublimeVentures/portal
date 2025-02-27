const TENANT = {
    basedVC: 1,
};

async function getEnvironment() {
    const environment = {
        tenant: {},
        currencies: {},
        stats: {
            partners: 0,
            funded: 0,
            launchpad: 0,
            vc: 0,
        },
    };

    environment.currencies = {
        1: {
            "0x0": {
                name: "Mock Token",
                symbol: "MTK",
                precision: 18,
                isSettlement: true,
                isStore: true,
                isStaking: false,
            },
        },
    };

    return environment;
}

module.exports = { getEnvironment };

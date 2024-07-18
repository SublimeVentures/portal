const axios = require("axios");
const logger = require("../../src/lib/logger");
const { getDistinctChainsAndWallets } = require("../queries/payout.query");
const db = require("../services/db/definitions/db.init");

const PLATFORM = {
    1: "ethereum",
    56: "bnb",
    137: "polygon",
};

const getWalletInfo = async (chainId, wallet) => {
    return await axios
        .get(`https://api.coingecko.com/api/v3/coins/${PLATFORM[chainId]}/contract/${wallet}`, {
            headers: {
                "x-cg-demo-api-key": process.env.COINGECKO_DEMO_API_KEY,
            },
        })
        .then((response) => response.data);
};

async function updateATH() {
    try {
        if (!process.env.COINGECKO_DEMO_API_KEY) {
            new Error("COINGECKO_DEMO_API_KEY not found");
            return;
        }
        const results = await getDistinctChainsAndWallets();
        results.forEach(async ({ chainId, currency, offerIds }) => {
            const {
                market_data: {
                    ath: { usd },
                },
            } = await getWalletInfo(chainId, currency);
            await db.models.offer.update({ ath: usd }, { where: { id: offerIds } });
            logger.info("updateATH", { offerIds, ath: usd });
        });
    } catch (error) {
        logger.error("updateATH", error);
    }
}

module.exports = { updateATH };

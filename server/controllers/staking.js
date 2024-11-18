const moment = require("moment");
const { serializeError } = require("serialize-error");
const axios = require("axios");
const { getOfferWithLimits } = require("../queries/offers.query");
const { getEnv } = require("../services/env");
const {
    expireAllocation,
    investIncreaseAllocationReserved,
    investUpsertParticipantReservation,
} = require("../queries/invest.query");
const { fetchUpgradeUsed } = require("../queries/upgrade.query");
const { PremiumItemsENUM } = require("../../src/lib/enum/store");
const { BookingErrorsENUM } = require("../../src/lib/enum/invest");
const logger = require("../../src/lib/logger");
const { sumAmountForUserAndTenant } = require("../queries/participants.query");
const { phases } = require("../../src/lib/phases");
const { userInvestmentState } = require("../../src/lib/investment");
const db = require("../services/db/definitions/db.init");
const { authTokenName } = require("../../src/lib/authHelpers");
const { createHash } = require("./helpers");

async function stake(user, req) {
    try {
        const { data } = await axios.post(`${process.env.AUTHER}/staking/sign`);

        return { ok: true, ...data };
    } catch (error) {
        logger.error(`ERROR :: [reserveSpot]`, {
            reqQuery: req.query,
            user,
            error: serializeError(error),
        });

        return { ok: false };
    }
}

module.exports = { stake };

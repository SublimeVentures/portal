const { serializeError } = require("serialize-error");
const axios = require("axios");
const logger = require("../../src/lib/logger");
const { authTokenName } = require("../../src/lib/authHelpers");
const { getUserReferralClaim } = require("../queries/referralClaim.query");

async function signUserReferralClaim(user, req) {
    try {
        const claimId = Number(req.body.claimId);
        const isUserWallet = user.wallets.includes(req.body.wallet);

        if (claimId && isUserWallet) {
            const token = req.cookies[authTokenName];
            const signature = await axios.post(
                `${process.env.AUTHER}/referral-claim/sign`,
                {
                    claimId,
                    wallet: req.body.wallet,
                    token,
                },
                {
                    headers: {
                        "content-type": "application/json",
                    },
                },
            );

            if (!signature?.data?.ok) {
                throw new Error(signature?.data?.error);
            }

            return {
                ok: true,
                data: {
                    signature: signature.data.data,
                },
            };
        } else {
            throw Error("Wrong data");
        }
    } catch (error) {
        const err = serializeError(error);
        return { ok: false, error: error?.shortMessage || err?.message };
    }
}

async function userReferralClaim(user, req) {
    try {
        const { userId } = user;
        return await getUserReferralClaim(userId);
    } catch (error) {
        logger.error(`Can't fetch userReferralClaim`, {
            error: serializeError(error),
            params: req.params,
        });
        return [];
    }
}

module.exports = { signUserReferralClaim, userReferralClaim };
const { serializeError } = require("serialize-error");
const { authTokenName } = require("../../src/lib/authHelpers");
const { axiosAutherPublic } = require("../services/request/axios");

async function signUserClaim(user, req) {
    try {
        const claimId = Number(req.body.claimId);
        const isUserWallet = user.wallets.find((el) => el === req.body.wallet);

        if (claimId && isUserWallet) {
            const token = req.cookies[authTokenName];
            console.log("CHECK WHAT HAPPENS", `${process.env.AUTHER}/claim/sign`, {
                claimId,
                wallet: req.body.wallet,
                token,
            });
            const signature = await axiosAutherPublic.post("/claim/sign", {
                claimId,
                wallet: req.body.wallet,
                token,
            });
            console.log("signature", signature.data);

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
        // logger.error(`ERROR :: addWallet`, {err});
        return { ok: false, error: error?.shortMessage || err?.message };
    }
}

module.exports = { signUserClaim };

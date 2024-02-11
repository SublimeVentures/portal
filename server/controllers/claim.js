const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const axios = require("axios");
const {authTokenName} = require("../../src/lib/authHelpers");

async function signUserClaim(user, req) {
    try {
        const claimId = Number(req.body.claimId)
        const isUserWallet = user.wallets.find(el=> el=== req.body.wallet)

        if(claimId && isUserWallet) {
            const token = req.cookies[authTokenName]

            const signature = await axios.post(`${process.env.AUTHER}/claim/sign`, {
                claimId, wallet: req.body.wallet, token
            }, {
                headers: {
                    'content-type': 'application/json'
                }
            });
            console.log("signature", signature.data)

            if(!signature?.data?.ok){
                throw new Error(signature?.data?.error)
            }

            return {
                ok: true,
                data: {
                    signature: signature.data.data
                }
            }

        } else {
            throw Error("Wrong data")
        }
    } catch(error) {
        const err = serializeError(error)
        // logger.error(`ERROR :: addWallet`, {err});
        return {ok: false, error: error?.shortMessage || err?.message}
    }

}

module.exports = {signUserClaim}

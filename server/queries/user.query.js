const {models} = require('../services/db/db.init');
const logger = require("../services/logger");
const {serializeError} = require("serialize-error");

async function userWalletUpsert(wallet, acl) {
    try {
        await models.user.upsert({
            web3Wallet: wallet,
            acl
        }, {
            conflictFields: ['web3Wallet'],
            updateOnConflict: ['updatedAt']
        });

    } catch (error) {
        logger.error('QUERY :: [userWalletUpsert]', {error: serializeError(error)});
    }

}


module.exports = {userWalletUpsert}

const {models} = require('../services/db/db.init');
const logger = require("../../src/lib/logger");

const {serializeError} = require("serialize-error");

async function userWalletUpsert(wallet, acl) {
    try {
        const [user, created] = await models.user.findOrCreate({
            where: { web3Wallet: wallet },
            defaults: { web3Wallet: wallet, acl: acl }
        });

        if (!created && user.acl !== acl) {
            await user.update({
                acl: acl
            });
        }

        return user.get({ plain: true });
    } catch (error) {
        logger.error('QUERY :: [userWalletUpsert]', {error: serializeError(error), wallet, acl});
    }

}

module.exports = {userWalletUpsert}

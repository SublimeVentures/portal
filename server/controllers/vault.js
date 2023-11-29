const {getUserVault, getUserInvestment} = require("../queries/vaults.query");
const {getEnv} = require("../services/db");
const {fetchUpgrade} = require("../queries/upgrade.query");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");


async function userInvestment(user, req) {
    try {
        const {userId} = user

        const offerId = Number(req.query.offer)
        const [vault, upgrades] = await Promise.all([
            getUserInvestment(userId, offerId),
            fetchUpgrade(userId, offerId)
        ]);
        return {
            invested: vault?.invested ? vault.invested : 0,
            upgrades: upgrades
        }
    } catch (error) {
        logger.error('ERROR :: [userInvestment]', {error: serializeError(error), params: req.params, user});
        return {
            invested: 0,
            upgrades: {}
        }
    }

}

async function userVault(user) {
    const {userId, ACL} = user
    const vault = await getUserVault(userId, ACL)
    return {elements: vault, cdn: getEnv().cdn}
}



module.exports = {userInvestment, userVault}

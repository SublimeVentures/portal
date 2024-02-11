const db = require('../services/db/definitions/db.init');
const { QueryTypes} = require("sequelize");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");


const query_getPendingPayouts = `
        SELECT 
            c.id AS "claimId", 
            c."offerId", 
            c."amount", 
            c."isClaimed", 
            c."createdAt", 
            p."offerPayout" AS "payoutId", 
            p."totalAmount", 
            p."claimDate", 
            p."chainId", 
            p."currency", 
            p."precision",
            p."currencySymbol"
        FROM 
            claim c
        JOIN 
            payout p ON c."payoutId" = p.id
        WHERE 
            c."userId" = :userId AND
            c."offerId" = :offerId AND
            c."isClaimed" = false;
    `;
async function getUserPayout(userId, offerId) {

    try {
        return await db.query(query_getPendingPayouts, {
            type: QueryTypes.SELECT,
            replacements: { userId, offerId },
        });
    } catch (error) {
        logger.error('QUERY :: [getUserPayout]', {error: serializeError(error), userId});
        return [];
    }
}



module.exports = { getUserPayout}

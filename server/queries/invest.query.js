const {models} = require('../services/db/definitions/db.init');
const db = require('../services/db/definitions/db.init');
const {Op, QueryTypes} = require("sequelize");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");

async function getOfferRaise(id) {
    try {
        return await models.offerFundraise.findOne({
            where: {offerId: id}
        })
    } catch (error) {
        logger.error(`QUERY :: [getOfferRaise] for ${id} `, {
            error: serializeError(error),
        });
    }
    return {}
}

async function investIncreaseAllocationReserved(offer, wantedAllocation, upgradeGuaranteed, transaction) {
    let effectiveAllocationReserved
    let sumFilter = ` COALESCE("alloRes",0) + COALESCE("alloFilled",0) + COALESCE("alloGuaranteed",0) + COALESCE("alloFilledInjected",0) + COALESCE("alloGuaranteedInjected",0)`

    if (upgradeGuaranteed?.isExpired === false) {
        const guaranteedAllocationLeft = upgradeGuaranteed.alloMax - upgradeGuaranteed.alloUsed
        let alloGuaranteed;

        if (wantedAllocation - guaranteedAllocationLeft > 0) {
            effectiveAllocationReserved = wantedAllocation - guaranteedAllocationLeft
            alloGuaranteed = guaranteedAllocationLeft
        } else {
            effectiveAllocationReserved = 0
            alloGuaranteed = wantedAllocation
        }

        sumFilter += ` + ${effectiveAllocationReserved} - ${alloGuaranteed} <= ${offer.alloTotal}`
    } else {
        effectiveAllocationReserved = wantedAllocation
        sumFilter += ` + ${wantedAllocation} <= ${offer.alloTotal}`
    }


    const updateQuery = `
        UPDATE "offerFundraise"
        SET "alloRes" = "alloRes" + ${effectiveAllocationReserved}
        WHERE "offerId" = ${offer.id}
          AND ${sumFilter}
            RETURNING *;
    `;

    const result = await db.query(updateQuery, {
        type: QueryTypes.UPDATE,
        transaction
    });

    console.log("investIncreaseAllocationReserved",result, updateQuery)

    return {
        ok: result[0].length ===1,
        data: result[0][0]
    }
}


async function investUpsertParticipantReservation(offer, userId, partnerId, tenantId, amount, hash, upgradeGuaranteed, transaction) {
    const participantsQuery = `
            INSERT INTO public.z_participant_${offer.id} ("userId", "partnerId", "tenantId", "amount", "hash", "isGuaranteed", "createdAt", "updatedAt")
            VALUES (:userId, :partnerId, :tenantId, :amount, :hash, :isGuaranteed, NOW(), NOW())
            ON CONFLICT ("userId", "hash") DO
            UPDATE SET amount = EXCLUDED.amount, "updatedAt" = NOW()
            RETURNING *;
        `;

    // Execute the query using a raw query execution
    const result = await db.query(participantsQuery, {
        replacements: {
            userId, partnerId, tenantId, amount, hash,
            isGuaranteed: upgradeGuaranteed?.isExpired === false
        },
        type: QueryTypes.RAW,
        transaction
    });


    if(result[1] !== 1) return {
        ok:false
    }

    return {
        ok: result[1],
        data: result[0][0]
    }
}


async function expireAllocation(offerId, userId, hash) {
    try {
        const participantsQuery = `
            UPDATE public.z_participant_${offerId}
            SET "isExpired" = true,
                "updatedAt" = now()
            WHERE "userId" = :userId
              AND "hash" = :hash
              AND "onchainId" is null;
        `;

        return await db.query(participantsQuery, {
            replacements: {
                userId,
                hash
            },
            type: QueryTypes.UPDATE
        });
    } catch (e) {
        logger.error(`ERROR :: [expireAllocation] for ${offerId} `, {
            offerId, userId, hash
        });
    }
    return true
}

async function expireAllocationAll(offerId, userId, tenantId) {
    try {
        const participantsQuery = `
            UPDATE public.z_participant_${offerId}
            SET "isExpired" = true,
                "updatedAt" = now()
            WHERE "userId" = :userId
              AND "tenantId" = :tenantId
              AND "onchainId" is null
              AND "isConfirmedInitial" = false;
        `;

        return await db.query(participantsQuery, {
            replacements: {
                userId,
                tenantId
            },
            type: QueryTypes.UPDATE
        });
    } catch (e) {
        logger.error(`ERROR :: [expireAllocationAll] for ${offerId} `, {
            offerId, userId, tenantId
        });
    }
    return true
}


async function bookAllocationGuaranteed(offerId, amount, totalAllocation, transaction) {
    let sumFilter = `"offerId" = ${offerId} AND COALESCE("alloRes",0) + COALESCE("alloFilled",0) + COALESCE("alloGuaranteed",0) + COALESCE("alloFilledInjected",0) + COALESCE("alloGuaranteedInjected",0) + ${amount} <= ${totalAllocation}`


    const booked = await models.offerFundraise.increment({alloGuaranteed: amount}, {
        where: {
            [Op.and]: [
                db.literal(sumFilter)
            ]
        },
        transaction
    });


    return {
        ok: booked[0][1],
    }
}


module.exports = {
    getOfferRaise,
    bookAllocationGuaranteed,
    expireAllocation,
    expireAllocationAll,
    investIncreaseAllocationReserved,
    investUpsertParticipantReservation
}

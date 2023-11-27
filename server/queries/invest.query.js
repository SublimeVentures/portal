const {models} = require('../services/db/db.init');
const db = require('../services/db/db.init');
const {Op, QueryTypes} = require("sequelize");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const {PhaseId} = require("../../src/lib/phases");


async function getOfferRaise(id) {
    try {
        return await models.offerFundraise.findOne({
            where: {offerId: id},
            include: {
                attributes: ['id', 'alloTotalPartner'],
                model: models.offer
            }
        })
    } catch (error) {
        logger.error(`QUERY :: [getOfferRaise] for ${id} `, {
            error: serializeError(error),
        });
    }
    return {}
}

async function bookAllocation(offerId, isSeparatePool, totalAllocation, userId, hash, amount, upgradeGuaranteed, phase) {
    let transaction, sumFilter, variable, increaseBooking, participantsQuery, alloBase, alloGuaranteed;

    if (isSeparatePool) {
        variable = "alloResPartner"
        sumFilter = `"offerId" = ${offerId} AND COALESCE("alloResPartner",0) + COALESCE("alloFilledPartner",0) + COALESCE("alloSidePartner",0) + COALESCE("alloGuaranteed",0)`
    } else {
        variable = "alloRes"
        sumFilter = `"offerId" = ${offerId} AND COALESCE("alloRes",0) + COALESCE("alloFilled",0) + COALESCE("alloSide",0) + COALESCE("alloGuaranteed",0)`
    }

    try {
        transaction = await db.transaction();
        const shouldAccountForGuaranteed = upgradeGuaranteed && phase === PhaseId.FCFS
        console.log("phase", phase, PhaseId.FCFS)
        if (shouldAccountForGuaranteed) {
            const guaranteedAllocationLeft = upgradeGuaranteed.alloMax - upgradeGuaranteed.alloUsed

            if (amount - guaranteedAllocationLeft > 0) {
                alloBase = amount - guaranteedAllocationLeft
                alloGuaranteed = guaranteedAllocationLeft
                logger.error(`[bookAllocation] - [GUARANTEED] - shouldn't happen`, {
                    alloBase,
                    alloGuaranteed,
                    offerId,
                    isSeparatePool,
                    totalAllocation,
                    userId,
                    hash,
                    amount,
                    upgradeGuaranteed
                });
            } else {
                alloBase = 0
                alloGuaranteed = amount
            }

            sumFilter += ` + ${alloBase} - ${alloGuaranteed} <= ${totalAllocation}`

            participantsQuery = `
                INSERT INTO public.z_participant_${offerId} ("userId", "amount", "hash", "isGuaranteed", "createdAt", "updatedAt")
                VALUES (${userId}, ${amount}, '${hash}', true, 'now()', 'now()') on conflict("userId", "hash") do
                update set amount=EXCLUDED.amount, "updatedAt"=EXCLUDED."updatedAt";
            `
        } else {
            sumFilter += ` + ${amount} <= ${totalAllocation}`

            participantsQuery = `
                INSERT INTO public.z_participant_${offerId} ("userId", "amount", "hash", "createdAt", "updatedAt")
                VALUES (${userId}, ${amount}, '${hash}', 'now()', 'now()') on conflict("userId", "hash") do
                update set amount=EXCLUDED.amount, "updatedAt"=EXCLUDED."updatedAt";
            `
        }

        console.log("booked")
        //INCREASE RESERVED
        increaseBooking = await models.offerFundraise.increment({[variable]: shouldAccountForGuaranteed ? alloBase : amount}, {
            where: {
                [Op.and]: [
                    db.literal(sumFilter)
                ]
            },
            transaction
        });


        if (!increaseBooking[0][1]) {
            await transaction.rollback();
            logger.info(`[bookAllocation] - reservation failed for Offer ${offerId} - overbooking`, {
                participantsQuery,
                sumFilter,
                increaseBooking,
                offerId,
                isSeparatePool,
                totalAllocation,
                userId,
                hash,
                amount,
                upgradeGuaranteed
            });
            return false;
        }

        await db.query(participantsQuery, {
            type: QueryTypes.UPSERT,
            transaction
        });

        await transaction.commit();
        return true;
    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        logger.error(`QUERY :: [bookAllocation] for ${offerId} `, {
            error: serializeError(error),
            offerId, isSeparatePool, totalAllocation, userId, hash, amount, upgradeGuaranteed,
            variable, sumFilter
        });
        return false
    }
}


async function bookAllocationGuaranteed(offerId, amount, totalAllocation, isSeparatePool, transaction) {

    let sumFilter
    if (isSeparatePool) {
        sumFilter = `"offerId" = ${offerId} AND COALESCE("alloResPartner",0) + COALESCE("alloFilledPartner",0) + COALESCE("alloSidePartner",0) + COALESCE("alloGuaranteed",0) + ${amount} <= ${totalAllocation}`
    } else {
        sumFilter = `"offerId" = ${offerId} AND COALESCE("alloRes",0) + COALESCE("alloFilled",0) + COALESCE("alloSide",0) + COALESCE("alloGuaranteed",0) + ${amount} <= ${totalAllocation}`
    }

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

async function expireAllocation(offerId, userId, hash) {
    try {
        const participantsQuery = `
            UPDATE public.z_participant_${offerId}
            SET "isExpired" = true,
                "updatedAt" = now()
            WHERE "userId" = :userId
              AND "hash" = :hash;
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


module.exports = {getOfferRaise, bookAllocation, bookAllocationGuaranteed, expireAllocation}

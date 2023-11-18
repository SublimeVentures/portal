const {models} = require('../services/db/db.init');
const db = require('../services/db/db.init');
const {Op, QueryTypes} = require("sequelize");
const Sentry = require("@sentry/nextjs");
const {ACLs} = require("../../src/lib/authHelpers");
const {UPGRADE_ERRORS} = require("../enum/UpgradeErrors");
const {getOfferById} = require("./offers.query");
const {PremiumItemsParamENUM, PremiumItemsENUM} = require("../../src/lib/enum/store");
const logger = require("../services/logger");
const {serializeError} = require("serialize-error");
const {increaseGuaranteedAllocationUsed} = require("./upgrade.query");


async function getOfferRaise(id) {
    try {
        return await models.offerFundraise.findOne({
            where: {offerId: id},
            include: {
                attributes: ['id', 'alloTotalPartner'],
                model: models.offer
            }
        })
    } catch (e) {
        Sentry.captureException({location: "getOfferRaise", type: 'query', e});
    }
    return {}
}

async function bookAllocation(offerId, isSeparatePool, totalAllocation, userId, hash, amount, upgradeGuaranteed) {
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

        if (upgradeGuaranteed) {
            const guaranteedAllocationLeft = upgradeGuaranteed.alloMax - upgradeGuaranteed.alloUsed

            if (amount - guaranteedAllocationLeft > 0) {
                alloBase = amount - guaranteedAllocationLeft
                alloGuaranteed = guaranteedAllocationLeft
            } else {
                alloBase = 0
                alloGuaranteed = amount
            }

            sumFilter += ` + ${alloBase} - ${alloGuaranteed} <= ${totalAllocation}`

            participantsQuery = `
                INSERT INTO public.z_participant_${offerId} ("userId", "amount", "hash", "isGuaranteed", "createdAt", "updatedAt")
                VALUES ('${userId}', ${amount}, '${hash}', true, 'now()', 'now()') on conflict("userId", "hash") do
                update set amount=EXCLUDED.amount, "updatedAt"=EXCLUDED."updatedAt";
            `
        } else {
            sumFilter += ` + ${amount} <= ${totalAllocation}`

            participantsQuery = `
                INSERT INTO public.z_participant_${offerId} ("userId", "amount", "hash", "createdAt", "updatedAt")
                VALUES ('${userId}', ${amount}, '${hash}', 'now()', 'now()') on conflict("userId", "hash") do
                update set amount=EXCLUDED.amount, "updatedAt"=EXCLUDED."updatedAt";
            `
        }

        increaseBooking = await models.offerFundraise.increment({[variable]: upgradeGuaranteed ? alloBase : amount}, {
            where: {
                [Op.and]: [
                    db.literal(sumFilter)
                ]
            },
            transaction
        });


        if (!increaseBooking[0][1]) {
            await transaction.rollback();
            logger.info(`[bookAllocation] - reservation failed for Offer ${offerId} - overbooking`, {participantsQuery, sumFilter, increaseBooking, offerId, isSeparatePool, totalAllocation, userId, hash, amount,  upgradeGuaranteed});
            return false;
        }

        if (upgradeGuaranteed) {
            await increaseGuaranteedAllocationUsed(offerId, userId, alloGuaranteed, transaction)
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
        logger.error(`ERROR :: [bookAllocation] for ${offerId} `, {
            error: serializeError(error),
            offerId, isSeparatePool, totalAllocation, userId, hash, amount,  upgradeGuaranteed,
            variable, sumFilter
        });
        return false
    }
}

async function bookAllocationGuaranteed(transaction, offerId, userId, tokenId, acl, multi, upgradeIncreased) {
    const offer = await getOfferById(offerId)
    const increasedAllocations = upgradeIncreased * PremiumItemsParamENUM.Increased
    const isSeparatePool = offer.alloTotalPartner > 0 && acl !== ACLs.Whale;
    const totalAllocation = isSeparatePool ? offer.alloTotalPartner : offer.alloTotal;
    const partnerAllo = multi * offer.alloMin + (increasedAllocations ? increasedAllocations : 0);
    const amount = acl === ACLs.Whale ? PremiumItemsParamENUM.Guaranteed : ((partnerAllo < PremiumItemsParamENUM.Guaranteed ? partnerAllo : PremiumItemsParamENUM.Guaranteed) * (100 - offer.tax) / 100)
    let sumFilter
    if (isSeparatePool) {
        sumFilter = `"offerId" = ${offerId} AND COALESCE("alloResPartner",0) + COALESCE("alloFilledPartner",0) + COALESCE("alloSidePartner",0) + COALESCE("alloGuaranteed",0) + ${amount} <= ${totalAllocation}`
    } else {
        sumFilter = `"offerId" = ${offerId} AND COALESCE("alloRes",0) + COALESCE("alloFilled",0) + COALESCE("alloSide",0) + COALESCE("alloGuaranteed",0) + ${amount} <= ${totalAllocation}`
    }

    try {
        const booked = await models.raises.increment({alloGuaranteed: amount}, {
            where: {
                [Op.and]: [
                    db.literal(sumFilter)
                ]
            },transaction
        });

        if (!booked[0][1]) {
            return {
                ok: false,
                error: UPGRADE_ERRORS.NotEnoughAllocation
            }
        }

        return {
            ok: true,
            alloMax: amount
        }

    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        console.log("bookAllocationGuaranteed", error)
        Sentry.captureException({
            location: "bookAllocationGuaranteed",
            error,
            data: {offerId,}
        });
        return {
            ok: false,
            error: UPGRADE_ERRORS.UnexpectedGuaranteed
        }
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

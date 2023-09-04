const {models} = require('../services/db/db.init');
const db = require('../services/db/db.init');
const {Op, QueryTypes} = require("sequelize");
const Sentry = require("@sentry/nextjs");
const {ACLs} = require("../../src/lib/authHelpers");
const {UPGRADE_ERRORS} = require("../enum/UpgradeErrors");
const {getOfferById} = require("./offers.query");
const {PremiumItemsParamENUM, PremiumItemsENUM} = require("../../src/lib/premiumHelper");


async function getOfferRaise(id) {
    try {
        return models.raises.findOne({
            where: {offerId: id},
            include: {
                attributes: ['id', 'alloTotalPartner'],
                model: models.offers
            }
        })
    } catch (e) {
        Sentry.captureException({location: "getOfferRaise", type: 'query', e});
    }
    return {}
}


async function bookAllocation(offerId, isSeparatePool, totalAllocation, address, hash, amount, acl, tokenId, upgradeGuaranteed) {
    let transaction, sumFilter, variable, increaseBooking, participantsQuery, alloBase, alloGuaranteed;
    const date = new Date().toISOString();

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
                INSERT INTO public.participants_${offerId} ("address", "nftId", "amount", "acl", "hash", "isGuaranteed", "createdAt", "updatedAt")
                VALUES ('${address}', ${tokenId}, ${amount}, ${acl}, '${hash}', true, '${date}', '${date}
                        ') on conflict("address", "hash") do
                update set amount=EXCLUDED.amount, "acl"=EXCLUDED."acl", "nftId"=EXCLUDED."nftId", "updatedAt"=EXCLUDED."updatedAt";
            `
        } else {
            sumFilter += ` + ${amount} <= ${totalAllocation}`

            participantsQuery = `
                INSERT INTO public.participants_${offerId} ("address", "nftId", "amount", "acl", "hash", "createdAt", "updatedAt")
                VALUES ('${address}', ${tokenId}, ${amount}, ${acl}, '${hash}', '${date}', '${date}
                        ') on conflict("address", "hash") do
                update set amount=EXCLUDED.amount, "acl"=EXCLUDED."acl", "nftId"=EXCLUDED."nftId", "updatedAt"=EXCLUDED."updatedAt";
            `
        }

        increaseBooking = await models.raises.increment({[variable]: upgradeGuaranteed ? alloBase : amount}, {
            where: {
                [Op.and]: [
                    db.literal(sumFilter)
                ]
            }
        }, {transaction});


        if (!increaseBooking[0][1]) {
            await transaction.rollback();
            return false;
        }

        if (upgradeGuaranteed) {
            await models.upgrade.increment({alloUsed: alloGuaranteed}, {
                where: {
                   offerId:offerId,
                   storeId: PremiumItemsENUM.Guaranteed,
                   owner: address,
                }
            }, {transaction});
        }

        await db.query(participantsQuery, {
            type: QueryTypes.UPSERT,
            model: models.participants,
            transaction,
        });

        await transaction.commit();
        return true;
    } catch (e) {
        if (transaction) {
            await transaction.rollback();
        }
        console.log("bookAllocation", error)
        Sentry.captureException({
            location: "bookAllocation",
            error,
            data: {offerId, isSeparatePool, totalAllocation, address, hash, amount, acl, tokenId}
        });
        return false
    }

}

async function bookAllocationGuaranteed(transaction, offerId, address, tokenId, acl, multi, upgradeIncreased) {
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
            }
        }, {transaction});

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

async function expireAllocation(offerId, address, hash) {
    try {
        const participants = `
            UPDATE public.participants_${offerId}
            SET "isExpired"= true,
                "updatedAt"='${new Date().toISOString()}'
            WHERE "address" = '${address}'
              AND "hash" = '${hash}';
        `

        await db.query(participants, {
            model: models.participants,
        });
    } catch (e) {
        Sentry.captureException({location: "expireAllocation", type: 'query', e});
    }
    return true
}


module.exports = {getOfferRaise, bookAllocation, bookAllocationGuaranteed, expireAllocation}

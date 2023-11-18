const Sentry = require("@sentry/nextjs");
const {models} = require('../services/db/db.init');
const db = require("../services/db/db.init");
const {Op, QueryTypes} = require("sequelize");
const {PremiumItemsENUM, PremiumItemsParamENUM} = require("../../src/lib/enum/store");
const {bookAllocationGuaranteed} = require("./invest.query");
const {UPGRADE_ERRORS} = require("../enum/UpgradeErrors");

async function saveUpgrade(transaction, upgradeId, offerId, owner, alloMax){

    const query = `
        INSERT INTO public."upgrade" ("owner", "amount", "createdAt", "updatedAt", "storeId", "offerId", "alloMax")
        VALUES ('${owner}', 1, now(), now(), ${upgradeId}, ${offerId}, ${alloMax ? alloMax : 0}) on conflict("owner", "storeId", "offerId") do
        update set "amount"=(SELECT amount from public."upgrade" WHERE "owner" = EXCLUDED.owner AND "storeId" = EXCLUDED."storeId" AND "offerId" = EXCLUDED."offerId") + EXCLUDED.amount, "updatedAt"=now();
    `

    const upsert = await db.query(query, {type: QueryTypes.UPSERT, transaction})
    if(upsert[0] === undefined && upsert[1] === null) {
        return {ok: true}
    } else {
        await transaction.rollback();
        Sentry.captureException({location: "saveUpgrade", type: 'transaction', owner});
        return {
            ok: false,
            error: UPGRADE_ERRORS.ErrorSavingUse
        }
    }

}


async function processUseUpgrade(owner, offerId, upgradeId, userTokenId, userACL, userMulti) {

    let transaction, alloMax;
    try {
        transaction = await db.transaction();
        const isUserOwnsUpgrade = await models.storeUser.findOne({
            where: {
                owner,
                storeId: upgradeId,
                amount: {
                    [Op.gt]: 0
                }
            },
            raw: true
        }, { transaction })

        if(!isUserOwnsUpgrade) {
            await transaction.rollback();
            return {
                ok: false,
                error: UPGRADE_ERRORS.NoUpgrade
            }
        }

        if(upgradeId === PremiumItemsENUM.Guaranteed) {
            const upgrades = await models.upgrade.findAll({
                where: {
                    owner,
                    offerId: offerId
                },
                raw: true
            }, { transaction })

            const upgradeGuaranteed = upgrades.find(el=>el.storeId === PremiumItemsENUM.Guaranteed)?.amount
            const upgradeIncreased = upgrades.find(el=>el.storeId === PremiumItemsENUM.Increased)?.amount

            if(upgradeGuaranteed) {
                await transaction.rollback();
                return {
                    ok: false,
                    error: UPGRADE_ERRORS.GuaranteedUsed
                }
            }

            const bookAllocation = await bookAllocationGuaranteed(
                offerId,
                owner,
                userACL,
                userMulti,
                upgradeIncreased,
                transaction
        )
            if(!bookAllocation.ok) {
                await transaction.rollback();
                return bookAllocation
            }
            alloMax = bookAllocation.alloMax
        }

        const save = await saveUpgrade(transaction, upgradeId, offerId, owner, alloMax)
        if(!save.ok) {
            return save
        }

        const deduct = await models.storeUser.increment({amount: -1}, { where: { owner, storeId: upgradeId }, raw:true, transaction })
        if(deduct[0][1] !== 1) {
            await transaction.rollback();
            return {
                ok: false,
                error: UPGRADE_ERRORS.Deduction
            }
        }

        await transaction.commit();
        return {
            ok: true
        }

    } catch (e) {
        if(transaction) {
           await transaction.rollback();
        }
        Sentry.captureException({location: "processUseUpgrade", type: 'catch error', owner, e});
        console.log("e",e)
        return {
            ok: false,
            error: UPGRADE_ERRORS.Unexpected
        }
    }

}


async function fetchUpgrade (userId, offerId) {
    return await models.upgrade.findAll({
        attributes: ['amount', 'storeId', 'alloUsed', 'alloMax', 'isExpired'],
        where: {
            userId,
            offerId,
            amount: {
                [Op.gt]: 0
            }
        },
        raw: true
    })
}

//todo: from invest.query
async function increaseGuaranteedAllocationUsed(offerId, userId, amount, transaction) {
    return await models.upgrade.increment({alloUsed: amount}, {
        where: {
            offerId,
            storeId: PremiumItemsENUM.Guaranteed,
            owner: address,
        },
        transaction
    });
}


module.exports = {processUseUpgrade, fetchUpgrade, increaseGuaranteedAllocationUsed}

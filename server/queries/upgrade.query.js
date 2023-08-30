const Sentry = require("@sentry/nextjs");
const {models} = require('../services/db/db.init');
const db = require("../services/db/db.init");
const {Op, Sequelize, QueryTypes} = require("sequelize");
const { MYSTERY_TYPES} = require("../../src/lib/premiumHelper");
const {PremiumItemsENUM} = require("../../src/lib/premiumHelper");

const UPGRADE_ERRORS = {
    NoUpgrade: "Upgrade not detected",
    Deduction:"Deduction error",
    Unexpected: "Unexpected error",
    GuaranteedUsed: "This upgrade can be used only once!",
    ErrorSavingUse: "Couldn't save Upgrade",

}

async function saveUpgrade(transaction, upgradeId, offerId, owner){

    const query = `
        INSERT INTO public."upgrade" ("owner", "amount", "createdAt", "updatedAt", "storeId", "offerId")
        VALUES ('${owner}', 1, now(), now(), ${upgradeId}, ${offerId}) on conflict("owner", "storeId", "offerId") do
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

async function processUseUpgrade(owner, offerId, upgradeId) {
    let transaction;
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
            const isGuaranteedUsed = await models.upgrade.findOne({
                where: {
                    owner,
                    storeId: upgradeId,
                    offerId: offerId,
                    amount: {
                        [Op.gt]: 0
                    }
                },
                raw: true
            }, { transaction })


            if(isGuaranteedUsed) {
                await transaction.rollback();
                return {
                    ok: false,
                    error: UPGRADE_ERRORS.GuaranteedUsed
                }
            }
        }

        const save = await saveUpgrade(transaction, upgradeId, offerId, owner)
        if(!save.ok) {
            return save
        }


        const deduct = await models.storeUser.increment({amount: -1}, { where: { owner, storeId: upgradeId }, raw:true }, { transaction })
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
        return {
            ok: false,
            error: UPGRADE_ERRORS.Unexpected
        }
    }

}


async function fetchUpgrade (owner, offerId) {
    return await models.upgrade.findAll({
        attributes: ['amount', 'storeId'],
        where: {
            owner,
            offerId: offerId,
            amount: {
                [Op.gt]: 0
            }
        },
        raw: true
    })
}


module.exports = {processUseUpgrade, fetchUpgrade}

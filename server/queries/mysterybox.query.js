const {models} = require('../services/db/db.init');
const db = require("../services/db/db.init");
const {Op, Sequelize, QueryTypes} = require("sequelize");
const {MYSTERYBOX_CLAIM_ERRORS} = require("../../src/lib/enum/store");


async function processMBAllocation(transaction, claim, userId) {
    const query = `
        INSERT INTO public.vault ("userId", "invested", "offerId", "createdAt", "updatedAt")
        VALUES (${userId}, ${claim.amount}, ${claim.offerId}, now(), now()) on conflict("userId", "offerId") do
        update set "invested"=(SELECT invested from vault WHERE "userId" = EXCLUDED."userId" AND "offerId" = EXCLUDED."offerId") + EXCLUDED.invested, "updatedAt"=now();
    `

    const upsert = await db.query(query, {type: QueryTypes.UPSERT, transaction})
    if (upsert[0] === undefined && upsert[1] === null) {
        return {
            ok: true,
            data: upsert
        }
    } else {
        await transaction.rollback();
        return {
            ok: false,
            error: MYSTERYBOX_CLAIM_ERRORS.AllocationAssignment
        }
    }
}


async function processMBUpgrade(transaction, claim, userId) {
    const query = `
        INSERT INTO public."storeUser" ("userId", "amount", "createdAt", "updatedAt", "storeId")
        VALUES (${userId}, 1, now(), now(), ${claim.upgradeId}) on conflict("userId", "storeId") do
        update set "amount"=(SELECT amount from public."storeUser" WHERE "userId" = EXCLUDED."userId" AND "storeId" = EXCLUDED."storeId") + EXCLUDED.amount, "updatedAt"=now();
    `

    const upsert = await db.query(query, {type: QueryTypes.UPSERT, transaction})
    if (upsert[0] === undefined && upsert[1] === null) {
        return {
            ok: true,
            data: upsert
        }
    } else {
        await transaction.rollback();
        return {
            ok: false,
            error: MYSTERYBOX_CLAIM_ERRORS.UpgradeAssignment
        }
    }
}


async function pickMysteryBox(transaction) {
    const rolledMysterybox = await models.storeMysterybox.findOne({
        where: {
            claimedBy: {
                [Op.eq]: null
            }
        },
        order: [
            Sequelize.fn('random'),
        ],
        raw: true
    }, {transaction});

    if (!rolledMysterybox) {
        await transaction.rollback();
        return {
            ok: false,
            error: MYSTERYBOX_CLAIM_ERRORS.NotEnoughBoxes
        }
    }
    return {
        ok: true,
        data: rolledMysterybox
    }
}


async function assignMysteryBox(userId, mbId, transaction) {
    const assignClaim = await models.storeMysterybox.update(
        {
            userId
        },
        {
            where: {
                id: mbId
            }
        }, {transaction}
    )

    if (!assignClaim) {
        await transaction.rollback();
        return {
            ok: false,
            error: MYSTERYBOX_CLAIM_ERRORS.AssignBox
        }
    }
    return {
        ok: true,
        data: assignClaim
    }
}


module.exports = {pickMysteryBox, assignMysteryBox, processMBAllocation, processMBUpgrade}

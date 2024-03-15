const { models } = require("../services/db/definitions/db.init");
const db = require("../services/db/definitions/db.init");
const { Op, Sequelize, QueryTypes } = require("sequelize");
const {
    MYSTERYBOX_CLAIM_ERRORS,
    PremiumItemsENUM,
} = require("../../src/lib/enum/store");

async function pickMysteryBox(tenantId, transaction) {
    const rolledMysterybox = await models.storeMysterybox.findOne({
        where: {
            userId: {
                [Op.eq]: null,
            },
            tenantId,
        },
        order: [Sequelize.fn("random")],
        raw: true,
        transaction,
    });

    if (!rolledMysterybox) {
        return {
            ok: false,
        };
    }
    return {
        ok: true,
        data: rolledMysterybox,
    };
}

async function assignMysteryBox(userId, mbId, transaction) {
    const assignClaim = await models.storeMysterybox.update(
        {
            userId,
        },
        {
            where: {
                id: mbId,
            },
        },
        { transaction },
    );

    if (!assignClaim) {
        return {
            ok: false,
        };
    }
    return {
        ok: true,
        data: assignClaim,
    };
}

//todo: to be tested

async function processMBAllocation(transaction, claim, userId) {
    const query = `
        INSERT INTO public.vault ("userId", "invested", "offerId", "createdAt", "updatedAt")
        VALUES (${userId}, ${claim.amount}, ${claim.offerId}, now(), now())
            ON CONFLICT ("userId", "offerId") DO
        UPDATE SET "invested" = vault."invested" + EXCLUDED.invested, "updatedAt" = now();

    `;

    const upsert = await db.query(query, {
        type: QueryTypes.UPSERT,
        transaction,
    });

    if (upsert[0] === undefined && upsert[1] === null) {
        return {
            ok: true,
            data: upsert,
        };
    } else {
        return {
            ok: false,
            error: MYSTERYBOX_CLAIM_ERRORS.AllocationAssignment,
        };
    }
}

async function processMBUpgrade(transaction, claim, userId) {
    const query = `
        INSERT INTO public."storeUser" ("userId", "amount", "createdAt", "updatedAt", "storePartnerId")
        VALUES (${userId}, 1, now(), now(), ${claim.storePartnerId})
            ON CONFLICT ("userId", "storePartnerId") DO
        UPDATE SET "amount" = "storeUser"."amount" + EXCLUDED.amount, "updatedAt" = now();

    `;

    const upsert = await db.query(query, {
        type: QueryTypes.UPSERT,
        transaction,
    });
    if (upsert[0] === undefined && upsert[1] === null) {
        return {
            ok: true,
            data: upsert,
        };
    } else {
        return {
            ok: false,
            error: MYSTERYBOX_CLAIM_ERRORS.UpgradeAssignment,
        };
    }
}

module.exports = {
    pickMysteryBox,
    assignMysteryBox,
    processMBAllocation,
    processMBUpgrade,
};

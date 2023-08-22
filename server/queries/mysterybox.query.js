const Sentry = require("@sentry/nextjs");
const {models} = require('../services/db/db.init');
const db = require("../services/db/db.init");
const {Op, Sequelize, QueryTypes} = require("sequelize");
const {PremiumItemsENUM, MYSTERY_TYPES} = require("../../src/lib/premiumHelper");

const CLAIM_ERRORS = {
    Unexpected: "Unexpected error",
    AllocationAssignment: "Allocation assignment error",
    UpgradeAssignment: "Upgrade assignment error",
    UserNoBoxes: "User don't own MysteryBoxes",
    NotEnoughBoxes:"Not enough MysteryBoxes available",
    AssignBox:"Couldn't assign MysteryBox",
    Deduction:"Deduction error",
}

async function processMysterybox(transaction, claim, owner) {
    switch(claim.type) {
        case MYSTERY_TYPES.Allocation: {
            return await processAllocation(transaction, claim, owner)
        }
        case MYSTERY_TYPES.Upgrade: {
            return await processUpgrade(transaction, claim, owner)
        }
        case MYSTERY_TYPES.Discount: {
            return true
        }
        case MYSTERY_TYPES.NFT: {
            return true
        }
    }
}

async function processAllocation(transaction, claim, owner){
    const query = `
        INSERT INTO public.vaults ("owner", "invested", "offerId", "createdAt", "updatedAt")
        VALUES ('${owner}', ${claim.amount}, ${claim.offerId}, now(), now()) on conflict("owner", "offerId") do
        update set "invested"=(SELECT invested from vaults WHERE "owner" = EXCLUDED.owner AND "offerId" = EXCLUDED."offerId") + EXCLUDED.invested, "updatedAt"=now();
    `

    const upsert = await db.query(query, {type: QueryTypes.UPSERT, transaction})
    if(upsert[0] === undefined && upsert[1] === null) {
        return true
    } else {
        await transaction.rollback();
        Sentry.captureException({location: "processAllocation", type: 'transaction', owner, claim});
        return {
            ok: false,
            error: CLAIM_ERRORS.AllocationAssignment
        }
    }


}


async function processUpgrade(transaction, claim, owner){

    const query = `
        INSERT INTO public."storeUser" ("owner", "amount", "createdAt", "updatedAt", "storeId")
        VALUES ('${owner}', 1, now(), now(), ${claim.upgradeId}) on conflict("owner", "storeId") do
        update set "amount"=(SELECT amount from public."storeUser" WHERE "owner" = EXCLUDED.owner AND "storeId" = EXCLUDED."storeId") + EXCLUDED.amount, "updatedAt"=now();
    `

    const upsert = await db.query(query, {type: QueryTypes.UPSERT, transaction})
    if(upsert[0] === undefined && upsert[1] === null) {
        return true
    } else {
        await transaction.rollback();
        Sentry.captureException({location: "claimMysterybox", type: 'transaction', owner});
        return {
            ok: false,
            error: CLAIM_ERRORS.UpgradeAssignment
        }
    }
}

async function claimMysterybox(owner) {
    let transaction;
    try {
        transaction = await db.transaction();
        const isUserOwnMysterybox = await models.storeUser.findOne({
            where: {
                owner,
                storeId: PremiumItemsENUM.Mysterybox,
                amount: {
                    [Op.gt]: 0
                }
            },
            raw: true
        }, { transaction })

        if(!isUserOwnMysterybox) {
            await transaction.rollback();
            Sentry.captureException({location: "claimMysterybox", type: 'transaction', owner});
            return {
                ok: false,
                error: CLAIM_ERRORS.UserNoBoxes
            }
        }

        const rolledMysterybox = await models.storeMysterybox.findOne({
            where: {
                claimedBy: {
                    [Op.eq]: null
                }
            },
            order: [
                Sequelize.fn( 'random' ),
            ],
            raw: true
        }, { transaction });

        if(!rolledMysterybox) {
            await transaction.rollback();
            Sentry.captureException({location: "claimMysterybox", type: 'transaction', owner});
            return {
                ok: false,
                error: CLAIM_ERRORS.NotEnoughBoxes
            }
        }

        const assignClaim = await models.storeMysterybox.update(
            {
                claimedBy: owner
            },
            {
                where: {
                    id: rolledMysterybox.id
                }
            }, { transaction }
        )

        if(!assignClaim) {
            await transaction.rollback();
            Sentry.captureException({location: "claimMysterybox", type: 'transaction', owner});
            return {
                ok: false,
                error: CLAIM_ERRORS.AssignBox
            }
        }


        const deduct = await models.storeUser.increment({amount: -1}, { where: { owner, storeId: PremiumItemsENUM.Mysterybox }, raw:true }, { transaction })
        if(deduct[0][1] !== 1) {
            await transaction.rollback();
            Sentry.captureException({location: "claimMysterybox", type: 'transaction', owner});
            return {
                ok: false,
                error: CLAIM_ERRORS.Deduction
            }
        }

        // console.log("userMysteryboxedOwned",isUserOwnMysterybox)
        // console.log("rolledMysterybox",rolledMysterybox)
        // console.log("assignClaim",assignClaim, owner)
        // console.log("deduct",deduct)
        await processMysterybox(transaction, rolledMysterybox, owner)

        await transaction.commit();
        return {
            ok: true,
            type: rolledMysterybox.type,
            name: rolledMysterybox.name,
            item: rolledMysterybox.item,
            relatedInvestment: rolledMysterybox.offerId,
            discount: rolledMysterybox.discount,
            code: rolledMysterybox.code,
        }

    } catch (e) {
        if(transaction) {
           await transaction.rollback();
        }
        Sentry.captureException({location: "claimMysterybox", type: 'catch error', owner, e});
        return {
            ok: false,
            error: CLAIM_ERRORS.Unexpected
        }
    }

}


module.exports = {claimMysterybox}

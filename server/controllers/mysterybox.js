const { pickMysteryBox, assignMysteryBox,  processMBAllocation, processMBUpgrade} = require("../queries/mysterybox.query");
const db = require("../services/db/definitions/db.init");
const {MYSTERYBOX_CLAIM_ERRORS, PremiumItemsENUM, MYSTERY_TYPES} = require("../../src/lib/enum/store");
const {getStoreItemsOwnedByUser, updateUserUpgradeAmount} = require("../queries/storeUser.query");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const {UPGRADE_ERRORS} = require("../enum/UpgradeErrors");

async function processMysteryBox(userId, claim, transaction) {
    switch(claim.type) {
        case MYSTERY_TYPES.Allocation: {
            return await processMBAllocation(transaction, claim, userId)
        }
        case MYSTERY_TYPES.Upgrade: {
            return await processMBUpgrade(transaction, claim, userId)
        }
        case MYSTERY_TYPES.Discount: {
            return {ok:true}
        }
        case MYSTERY_TYPES.NFT: {
            return {ok:true}
        }
    }
}

async function claim(user) {
    const {userId, tenantId} = user

    let transaction;
    try {
        transaction = await db.transaction();

        const isUserOwnMB = await getStoreItemsOwnedByUser(userId, tenantId, PremiumItemsENUM.MysteryBox, transaction)
        if(!isUserOwnMB.ok || !(isUserOwnMB?.data?.amount>0)) {
            await transaction.rollback();
            return {
                ok: false,
                error: MYSTERYBOX_CLAIM_ERRORS.UserNoBoxes
            }
        }

        const selectedMysteryBox = await pickMysteryBox(tenantId, transaction)

        if(!selectedMysteryBox.ok) {
            await transaction.rollback();
            return {
                ok: false,
                error: MYSTERYBOX_CLAIM_ERRORS.NotEnoughBoxes
            }
        }


        const assign = await assignMysteryBox(userId, selectedMysteryBox.data.id, transaction)
        if(!assign.ok) {
            await transaction.rollback();
            return {
                ok: false,
                error: MYSTERYBOX_CLAIM_ERRORS.AssignBox
            }
        }

        const deduct = await updateUserUpgradeAmount(userId, isUserOwnMB.data.storePartnerId,  -1, transaction)

        if(!deduct.ok) {
            await transaction.rollback();
            return {
                ok: false,
                error: UPGRADE_ERRORS.Deduction
            }
        }

        const final = await processMysteryBox(userId, selectedMysteryBox.data, transaction)
        if(!final.ok) {
            await transaction.rollback();
            return {ok:false, error: final.error}
        }

        await transaction.commit();

        return {
            ok: true,
            type: selectedMysteryBox.data.type,
            name: selectedMysteryBox.data.name,
            item: selectedMysteryBox.data.item,
            relatedInvestment: selectedMysteryBox.data.offerId,
            discount: selectedMysteryBox.data.discount,
            code: selectedMysteryBox.data.code,
        }

    } catch (error) {
        if(transaction) {
            await transaction.rollback();
        }
        logger.error("ERROR :: [claimMysterybox]", {
            error: serializeError(error),
            user
        })
        return {
            ok: false,
            error: MYSTERYBOX_CLAIM_ERRORS.Unexpected
        }
    }

}



module.exports = {claim}

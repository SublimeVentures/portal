const { pickMysteryBox, assignMysteryBox,  processMBAllocation, processMBUpgrade} = require("../queries/mysterybox.query");
const db = require("../services/db/db.init");
const {MYSTERYBOX_CLAIM_ERRORS, PremiumItemsENUM, MYSTERY_TYPES} = require("../../src/lib/enum/store");
const {getStoreItemsOwnedByUser, updateUserUpgradeAmount} = require("../queries/storeUser.query");
const logger = require("../services/logger");
const {serializeError} = require("serialize-error");

async function processMysteryBox(owner, claim, transaction) {
    switch(claim.type) {
        case MYSTERY_TYPES.Allocation: {
            return await processMBAllocation(transaction, claim, owner)
        }
        case MYSTERY_TYPES.Upgrade: {
            return await processMBUpgrade(transaction, claim, owner)
        }
        case MYSTERY_TYPES.Discount: {
            return true
        }
        case MYSTERY_TYPES.NFT: {
            return true
        }
    }
}

async function claim(user) {
    const {userId} = user

    let transaction;
    try {
        transaction = await db.transaction();

        const isUserOwnMB = await getStoreItemsOwnedByUser(userId, PremiumItemsENUM.MysteryBox, transaction)
        if(!isUserOwnMB.ok) {
            return {
                ok: false,
                error: MYSTERYBOX_CLAIM_ERRORS.UserNoBoxes
            }
        }

        const selectedMysteryBox = await pickMysteryBox(transaction)
        if(!selectedMysteryBox.ok) {
            return selectedMysteryBox
        }

        const assign = await assignMysteryBox(userId, selectedMysteryBox.data.id, transaction)
        if(!assign.ok) {
            return assign
        }

        const deduct = await updateUserUpgradeAmount(userId, PremiumItemsENUM.MysteryBox, -1, transaction)
        if(!deduct.ok) {
            return deduct
        }

        const final = await processMysteryBox(userId, selectedMysteryBox.data, transaction)
        if(!final.ok) {
            return final
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

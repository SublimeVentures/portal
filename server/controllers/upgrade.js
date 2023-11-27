const {ACLs} = require("../../src/lib/authHelpers");
const {
    fetchUpgrade, fetchAppliedUpgradesInTransaction, saveUpgradeUse
} = require("../queries/upgrade.query");
const {PremiumItemsENUM} = require("../../src/lib/enum/store");
const logger = require("../../src/lib/logger");

const {serializeError} = require("serialize-error");
const {PremiumItemsParamENUM} = require("../../src/lib/enum/store");
const db = require("../services/db/db.init");
const {getStoreItemsOwnedByUser, updateUserUpgradeAmount} = require("../queries/storeUser.query");
const {UPGRADE_ERRORS} = require("../enum/UpgradeErrors");
const {getOfferById} = require("../queries/offers.query");
const {bookAllocationGuaranteed} = require("../queries/invest.query");
const {getUserAllocationMax, roundAmount} = require("../../src/lib/investment");

async function useGuaranteed(offerId, user, transaction) {
    const {userId} = user

    const userAppliedUpgrades = await fetchAppliedUpgradesInTransaction(userId, offerId, transaction)
    const upgradeGuaranteed = userAppliedUpgrades?.find(el => el.storeId === PremiumItemsENUM.Guaranteed)?.amount
    const upgradeIncreased = userAppliedUpgrades?.find(el => el.storeId === PremiumItemsENUM.Increased)?.amount

    if (upgradeGuaranteed) {
        await transaction.rollback();
        return {
            ok: false,
            error: UPGRADE_ERRORS.GuaranteedUsed
        }
    }

    const offer = await getOfferById(offerId)
    const isSeparatePool = offer.alloTotalPartner > 0 && upgradeIncreased !== ACLs.Whale;
    const totalAllocation = offer[isSeparatePool ? 'alloTotalPartner' : 'alloTotal']

    const {allocationUser_max} = getUserAllocationMax(user, offer, upgradeIncreased)
    const maxAllocation = roundAmount(allocationUser_max)
    const amount = maxAllocation < PremiumItemsParamENUM.Guaranteed ? maxAllocation : PremiumItemsParamENUM.Guaranteed

    const increaseGuaranteedReservations = await bookAllocationGuaranteed(offerId, amount, totalAllocation, isSeparatePool, transaction)


    if (!increaseGuaranteedReservations.ok) {
        await transaction.rollback();
        return {
            ok: false,
            error: UPGRADE_ERRORS.NotEnoughAllocation
        }
    }

    return {
        ok: true,
        data: amount
    }
}

async function useUpgrade(user, req) {
    let offerId, storeId, transaction;

    try {
        offerId = Number(req.params.id)
        storeId = Number(req.params.upgrade)

        //todo: blocker on increased allocation
        if (storeId !== PremiumItemsENUM.Guaranteed && storeId !== PremiumItemsENUM.Increased) {
            throw new Error("Wrong Upgrade")
        }

        const {userId} = user

        transaction = await db.transaction();

        //check if user has upgrades
        const isUserOwnsUpgrade = await getStoreItemsOwnedByUser(userId, storeId, transaction)
        if (!isUserOwnsUpgrade.ok) {
            return {
                ok: false,
                error: "Error" //todo: extract
            }
        }

        let allocation
        //check if user used Guaranteed (limit - only one)
        if (storeId === PremiumItemsENUM.Guaranteed) {
            const saveStatus_upgrade = await useGuaranteed(offerId, user, transaction)
            if (!saveStatus_upgrade.ok) {
                logger.warn('ERROR :: [useUpgrade] - guaranteed couldnt apply', {
                    saveStatus_upgrade,
                    isUserOwnsUpgrade,
                    user,
                    prams: req.params
                });
                return saveStatus_upgrade
            }
            allocation = saveStatus_upgrade.data
        }

        //save used upgrade
        const save = await saveUpgradeUse(userId, offerId, storeId, 1, allocation, transaction)
        if (!save.ok) {
            logger.warn('ERROR :: [useUpgrade] - couldnt save use of upgrade', {save, user, offerId, storeId});
            return save
        }

        const deduct = await updateUserUpgradeAmount(userId, storeId, -1, transaction)
        if (!deduct.ok) {
            return deduct
        }

        await transaction.commit();
        return {
            ok: true
        }

    } catch (error) {
        if (transaction) {
            await transaction.rollback();
        }
        logger.error('ERROR :: [useUpgrade]', {error: serializeError(error), offerId, user, params: req.params});
        return {
            ok: false,
            error: UPGRADE_ERRORS.Unexpected
        }
    }
}


async function getUpgrades(user, req) {
    try {
        const offerId = Number(req.params.id)
        const {userId} = user
        return {ok: true, data: await fetchUpgrade(userId, offerId)}

    } catch (error) {
        logger.error('ERROR :: [getUpgrades]', {error: serializeError(error), params: req.params, user});
        return {
            ok: false,
            usedUpgrades: {}
        }
    }


}


module.exports = {useUpgrade, getUpgrades}

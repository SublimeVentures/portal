const { Sequelize } = require("sequelize");
const logger = require("../../logger");
const { defineParticipantModel } = require("./models/participant.model");

let connection = {
    dialect: "postgres",
    pool: {
        min: 0,
        max: Number(process.env.DATABASE_POOL_MAX),
        acquire: Number(process.env.DATABASE_POOL_ACQUIRE),
        idle: Number(process.env.DATABASE_POOL_IDLE),
    },
};

if (!process.env.IS_LOCAL_DB) {
    connection.ssl = true;
    connection.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    };
    connection.logging = false;
} else {
    connection.ssl = false;
    connection.logging = false;
    // connection.logging = logger.info.bind(console.log)
}

const sequelize = new Sequelize(process.env.DATABASE, connection);

const modelDefiners = [
    require("./models/currency.model"),
    require("./models/diamond.model"),
    require("./models/environment.model"),
    require("./models/network.model"),
    require("./models/ntElite.model"),
    require("./models/ntStake.model"),
    require("./models/partner.model"),
    require("./models/partnerDetails.model"),
    require("./models/user.model"),
    require("./models/userWallet.model"),
    require("./models/vault.model"),
    require("./models/offer.model"),
    require("./models/offerLimit.model"),
    require("./models/lootbox.model"),
    require("./models/notification.model"),
    require("./models/notificationType.model"),
    require("./models/onchain.model"),
    require("./models/onchainType.model"),
    require("./models/offerDescription.model"),
    require("./models/offerFundraise.model"),
    require("./models/otcDeal.model"),
    require("./models/otcLock.model"),
    require("./models/storeMysterybox.model"),
    require("./models/store.model"),
    require("./models/storePartner.model"),
    require("./models/storeUser.model"),
    require("./models/upgrade.model"),
    require("./models/payout.model"),
    require("./models/claim.model"),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

function setupAssociationsForParticipant(sequelize, participantModel) {
    const { onchain, user, partner } = sequelize.models;

    //participants model
    onchain.hasOne(participantModel, { foreignKey: "onchainId" });
    participantModel.belongsTo(onchain, { foreignKey: "onchainId" });

    user.hasMany(participantModel, { foreignKey: "userId" });
    participantModel.belongsTo(user, { foreignKey: "userId" });

    partner.hasMany(participantModel, {
        foreignKey: "partnerId",
        sourceKey: "id",
    });
    participantModel.belongsTo(partner, {
        foreignKey: "partnerId",
        sourceKey: "id",
    });

    partner.hasMany(participantModel, {
        foreignKey: "tenantId",
        sourceKey: "id",
    });
    participantModel.belongsTo(partner, {
        foreignKey: "tenantId",
        sourceKey: "id",
    });
}

function applyExtraSetup(sequelize) {
    const {
        network,
        partner,
        partnerDetails,
        currency,
        user,
        diamond,
        environment,
        userWallet,
        offer,
        vault,
        lootbox,
        notification,
        notificationType,
        onchain,
        onchainType,
        offerDescription,
        offerFundraise,
        otcDeal,
        otcLock,
        storeMysterybox,
        store,
        storeUser,
        storePartner,
        upgrade,
        offerLimit,
        payout,
        claim,
    } = sequelize.models;

    //environment model
    partner.hasMany(environment, { foreignKey: "partnerId" });
    environment.belongsTo(partner, { foreignKey: "partnerId" });

    //userWallet model
    user.hasMany(userWallet, { foreignKey: "userId" });
    userWallet.belongsTo(user, { foreignKey: "userId" });

    //currency model
    network.hasMany(currency, { foreignKey: "chainId" });
    currency.belongsTo(network, { foreignKey: "chainId" });

    partner.hasMany(currency, { foreignKey: "partnerId" });
    currency.belongsTo(partner, { foreignKey: "partnerId" });

    //partner model
    network.hasMany(partnerDetails, { foreignKey: "chainId" });
    partnerDetails.belongsTo(network, { foreignKey: "chainId" });

    partner.hasMany(partnerDetails, { foreignKey: "partnerId" });
    partnerDetails.belongsTo(partner, { foreignKey: "partnerId" });

    //diamond model
    network.hasMany(diamond, { foreignKey: "chainId" });
    diamond.belongsTo(network, { foreignKey: "chainId" });

    partner.hasMany(diamond, { foreignKey: "partnerId" });
    diamond.belongsTo(partner, { foreignKey: "partnerId" });

    //vault model
    user.hasMany(vault, { foreignKey: "userId" });
    vault.belongsTo(user, { foreignKey: "userId" });

    offer.hasMany(vault, { foreignKey: "offerId" });
    vault.belongsTo(offer, { foreignKey: "offerId" });

    //lootbox model
    user.hasMany(lootbox, { foreignKey: "userId" });
    lootbox.belongsTo(user, { foreignKey: "userId" });

    //notification model
    user.hasMany(notification, { foreignKey: "userId" });
    notification.belongsTo(user, { foreignKey: "userId" });

    notificationType.hasMany(notification, {
        foreignKey: "typeId",
        sourceKey: "id",
    });
    notification.belongsTo(notificationType, {
        foreignKey: "typeId",
        sourceKey: "id",
    });

    onchain.hasMany(notification, { foreignKey: "onchainId", sourceKey: "id" });
    notification.belongsTo(onchain, {
        foreignKey: "onchainId",
        targetKey: "id",
    });

    offer.hasMany(notification, { foreignKey: "offerId", sourceKey: "id" });
    notification.belongsTo(offer, { foreignKey: "offerId", targetKey: "id" });

    partner.hasMany(notification, { foreignKey: "tenantId", sourceKey: "id" });
    notification.belongsTo(partner, {
        foreignKey: "tenantId",
        targetKey: "id",
    });

    //offerDescription model
    offerDescription.hasOne(offer, {
        foreignKey: "descriptionId",
        sourceKey: "id",
    });
    offer.belongsTo(offerDescription, {
        foreignKey: "descriptionId",
        sourceKey: "id",
    });

    //offerFundraise model
    offer.hasOne(offerFundraise, { foreignKey: "offerId" });
    offerFundraise.belongsTo(offer, { foreignKey: "offerId" });

    //offerLimit model
    offer.hasMany(offerLimit, { foreignKey: "offerId" });
    offerLimit.belongsTo(offer, { foreignKey: "offerId" });

    partner.hasMany(offerLimit, { foreignKey: "partnerId" });
    offerLimit.belongsTo(partner, { foreignKey: "partnerId" });

    //onchain model
    onchainType.hasMany(onchain, { foreignKey: "typeId" });
    onchain.belongsTo(onchainType, { foreignKey: "typeId" });

    user.hasMany(onchain, { foreignKey: "userId" });
    onchain.belongsTo(user, { foreignKey: "userId" });

    network.hasMany(onchain, { foreignKey: "chainId" });
    onchain.belongsTo(network, { foreignKey: "chainId" });

    partner.hasMany(onchain, { foreignKey: "tenant" });
    onchain.belongsTo(partner, { foreignKey: "tenant" });

    //otcDeal model
    otcDeal.belongsTo(onchain, {
        foreignKey: "onchainIdMaker",
        targetKey: "id",
    });
    onchain.hasOne(otcDeal, { foreignKey: "onchainIdMaker", sourceKey: "id" });

    otcDeal.belongsTo(onchain, {
        foreignKey: "onchainIdTaker",
        targetKey: "id",
    });
    onchain.hasOne(otcDeal, { foreignKey: "onchainIdTaker", sourceKey: "id" });

    offer.hasMany(otcDeal, { foreignKey: "offerId" });
    otcDeal.belongsTo(offer, { foreignKey: "offerId" });

    network.hasMany(otcDeal, { foreignKey: "chainId" });
    otcDeal.belongsTo(network, { foreignKey: "chainId" });

    //otcLock model
    offer.hasMany(otcLock, { foreignKey: "offerId" });
    otcLock.belongsTo(offer, { foreignKey: "offerId" });

    otcDeal.hasMany(otcLock, { foreignKey: "otcDealId" });
    otcLock.belongsTo(otcDeal, { foreignKey: "otcDealId" });

    user.hasMany(otcLock, { foreignKey: "userId" });
    otcLock.belongsTo(user, { foreignKey: "userId" });

    //storePartner model
    partner.hasMany(storePartner, { foreignKey: "tenantId" });
    storePartner.belongsTo(partner, { foreignKey: "tenantId" });

    store.hasMany(storePartner, { foreignKey: "storeId" });
    storePartner.belongsTo(store, { foreignKey: "storeId" });

    //storeUser model
    user.hasMany(storeUser, { foreignKey: "userId" });
    storeUser.belongsTo(user, { foreignKey: "userId" });

    storePartner.hasMany(storeUser, { foreignKey: "storePartnerId" });
    storeUser.belongsTo(storePartner, { foreignKey: "storePartnerId" });

    //upgrade model
    user.hasMany(upgrade, { foreignKey: "userId" });
    upgrade.belongsTo(user, { foreignKey: "userId" });

    offer.hasMany(upgrade, { foreignKey: "offerId" });
    upgrade.belongsTo(offer, { foreignKey: "offerId" });

    storePartner.hasMany(upgrade, { foreignKey: "storePartnerId" });
    upgrade.belongsTo(storePartner, { foreignKey: "storePartnerId" });

    //storeMysterybox model
    user.hasMany(storeMysterybox, { foreignKey: "userId" });
    storeMysterybox.belongsTo(user, { foreignKey: "userId" });

    storePartner.hasMany(storeMysterybox, { foreignKey: "storePartnerId" });
    storeMysterybox.belongsTo(storePartner, { foreignKey: "storePartnerId" });

    offer.hasMany(storeMysterybox, { foreignKey: "offerId" });
    storeMysterybox.belongsTo(offer, { foreignKey: "offerId" });

    partner.hasMany(storeMysterybox, { foreignKey: "tenantId" });
    storeMysterybox.belongsTo(partner, { foreignKey: "tenantId" });

    //claim model
    user.hasMany(claim, { foreignKey: "userId" });
    claim.belongsTo(user, { foreignKey: "userId" });

    offer.hasMany(claim, { foreignKey: "offerId" });
    claim.belongsTo(offer, { foreignKey: "offerId" });

    payout.hasMany(claim, { foreignKey: "payoutId" });
    claim.belongsTo(payout, { foreignKey: "payoutId" });

    //claim model
    offer.hasMany(payout, { foreignKey: "offerId" });
    payout.belongsTo(offer, { foreignKey: "offerId" });

    network.hasMany(payout, { foreignKey: "chainId" });
    payout.belongsTo(network, { foreignKey: "chainId" });

    for (let i = 1; i < 100; i++) {
        const participantModel = defineParticipantModel(sequelize, i);
        setupAssociationsForParticipant(sequelize, participantModel);
    }
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

module.exports = sequelize;

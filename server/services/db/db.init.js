const {Sequelize} = require("sequelize");
const logger = require('../../../src/lib/logger');
const {defineParticipantModel} = require("../../models/participant.model");

let connection = {
    dialect: "postgres",
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 20000
    }
}

if(process.env.IS_LOCAL_DB === 'false' || !process.env.IS_LOCAL_DB) {
    connection.ssl = true
    connection.dialectOptions = {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
    // connection.logging = false
    connection.logging = logger.info.bind(logger)
} else {
    connection.ssl = false
    connection.logging = false
    // connection.logging = logger.info.bind(console.log)
}

const URI = process.env.IS_LOCAL_DB ? process.env.DATABASE_URL_LOCAL : process.env.DATABASE

const sequelize = new Sequelize(URI, connection)

const modelDefiners = [
    require('../../models/currency.model'),
    require('../../models/delegate.model'),
    require('../../models/diamond.model'),
    require('../../models/environment.model'),
    require('../../models/environment_based.model'),
    require('../../models/environment_citcap.model'),
    require('../../models/filteredAddress.model'),
    require('../../models/injectedUser.model'),
    require('../../models/lootbox.model'),
    require('../../models/network.model'),
    require('../../models/notification.model'),
    require('../../models/notificationType.model'),
    require('../../models/ntElite.model'),
    require('../../models/ntStake.model'),
    require('../../models/offer.model'),
    require('../../models/offerDescription.model'),
    require('../../models/offerFundraise.model'),
    require('../../models/onchain.model'),
    require('../../models/onchainType.model'),
    require('../../models/otcDeal.model'),
    require('../../models/otcLock.model'),
    require('../../models/partner.model'),
    require('../../models/store.model'),
    require('../../models/storeMysterybox.model'),
    require('../../models/storeUser.model'),
    require('../../models/upgrade.model'),
    require('../../models/user.model'),
    require('../../models/vault.model'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

function setupAssociationsForParticipant(sequelize, participantModel) {
    const { onchain, user } = sequelize.models;

    //participants model
    onchain.hasOne(participantModel, { foreignKey: 'onchainId' });
    participantModel.belongsTo(onchain, { foreignKey: 'onchainId' });

    user.hasMany(participantModel, { foreignKey: 'userId' });
    participantModel.belongsTo(user, { foreignKey: 'userId' });
}



function applyExtraSetup(sequelize) {

    const {
        network,
        partner,
        currency,
        injectedUser,
        offer,
        offerFundraise,
        vault,
        user,
        lootbox,
        notification,
        notificationType,
        onchain,
        onchainType,
        otcDeal,
        otcLock,
        storeMysterybox,
        storeUser,
        store,
        upgrade,
        diamond,
        offerDescription,
        ntStake
    } = sequelize.models;

    //currency model
    network.hasMany(currency, { foreignKey: 'chainId' });
    currency.belongsTo(network, { foreignKey: 'chainId' });

    //diamond model
    network.hasMany(diamond, { foreignKey: 'chainId' });
    diamond.belongsTo(network, { foreignKey: 'chainId' });

    //inectedUser model
    partner.hasMany(injectedUser, { foreignKey: 'partnerId' });
    injectedUser.belongsTo(partner, { foreignKey: 'partnerId' });

    //lootbox model
    user.hasMany(lootbox, { foreignKey: 'userId' });
    lootbox.belongsTo(user, { foreignKey: 'userId' });

    //notification model
    user.hasMany(notification, { foreignKey: 'userId' });
    notification.belongsTo(user, { foreignKey: 'userId' });

    notificationType.hasMany(notification, { foreignKey: 'typeId', sourceKey: 'id' });
    notification.belongsTo(notificationType, { foreignKey: 'typeId', sourceKey: 'id' });

    notification.belongsTo(onchain, { foreignKey: 'onchainId', targetKey: 'id' });
    onchain.hasOne(notification, { foreignKey: 'onchainId', sourceKey: 'id' });

    //offerDescription model
    offerDescription.hasOne(offer, { foreignKey: 'descriptionId', sourceKey: 'id' });
    offer.belongsTo(offerDescription, { foreignKey: 'descriptionId', sourceKey: 'id' });

    //offerFundraise model
    offer.hasOne(offerFundraise, { foreignKey: 'offerId' });
    offerFundraise.belongsTo(offer, { foreignKey: 'offerId' });

    //onchain model
    onchainType.hasMany(onchain, { foreignKey: 'typeId' });
    onchain.belongsTo(onchainType, { foreignKey: 'typeId' });

    network.hasMany(onchain, { foreignKey: 'chainId' });
    onchain.belongsTo(network, { foreignKey: 'chainId' });

    //otcDeal model
    otcDeal.belongsTo(onchain, { foreignKey: 'onchainId', targetKey: 'id' });
    onchain.hasOne(otcDeal, { foreignKey: 'onchainId', sourceKey: 'id' });

    offer.hasMany(otcDeal, { foreignKey: 'offerId' });
    otcDeal.belongsTo(offer, { foreignKey: 'offerId' });

    network.hasMany(otcDeal, { foreignKey: 'chainId' });
    otcDeal.belongsTo(network, { foreignKey: 'chainId' });

    //otcLock model
    offer.hasMany(otcLock, { foreignKey: 'offerId' });
    otcLock.belongsTo(offer, { foreignKey: 'offerId' });

    otcDeal.hasMany(otcLock, { foreignKey: 'otcDealId' });
    otcLock.belongsTo(otcDeal, { foreignKey: 'otcDealId' });

    user.hasMany(otcLock, { foreignKey: 'userId' });
    otcLock.belongsTo(user, { foreignKey: 'userId' });

    //partner model
    network.hasMany(partner, { foreignKey: 'chainId' });
    partner.belongsTo(network, { foreignKey: 'chainId' });

    //storeMysterybox model
    user.hasMany(storeMysterybox, { foreignKey: 'userId' });
    storeMysterybox.belongsTo(user, { foreignKey: 'userId' });

    store.hasMany(storeMysterybox, { foreignKey: 'storeId' });
    storeMysterybox.belongsTo(store, { foreignKey: 'storeId' });

    offer.hasMany(storeMysterybox, { foreignKey: 'offerId' });
    storeMysterybox.belongsTo(offer, { foreignKey: 'offerId' });

    //storeUser model
    user.hasMany(storeUser, { foreignKey: 'userId' });
    storeUser.belongsTo(user, { foreignKey: 'userId' });

    store.hasMany(storeUser, { foreignKey: 'storeId' });
    storeUser.belongsTo(store, { foreignKey: 'storeId' });

    //upgrade model
    user.hasMany(upgrade, { foreignKey: 'userId' });
    upgrade.belongsTo(user, { foreignKey: 'userId' });

    store.hasMany(upgrade, { foreignKey: 'storeId' });
    upgrade.belongsTo(store, { foreignKey: 'storeId' });

    offer.hasMany(upgrade, { foreignKey: 'offerId' });
    upgrade.belongsTo(offer, { foreignKey: 'offerId' });

    //vault model
    user.hasMany(vault, { foreignKey: 'userId' });
    vault.belongsTo(user, { foreignKey: 'userId' });

    offer.hasMany(vault, { foreignKey: 'offerId' });
    vault.belongsTo(offer, { foreignKey: 'offerId' });

    for(let i=1; i<100; i++) {
        const participantModel = defineParticipantModel(sequelize, i);
        setupAssociationsForParticipant(sequelize, participantModel);
    }

}
// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

module.exports = sequelize;




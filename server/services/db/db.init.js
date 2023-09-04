const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    // native: true,
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    pool: {
        max: 20,
        min: 0,
        acquire: 30000,
        idle: 20000
    }
})

const modelDefiners = [
    require('../../models/environment.model'),
    require('../../models/networks.model'),
    require('../../models/currencies.model'),
    require('../../models/partners.model'),
    require('../../models/injectedUsers.model'),
    require('../../models/delegates.model'),
    require('../../models/offers.model'),
    require('../../models/raises.model'),
    require('../../models/participants.model'),
    require('../../models/vaults.model'),
    require('../../models/otcDeals.model'),
    require('../../models/otcPending.model'),
    require('../../models/diamonds.model'),
    require('../../models/ntElites.model'),
    require('../../models/lootbox.model'),
    require('../../models/store.model'),
    require('../../models/storeUser.model'),
    require('../../models/storeMysterybox.model'),
    require('../../models/upgrade.model'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

function applyExtraSetup(sequelize) {
    const { networks, partners, currencies, injectedUsers, offers, raises, vaults, otcDeals, otcPending, diamonds, store, storeUser, storeMysterybox, upgrade } = sequelize.models;

    networks.hasMany(partners)
    partners.belongsTo(networks);

    networks.hasMany(currencies)
    currencies.belongsTo(networks);

    partners.hasMany(injectedUsers);
    injectedUsers.belongsTo(partners);

    offers.hasOne(raises);
    raises.belongsTo(offers);

    offers.hasMany(vaults);
    vaults.belongsTo(offers);

    offers.hasMany(otcDeals);
    otcDeals.belongsTo(offers);

    offers.hasMany(otcPending);
    otcPending.belongsTo(offers);

    networks.hasMany(otcDeals)
    otcDeals.belongsTo(networks);

    networks.hasMany(otcPending)
    otcPending.belongsTo(networks);

    networks.hasMany(diamonds)
    diamonds.belongsTo(networks);

    store.hasMany(storeUser)
    storeUser.belongsTo(store);

    offers.hasMany(storeMysterybox);
    storeMysterybox.belongsTo(offers);

    offers.hasMany(upgrade);
    upgrade.belongsTo(offers);
    store.hasMany(upgrade);
    upgrade.belongsTo(store);
}
// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

module.exports = sequelize;




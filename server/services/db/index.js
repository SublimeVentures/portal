
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
    require('../../models/otcSettlement.model'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

function applyExtraSetup(sequelize) {
    const { networks, partners, currencies, injectedUsers, offers, raises, vaults, otcDeals, otcSettlement } = sequelize.models;

    networks.hasMany(partners)
    networks.hasMany(currencies)
    partners.hasMany(injectedUsers);
    offers.hasOne(raises);
    offers.hasMany(vaults);
    offers.hasMany(otcDeals);
    offers.hasMany(otcSettlement);

    partners.belongsTo(networks);
    currencies.belongsTo(networks);
    injectedUsers.belongsTo(partners);
    raises.belongsTo(offers);
    vaults.belongsTo(offers);
    otcDeals.belongsTo(offers);
    otcSettlement.belongsTo(offers);

}
// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

module.exports = sequelize;




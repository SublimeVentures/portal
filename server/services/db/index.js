
const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialect: "postgres",
    // native: true,
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
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
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

function applyExtraSetup(sequelize) {
    const { networks, partners, currencies, injectedUsers } = sequelize.models;

    networks.hasMany(partners)
    networks.hasMany(currencies)
    partners.hasMany(injectedUsers);


    partners.belongsTo(networks);
    currencies.belongsTo(networks);
    injectedUsers.belongsTo(partners);


}
// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

module.exports = sequelize;




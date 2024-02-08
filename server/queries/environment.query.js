const {models} = require('../services/db/definitions/db.init');

async function getEnvironment() {
    //initialize environment
    let environment = {}

    //PARAMS :: fetch global `environment`
    const envVars = await models.environment.findAll({raw: true});
    let partnerSpecific = {};
    envVars.forEach(item => {
        if (item.partnerId !== null) {
            if(item.partnerId === Number(process.env.NEXT_PUBLIC_TENANT)) {
                if (!partnerSpecific[item.name]) {
                    partnerSpecific[item.name] = {};
                }
                partnerSpecific[item.name][item.partnerId] = item.value ? item.value : item.valueJSON;
            }
        } else {
            environment[item.name] = item.value ? item.value : item.valueJSON;
        }
    });

    // Process partner-specific variables
    Object.keys(partnerSpecific).forEach(name => {
        const partners = partnerSpecific[name];
        const partnerIds = Object.keys(partners);

        if (partnerIds.length === 1) {
            const partnerId = partnerIds[0];
            if (!environment[`tenant`]) {
                environment[`tenant`] = {};
            }
            environment[`tenant`][name] = partners[partnerId];
        } else {
            // If more than one partnerId, add directly to env
            environment[name] = partners;
        }
    });


    // //PARAM :: `currencies`
    const currencies = await models.currency.findAll({
        attributes:["address", "name", "symbol", "precision", "isSettlement", "isStore", "isStaking", "chainId", "partnerId" ],
        raw: true
    });
    let currenciesAll = {}

    currencies.forEach(el => {
        if (!currenciesAll[el.chainId]) currenciesAll[el.chainId] = {}
        currenciesAll[el.chainId][el.address] = {
            name: el.name,
            symbol: el.symbol,
            precision: el.precision,
            isSettlement: el.isSettlement,
            isStore: el.isStore,
            isStaking: el.isStaking,
        }
    })
    environment.currencies = currenciesAll
    //
    //PARAM :: `stats`
    environment.stats = {}
    //-- PARAM :: `stats.partners`
    const partners = await models.partner.findAll({where: {isEnabled: true, isPartner:true}, raw: true});
    environment.stats.partners = partners.length;
    //-- PARAM :: `stats.funded`
    const offers = await models.offer.findAll({
        include: [{
            model: models.offerFundraise,
            as: 'offerFundraise',
            attributes: ['alloRaised']
        }],
        raw: true,
        nest: true  // Required for nested include to work properly with raw: true
    });
    const funded = offers.map(item => item.offerFundraise.alloRaised).reduce((prev, next) => prev + next);
    environment.stats.funded = funded + Number(environment?.investedInjected ? environment?.investedInjected : 0)


    return environment
}

module.exports = {getEnvironment}

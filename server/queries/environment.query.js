const { QueryTypes } = require("sequelize");
const { models } = require("../services/db/definitions/db.init");
const db = require("../services/db/definitions/db.init");
const { TENANT } = require("../../src/lib/tenantHelper");

async function getEnvironment() {
    //initialize environment
    let environment = {};

    //PARAMS :: fetch global `environment`
    const envVars = await models.environment.findAll({ raw: true });
    let partnerSpecific = {};
    envVars.forEach((item) => {
        if (item.partnerId !== null) {
            if (item.partnerId === Number(process.env.NEXT_PUBLIC_TENANT)) {
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
    Object.keys(partnerSpecific).forEach((name) => {
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
        attributes: [
            "address",
            "name",
            "symbol",
            "precision",
            "isSettlement",
            "isStore",
            "isStaking",
            "chainId",
            "partnerId",
        ],
        raw: true,
    });
    let currenciesAll = {};

    currencies.forEach((el) => {
        if (!currenciesAll[el.chainId]) currenciesAll[el.chainId] = {};
        currenciesAll[el.chainId][el.address] = {
            name: el.name,
            symbol: el.symbol,
            precision: el.precision,
            isSettlement: el.isSettlement,
            isStore: el.isStore,
            isStaking: el.isStaking,
        };
    });
    environment.currencies = currenciesAll;
    //
    //PARAM :: `stats`
    environment.stats = {};
    //-- PARAM :: `stats.partners`
    const partners = await models.partner.findAll({
        where: { isEnabled: true, isPartner: true },
        raw: true,
    });
    environment.stats.partners = partners.length;
    //-- PARAM :: `stats.funded`

    const query_funded = `
        SELECT o.*,
               array_agg(ol."partnerId") AS offerLimits,
               ofr."alloRaised"
        FROM offer o
                 LEFT JOIN "offerLimit" ol ON o.id = ol."offerId"
                 LEFT JOIN "offerFundraise" ofr ON o.id = ofr."offerId"
        GROUP BY o.id, ofr."alloRaised"
    `;

    const offers = await db.query(query_funded, { type: QueryTypes.SELECT });

    let funded = 0;
    const TENANT_ID = Number(process.env.NEXT_PUBLIC_TENANT);
    if (TENANT_ID === TENANT.basedVC) {
        funded = offers.map((item) => item.alloRaised || 0).reduce((prev, next) => prev + next, 0);
    } else {
        const filteredOffers = offers.filter(
            (offer) => Array.isArray(offer.offerlimits) && offer.offerlimits.includes(parseInt(TENANT_ID)),
        );

        funded = filteredOffers.map((item) => item.alloRaised || 0).reduce((prev, next) => prev + next, 0);
    }
    environment.stats.funded =
        TENANT_ID === TENANT.basedVC
            ? funded + Number(environment?.investedInjected ? environment?.investedInjected : 0)
            : funded;

    environment.stats.launchpad = offers.filter(
        (offer) =>
            offer.isLaunchpad && Array.isArray(offer.offerlimits) && offer.offerlimits.includes(parseInt(TENANT_ID)),
    ).length;

    environment.stats.vc = offers.filter(
        (offer) => Array.isArray(offer.offerlimits) && offer.offerlimits.includes(parseInt(TENANT_ID)),
    ).length;

    return environment;
}

module.exports = { getEnvironment };

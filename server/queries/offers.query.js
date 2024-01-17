const {models} = require('../services/db/definitions/db.init');
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const db = require("../services/db/definitions/db.init");
const {QueryTypes} = require("sequelize");

async function getOffersPublic() {
    try {
        return models.offer.findAll({
            attributes: ['name', 'genre', 'url_web', 'slug'],
            where: {
                displayPublic: true
            },
            order: [
                ['d_open', 'DESC'],
            ],
            raw: true
        });
    } catch (error) {
        logger.error('QUERY :: [getOffersPublic]', {error: serializeError(error)});
    }
    return []
}


const query_getOfferList = `
    SELECT
        o.slug,
        o.name,
        o.genre,
        o.otc,
        o.ticker,
        o."isAccelerator",
        -- Add other offer columns as needed
        ol.d_open,
        ol.d_close,
        ol."offerId"
        -- Add other offerLimit columns as needed
    FROM
        "offer" o
            LEFT JOIN LATERAL (
            SELECT
                ol1.d_open,
                ol1.d_close,
                ol1."offerId"
                -- Add other offerLimit columns as needed
            FROM
                "offerLimit" ol1
            WHERE
                ol1."offerId" = o.id AND
                ol1."partnerId" IN (:partnerId, :tenantId)
            ORDER BY
                CASE
                    WHEN ol1."partnerId" = :partnerId THEN 1
                    WHEN ol1."partnerId" = :tenantId THEN 2
                    ELSE 3
                    END
                LIMIT 1
) ol ON true
    WHERE
        o.display = true AND
        o.otc != 0 AND
        ol."offerId" IS NOT NULL
    ORDER BY
        ol.d_open DESC;
`;


async function getOfferList(partnerId, tenantId) {
    try {
        return await db.query(query_getOfferList, {
            type: QueryTypes.SELECT,
            replacements: { partnerId, tenantId },
        });
    } catch (error) {
        logger.error('QUERY :: [getOfferList]', {error: serializeError(error)});
    }
    return []
}


const query_getOfferDetails = `
    SELECT
        o.*,
        ol.*,
        od.description
    FROM
        "offer" o
            JOIN
        "offerDescription" od ON o."descriptionId" = od.id
            LEFT JOIN LATERAL (
            SELECT
                ol1.*
            FROM
                "offerLimit" ol1
            WHERE
                ol1."offerId" = o.id AND
                ol1."partnerId" IN (:partnerId, :tenantId)
            ORDER BY
                CASE
                    WHEN ol1."partnerId" = :partnerId THEN 1
                    WHEN ol1."partnerId" = :tenantId THEN 2
                    ELSE 3
                    END
                LIMIT 1
    ) ol ON true
    WHERE
        o.display = true AND
        o.slug = :slug AND
        ol."offerId" IS NOT NULL
        LIMIT 1;
`;


async function getOfferDetails(slug, partnerId, tenantId) {
    try {
        return await db.query(query_getOfferDetails, {
            type: QueryTypes.SELECT,
            replacements: { slug, partnerId, tenantId },
        });
    } catch (error) {
        logger.error('QUERY :: [getOfferDetails]', {error: serializeError(error), slug, });
    }
    return {}
}


async function getOfferById(id) {
    try {
        return models.offer.findOne({
            where: {id},
            raw: true
        })
    } catch (error) {
        logger.error('QUERY :: [getOfferById]', {error: serializeError(error), id});
    }
    return {}
}

async function getOfferWithLimits(offerId) {
    try {
        const offer = await models.offer.findOne({
            where: { id: offerId },
            include: [{
                model: models.offerLimit,
                as: 'offerLimits'
            }],

        });

        return offer ? offer.get({ plain: true }) : null;
    } catch (error) {
        console.error('Error fetching offer with limits:', error);
        return null;
    }
}



module.exports = {getOffersPublic, getOfferList, getOfferDetails, getOfferById, getOfferWithLimits}

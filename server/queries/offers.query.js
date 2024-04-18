const { serializeError } = require("serialize-error");
const { QueryTypes } = require("sequelize");
const { models } = require("../services/db/definitions/db.init");
const logger = require("../../src/lib/logger");
const db = require("../services/db/definitions/db.init");
const { TENANT } = require("../../src/lib/tenantHelper");

async function getOffersPublic() {
    try {
        const tenantId = Number(process.env.NEXT_PUBLIC_TENANT);

        let sqlQuery =
            tenantId === TENANT.basedVC
                ? `
            SELECT name, genre, url_web, slug
            FROM offer
            WHERE "displayPublic" = true
            ORDER BY "createdAt" DESC;
        `
                : `
            SELECT o.name, o.genre, o.url_web, o.slug
            FROM offer o
            INNER JOIN "offerLimit" ol ON o.id = ol."offerId"
            WHERE o."displayPublic" = true AND ol."partnerId" = ${tenantId}
            ORDER BY o."createdAt" DESC;
        `;

        return db.query(sqlQuery, {
            type: QueryTypes.SELECT,
        });
    } catch (error) {
        logger.error("QUERY :: [getOffersPublic]", {
            error: serializeError(error),
        });
        return [];
    }
}

const query_getOfferList = `
    SELECT
        o.slug,
        o.name,
        o.genre,
        o.ticker,
        o."isLaunchpad",
        ol.d_open,
        ol.d_close,
        ol."offerId",
        ofr."isPaused",
        ofr."isSettled"
    FROM
        "offer" o
            LEFT JOIN LATERAL (
            SELECT
                ol1.d_open,
                ol1.d_close,
                ol1."offerId"
            FROM
                "offerLimit" ol1
            WHERE
                ol1."offerId" = o.id AND (
                        (ol1."isTenantExclusive" = false AND ol1."partnerId" = :partnerId) OR
                        ol1."partnerId" = :tenantId
                )
            ORDER BY
                CASE
                    WHEN ol1."partnerId" = :tenantId THEN 1
                    WHEN ol1."partnerId" = :partnerId AND ol1."isTenantExclusive" = false THEN 2
                    ELSE 3
                    END
            LIMIT 1
            ) ol ON true
            LEFT JOIN "offerFundraise" ofr ON ofr."offerId" = o.id
    WHERE
        o.display = true AND
        o."isLaunchpad" = false AND
        o."isAccelerator" = false AND
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
        logger.error("QUERY :: [getOfferList]", {
            error: serializeError(error),
        });
    }
    return [];
}

const query_getLaunchpadList = `
    SELECT
        o.slug,
        o.name,
        o.genre,
        o.ticker,
        ol.d_open,
        ol.d_close,
        ol."offerId",
        ofr."isPaused",
        ofr."isSettled"
    FROM
        "offer" o
            LEFT JOIN LATERAL (
            SELECT
                ol1.d_open,
                ol1.d_close,
                ol1."offerId"
            FROM
                "offerLimit" ol1
            WHERE
                ol1."offerId" = o.id AND (
                        (ol1."isTenantExclusive" = false AND ol1."partnerId" = :partnerId) OR
                        ol1."partnerId" = :tenantId
                )
            ORDER BY
                CASE
                    WHEN ol1."partnerId" = :tenantId THEN 1
                    WHEN ol1."partnerId" = :partnerId AND ol1."isTenantExclusive" = false THEN 2
                    ELSE 3
                    END
            LIMIT 1
            ) ol ON true
            LEFT JOIN "offerFundraise" ofr ON ofr."offerId" = o.id
    WHERE
        o.display = true AND
        o."isLaunchpad" = true AND
        o."isAccelerator" = false AND
        ol."offerId" IS NOT NULL
    ORDER BY
        ol.d_open DESC;
`;
async function getLaunchpadList(partnerId, tenantId) {
    try {
        return await db.query(query_getLaunchpadList, {
            type: QueryTypes.SELECT,
            replacements: { partnerId, tenantId },
        });
    } catch (error) {
        logger.error("QUERY :: [getLaunchpadList]", {
            error: serializeError(error),
        });
    }
    return [];
}

const query_getOtcList = `
    SELECT
        o.slug,
        o.name,
        o.genre,
        o.otc,
        o.ticker,
        o."isAccelerator",
        ol.d_open,
        ol.d_close,
        ol."offerId"
    FROM
        "offer" o
            LEFT JOIN LATERAL (
            SELECT
                ol1.d_open,
                ol1.d_close,
                ol1."offerId"
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
async function getOtcList(partnerId, tenantId) {
    try {
        return await db.query(query_getOtcList, {
            type: QueryTypes.SELECT,
            replacements: { partnerId, tenantId },
        });
    } catch (error) {
        logger.error("QUERY :: [getOtcList]", {
            error: serializeError(error),
        });
    }
    return [];
}

const query_getOfferDetails = `
    SELECT
        o.*,
        ol.*,
        od.description
    FROM
        "offer" o
            LEFT JOIN
        "offerDescription" od ON o."descriptionId" = od.id
            LEFT JOIN LATERAL (
            SELECT
                ol1.*
            FROM
                "offerLimit" ol1
            WHERE
                ol1."offerId" = o.id AND (
                    (ol1."isTenantExclusive" = false AND ol1."partnerId" = :partnerId) OR
                    ol1."partnerId" = :tenantId
                )
            ORDER BY
                CASE
                    WHEN ol1."partnerId" = :tenantId THEN 1
                    WHEN ol1."partnerId" = :partnerId AND ol1."isTenantExclusive" = false THEN 2
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
        logger.error("QUERY :: [getOfferDetails]", {
            error: serializeError(error),
            slug,
        });
    }
    return {};
}

async function getOfferWithLimits(offerId) {
    try {
        const offer = await models.offer.findOne({
            where: { id: offerId },
            include: [
                {
                    model: models.offerLimit,
                    as: "offerLimits",
                },
                {
                    model: models.offerFundraise,
                    as: "offerFundraise",
                },
            ],
        });

        return offer ? offer.get({ plain: true }) : null;
    } catch (error) {
        console.error("Error fetching offer with limits:", error);
        return null;
    }
}

module.exports = {
    getOffersPublic,
    getOfferList,
    getOfferDetails,
    getLaunchpadList,
    getOtcList,
    getOfferWithLimits,
};

const { serializeError } = require("serialize-error");
const { Op, QueryTypes, Sequelize } = require("sequelize");
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
                WHERE o."displayPublic" = true 
                    AND (
                            (ol."isTenantExclusive" = true AND ol."partnerId" = ${NEXT_PUBLIC_TENANT} AND ${tenantId} = ${NEXT_PUBLIC_TENANT})
                            OR (ol."isTenantExclusive" = false)
                            OR (o."isOtcExclusive" = true AND o."broughtBy" = ${tenantId})
                        )
                    AND (ol."partnerId" = ${partnerId} OR ol."partnerId" = ${tenantId})
                ORDER BY o."createdAt" DESC;
            `;

        return db.query(sqlQuery, { type: QueryTypes.SELECT });
    } catch (error) {
        logger.error("QUERY :: [getOffersPublic]", {
            error: serializeError(error),
        });
        return [];
    }
}

const query_getOfferList = `
    WITH filtered_offers AS (
        SELECT
            o.slug,
            o.name,
            o.genre,
            o.ticker,
            o."isLaunchpad",
            ol.d_open,
            ol.d_close,
            ol."offerId",
            ol."isPaused",
            ol."isSettled",
            ol."isTenantExclusive"
        FROM
            "offer" o
            LEFT JOIN LATERAL (
                SELECT
                    ol1.d_open,
                    ol1.d_close,
                    ol1."offerId",
                    ol1."isPaused",
                    ol1."isSettled",
                    ol1."isTenantExclusive"
                FROM
                    "offerLimit" ol1
                WHERE
                    ol1."offerId" = o.id AND (
                        (o."isOtcExclusive" = true AND ol1."partnerId" = :tenantId AND CAST(o."broughtBy" AS INTEGER) = :tenantId) OR
                        (o."isOtcExclusive" = false AND ol1."partnerId" = :tenantId) OR
                        (o."isOtcExclusive" = false AND ol1."partnerId" = :partnerId)
                    )
                ORDER BY
                    CASE
                        WHEN ol1."isTenantExclusive" = true AND ol1."partnerId" = :tenantId THEN 0
                        WHEN ol1."partnerId" = :partnerId THEN 1
                        ELSE 2
                    END
                LIMIT 1
            ) ol ON true
        WHERE
            o.display = true AND
            o."isLaunchpad" = false AND
            o."isAccelerator" = false AND
            ol."offerId" IS NOT NULL AND
            (COALESCE(:isSettled::boolean, ol."isSettled") = ol."isSettled")
    )
    SELECT
        (SELECT COUNT(*) FROM filtered_offers) AS count,
        json_agg(t) AS rows
    FROM (
        SELECT
            *
        FROM
            filtered_offers
        ORDER BY
            d_open DESC
        LIMIT :limit OFFSET :offset
    ) t;
`;

async function getOfferList(partnerId, tenantId, { limit = 6, offset = 0, isSettled = null }) {
    try {
        const [offers] = await db.query(query_getOfferList, {
            type: QueryTypes.SELECT,
            replacements: { partnerId, tenantId, limit, offset, isSettled },
        });

        return {
            ...offers,
            limit,
            offset,
        };
    } catch (error) {
        logger.error("QUERY :: [getOfferList]", {
            error: serializeError(error),
        });
    }

    return { count: 0, rows: [] };
}

const query_getOfferProgress = `
    SELECT
        CASE 
            WHEN ol."alloTotal" > 0 THEN (ol."alloFilled" / ol."alloTotal") * 100
            ELSE 0
        END AS progress,
        ol."alloFilled" AS filled
    FROM
        "offerLimit" ol
    WHERE
        ol."offerId" = :offerId;
`;

async function getOfferProgress(offerId) {
    try {
        const result = await db.query(query_getOfferProgress, {
            type: QueryTypes.SELECT,
            replacements: { offerId },
        });

        return result.length > 0 ? result[0] : null;
    } catch (error) {
        logger.error("QUERY :: [getOfferProgress]", {
            error: serializeError(error),
        });
    }

    return null;
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
        ol."isPaused",
        ol."isSettled"
    FROM
        "offer" o
        LEFT JOIN LATERAL (
            SELECT
                ol1.d_open,
                ol1.d_close,
                ol1."offerId",
                ol1."isPaused",
                ol1."isSettled"
            FROM
                "offerLimit" ol1
            WHERE
                ol1."offerId" = o.id AND (
                    (o."isOtcExclusive" = true AND CAST(o."broughtBy" AS INTEGER) = :tenantId) OR
                    (o."isOtcExclusive" = false AND ol1."partnerId" IN (:partnerId, :tenantId))
                )
            ORDER BY
                CASE
                    WHEN o."isOtcExclusive" = true AND CAST(o."broughtBy" AS INTEGER) = :tenantId THEN 0
                    WHEN ol1."partnerId" = :tenantId THEN 1
                    WHEN ol1."partnerId" = :partnerId THEN 2
                    ELSE 3
                END
            LIMIT 1
        ) ol ON true
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
        o.ppu,
        o.genre,
        o.ticker,
        o.otc,
        o."dealStructure",
        o."isManaged",
        o."broughtBy",
        MAX(ol.d_close) AS "closedAt",
        p.logo AS "partnerLogo",
        p.name AS "partnerName",
        p.slug AS "partnerSlug",
        (
            SELECT COUNT(*)
            FROM "otcDeal" od
            WHERE od."offerId" = o.id
              AND od."isFilled" = FALSE
              AND od."isCancelled" = FALSE
              AND od."onchainIdMaker" IS NOT NULL
        ) AS "activeDealsCount"
    FROM
        "offer" o
            LEFT JOIN "offerLimit" ol ON o.id = ol."offerId"
            LEFT JOIN "partner" p ON CAST(o."broughtBy" AS INTEGER) = p.id
    WHERE
        o.otc != 0 AND
        (
                (o."isOtcExclusive" = FALSE) OR
                (o."isOtcExclusive" = TRUE AND ol."partnerId" = :tenantId)
        )
    GROUP BY
        o.id, p.id
    ORDER BY
        MAX(ol.d_close) DESC NULLS LAST;
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
        LEFT JOIN "offerDescription" od ON o."descriptionId" = od.id
        LEFT JOIN LATERAL (
            SELECT
                ol1.*
            FROM
                "offerLimit" ol1
            WHERE
                ol1."offerId" = o.id AND (
                    (o."isOtcExclusive" = true AND CAST(o."broughtBy" AS INTEGER) = :tenantId) OR
                    (o."isOtcExclusive" = false AND ol1."partnerId" IN (:partnerId, :tenantId))
                )
            ORDER BY
                CASE
                    WHEN o."isOtcExclusive" = true AND CAST(o."broughtBy" AS INTEGER) = :tenantId THEN 0
                    WHEN ol1."partnerId" = :tenantId THEN 1
                    WHEN ol1."partnerId" = :partnerId AND o."isOtcExclusive" = false THEN 2
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

async function getOfferDetails(slug, partnerId, tenantId, userId) {
    try {
        return await db.query(query_getOfferDetails, {
            type: QueryTypes.SELECT,
            replacements: { slug, partnerId, tenantId, userId },
        });
    } catch (error) {
        logger.error("QUERY :: [getOfferDetails]", {
            error: serializeError(error),
            slug,
        });
    }
    return {};
}

const query_getOfferFunding = `
    SELECT
        ol."alloRes",
        ol."alloFilled",
        ol."alloGuaranteed",
        ol."alloResInjected",
        ol."alloFilledInjected",
        ol."alloGuaranteedInjected",
        ol."alloRaised",
        ol."isPaused",
        ol."isSettled",
        ol."isRefund"
    FROM
        "offerLimit" ol
    WHERE
        ol."offerId" = :offerId
        AND (
            (ol."isTenantExclusive" = true AND :tenantId IS NOT NULL AND ol."partnerId" = :tenantId)
            OR (ol."isTenantExclusive" = false)
        )
        AND (
            (ol."isOtcExclusive" = true AND :tenantId = ol."broughtBy")
            OR (ol."isOtcExclusive" = false)
        )
    ORDER BY
        CASE
            WHEN ol."partnerId" = :tenantId THEN 1
            WHEN ol."partnerId" = :partnerId THEN 2
            ELSE 3
        END
    LIMIT 1;
`;

async function getOfferFunding(offerId, partnerId, tenantId) {
    try {
        return await db.query(query_getOfferFunding, {
            type: QueryTypes.SELECT,
            replacements: { offerId, partnerId, tenantId },
        });
    } catch (error) {
        logger.error("QUERY :: [getOfferFunding]", {
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
            ],
        });

        return offer ? offer.get({ plain: true }) : null;
    } catch (error) {
        console.error("Error fetching offer with limits:", error);
        return null;
    }
}

async function getAllocation(userId) {
    try {
        return models.vault.findAll({
            attributes: ["id", "offerId", "invested", "locked", [Sequelize.literal("invested - locked"), "allocation"]],
            where: {
                userId,
                invested: {
                    [Op.ne]: 0,
                },
            },
            raw: true,
        });
    } catch (error) {
        logger.error("QUERY :: [getAllocation]", {
            error: serializeError(error),
        });

        return [];
    }
}

async function getOfferParticipants(offerId, userId) {
    try {
        return models[`z_participant_${offerId}`].findAll({
            where: {
                userId,
            },
        });
    } catch (error) {
        logger.error("QUERY :: [getOfferParticipants]", {
            error: serializeError(error),
        });

        return [];
    }
}

module.exports = {
    getOffersPublic,
    getOfferList,
    getOfferProgress,
    getOfferDetails,
    getOfferFunding,
    getLaunchpadList,
    getOtcList,
    getOfferWithLimits,
    getAllocation,
    getOfferParticipants,
};

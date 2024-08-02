import { getPaginationParams, getWhereClause } from "../utils";
const { models } = require("../services/db/definitions/db.init");

function getReferralsInteractiveKeys() {
    const referralsStrictKeys = ["userId", "id", "webhookId"];
    const referralsQueryKeys = ["userId", "id", "webhookId"];

    return { referralsStrictKeys, referralsQueryKeys };
}

async function constructReferralsWhereClause(filters) {
    const { announcementsStrictKeys, announcementsWalletsJsonKeys, webhookMainKeys } = getReferralsInteractiveKeys();
    const announcementsWhereClause = getWhereClause(filters, [], announcementsStrictKeys, announcementsWalletsJsonKeys);
    const webhooksWhereClause = getWhereClause(filters, webhookMainKeys);

    // if (filters.updatedAt) {
    //     announcementsWhereClause.updatedAt = Sequelize.where(
    //         Sequelize.cast(Sequelize.col("announcement.updatedAt"), "varchar"),
    //         { [Sequelize.Op.iLike]: `${filters.updatedAt}%` },
    //     );
    // }
    //
    // if (filters.createdAt) {
    //     announcementsWhereClause.createdAt = Sequelize.where(
    //         Sequelize.cast(Sequelize.col("announcement.createdAt"), "varchar"),
    //         { [Sequelize.Op.iLike]: `${filters.createdAt}%` },
    //     );
    // }

    return { announcementsWhereClause, webhooksWhereClause };
}

function constructReferralsOrder(sortId, sortOrder) {
    const defaultSort = ["updatedAt", "DESC"];

    let announcementOrder = [defaultSort];

    if (!!sortId && !!sortOrder) {
        announcementOrder = [[sortId, sortOrder], defaultSort];
    }

    return announcementOrder;
}

async function getReferrals(req) {
    const { sortId, sortOrder, ...filters } = req.query;
    const { limit, offset, currentPage } = getPaginationParams(req);

    try {
        const { announcementsWhereClause, webhooksWhereClause } = await constructReferralsWhereClause(filters);

        const order = constructReferralsOrder(sortId, sortOrder);

        const { count, rows } = await models.announcement.findAndCountAll({
            where: announcementsWhereClause,
            order,
            limit,
            offset,
        });

        return {
            ok: true,
            data: rows,
            pagination: {
                totalRecords: count,
                currentPage,
                totalPages: Math.ceil(count / limit),
            },
        };
    } catch (error) {
        return constructError(ErrorTypes.QUERY, error, { isLog: true, methodName: "getAnnouncements" });
    }
}

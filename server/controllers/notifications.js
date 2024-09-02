const { z } = require("zod");
const axios = require("axios");
const queries = require("../queries/notifications.query");
const logger = require("../services/logger");
const { tenantIndex } = require("../../src/lib/utils");
const { getNotifications, getExtendedNotification } = require("../queries/notifications.query");
const { verifyID } = require("../../src/lib/authHelpers");

/**
 * @param {Record<string, any> & { id: number }} user
 * @param {import("express").Request} request
 * @returns {Promise<import("sequelize").Model[]>}
 */
async function getNotificationsByParams(user, request) {
    return getNotifications(user, { ...request.query });
}

/**
 * @param {number} id
 */
async function getNotificationData(id) {
    return getExtendedNotification(id);
}

async function getNotificationChannels(req, res) {
    const result = await queries.getNotificationChannels();
    return res.status(200).json({
        ok: true,
        ...result,
    });
}

async function getNotificationPreferences(req, res) {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    const { userId, tenantId } = user;
    try {
        const preferences = await queries.getNotificationPreferences(userId, tenantId);
        return res.json({
            ok: true,
            preferences,
        });
    } catch (error) {
        logger.error(`ERROR :: [getNotificationPreferences] ${error.message}`);
        return res.status(400).json({
            ok: false,
            error,
        });
    }
}

async function setNotificationPreferences(req, res) {
    const { auth, user } = await verifyID(req);
    if (!auth) return res.status(401).json({});

    const { userId, tenantId } = user;
    try {
        const schema = z.object({
            updates: z.array(
                z.object({
                    categoryId: z.string(),
                    channelId: z.string(),
                    enabled: z.boolean(),
                }),
            ),
        });
        const { updates } = schema.parse(req.body);
        const updated = await queries.setNotificationPreferences(userId, tenantId, updates);
        return res.status(200).json({
            ok: true,
            updated,
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            error,
        });
    }
}

async function subscribeToTopic(req, res) {
    try {
        const schema = z.object({
            categoryId: z.string(),
            token: z.string(),
        });
        const { categoryId, token } = schema.parse(req.body);
        return axios
            .post(process.env.MESSENGER_PUSH_SUBSCRIBE_URL, {
                categoryId,
                token,
                tenantId: tenantIndex,
            })
            .then(({ data }) => {
                return res.json({
                    ok: data.ok,
                    message: data.message ?? data.error,
                });
            })
            .catch((err) => {
                return res.status(400).json({
                    ok: false,
                    error: err.message,
                });
            });
    } catch (err) {
        return res.status(400).json({
            ok: false,
            error: err.message,
        });
    }
}

async function unsubscribeFromTopic(req, res) {
    try {
        const schema = z.object({
            categoryId: z.string(),
            tenantId: z.number(),
            token: z.string(),
        });
        const body = schema.parse(req.body);
        return axios
            .delete(process.env.MESSENGER_PUSH_SUBSCRIBE_URL, {
                data: {
                    ...body,
                },
            })
            .then(({ data }) => {
                return res.json({
                    ok: data.ok,
                    message: data.message ?? data.error,
                });
            })
            .catch((err) => {
                return res.status(400).json({
                    ok: false,
                    error: err.message,
                });
            });
    } catch (err) {
        return res.status(400).json({
            ok: false,
            error: err.message,
        });
    }
}

module.exports = {
    getNotificationsByParams,
    getNotificationData,
    getNotificationChannels,
    getNotificationPreferences,
    setNotificationPreferences,
    subscribeToTopic,
    unsubscribeFromTopic,
};

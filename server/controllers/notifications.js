const { ZodError } = require("zod");
const axios = require("axios");
const queries = require("../queries/notifications.query");
const { tenantIndex } = require("../../src/lib/utils");
const { getNotifications, getExtendedNotification } = require("../queries/notifications.query");
const {
    NotificationPreferencesUpdateSchema,
    TopicSubscriptionSchema,
    TopicUnsubscribeSchema,
} = require("../schemas/notifications.schema");

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

async function getNotificationChannels(_req, res) {
    try {
        const result = await queries.getNotificationChannels();
        return res.status(200).json({
            ok: true,
            ...result,
        });
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                ok: false,
                error: err.errors,
            });
        }
        return res.status(400).json({
            ok: false,
            error: err.message,
        });
    }
}

async function getNotificationPreferences(req, res) {
    const { userId, tenantId } = req.user;
    try {
        const preferences = await queries.getNotificationPreferences(userId, tenantId);
        return res.json({
            ok: true,
            preferences,
        });
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                ok: false,
                error: err.errors,
            });
        }
        return res.status(400).json({
            ok: false,
            error: err.message,
        });
    }
}

async function setNotificationPreferences(req, res) {
    const { userId } = req.user;
    try {
        const { updates } = NotificationPreferencesUpdateSchema.parse(req.body);
        const updated = await queries.setNotificationPreferences(userId, tenantIndex, updates);
        return res.status(200).json({
            ok: true,
            updated,
        });
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                ok: false,
                error: err.errors,
            });
        }
        return res.status(400).json({
            ok: false,
            error: err.message,
        });
    }
}

async function subscribeToTopic(req, res) {
    try {
        const { categoryId, token } = TopicSubscriptionSchema.parse(req.body);
        const { data } = await axios.post(process.env.MESSENGER_PUSH_SUBSCRIBE_URL, {
            categoryId,
            token,
            tenantId: tenantIndex,
        });
        return res.json({
            ok: data.ok,
            message: data.message ?? data.error,
        });
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                ok: false,
                error: err.errors,
            });
        }
        return res.status(400).json({
            ok: false,
            error: err.message,
        });
    }
}

async function unsubscribeFromTopic(req, res) {
    try {
        const body = TopicUnsubscribeSchema.parse(req.body);
        const { data } = await axios.delete(process.env.MESSENGER_PUSH_SUBSCRIBE_URL, {
            data: {
                ...body,
            },
        });
        return res.json({
            ok: data.ok,
            message: data.message ?? data.error,
        });
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                ok: false,
                error: err.errors,
            });
        }
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

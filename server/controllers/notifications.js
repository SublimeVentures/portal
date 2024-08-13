const { z } = require("zod");
const queries = require("../queries/notifications.query");
const logger = require("../services/logger");

async function getNotificationChannels(req, res) {
    const result = await queries.getNotificationChannels();
    return res.status(200).json({
        ok: true,
        ...result,
    });
}

async function getNotificationPreferences(req, res) {
    const { userId, tenantId } = req.user;
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
    const { userId, tenantId } = req.user;
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

module.exports = {
    getNotificationChannels,
    getNotificationPreferences,
    setNotificationPreferences,
};

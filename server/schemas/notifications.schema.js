const { z } = require("zod");

const NotificationPreferencesUpdateSchema = z.object({
    updates: z.array(
        z.object({
            categoryId: z.string(),
            channelId: z.string(),
            enabled: z.boolean(),
        }),
    ),
});

const TopicSubscriptionSchema = z.object({
    categoryId: z.string(),
    token: z.string(),
});

const TopicUnsubscribeSchema = z.object({
    categoryId: z.string(),
    tenantId: z.number(),
    token: z.string(),
});

module.exports = {
    NotificationPreferencesUpdateSchema,
    TopicSubscriptionSchema,
    TopicUnsubscribeSchema,
};

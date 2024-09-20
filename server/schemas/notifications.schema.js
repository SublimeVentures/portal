import { z } from "zod";

export const NotificationPreferencesUpdateSchema = z.object({
    updates: z.array(
        z.object({
            categoryId: z.string(),
            channelId: z.string(),
            enabled: z.boolean(),
        }),
    ),
});

export const TopicSubscriptionSchema = z.object({
    categoryId: z.string(),
    token: z.string(),
});

export const TopicUnsubscribeSchema = z.object({
    categoryId: z.string(),
    tenantId: z.number(),
    token: z.string(),
});

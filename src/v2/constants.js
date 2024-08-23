// Source https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
const settingsKeyValues = {
    wallets: "wallets",
};

const notificationsKeyValues = {
    notifications: "notifications",
    lastNotifications: "last-notifications",
};

export const settingsKeys = {
    wallets: [settingsKeyValues.wallets],
    userWallets: (userId) => [...settingsKeys.wallets, { userId }],
};

export const notificationKeys = {
    notifications: [notificationsKeyValues.notifications],
    queryNotifications: (query) => [...notificationKeys.notifications, query],
    lastNotifications: [notificationsKeyValues.lastNotifications],
};

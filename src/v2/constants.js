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

export const newsKeys = {
    news: (query) => ["news", ...(query ? [query] : [])],
};

export const vaultKeys = {
    vault: (query) => ["vault", ...(query ? [query] : [])],
    vaultStats: (query) => [...vaultKeys.vault(null), "stats", ...(query ? [query] : [])],
};

export const offersKeys = {
    offers: (query) => ["offers", ...(query ? [query] : [])],
};

export const storeOwnedItemsKeys = {
    storeOwnedItems: (query) => ["store-items", "owned", ...(query ? [query] : [])],
};

export const payoutsKeys = {
    payouts: (query) => ["payouts", ...(query ? [query] : [])],
};

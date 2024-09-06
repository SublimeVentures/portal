// Source https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
const settingsKeyValues = {
    wallets: "wallets",
};

export const settingsKeys = {
    wallets: [settingsKeyValues.wallets],
    userWallets: (userId) => [...settingsKeys.wallets, { userId }],
};

const notificationsKeyValues = {
    notifications: "notifications",
    lastNotifications: "last-notifications",
};

export const notificationKeys = {
    notifications: [notificationsKeyValues.notifications],
    queryNotifications: (query) => [...notificationKeys.notifications, query],
    lastNotifications: [notificationsKeyValues.lastNotifications],
};

const offersKeyValues = {
    offersVc: "offers-vc",
    offerStats: "offer-stats",
    offerProgress: "offer-progress",
};

export const offersKeys = {
    offers: (query) => ["offers", ...(query ? [query] : [])],
    queryOffersVc: (query) => [...offersKeyValues.offersVc, query],
    queryOffersStats: (query) => [...offersKeyValues.offerStats, query],
    queryOfferProgress: (query) => [...offersKeyValues.offerProgress, query],
};

export const newsKeys = {
    news: (query) => ["news", ...(query ? [query] : [])],
};

export const vaultKeys = {
    vault: (query) => ["vault", ...(query ? [query] : [])],
    vaultStats: (query) => [...vaultKeys.vault(null), "stats", ...(query ? [query] : [])],
};

export const storeOwnedItemsKeys = {
    storeOwnedItems: (query) => ["store-items", "owned", ...(query ? [query] : [])],
};

export const payoutsKeys = {
    payouts: (query) => ["payouts", ...(query ? [query] : [])],
};

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
    offersVc: [offersKeyValues.offers],
    queryOffersVc: (query) => [...offersKeyValues.offersVc, query],
    queryOffersStats: (query) => [...offersKeyValues.offerStats, query],
    queryOfferProgress: (query) => [...offersKeyValues.offerProgress, query],
};

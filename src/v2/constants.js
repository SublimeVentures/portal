// Source https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
const createQueryKey = (key, query) => [key, ...(query ? [query] : [])];

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
export const newsKeys = {
    news: (query) => ["news", ...(query ? [query] : [])],
};

export const vaultKeys = {
    vault: (query) => ["vault", query ? JSON.stringify(query) : null],
    vaultStats: (query) => [...vaultKeys.vault(null), "stats", ...(query ? [query] : [])],
};

export const storeOwnedItemsKeys = {
    storeOwnedItems: (query) => ["store-items", "owned", ...(query ? [query] : [])],
};

export const payoutsKeys = {
    payouts: (query) => ["payouts", ...(query ? [query] : [])],
};

export const offersKeys = {
    offers: (query) => createQueryKey("offers", query),
    offersVc: (query) => createQueryKey("offers-vc", query),
    offersStats: (query) => createQueryKey("offers-stats", query),
    offerDetails: (query) => createQueryKey("offer-details", query),
    offerProgress: (query) => createQueryKey("offer-progress", query),
    offerAllocation: (query) => createQueryKey("offer-allocation", query),
    offerParticipants: (query) => createQueryKey("offer-participants", query),
};

export const userInvestmentsKeys = {
    userAllocation: (query) => createQueryKey("user-allocation", query),
    premiumOwned: (query) => createQueryKey("premium-owned", query),
};

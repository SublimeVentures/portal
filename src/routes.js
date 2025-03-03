import { PAGE } from "@/lib/enum/route";

export const API = {
    fetchWallets: "/api/settings/wallets",
    settingsWallet: "/api/settings/wallets/",
    settingsStake: "/api/settings/stake",
    fetchVault: "/api/vault/all",
    fetchPayout: "/api/payout/",
    fetchClaim: "/api/claim",
    reserveMysteryBox: "/api/mysterybox/reserve",
    claimMysterybox: "/api/mysterybox/claim",
    fetchStore: "/api/store",
    fetchStoreItemsOwned: "/api/store/owned",
    reserveUpgrade: "/api/store/reserve",
    publicInvestments: "/api/public/investments",
    offerList: "/api/offer",
    offerAllocation: "/api/offer/allocation/",
    offerDetails: "/api/offer/",
    auth: "/api/auth/login",
    environment: "/api/environment",
    publicPartners: "/api/public/partners",
    publicNeoTokyoEnvs: "/api/public/nt-calculator",
    publicKongzEnvs: "/api/public/kongz-calculator",
};

export default PAGE;

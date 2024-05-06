import { TENANT } from "@/lib/tenantHelper";

const copy = {
    [TENANT.basedVC]: {
        NAME: "basedVC",
        COMMUNITY: "web3",
    },
    [TENANT.NeoTokyo]: {
        NAME: "Citizen Capital",
        COMMUNITY: "NeoTokyo",
    },
    [TENANT.CyberKongz]: {
        NAME: "KongzCapital",
        COMMUNITY: "CyberKongz",
    },
    [TENANT.BAYC]: {
        NAME: "Apes Capital",
        COMMUNITY: "Bored Apes Yacht Club",
    },
};

export const getCopy = (name) => {
    return copy[process.env.NEXT_PUBLIC_TENANT][name];
};

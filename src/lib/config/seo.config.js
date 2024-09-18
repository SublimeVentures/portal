const { PAGE } = require("../enum/route");
const { TENANT } = require("../enum/tenant");

const template_based = {
    url: "https://basedvc.fund",
    og: {
        type: "website",
        url: "",
        title: "3",
        description: "",
        images: [
            {
                url: "https://cdn.basedvc.fund/webapp/og.jpg",
                width: 800,
                height: 600,
                alt: "Join basedVC",
                type: "image/jpeg",
            },
        ],
        siteName: "basedVC",
    },
    twitter: {
        handle: "@basedvcfund",
        site: "@basedvcfund",
        cardType: "summary_large_image",
    },
};

const template_CitCap = {
    url: "https://citizencapital.fund",
    og: {
        type: "website",
        url: "",
        title: "3",
        description: "",
        images: [
            {
                url: "https://cdn.citizencapital.fund/webapp/og_citcap.png",
                width: 800,
                height: 600,
                alt: "Join Citizen Capital",
                type: "image/jpeg",
            },
        ],
        siteName: "Citizen Capital",
    },
    twitter: {
        handle: "@CitCapFund",
        site: "@CitCapFund",
        cardType: "summary_large_image",
    },
};

const template_CyberKongz = {
    url: "https://kongzcapital.fund",
    og: {
        type: "website",
        url: "https://kongzcapital.fund",
        title: "3",
        description: "",
        images: [
            {
                url: "https://cdn.citizencapital.fund/webapp/og_kongz.png",
                width: 800,
                height: 600,
                alt: "Join KongzCapital",
                type: "image/jpeg",
            },
        ],
        siteName: "KongzCapital",
    },
    twitter: {
        handle: "@KongzCapital",
        site: "@KongzCapital",
        cardType: "summary_large_image",
    },
};

const template_BYAC = {
    url: "https://apes.capital",
    og: {
        type: "website",
        url: "https://apes.capital",
        title: "3",
        description: "",
        images: [
            {
                url: "https://cdn.citizencapital.fund/webapp/og_apes.png",
                width: 800,
                height: 600,
                alt: "Join BAYC & MAYC",
                type: "image/jpeg",
            },
        ],
        siteName: "Apes Capital",
    },
    twitter: {
        handle: "@Apes_Capital",
        site: "@Apes_Capital",
        cardType: "summary_large_image",
    },
};

const getSEOTenantConfig = (tenantIndex) => {
    switch (tenantIndex) {
        case TENANT.basedVC:
            return {
                NAME: "basedVC",
                COMMUNITY: "web3",
                INFO: template_based,
                DESCRIPTION: "DON’T BE EXIT LIQUIDITY. INVEST EARLY WITH THE WORLDS LEADING VC FUNDS.",
                PAGES: {
                    [PAGE.Landing]: {
                        url: template_based.url + PAGE.Landing,
                        title: "basedVC - invest ground floor",
                    },
                    [PAGE.Login]: {
                        url: template_based.url + PAGE.Login,
                        title: "basedVC - login",
                    },
                    [PAGE.Investments]: {
                        url: template_based.url + PAGE.Investments,
                        title: "basedVC - our investments",
                    },
                    [PAGE.Tokenomics]: {
                        url: template_based.url + PAGE.Tokenomics,
                        title: "basedVC - our tokenomics",
                    },
                    [PAGE.ToS]: {
                        url: template_based.url + PAGE.ToS,
                        title: "basedVC - terms of service",
                    },
                    [PAGE.Privacy]: {
                        url: template_based.url + PAGE.Privacy,
                        title: "basedVC - privacy policy",
                    },
                    [PAGE.NotFound]: {
                        url: template_based.url + PAGE.NotFound,
                        title: "basedVC - not found",
                    },
                },
            };
        case TENANT.NeoTokyo:
            return {
                NAME: "Citizen Capital",
                COMMUNITY: "NeoTokyo",
                INFO: template_CitCap,
                DESCRIPTION: "Official investment arm of Neo Tokyo! Invest with Citadel.",
                PAGES: {
                    [PAGE.Landing]: {
                        url: template_CitCap.url + PAGE.Landing,
                        title: "Citizen Capital - invest with Citadel",
                    },
                    [PAGE.Login]: {
                        url: template_CitCap.url + PAGE.Login,
                        title: "Citizen Capital - login",
                    },
                    [PAGE.Investments]: {
                        url: template_CitCap.url + PAGE.Investments,
                        title: "Citizen Capital - our investments",
                    },
                    [PAGE.Tokenomics]: {
                        url: template_CitCap.url + PAGE.Tokenomics,
                        title: "Citizen Capital - tokenomics",
                    },
                    [PAGE.ToS]: {
                        url: template_CitCap.url + PAGE.ToS,
                        title: "Citizen Capital - terms of service",
                    },
                    [PAGE.Privacy]: {
                        url: template_CitCap.url + PAGE.Privacy,
                        title: "Citizen Capital - privacy policy",
                    },
                    [PAGE.NotFound]: {
                        url: template_CitCap.url + PAGE.NotFound,
                        title: "Citizen Capital - not found",
                    },
                },
            };
        case TENANT.CyberKongz:
            return {
                NAME: "KongzCapital",
                COMMUNITY: "CyberKongz",
                INFO: template_CyberKongz,
                DESCRIPTION: "THE CYBERKONGZ COMMUNITY LED VC FUND.",
                PAGES: {
                    [PAGE.Landing]: {
                        url: template_CyberKongz.url + PAGE.Landing,
                        title: "KongzCapital - community led VC fund",
                    },
                    [PAGE.Login]: {
                        url: template_CyberKongz.url + PAGE.Login,
                        title: "KongzCapital - login",
                    },
                    [PAGE.Investments]: {
                        url: template_CyberKongz.url + PAGE.Investments,
                        title: "KongzCapital - our investments",
                    },
                    [PAGE.Tokenomics]: {
                        url: template_CyberKongz.url + PAGE.Tokenomics,
                        title: "KongzCapital - tokenomics",
                    },
                    [PAGE.ToS]: {
                        url: template_CyberKongz.url + PAGE.ToS,
                        title: "KongzCapital - terms of service",
                    },
                    [PAGE.Privacy]: {
                        url: template_CyberKongz.url + PAGE.Privacy,
                        title: "KongzCapital - privacy policy",
                    },
                    [PAGE.NotFound]: {
                        url: template_CyberKongz.url + PAGE.NotFound,
                        title: "KongzCapital - not found",
                    },
                },
            };
        case TENANT.BAYC:
            return {
                NAME: "Apes Capital",
                COMMUNITY: "Bored Apes Yacht Club",
                INFO: template_BYAC,
                DESCRIPTION: "THE BAYC & MAYC COMMUNITY LED VC FUND.",
                PAGES: {
                    [PAGE.Landing]: {
                        url: template_BYAC.url + PAGE.Landing,
                        title: "Apes Capital - community led VC fund",
                    },
                    [PAGE.Login]: {
                        url: template_BYAC.url + PAGE.Login,
                        title: "Apes Capital - login",
                    },
                    [PAGE.Investments]: {
                        url: template_BYAC.url + PAGE.Investments,
                        title: "Apes Capital - our investments",
                    },
                    [PAGE.Tokenomics]: {
                        url: template_BYAC.url + PAGE.Tokenomics,
                        title: "Apes Capital - tokenomics",
                    },
                    [PAGE.ToS]: {
                        url: template_BYAC.url + PAGE.ToS,
                        title: "Apes Capital - terms of service",
                    },
                    [PAGE.Privacy]: {
                        url: template_BYAC.url + PAGE.Privacy,
                        title: "Apes Capital - privacy policy",
                    },
                    [PAGE.NotFound]: {
                        url: template_BYAC.url + PAGE.NotFound,
                        title: "Apes Capital - not found",
                    },
                },
            };
        default:
            return null;
    }
};

module.exports = {
    getSEOTenantConfig,
};

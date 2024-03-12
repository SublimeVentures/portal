import PAGE from "@/routes";
import {TENANT} from "@/lib/tenantHelper";

const copy = {
    [TENANT.basedVC]: {
        NAME: "basedVC",
        ACCELERATOR: "Accelerator",
        COMMUNITY: "web3",

    },
    [TENANT.NeoTokyo]: {
        NAME: "Citizen Capital",
        ACCELERATOR: "CitCapX",
        COMMUNITY: "NeoTokyo",

    },
    [TENANT.CyberKongz]: {
        NAME: "KongzCapital",
        ACCELERATOR: "KongzCapX",
        COMMUNITY: "CyberKongz",
    }
}

export const getCopy = (name) => {
    return copy[process.env.NEXT_PUBLIC_TENANT][name]
}

export const seoConfig = (page) => {
    switch(Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC:{
            return seoBased(page)
        }
        case TENANT.NeoTokyo:{
            return seoNeoTokyo(page)
        }
        case TENANT.CyberKongz:{
            return seoCyberKongz(page)
        }
    }
}

const seoBased = (page) => {
        switch(page) {
            case PAGE.Landing: {
                return generateSeo(
                    "basedVC - invest ground floor",
                    "DON’T BE EXIT LIQUIDITY. INVEST EARLY WITH THE WORLDS LEADING VC FUNDS.",
                    template_based,
                    page
                )
            }
            case PAGE.Login: {
                return generateSeo(
                    "basedVC - login",
                    "DON’T BE EXIT LIQUIDITY. INVEST EARLY WITH THE WORLDS LEADING VC FUNDS.",
                    template_based,
                    page
                )
            }
            case PAGE.Investments: {
                return generateSeo(
                    "basedVC - our investments",
                    "DON’T BE EXIT LIQUIDITY. INVEST EARLY WITH THE WORLDS LEADING VC FUNDS.",
                    template_based,
                    page
                )
            }
            case PAGE.Tokenomics: {
                return generateSeo(
                    "basedVC - our tokenomics",
                    "DON’T BE EXIT LIQUIDITY. INVEST EARLY WITH THE WORLDS LEADING VC FUNDS.",
                    template_based,
                    page
                )
            }
            case PAGE.ToS: {
                return generateSeo(
                    "basedVC - terms of service",
                    "DON’T BE EXIT LIQUIDITY. INVEST EARLY WITH THE WORLDS LEADING VC FUNDS.",
                    template_based,
                    page
                )
            }
            case PAGE.Privacy: {
                return generateSeo(
                    "basedVC - privacy policy",
                    "DON’T BE EXIT LIQUIDITY. INVEST EARLY WITH THE WORLDS LEADING VC FUNDS.",
                    template_based,
                    page
                )
            }
        }
}
const seoNeoTokyo = (page) => {
        switch(page) {
            case PAGE.Landing: {
                return generateSeo(
                    "Citizen Capital - invest with Citadel",
                    "Official investment arm of Neo Tokyo! Invest with Citadel. ",
                    template_CitCap,
                    page
                )
            }
            case PAGE.Login: {
                return generateSeo(
                    "Citizen Capital - login",
                    "Official investment arm of Neo Tokyo! Invest with Citadel. ",
                    template_CitCap,
                    page
                )
            }
            case PAGE.Investments: {
                return generateSeo(
                    "Citizen Capital - our investments",
                    "Official investment arm of Neo Tokyo! Invest with Citadel. ",
                    template_CitCap,
                    page
                )
            }
            case PAGE.Tokenomics: {
                return generateSeo(
                    "Citizen Capital - tokenomics",
                    "Official investment arm of Neo Tokyo! Invest with Citadel. ",
                    template_CitCap,
                    page
                )
            }
            case PAGE.ToS: {
                return generateSeo(
                    "Citizen Capital - terms of service",
                    "fficial investment arm of Neo Tokyo! Invest with Citadel.",
                    template_CitCap,
                    page
                )
            }
            case PAGE.Privacy: {
                return generateSeo(
                    "Citizen Capital - privacy policy",
                    "fficial investment arm of Neo Tokyo! Invest with Citadel.",
                    template_CitCap,
                    page
                )
            }
        }
}
const seoCyberKongz = (page) => {
        switch(page) {
            case PAGE.Landing: {
                return generateSeo(
                    "KongzCapital - community led VC fund",
                    "THE CYBERKONGZ COMMUNITY LED VC FUND.",
                    template_CyberKongz,
                    page
                )
            }
            case PAGE.Login: {
                return generateSeo(
                    "KongzCapital - login",
                    "THE CYBERKONGZ COMMUNITY LED VC FUND.",
                    template_CyberKongz,
                    page
                )
            }
            case PAGE.Tokenomics: {
                return generateSeo(
                    "KongzCapital - tokenomics",
                    "How it works",
                    template_CyberKongz,
                    page
                )
            }
            case PAGE.ToS: {
                return generateSeo(
                    "KongzCapital - terms of service",
                    "THE CYBERKONGZ COMMUNITY LED VC FUND.",
                    template_CyberKongz,
                    page
                )
            }
            case PAGE.Privacy: {
                return generateSeo(
                    "KongzCapital - privacy policy",
                    "THE CYBERKONGZ COMMUNITY LED VC FUND.",
                    template_CyberKongz,
                    page
                )
            }
        }
}


const generateSeo = (title, description, source, extraUrl) =>{
    let template = {...source}

    template.title = title
    template.description = description
    template.url += extraUrl
    template.og.url = template.url
    template.og.title = template.title
    template.og.description = template.description

    return template
}

const template_based = {
        url: "https://basedvc.fund",
        og: {
            type: 'website',
            url: '',
            title: '3',
            description: '',
            images: [
                {
                    url: 'https://cdn.basedvc.fund/webapp/og.jpg',
                    width: 800,
                    height: 600,
                    alt: 'Join basedVC',
                    type: 'image/jpeg',
                },
            ],
            siteName: 'basedVC',
        },
        twitter: {
            handle: '@basedvcfund',
            site: '@basedvcfund',
            cardType: 'summary_large_image',
        }
}

const template_CitCap = {
        url: "https://citizencapital.fund",
        og: {
            type: 'website',
            url: '',
            title: '3',
            description: '',
            images: [
                {
                    url: 'https://cdn.citizencapital.fund/webapp/og_citcap.png',
                    width: 800,
                    height: 600,
                    alt: 'Join Citizen Capital',
                    type: 'image/jpeg',
                },
            ],
            siteName: 'Citizen Capital',
        },
        twitter: {
            handle: '@CitCapFund',
            site: '@CitCapFund',
            cardType: 'summary_large_image',
        }
}

const template_CyberKongz = {
        url: "https://kongzcapital.fund",
        og: {
            type: 'website',
            url: '',
            title: '3',
            description: '',
            images: [
                {
                    url: 'https://cdn.citizencapital.fund/webapp/og_kongz.png',
                    width: 800,
                    height: 600,
                    alt: 'Join KongzCapital',
                    type: 'image/jpeg',
                },
            ],
            siteName: 'KongzCapital',
        },
        twitter: {
            handle: '@KongzCapital',
            site: '@KongzCapital',
            cardType: 'summary_large_image',
        }
}

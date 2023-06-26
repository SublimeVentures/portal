import PAGE from "@/routes";

export const is3VC = process.env.NEXT_PUBLIC_SITE === "3VC" ? 1 : 0

const copy = {
    1: {
        NAME: "3VC",
    },
    0: {
        NAME: "Citizen Capital",
    }
}

export const getCopy = (name) => {
    return copy[is3VC][name]
}

export const seoConfig = (page) => {
    if(is3VC) {
        switch(page) {
            case PAGE.Landing: {
                return generateSeo(
                    "3VC - invest ground floor",
                    "DON’T BE EXIT LIQUIDITY. INVEST EARLY WITH THE WORLDS LEADING VC FUNDS.",
                    template_3VC,
                    page
                )
            }
            case PAGE.Login: {
                return generateSeo(
                    "3VC - login",
                    "DON’T BE EXIT LIQUIDITY. INVEST EARLY WITH THE WORLDS LEADING VC FUNDS.",
                    template_3VC,
                    page
                )
            }
            case PAGE.Investments: {
                return generateSeo(
                    "3VC - our investments",
                    "DON’T BE EXIT LIQUIDITY. INVEST EARLY WITH THE WORLDS LEADING VC FUNDS.",
                    template_3VC,
                    page
                )
            }
        }
    }
    else {
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

const template_3VC = {
        url: "https://3vc.fund",
        og: {
            type: 'website',
            url: '',
            title: '3',
            description: '',
            images: [
                {
                    url: 'https://cdn.3vc.fund/webapp/og.jpg',
                    width: 800,
                    height: 600,
                    alt: 'Join 3VC',
                    type: 'image/jpeg',
                },
            ],
            siteName: '3VC',
        },
        twitter: {
            handle: '@3VCfund',
            site: '@3VCfund',
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
                    url: 'https://cdn.3vc.fund/webapp/og.jpg',
                    width: 800,
                    height: 600,
                    alt: 'Join Citizen Capital',
                    type: 'image/jpeg',
                },
            ],
            siteName: '3VC',
        },
        twitter: {
            handle: '@CitCapFund',
            site: '@CitCapFund',
            cardType: 'summary_large_image',
        }
}

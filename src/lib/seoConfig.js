import PAGE from "@/routes";

export const seoConfig = (page) => {
    if(process.env.NEXT_PUBLIC_SITE==="3VC") {
        switch(page) {
            case PAGE.Landing: {
                return generateSeo(
                    "3VC - invest ground floor",
                    "DON'T BE EXIT LIQUIDITY. ACCESS OPPORTUNITIES.",
                    page
                )
            }
            case PAGE.Login: {
                return generateSeo(
                    "3VC - login",
                    "DON'T BE EXIT LIQUIDITY. ACCESS OPPORTUNITIES.",
                    page
                )
            }
            case PAGE.Investments: {
                return generateSeo(
                    "3VC - our investments",
                    "DON'T BE EXIT LIQUIDITY. ACCESS OPPORTUNITIES.",
                    page
                )
            }
        }
    }
}


const generateSeo = (title, description, extraUrl) =>{
    let template = {...template_3VC}

    template.title = title
    template.description = description
    template.url += extraUrl
    template.og.url = template.url
    template.og.title = template.title
    template.og.description = template.description

    return template
}

const template_3VC = {
        url: "https://www.3vc.fund",
        og: {
            type: 'website',
            url: '',
            title: '3',
            description: '',
            images: [
                {
                    url: 'https://www.example.ie/og-image-01.jpg',
                    width: 800,
                    height: 600,
                    alt: 'Og Image Alt',
                    type: 'image/jpeg',
                },
                {
                    url: 'https://www.example.ie/og-image-02.jpg',
                    width: 800,
                    height: 600,
                    alt: 'Og Image Alt2',
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

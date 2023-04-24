import HeroBg from "@/components/Home/HeroBg";
import {
    useQuery,
    dehydrate, QueryClient
} from '@tanstack/react-query'
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {fetchPublicInvestments} from "@/fetchers/public";
import { queryClient } from '@/lib/web3/queryCache'
import Head from "next/head";
import {NextSeo} from "next-seo";

export default function InvestmentsPublic() {
    const { isLoading, data, isError } = useQuery({
            queryKey: ["publicInvestment"],
            queryFn: fetchPublicInvestments,
            cacheTime: 180 * 60 * 1000,
            staleTime: 90 * 60 * 1000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );



    const renderList = () => {
        if(isLoading) {
            return;
        }
        if(isError) {
            return;
        }
        return (
                <ul className="masonry-list flex flex-wrap justify-center mx-auto sinvest:ml-0 sinvest:mr-0 ">
                    {data.map((el,i) => {
                        return <li className="tile-case" key={i}>
                            <a href={el.url_web} target="_blank">
                                <div className="tile-primary-content bgFit"
                                     style={{backgroundImage: 'url(' + el.image + ')'}}></div>
                                <div className="tile-secondary-content">
                                    <h2>{el.genre}</h2>
                                    <p>{el.name}</p>
                                </div>
                            </a>
                        </li>
                    })
                    }
                </ul>)
    }

    return (
        <>
            <NextSeo
                title="3VC - our investments"
                description="DON'T BE EXIT LIQUIDITY. ACCESS OPPORTUNITIES."
                canonical="https://www.3vc.fund/investments"
                openGraph={{
                    type: 'website',
                    url: 'https://www.3vc.fund/investments',
                    title: '3VC - login',
                    description: 'DON\'T BE EXIT LIQUIDITY. ACCESS OPPORTUNITIES.',
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
                }}
                twitter={{
                    handle: '@3VCfund',
                    site: '@3VCfund',
                    cardType: 'summary_large_image',
                }}
            />
            <HeroBg subtitle={'who we support'} title={'previous deals'} content={renderList()} extraClass={"investmentsPublic"}/>
        </>
    )
}


export const getServerSideProps = async() => {
    await queryClient.prefetchQuery({
        queryKey: ["publicInvestment"],
        queryFn: fetchPublicInvestments,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000
    })
    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    }
}

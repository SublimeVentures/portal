import HeroBg from "@/components/Home/HeroBg";
import {
    useQuery,
    dehydrate
} from '@tanstack/react-query'
import {fetchPortfolio} from "@/fetchers/public.fecher";
import { queryClient } from '@/lib/queryCache'
import {NextSeo} from "next-seo";
import {seoConfig} from "@/lib/seoConfig";
import PAGE from "@/routes";

export default function Portfolio() {
    const seo = seoConfig(PAGE.Portfolio)
    const { isLoading, data, isError } = useQuery({
            queryKey: ["portfolio"],
            queryFn: fetchPortfolio,
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
                                     style={{backgroundImage: 'url(https://cdn.3vc.fund/research/' + el.slug + '/logo.jpg)'}}></div>
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
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />
            <HeroBg subtitle={'who we support'} title={'previous deals'} content={renderList()} extraClass={"investmentsPublic"}/>
        </>
    )
}


export const getServerSideProps = async() => {
    await queryClient.prefetchQuery({
        queryKey: ["portfolio"],
        queryFn: fetchPortfolio,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000
    })
    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    }
}

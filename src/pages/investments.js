import { useQuery, dehydrate } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import HeroBg from "@/components/Home/HeroBg";
import { fetchPublicInvestments } from "@/fetchers/public.fecher";
import { queryClient } from "@/lib/queryCache";
import { PAGE } from "@/lib/enum/route";
import { getTenantConfig } from "@/lib/tenantHelper";

const {
    DESCRIPTION,
    INFO: { og, twitter },
    PAGES: {
        [PAGE.Investments]: { title, url },
    },
} = getTenantConfig().seo;

export default function InvestmentsPublic() {
    const { isLoading, data, isError } = useQuery({
        queryKey: ["publicInvestment"],
        queryFn: fetchPublicInvestments,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const renderList = () => {
        if (isLoading) {
            return;
        }
        if (isError) {
            return;
        }
        return (
            <ul className="masonry-list flex flex-wrap justify-center mx-auto sinvest:ml-0 sinvest:mr-0 ">
                {data.map((el, i) => {
                    return (
                        <li className="tile-case" key={i}>
                            <a href={el.url_web} target="_blank" rel="noreferrer">
                                <div
                                    className="tile-primary-content bgFit"
                                    style={{
                                        backgroundImage:
                                            "url(https://cdn.basedvc.fund/research/" + el.slug + "/logo.jpg)",
                                    }}
                                />
                                <div className="tile-secondary-content">
                                    <h2>{el.genre}</h2>
                                    <p>{el.name}</p>
                                </div>
                            </a>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <>
            <NextSeo title={title} description={DESCRIPTION} canonical={url} openGraph={og} twitter={twitter} />
            <HeroBg
                subtitle={"who we support"}
                title={"previous deals"}
                content={renderList()}
                extraClass={"investmentsPublic"}
            />
        </>
    );
}

export const getServerSideProps = async () => {
    await queryClient.prefetchQuery({
        queryKey: ["publicInvestment"],
        queryFn: fetchPublicInvestments,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000,
    });
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
};

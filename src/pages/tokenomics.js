import HeroBg from "@/components/Home/HeroBg";
import {
    useQuery,
    dehydrate
} from '@tanstack/react-query'
import {fetchPublicInvestments} from "@/fetchers/public.fecher";
import { queryClient } from '@/lib/queryCache'
import {NextSeo} from "next-seo";
import {seoConfig} from "@/lib/seoConfig";
import PAGE from "@/routes";
import {isBased} from "@/lib/utils";
import TokenomicsCitCap from "@/components/Tokenomics";

export default function InvestmentsPublic() {
    const seo = seoConfig(PAGE.Tokenomics)

    const renderList = () => {
        if(!isBased) {
            return <TokenomicsCitCap/>
        }
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
            <HeroBg subtitle={'our tokenomics'} title={'how it works'} content={renderList()} extraClass={"investmentsPublic"}/>
        </>
    )
}


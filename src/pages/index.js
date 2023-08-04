import { NextSeo } from 'next-seo';
import {seoConfig} from "@/lib/seoConfig";
import PAGE from "@/routes";
import {verifyID} from "@/lib/authHelpers";
import HomeBased from "@/components/Home";
import HomeCitCap from "@/components/HomeCitCap";
import {isBased} from "@/lib/utils";

export default function Home({account}) {
  const seo = seoConfig(PAGE.Landing)
  return (
    <>
        <NextSeo
            title={seo.title}
            description={seo.description}
            canonical={seo.url}
            openGraph={seo.og}
            twitter={seo.twitter}
        />

        {isBased ? <HomeBased account={account}/> : <HomeCitCap account={account}/>}
    </>
  )
}

export const getServerSideProps = async ({res}) => {
    const account = await verifyID(res.req)
    return {
        props: {
            account: account?.user ? account.user : null,
        }
    }
}

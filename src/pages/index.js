import { NextSeo } from 'next-seo';
import {is3VC, seoConfig} from "@/lib/seoConfig";
import PAGE from "@/routes";
import {verifyID} from "@/lib/authHelpers";
import Home3VC from "@/components/Home3VC";
import HomeCitCap from "@/components/HomeCitCap";

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

        {is3VC ? <Home3VC account={account}/> : <HomeCitCap account={account}/>}
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

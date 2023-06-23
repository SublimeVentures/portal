import Hero from "@/components/Home/Hero";
import Highlights from "@/components/Home/Highlights";
import Investors from "@/components/Home/Investors";
import About from "@/components/Home/About";
import Callout from "@/components/Home/Callout";
import { NextSeo } from 'next-seo';
import {seoConfig} from "@/lib/seoConfig";
import PAGE from "@/routes";
import {verifyID} from "@/lib/authHelpers";

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
        <Hero account={account}/>
      <Highlights/>
      <Investors/>
      <About/>
      <Callout/>
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

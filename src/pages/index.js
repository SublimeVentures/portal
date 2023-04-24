import Hero from "@/components/Home/Hero";
import Highlights from "@/components/Home/Highlights";
import Investors from "@/components/Home/Investors";
import About from "@/components/Home/About";
import Callout from "@/components/Home/Callout";
import { NextSeo } from 'next-seo';
import {seoConfig} from "@/lib/seoConfig";
import PAGE from "@/routes";

export default function Home() {
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
      <Hero/>
      <Highlights/>
      <Investors/>
      <About/>
      <Callout/>
    </>
  )
}

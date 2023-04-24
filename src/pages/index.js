// import { Inter } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'] })
// import styles from '@/styles/Home.module.css'
import Hero from "@/components/Home/Hero";
import Highlights from "@/components/Home/Highlights";
import Investors from "@/components/Home/Investors";
import About from "@/components/Home/About";
import Callout from "@/components/Home/Callout";
import Head from "next/head";
import { NextSeo } from 'next-seo';

export default function Home() {

  return (
    <>
        <NextSeo
            title="3VC - invest ground floor"
            description="DON'T BE EXIT LIQUIDITY."
            canonical="https://www.3vc.fund/"
            openGraph={{
                type: 'website',
                url: 'https://www.3vc.fund/',
                title: '3VC - invest ground floor',
                description: 'DON\'T BE EXIT LIQUIDITY.',
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
      <Hero/>
      <Highlights/>
      <Investors/>
      <About/>
      <Callout/>
    </>
  )
}

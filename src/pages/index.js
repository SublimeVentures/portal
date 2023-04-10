// import { Inter } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'] })
// import styles from '@/styles/Home.module.css'
import Hero from "@/components/Home/Hero";
import Highlights from "@/components/Home/Highlights";
import Investors from "@/components/Home/Investors";
import About from "@/components/Home/About";
import Callout from "@/components/Home/Callout";

export default function Home() {

  return (
    <>
      <Hero/>
      <Highlights/>
      <Investors/>
      <About/>
      <Callout/>
    </>
  )
}

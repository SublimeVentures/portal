import Hero from "@/components/HomeCitCap/Hero";
import Highlights from "@/components/HomeCitCap/Highlights";
import About from "@/components/HomeCitCap/About";
import Callout from "@/components/HomeCitCap/Callout";
import Investors from "@/components/Home3VC/Investors";


export default function HomeCitCap({account}) {
    return (
        <>
            <Hero account={account}/>
            <Highlights/>
            <Investors/>
            <About/>
            <Callout/>
        </>
    )
}


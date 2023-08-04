import Hero from "@/components/Home/Hero";
import Highlights from "@/components/Home/Highlights";
import Investors from "@/components/Home/Investors";
import About from "@/components/Home/About";
import Callout from "@/components/Home/Callout";


export default function HomeBased({account}) {
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


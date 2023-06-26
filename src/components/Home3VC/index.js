import Hero from "@/components/Home3VC/Hero";
import Highlights from "@/components/Home3VC/Highlights";
import Investors from "@/components/Home3VC/Investors";
import About from "@/components/Home3VC/About";
import Callout from "@/components/Home3VC/Callout";


export default function Home3VC({account}) {
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


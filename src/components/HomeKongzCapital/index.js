import Hero from "@/components/HomeKongzCapital/Hero";
import Highlights from "@/components/HomeKongzCapital/Highlights";
import Callout from "@/components/HomeKongzCapital/Callout";


export default function HomeKongzCapital({account}) {
    return (
        <>
            <Hero account={account}/>
            <Highlights/>
            <Callout/>
        </>
    )
}


import Hero from "@/components/Home/Hero";
import Highlights from "@/components/Home/Highlights";
import Investors from "@/components/Home/Investors";
import About from "@/components/Home/About";
import Callout from "@/components/Home/Callout";

export default function HomeBased({ account }) {
    return (
        <>
            <Hero account={account} />
            <Highlights />
            <Investors className="bg-[linear-gradient(to_bottom,rgba(16,19,27,1)_0%,rgba(16,19,27,1)_85%,rgba(14,17,24,1)_100%)]" />
            <About />
            <Callout />
        </>
    );
}

import Hero from "@/components/HomeApesCapital/Hero";
import Highlights from "@/components/HomeApesCapital/Highlights";
import Callout from "@/components/HomeApesCapital/Callout";

export default function HomeBAYCCapital({ account }) {
    return (
        <>
            <Hero account={account} />
            <Highlights />
            <Callout />
        </>
    );
}

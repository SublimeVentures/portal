import Hero from "@/components/HomeKongzCapital/Hero";
import Highlights from "@/components/HomeKongzCapital/Highlights";
import Callout from "@/components/HomeKongzCapital/Callout";
import ErrorProvider from "@/components/SignupFlow/ErrorProvider";

export default function HomeKongzCapital({ account }) {
    return (
        <ErrorProvider>
            <Hero account={account} />
            <Highlights />
            <Callout />
        </ErrorProvider>
    );
}

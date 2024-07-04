import Hero from "@/components/HomeApesCapital/Hero";
import Highlights from "@/components/HomeApesCapital/Highlights";
import Callout from "@/components/HomeApesCapital/Callout";
import ErrorProvider from "@/components/SignupFlow/ErrorProvider";

export default function HomeBAYCCapital({ account }) {
    return (
        <ErrorProvider>
            <Hero account={account} />
            <Highlights />
            <Callout />
        </ErrorProvider>
    );
}

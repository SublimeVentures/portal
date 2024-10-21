import Hero from "@/components/HomeCitCap/Hero";
import Highlights from "@/components/HomeCitCap/Highlights";
import About from "@/components/HomeCitCap/About";
import Callout from "@/components/HomeCitCap/Callout";
import Investors from "@/components/Home/Investors";
import ErrorProvider from "@/components/SignupFlow/ErrorProvider";

export default function HomeCitCap({ account }) {
    return (
        <ErrorProvider>
            <Hero account={account} />
            <Highlights />
            <Investors className="bg-black" />
            <About />
            <Callout />
        </ErrorProvider>
    );
}

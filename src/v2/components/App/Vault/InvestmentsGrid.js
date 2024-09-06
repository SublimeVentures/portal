import { InvestmentCard } from "@/v2/components/App/Vault";

export default function InvestmentsGrid({ investments = [], isLoading = false }) {
    return (
        <ul className="grid gap-2 sm:gap-4 lg:gap-8 3xl:gap-12 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-5 4xl:grid-cols-6 5xl:grid-cols-7">
            {investments.map((item) => (
                <li key={item.slug}>
                    <InvestmentCard details={item} isLoading={isLoading} key={item.slug} />
                </li>
            ))}
        </ul>
    );
}

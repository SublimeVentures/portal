import { InvestmentCard } from "@/v2/components/App/Vault";

export default function InvestmentsGrid({ investments = [], isLoading = false }) {
    return (
        <ul className="grid gap-2 lg:gap-8 3xl:gap-12 grid-cols-[repeat(auto-fit,minmax(170px,1fr))] lg:grid-cols-[repeat(auto-fit,minmax(190px,1fr))] 3xl:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
            {investments.map((item) => (
                <li key={item.slug}>
                    <InvestmentCard details={item} isLoading={isLoading} key={item.slug} />
                </li>
            ))}
        </ul>
    );
}

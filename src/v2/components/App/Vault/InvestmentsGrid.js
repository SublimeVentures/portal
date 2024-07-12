import { InvestmentCard } from "@/v2/components/App/Vault";

export default function InvestmentsGrid({ investments = [], isLoading = false }) {
    return (
        <ul className="grid gap-2 md:gap-12 grid-cols-[repeat(auto-fit,minmax(170px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] -mr-3">
            {investments.map((item) => (
                <li key={item.slug}>
                    <InvestmentCard details={item} isLoading={isLoading} key={item.slug} />
                </li>
            ))}
        </ul>
    );
}

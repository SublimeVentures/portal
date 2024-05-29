import { ViewRadio, UpgradeBanner } from "@/v2/components/App/Vault";
import { Button } from "@/v2/components/ui/button";

export default function InvestmentsList({ investments, viewOptions = {} }) {
    return (
        <div className="py-4 flex flex-col flex-wrap gap-8 md:px-16 lg:flex-row lg:items-center">
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-foreground lg:font-regular">My Investments ({investments.length + 1})</h3>
                <ViewRadio viewOptions={viewOptions} />
            </div>

            <div className="flex items-center flex-wrap gap-y-2 gap-x-4">
                <Button variant="tertiary">Filters</Button>
                <Button variant="secondary">Progress</Button>
                <Button variant="secondary">TGE</Button>
                <Button variant="secondary">New</Button>
            </div>

            <UpgradeBanner className="hidden ml-auto 2xl:block" />
        </div>
    );
}

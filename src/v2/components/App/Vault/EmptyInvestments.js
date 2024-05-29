import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import { Button } from "@/v2/components/ui/button";

// min-w-[600px]
const EmptyInvestments = () => {
    return (
        <Card variant="none" border="none" className="p-0 w-full bg-empty-investment-pattern bg-cover bg-center bg-no-repeat">
            <div className="py-24 px-20 flex flex-col gap-4">
                <CardTitle className="text-2xl">No investments found</CardTitle>
                <CardDescription className="max-w-lg text-9xl font-semibold">Explore elite investment avenues curated for the astute investor</CardDescription>

                <div className="flex items-center gap-4">
                    <Button variant="outline">OTC market</Button>
                    <Button>Opportunities</Button>
                </div>
            </div>
        </Card>
    )
}

export default EmptyInvestments;

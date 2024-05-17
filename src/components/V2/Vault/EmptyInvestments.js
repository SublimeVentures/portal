import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EmptyInvestments = () => {
    return (
        <Card variant="none" border="none" className="p-0 w-full min-w-[900px] bg-empty-investment-pattern bg-cover bg-center bg-no-repeat">
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

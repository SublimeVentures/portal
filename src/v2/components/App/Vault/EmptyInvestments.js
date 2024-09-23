import Link from "next/link";
import { Card, CardDescription, CardTitle } from "@/v2/components/ui/card";
import { Button } from "@/v2/components/ui/button";
import PAGE from "@/routes";

const EmptyInvestments = () => {
    return (
        <Card
            variant="none"
            border="none"
            className="p-0 grow bg-empty-investment-pattern bg-cover bg-center bg-no-repeat"
        >
            <div className="h-full py-16 px-4 md:px-20 flex flex-col items-center justify-center md:items-start gap-4 text-center md:text-left">
                <CardTitle className="text-sm md:text-base font-normal">No investments found</CardTitle>
                <CardDescription className="text-lg md:text-2xl font-semibold md:font-medium">
                    Explore elite investment avenues
                    <br />
                    curated for the astute investor
                </CardDescription>

                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link href={PAGE.OTC}>OTC Market</Link>
                    </Button>
                    <Button>
                        <Link href={PAGE.Opportunities}>Opportunities</Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default EmptyInvestments;

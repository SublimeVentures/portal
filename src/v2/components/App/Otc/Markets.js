import SingleMarket from "./SingleMarket";
import { Card } from "@/v2/components/ui/card";
import { Search } from "@/v2/components/Fields";

export default function OtcMarkets({ propMarkets }) {
    let { otc, changeMarket, currentMarket } = propMarkets;

    return (
        <Card variant="static" className="h-full flex flex-col overflow-hidden"> 
            <h3 className="py-4 text-3xl font-bold text-foreground">Select Markets</h3>
            <Search name="Search name" className="mb-4" />

            <ul className="max-h-[calc(100vh_-_500px)] flex flex-col gap-4 overflow-y-auto"> 
                {otc.map(offer => (
                    <li key={offer.offerId}>
                        <SingleMarket {...offer} />
                    </li>
                ))}
            </ul>
        </Card>
    );
}

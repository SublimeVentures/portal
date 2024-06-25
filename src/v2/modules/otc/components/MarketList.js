import SingleMarket from "./SingleMarket";
import { cn } from "@/lib/cn";

export default function MarketList({ markets, selectedMarket, className }) {
    return (
        <ul className={cn("flex flex-col gap-4 overflow-y-auto", className)}> 
            {markets.map(offer => (
                <li key={offer.offerId}>
                    <SingleMarket {...offer} selectedMarket={selectedMarket} />
                </li>
            ))}
        </ul>
    );
};

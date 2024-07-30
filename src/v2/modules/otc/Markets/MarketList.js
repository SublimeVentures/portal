import SingleMarket from "./SingleMarket";

export default function MarketList({ markets, currentMarket }) {
    return (
        <ul className="block-scrollbar h-full flex flex-col gap-4 overflow-y-auto"> 
            {markets.map(offer => (
                <li key={offer.offerId}>
                    <SingleMarket {...offer} currentMarket={currentMarket} />
                </li>
            ))}
        </ul>
    );
};

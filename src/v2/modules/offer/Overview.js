import { useOfferDetailsQuery } from "@/v2/modules/offer/queries";

// @TODO
// Add skeleton loader on isLoading
export default function Overview() {
    const { data: offerDetails, isLoading } = useOfferDetailsQuery();

    return (
        <div className="p-6 rounded bg-[#12202C]">
            <h2>{offerDetails.name}</h2>
            <p>{offerDetails.genre}</p>
            <p>{offerDetails.description ?? 'No description'}</p>
            <p>Live: ?</p>
            <p>Website: {offerDetails.url_web}</p>
            <p>Discord: {offerDetails.url_discord}</p>
            <p>Twitter: {offerDetails.url_twitter}</p>
        </div>
    );
};

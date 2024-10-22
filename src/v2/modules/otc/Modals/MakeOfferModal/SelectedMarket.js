import Image from "next/image";

export default function SelectedMarket({ name, ticker, slug, cdn }) {
    return (
        <>
            <h3 className="pt-4 px-8 text-base font-medium text-white font-heading">Market</h3>
            <div className="py-2 px-8 flex flex-col gap-4 bg-white/5 rounded">
                <div className="flex items-center">
                    <Image
                        src={`${cdn}/research/${slug}/icon.jpg`}
                        className="inline mr-2 rounded-full"
                        alt={`Avatar of ${name} market`}
                        width={40}
                        height={40}
                    />

                    <div>
                        <p className="text-sm md:text-base font-medium text-white">{name}</p>
                        <p className="text-xs md:text-sm font-light text-white/75">${ticker}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

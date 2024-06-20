import Image from "next/image";

export default function SelectedMarket({ name, ticker, slug, cdn }) {
    return (
        <>
            <h3 className="pt-4 px-8 text-lg font-medium text-foreground">Market</h3>
            <div className="py-2 px-8 flex flex-col gap-4 bg-foreground/[.06] rounded">
                <div className="flex items-center">
                    <Image
                        src={`${cdn}/research/${slug}/icon.jpg`}
                        className="inline mr-2 rounded-full"
                        alt={`Avatar of ${name} market`}
                        width={40}
                        height={40}
                    />
                    
                    <div>
                        <p className="text-lg font-medium text-foreground">{name}</p>
                        <p className="text-md font-light text-foreground/[.9]">${ticker}</p>
                    </div>
                </div>
            </div>
        </>            
    )
}

import { Avatar } from "@/v2/components/ui/avatar";

export default function CurrentMarket({ currentMarket }) {
    const { name, ticker, genre } = currentMarket;

    return (
        <div className="mb-2 w-full items-center justify-between md:flex">
            <div className="mb-2 flex items-center gap-4 2xl:gap-8">
                <Avatar variant="block" className='size-16 2xl:size-32 bg-lime-500' />
                <div>
                    <div className="flex items-center 2xl:items-start">
                        <h3 className="text-lg font-bold text-foreground leading-none 2xl:text-[42px]">{name}</h3>
                        <p className="ml-2 text-md text-foreground/[.5] leading-none whitespace-nowrap 2xl:text-5xl">${ticker}</p>
                    </div>
                    <p className="text-md text-foreground 2xl:text-9xl">{genre}</p>
                </div>
            </div>

            <div className="py-2 px-4 bg-foreground/[.1] flex items-center rounded">
                <Avatar />

                <dl className="ml-8 flex gap-8">
                    <div>
                        <dt className="text-md text-foreground/[.5]">Payout</dt>
                        <dd className="text-lg text-foreground">${ticker}</dd>
                    </div>
                    <div>
                        <dt className="text-md text-foreground/[.5]">Price</dt>
                        <dd className="text-lg text-foreground">$0.02</dd>
                    </div>
                    <div>
                        <dt className="text-md text-foreground/[.5]">Listed</dt>
                        <dd className="text-lg text-foreground">23</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}

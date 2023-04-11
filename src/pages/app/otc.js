import LayoutApp from '@/components/Layout/LayoutApp';
import RoundBanner from "@/components/App/RoundBanner";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import ReadIcon from "@/assets/svg/Read.svg";
import IconCart from "@/assets/svg/Cart.svg";


export default function AppOtc() {

    const markets = [
        {
            marketKey: 1,
            offers: 6,
            market: "Mavia",
            ticker: "MVN",
        },
        {
            marketKey: 2,
            offers: 6,
            market: "Mavia",
            ticker: "MVN",
        },
        {
            marketKey: 3,
            offers: 6,
            market: "Mavia",
            ticker: "MVN",
        },
        {
            marketKey: 4,
            offers: 6,
            market: "Mavia",
            ticker: "MVN",
        },

    ]
    const offers = [
        {
            tokens: 64443,
            allocation: 456,
            price: 632,
        },
        {
            tokens: 234324,
            allocation: 355,
            price: 1200,
        },
        {
            tokens: 344,
            allocation: 100,
            price: 200,
        },

    ]


    return (
        <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
            <div className="col-span-12 flex">
                <RoundBanner title={'Over the counter'} subtitle={'Need liquidity? Trade your allocation.'}
                             action={<RoundButton text={'Learn more'} isWide={true}
                                                  size={'text-sm sm'}
                                                  icon={<ReadIcon className={ButtonIconSize.hero}/>}/>}
                />
            </div>

            <div className="col-span-12">
                <div className="grid grid-cols-12 flex gap-y-5 mobile:gap-y-10 mobile:gap-10 ">
                    <div className="col-span-12 lg:col-span-4 flex flex-1">
                        <div className="rounded-xl bg-navy-accent flex flex-1 rounded ">
                            <div className="overflow-x-auto flex flex-col">
                                <div className="font-bold text-2xl p-5">Markets</div>
                                <table>
                                    <thead className="bg-navy ">
                                    <tr>
                                        <th className="font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                                            <label>OFFERS</label></th>
                                        <th className="font-bold text-sm text-left sm:py-4 sm:px-2">
                                            <label>MARKET</label></th>
                                        <th className="font-bold text-sm text-left sm:py-4 sm:pl-2 sm:pr-5">
                                            <label>TICKER</label></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {markets.map((el, i) => {
                                        return <tr key={el.marketKey}
                                                   className={`cursor-pointer transition duration-300 hover:bg-app-success hover:text-black ${i === 1 ? 'font-bold bg-app-success text-black' : ''}`}>
                                            <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pl-5 sm:pr-2"
                                                data-label="OFFERS">{el.offers}</td>
                                            <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:px-2 "
                                                data-label="MARKET">{el.market}</td>
                                            <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pr-5 sm:pl-2"
                                                data-label="TICKER">{el.ticker}</td>
                                        </tr>
                                    })}

                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-8 flex flex-1">
                        <div className="rounded-xl bg-navy-accent flex flex-1 rounded ">
                                <div className="overflow-x-auto flex flex-col flex-1">
                                    <div className="p-5 flex flex-row relative">
                                        <div className="font-bold text-2xl flex flex-1">
                                            Offers
                                        </div>
                                        <div className="absolute right-5 top-3">
                                            <RoundButton text={'SELL'} isWide={true} size={'text-sm xs'}
                                                         icon={<IconCart className={ButtonIconSize.hero}/>}/>
                                        </div>

                                    </div>

                                    <table>
                                        <thead className="bg-navy ">
                                        <tr>
                                            <th className="font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                                                <label>TOKENS</label></th>
                                            <th className="font-bold text-sm text-left sm:py-4 sm:px-2">
                                                <label>ALLOCATION</label></th>
                                            <th className="font-bold text-sm text-left sm:py-4 sm:px-2">
                                                <label>PRICE</label>
                                            </th>
                                            <th className="font-bold text-sm text-left sm:py-4 sm:px-2">
                                                <label>MULTIPLIER</label></th>
                                            <th className="font-bold text-sm text-left sm:py-4 sm:pl-2 sm:pr-5">
                                                <label>ACTION</label></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {offers.map(el => {
                                            return <tr key={el.tokens}
                                                       className="hoverTable transition-all duration-300 hover:text-black">
                                                <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pl-5 sm:pr-2"
                                                    data-label="TOKENS">{el.tokens}</td>
                                                <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:px-2"
                                                    data-label="ALLOCATION">{el.allocation}</td>
                                                <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:px-2"
                                                    data-label="PRICE">{el.price}</td>
                                                <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:px-2"
                                                    data-label="MULTIPLIER"><span
                                                    className="text-app-success">{Number(el.price / el.allocation).toFixed(2)}x</span>
                                                </td>
                                                <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pr-5 sm:pl-2"
                                                    data-label="ACTION">cash, close
                                                </td>
                                            </tr>
                                        })}

                                        </tbody>
                                    </table>

                                </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}


AppOtc.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};

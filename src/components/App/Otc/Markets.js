

export default function OtcMarkets({propMarkets}) {
    let {markets, changeMarket, currentMarket} = propMarkets

    return (
        <div className="rounded-xl bg-navy-accent flex flex-1 rounded ">
            <div className="overflow-x-auto flex flex-col">
                <div className="text-xl uppercase font-medium text-outline p-5">Markets</div>
                <table>
                    <thead className="bg-navy ">
                    <tr>
                        {/*<th className="sm:w-[110px] font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">*/}
                        {/*    <label>OFFERS</label></th>*/}
                        {/*<th className="font-bold text-sm text-left sm:py-4 sm:px-2">*/}
                        <th className="font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                            <label>PROJECT</label></th>
                        <th className="font-bold text-sm text-right sm:py-4 sm:pl-2 sm:pr-5">
                            <label>TICKER</label></th>
                    </tr>
                    </thead>
                    <tbody>
                    {markets.open.map((el) => {
                        return <tr key={el.id} onClick={()=> changeMarket(el.slug)}
                                   className={`cursor-pointer transition duration-300 hover:bg-app-success hover:text-black ${el.slug === currentMarket.slug ? 'bg-app-success text-black' : ''}`}>
                            {/*<td className="sm:w-[110px]  text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pl-5 sm:pr-2"*/}
                            {/*    data-label="OFFERS">0*/}
                            {/*</td>*/}
                            {/*<td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:px-2 "*/}
                            <td className="text-sm text-right px-5 py-1 sm:text-left  sm:px-2 sm:py-4 sm:pl-5 sm:pr-2"
                                data-label="MARKET">{el.name}</td>
                            <td className="text-sm text-right px-5 py-1  sm:px-2 sm:py-4 sm:pr-5 sm:pl-2"
                                data-label="TICKER">{el.ticker}</td>
                        </tr>
                    })}

                    </tbody>
                </table>

            </div>
        </div>


    )
}

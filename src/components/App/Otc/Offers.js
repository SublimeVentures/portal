import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import IconCart from "@/assets/svg/Cart.svg";
import IconCancel from "@/assets/svg/Cancel.svg";
import IconHistory from "@/assets/svg/History.svg";
import {useState} from "react";
import dynamic from "next/dynamic";
import {useEffect} from "react";
import Empty from "@/components/App/Empty";
import {IconButton} from "@/components/Button/IconButton";
import {useQuery} from "@tanstack/react-query";
import {fetchHistory, fetchOffers} from "@/fetchers/otc.fetcher";
import moment from "moment";
import Loader from "@/components/App/Loader";
import MakeOfferModal from "@/components/App/Otc/MakeOfferModal";
const SellModal = dynamic(() => import('@/components/App/Otc/MakeOfferModal'), {ssr: false,})
const CancelModal = dynamic(() => import('@/components/App/Otc/CancelModal'), {ssr: false,})
const BuyModal = dynamic(() => import('@/components/App/Otc/BuyModal'), {ssr: false,})


export default function OtcOffers({propOffers}) {
    let { offers, vault, currentMarket, session, refetchOffers} = propOffers
    const [isSellModal, setIsSellModal] = useState(false);
    const [isBuyModal, setIsBuyModal] = useState(false);
    const [buyOffer, setBuyOffer] = useState(false);
    const [isCancelModal, setIsCancelModal] = useState(false);
    const [cancelOffer, setCancelOffer] = useState(false);

    const [showHistory, setShowHistory] = useState(false);

    const haveAllocation = vault.find(el=> el.offerId === currentMarket.id)

    const user = session.user.ACL === 0 ? session.user.id : session.user.address


    const {isSuccess: historyIsSuccess, data: history, refetch: refetchHistory} = useQuery({
            queryKey: ["otcHistory", currentMarket?.id],
            queryFn: () => fetchHistory(currentMarket?.id),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 5 * 60 * 1000,
            staleTime: 3 * 60 * 1000,
            enabled: showHistory
        }
    );


    const openCancel = (offer) => {
        setCancelOffer(offer)
        setIsCancelModal(true)
    }

    const openBuy = (offer) => {
        setBuyOffer(offer)
        setIsBuyModal(true)
    }

    useEffect(() => {
        import('@lottiefiles/lottie-player');
    }, []);

    useEffect(() => {
        if(!showHistory) {
            refetchOffers()
        }
    }, [showHistory]);


    const renderOfferTable = () => {
        return  <table>
            <thead className="bg-navy ">
            <tr>

                <th className="font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                    <label>ALLOCATION</label></th>
                <th className="font-bold text-sm text-left  sm:py-4 sm:px-2">
                    <label>PRICE</label>
                </th>
                <th className="font-bold text-sm text-left sm:py-4 sm:px-2">
                    <label>MULTIPLIER</label></th>
                <th className="font-bold text-sm text-leftsm:py-4 sm:pl-2 sm:pr-5">
                    <label>ACTION</label></th>
            </tr>
            </thead>
            <tbody>
            {offers.length === 0 && <tr>
                <td colSpan="4" className={"text-center pt-3"}>
                    <Empty text={"No offers on this market"} maxSize={280}/>
                </td>
            </tr>}
            {offers.length !== 0 && offers.map(el => {
                return <tr key={el.dealId}
                           className="hoverTable transition-all duration-300 hover:text-black">

                    <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pl-5 sm:pr-2"
                        data-label="ALLOCATION">${el.amount}</td>
                    <td className="text-sm text-right px-5 py-1 sm:text-left  sm:px-2 sm:py-4 sm:px-2"
                        data-label="PRICE">${el.price}</td>
                    <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:px-2"
                        data-label="MULTIPLIER"><span
                        className="text-app-success">{Number(el.price / el.amount).toFixed(2)}x</span>
                    </td>
                    <td className="text-sm text-center px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pr-5 sm:pl-2"
                        data-label="ACTION">
                        <div className={'flex flex-row gap-1 justify-end sm:justify-center'}>
                            {user == el.seller &&
                                <div className={'duration-300 hover:text-app-error cursor-pointer'} onClick={() => openCancel(el)}>
                                    <IconCancel className={'w-6'}/>
                                </div>
                            }
                            {user != el.seller &&
                                <div className={'duration-300 hover:text-app-error cursor-pointer'} onClick={()=> openBuy(el)}>
                                    <IconCart className={'w-6'}/>
                                </div>
                            }
                        </div>


                    </td>
                </tr>
            })}


            </tbody>
        </table>
    }

    const renderOfferHistoryTable = () => {
        return  <table>
            <thead className="bg-navy ">
            <tr>

                <th className="font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                    <label>DATE</label></th>
                <th className="font-bold text-sm text-left  sm:py-4 sm:px-2">
                    <label>MULTIPLIER</label>
                </th>
                <th className="font-bold text-sm text-left sm:py-4 sm:px-2">
                    <label>PRICE</label></th>
                <th className="font-bold text-sm text-left sm:py-4 sm:pl-2 sm:pr-5">
                    <label>ALLOCATION</label></th>
            </tr>
            </thead>
            <tbody>

            {(!history || !historyIsSuccess) && <tr>
                <td colSpan="4" className={"text-center pt-3"}>
                    <Loader/>
                </td>
            </tr>}
            {!!history && history.length === 0 && <tr>
                <td colSpan="4" className={"text-center pt-3"}>
                    <Empty text={"No history on this market"} maxSize={280}/>
                </td>
            </tr>}
            {!!history && history.length !== 0 && history.map(el => {
                return <tr key={el.dealId}
                           className="hoverTable transition-all duration-300 hover:text-black">

                    <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pl-5 sm:pr-2"
                        data-label="DATE">{moment(el.updatedAt).utc().local().format("YYYY-MM-DD")}</td>
                    <td className="text-sm text-right px-5 py-1 sm:text-left  sm:px-2 sm:py-4 sm:px-2"
                        data-label="MULTIPLIER">
                        <span className="text-app-success"> {Number(el.price / el.amount).toFixed(2)}x</span>

                    </td>
                    <td className="text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:px-2"
                        data-label="PRICE">${el.price}
                    </td>
                    <td className="text-sm text-center px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pr-5 sm:pl-2"
                        data-label="ALLOCATION">
                        ${el.amount}
                    </td>
                </tr>
            })}


            </tbody>
        </table>
    }

    return (
        <>
            <div className="rounded-xl bg-navy-accent flex flex-1 rounded ">
                <div className="overflow-x-auto flex flex-col flex-1">
                    <div className="p-5 flex flex-row relative">
                        <div className="text-xl uppercase font-medium text-outline flex flex-1">
                            Offers {showHistory && "History"}
                        </div>
                        <div className="absolute right-5 top-3 flex flex-row gap-5 items-center">
                            <RoundButton text={'TRADE'} isWide={true} size={'text-sm xs'} handler={() => setIsSellModal(true)}
                                         icon={<IconCart className={ButtonIconSize.hero}/>}/>
                            <div>
                                <IconButton zoom={1.1} size={'p-3'} noBorder={false} icon={<IconHistory className={"w-5"}/>} handler={() => setShowHistory((current)=> !current)} />

                            </div>

                        </div>
                    </div>
                    {showHistory ? renderOfferHistoryTable() : renderOfferTable()}
                </div>
            </div>

            <MakeOfferModal model={isSellModal} setter={() => {setIsSellModal(false)}} props={{...propOffers, ...{allocation: haveAllocation}}}/>
            {/*<CancelModal model={isCancelModal} setter={() => {setIsCancelModal(false)}} props={{...propOffers, ...{cancelOffer}}}/>*/}
            {/*<BuyModal model={isBuyModal} setter={() => {setIsBuyModal(false)}} props={{...propOffers, ...{buyOffer}}}/>*/}
        </>



    )
}

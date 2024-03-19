import { ButtonIconSize } from "@/components/Button/RoundButton";
import { IoCartOutline as IconCart, IoCloseCircleOutline as IconCancel } from "react-icons/io5";
import { GoHistory as IconHistory } from "react-icons/go";
import { useState } from "react";
import { useEffect } from "react";
import Empty from "@/components/App/Empty";
import { IconButton } from "@/components/Button/IconButton";
import { useQuery } from "@tanstack/react-query";
import { fetchHistory } from "@/fetchers/otc.fetcher";
import moment from "moment";
import Loader from "@/components/App/Loader";
import MakeOfferModal from "@/components/App/Otc/MakeOfferModal";
import CancelOfferModal from "@/components/App/Otc/CancelOfferModal";
import { isBased, NETWORKS } from "@/lib/utils";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import DynamicIcon from "@/components/Icon";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Tooltiper, TooltipType } from "@/components/Tooltip";
import TakeOfferModal from "@/components/App/Otc/TakeOfferModal";

export default function OtcOffers({ propOffers }) {
    const { offers, vault, currentMarket, session, refetchOffers, offersIsSuccess, vaultIsSuccess } = propOffers;
    const { wallets } = session;

    const { getCurrencySymbolByAddress, account } = useEnvironmentContext();

    const [isMakeOfferModal, setIsMakeOfferModal] = useState(false);
    const [isCancelOfferModal, setIsCancelOfferModal] = useState(false);
    const [isTakeOfferModal, setIsTakeOfferModal] = useState(false);

    const [offerDetails, setOfferDetails] = useState(false);

    const [showHistory, setShowHistory] = useState(false);

    const haveAllocation = vault && currentMarket ? vault.find((el) => el.id === currentMarket.offerId) : null;

    const { isSuccess: historyIsSuccess, data: history } = useQuery({
        queryKey: ["otcHistory", currentMarket?.offerId],
        queryFn: () => fetchHistory(currentMarket?.offerId),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 5 * 60 * 1000,
        staleTime: 3 * 60 * 1000,
        enabled: showHistory,
    });

    const openCancel = (offer) => {
        setOfferDetails(offer);
        setIsCancelOfferModal(true);
    };

    const openTake = (offer) => {
        setOfferDetails(offer);
        setIsTakeOfferModal(true);
    };

    function isUserOffer(userWallets, checkWallet) {
        return {
            ok: userWallets.includes(checkWallet),
            isActive: account?.address === checkWallet,
        };
    }

    useEffect(() => {
        if (!showHistory) {
            refetchOffers();
        } else {
        }
    }, [showHistory]);

    const makeOfferProps = {
        ...propOffers,
        allocation: haveAllocation,
    };

    const interactOfferProps = {
        ...propOffers,
        offerDetails,
    };

    const renderOfferTable = () => {
        return (
            <table>
                <thead className="bg-navy-2">
                    <tr>
                        <th className="font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                            <label>TYPE</label>
                        </th>
                        <th className="font-bold text-sm text-left  sm:py-4 sm:px-2">
                            <label>ALLOCATION</label>
                        </th>
                        <th className="font-bold text-sm text-left  sm:py-4 sm:px-2">
                            <label>PRICE</label>
                        </th>
                        <th className="font-bold text-sm text-left sm:py-4 sm:px-2 sm:text-center">
                            <label>MULTIPLIER</label>
                        </th>
                        <th className="font-bold text-sm text-right sm:py-4 sm:px-2 sm:text-center">
                            <label>CHAIN</label>
                        </th>
                        <th className="font-bold text-sm text-leftsm:py-4 sm:pl-2 sm:pr-5">
                            <label>ACTION</label>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {offers.length === 0 && (
                        <tr>
                            <td colSpan="6" className={"text-center pt-3"}>
                                <Empty text={"No offers on this market"} maxSize={280} />
                            </td>
                        </tr>
                    )}
                    {offers.length !== 0 &&
                        offers.map((el) => {
                            const ownership = isUserOffer(wallets, el.maker);
                            return (
                                <tr key={el.id} className="hoverTable transition-all duration-300 hover:text-black">
                                    <td
                                        className={`${el.isSell ? "text-app-error" : "text-app-success"} font-bold text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pl-5 sm:pr-2`}
                                        data-label="TYPE"
                                    >
                                        {el.isSell ? "SELL" : "BUY"}
                                    </td>
                                    <td
                                        className="text-sm text-right px-5 py-1 sm:text-left  sm:px-2 sm:py-4 sm:px-2"
                                        data-label="ALLOCATION"
                                    >
                                        ${el.amount.toLocaleString()}
                                    </td>
                                    <td
                                        className="text-sm text-right px-5 py-1 sm:text-left  sm:px-2 sm:py-4 sm:px-2"
                                        data-label="PRICE"
                                    >
                                        <span className={"text-ellipsis overflow-hidden block"}>
                                            ${el.price.toLocaleString()}
                                        </span>
                                    </td>
                                    <td
                                        className="text-sm text-right px-5 py-1 sm:text-center sm:px-2 sm:py-4 sm:px-2"
                                        data-label="MULTIPLIER"
                                    >
                                        <span className="text-app-success">
                                            {Number(el.price / el.amount).toFixed(2)}x
                                        </span>
                                    </td>
                                    <td
                                        className=" text-sm text-right px-5 py-1 sm:text-center sm:px-2 sm:py-4 sm:px-2"
                                        data-label="CHAIN"
                                    >
                                        <span className="flex flex-row flex-1 justify-center gap-2">
                                            <DynamicIcon
                                                name={getCurrencySymbolByAddress(el.currency)}
                                                style={ButtonIconSize.hero3}
                                            />
                                            <DynamicIcon name={NETWORKS[el.chainId]} style={ButtonIconSize.hero3} />
                                        </span>
                                    </td>
                                    <td
                                        className="text-sm text-center px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pr-5 sm:pl-2"
                                        data-label="ACTION"
                                    >
                                        <div className={"flex flex-row gap-1 justify-end sm:justify-center"}>
                                            {ownership.ok &&
                                                (ownership.isActive ? (
                                                    <div
                                                        className={` duration-300 hover:text-app-error cursor-pointer`}
                                                        onClick={() => openCancel(el)}
                                                    >
                                                        <IconCancel className={"w-6"} />
                                                    </div>
                                                ) : (
                                                    <Tooltiper
                                                        wrapper={
                                                            <div
                                                                className={`disabled duration-300 hover:text-app-error cursor-pointer`}
                                                                onClick={() => {}}
                                                            >
                                                                <IconCancel className={"w-6"} />
                                                            </div>
                                                        }
                                                        text={`Created from other wallet`}
                                                        type={TooltipType.Error}
                                                    />
                                                ))}
                                            {!ownership.ok && (
                                                <div
                                                    className={"duration-300 hover:text-app-error cursor-pointer"}
                                                    onClick={() => openTake(el)}
                                                >
                                                    <IconCart className={"w-6"} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        );
    };

    const renderOfferHistoryTable = () => {
        return (
            <table>
                <thead className="bg-navy-2">
                    <tr>
                        <th className="font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                            <label>TYPE</label>
                        </th>
                        <th className="font-bold text-sm text-left  sm:py-4 sm:px-2">
                            <label>ALLOCATION</label>
                        </th>
                        <th className="font-bold text-sm text-left  sm:py-4 sm:px-2">
                            <label>PRICE</label>
                        </th>
                        <th className="font-bold text-sm text-left sm:py-4 sm:px-2 sm:text-center">
                            <label>MULTIPLIER</label>
                        </th>
                        <th className="font-bold text-sm text-right sm:py-4 sm:px-2 sm:text-center">
                            <label>CHAIN</label>
                        </th>
                        <th className="font-bold text-sm text-leftsm:py-4 sm:pl-2 sm:pr-5">
                            <label>DATE</label>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {(!history || !historyIsSuccess) && (
                        <tr>
                            <td colSpan="6" className={"text-center pt-3"}>
                                <Loader />
                            </td>
                        </tr>
                    )}
                    {!!history && history.length === 0 && (
                        <tr>
                            <td colSpan="6" className={"text-center pt-3"}>
                                <Empty text={"No history on this market"} maxSize={280} />
                            </td>
                        </tr>
                    )}
                    {!!history &&
                        history.length !== 0 &&
                        history.map((el) => {
                            return (
                                <tr key={el.id} className="hoverTable transition-all duration-300 hover:text-black">
                                    <td
                                        className={`${el.isSell ? "text-app-error" : "text-app-success"} font-bold text-sm text-right px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pl-5 sm:pr-2`}
                                        data-label="TYPE"
                                    >
                                        {el.isSell ? "SELL" : "BUY"}
                                    </td>
                                    <td
                                        className="text-sm text-right px-5 py-1 sm:text-left  sm:px-2 sm:py-4 sm:px-2"
                                        data-label="ALLOCATION"
                                    >
                                        ${el.amount.toLocaleString()}
                                    </td>
                                    <td
                                        className="text-sm text-right px-5 py-1 sm:text-left  sm:px-2 sm:py-4 sm:px-2"
                                        data-label="PRICE"
                                    >
                                        ${el.price.toLocaleString()}
                                    </td>
                                    <td
                                        className="text-sm text-right px-5 py-1 sm:text-center sm:px-2 sm:py-4 sm:px-2"
                                        data-label="MULTIPLIER"
                                    >
                                        <span className="text-app-success">
                                            {Number(el.price / el.amount).toFixed(2)}x
                                        </span>
                                    </td>
                                    <td
                                        className=" text-sm text-right px-5 py-1 sm:text-center sm:px-2 sm:py-4 sm:px-2"
                                        data-label="CHAIN"
                                    >
                                        <span className="flex flex-row flex-1 justify-center">
                                            <DynamicIcon name={NETWORKS[el.chainId]} style={ButtonIconSize.hero3} />
                                        </span>
                                    </td>
                                    <td
                                        className="text-sm text-center px-5 py-1 sm:text-left sm:px-2 sm:py-4 sm:pr-5 sm:pl-2"
                                        data-label="ACTION"
                                    >
                                        {moment(el.updatedAt).utc().local().format("YYYY-MM-DD")}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        );
    };

    return (
        <>
            <div className={`${isBased ? " rounded-xl " : ""} bg-navy-accent flex flex-1 offerWrap`}>
                <div className={`overflow-x-auto flex flex-col flex-1 bg-navy-accent ${isBased ? " rounded-xl " : ""}`}>
                    <div
                        className={`p-5 flex flex-row relative  ${isBased ? " rounded-tl-xl rounded-tr-xl bg-navy" : "bg-black"}`}
                    >
                        <div
                            className={`${isBased ? " font-medium text-[1.7rem] " : "text-app-error font-accent glowRed uppercase font-light text-2xl"} flex glowNormal   header`}
                        >
                            Offers {showHistory && "History"}
                        </div>
                        <div className="absolute right-5 top-3 flex flex-row gap-5 items-center ">
                            <UniButton
                                type={ButtonTypes.BASE}
                                text={"MAKE OFFER"}
                                isWide={true}
                                size={"text-sm xs"}
                                zoom={1.1}
                                handler={() => setIsMakeOfferModal(true)}
                                icon={<IconCart className={ButtonIconSize.hero} />}
                            />
                            <div>
                                <IconButton
                                    zoom={1.1}
                                    size={"p-3"}
                                    noBorder={!isBased}
                                    icon={<IconHistory className={isBased ? "w-5" : "w-15 p-2"} />}
                                    handler={() => setShowHistory((current) => !current)}
                                />
                            </div>
                        </div>
                    </div>
                    {!offersIsSuccess || !vaultIsSuccess || (!historyIsSuccess && showHistory) ? (
                        <Loader />
                    ) : showHistory ? (
                        renderOfferHistoryTable()
                    ) : (
                        renderOfferTable()
                    )}
                </div>
            </div>
            <MakeOfferModal
                model={isMakeOfferModal}
                setter={() => {
                    setIsMakeOfferModal(false);
                }}
                props={{ ...makeOfferProps }}
            />
            <CancelOfferModal
                model={isCancelOfferModal}
                setter={() => {
                    setIsCancelOfferModal(false);
                }}
                props={{ ...interactOfferProps }}
            />
            <TakeOfferModal
                model={isTakeOfferModal}
                setter={() => {
                    setIsTakeOfferModal(false);
                }}
                props={{ ...interactOfferProps }}
            />
        </>
    );
}

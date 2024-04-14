import { useState, useMemo, useEffect } from "react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    IoAddCircleOutline as IconPlus,
    IoRemoveCircleOutline as IconMinus,
    IoLogoDiscord as IconDiscord,
} from "react-icons/io5";
import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";
import { ExternalLinks } from "@/routes";
import Input from "@/components/App/Input";
import { IconButton } from "@/components/Button/IconButton";
import Dropdown from "@/components/App/Dropdown";
import lottieOtc from "@/assets/lottie/otc.json";
import Linker from "@/components/link";
import { saveTransaction } from "@/fetchers/otc.fetcher";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import GenericRightModal from "@/components/Modal/GenericRightModal";
import BlockchainSteps from "@/components/BlockchainSteps";
import useGetToken from "@/lib/hooks/useGetToken";
import { METHOD } from "@/components/BlockchainSteps/utils";

export const blockchainPrerequisite = async (params) => {
    const { market, price, amount, isSeller, account, network } = params;
    const transaction = await saveTransaction(market.offerId, network?.chainId, price, amount, isSeller, account);
    if (transaction.ok) {
        return {
            ok: true,
            data: { hash: transaction.hash },
        };
    } else {
        return {
            ok: false,
            error: "Error generating hash",
        };
    }
};

const TABS = {
    BUY: 0,
    SELL: 1,
};

export default function MakeOfferModal({ model, setter, props }) {
    const { currentMarket, allocation, refetchVault, refetchOffers } = props;
    const { getCurrencySettlement, account, activeOtcContract, network } = useEnvironmentContext();

    const allocationMax = allocation ? allocation.invested - allocation.locked : 0;

    const [selectedTab, setSelectedTab] = useState(TABS.BUY);
    const [selectedCurrency, setSelectedCurrency] = useState({});
    const dropdownCurrencyOptions = getCurrencySettlement();

    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const [amount, setAmount] = useState(10);
    const [statusAmount, setStatusAmount] = useState(false);

    const [price, setPrice] = useState(10);
    const [statusPrice, setStatusPrice] = useState(false);
    const [multiplier, setMultiplier] = useState(1);

    const multiplierParsed = multiplier.toFixed(2);
    const allocationMin = 10;
    const priceMin = allocationMin;
    const statusCheck = statusAmount || statusPrice;

    const isSeller = selectedTab === TABS.SELL;
    const titleCopy = isSeller ? "Selling" : "Buying";
    const textCopy = isSeller ? "sell" : "buy";

    useEffect(() => {
        setSelectedCurrency(dropdownCurrencyOptions[0]);
    }, [network.chainId, isSeller]);

    const calcPrice = (multi, amt) => {
        setPrice(Number(Number(amt * multi).toFixed(2)));
    };
    const setAmountHandler = (amt) => {
        setAmount(amt);
        if (amt) calcPrice(multiplier, amt);
    };

    const switchTab = (tabId) => {
        if (allocationMax === 0 && tabId === TABS.SELL) return;
        setSelectedTab(tabId);
    };

    const customLocks = () => {
        if (statusCheck) return { lock: true, text: "Bad parameters" };
        else return { lock: false };
    };

    useEffect(() => {
        if (isSeller && amount > allocationMax) setAmountHandler(allocationMax);
    }, [isSeller]);

    const { lock, text } = customLocks();

    const token = useGetToken(selectedCurrency?.contract);
    console.log("selectedCurrency?.contract", selectedCurrency?.contract);
    const blockchainInteractionDataSELL = useMemo(() => {
        console.log("BIX :: BUTTON STATE locked - refresh");
        return {
            steps: {
                transaction: true,
            },
            params: {
                price: Number(price),
                amount: Number(amount),
                account: account.address,
                spender: activeOtcContract,
                contract: activeOtcContract,
                buttonCustomText: text,
                buttonCustomLock: lock,
                buttonText: "Make Offer",
                market: currentMarket,
                isSeller: true,
                transactionType: METHOD.OTC_MAKE,
            },
            token,
            setTransactionSuccessful,
        };
    }, [selectedCurrency?.contract, price, amount, account, activeOtcContract, model, text]);

    const blockchainInteractionDataBUY = useMemo(() => {
        console.log("BIX :: BUTTON STATE locked - refresh");
        return {
            steps: {
                liquidity: true,
                allowance: true,
                transaction: true,
            },
            params: {
                price: Number(price),
                liquidity: Number(price),
                allowance: Number(price),
                amount: Number(amount),
                account: account.address,
                spender: activeOtcContract,
                contract: activeOtcContract,
                buttonCustomText: text,
                buttonCustomLock: lock,
                buttonText: "Make Offer",
                market: currentMarket,
                isSeller: false,
                prerequisiteTextWaiting: "Generate hash",
                prerequisiteTextProcessing: "Generating hash",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Couldn't generate hash",
                transactionType: METHOD.OTC_MAKE,
            },
            token,
            setTransactionSuccessful,
        };
    }, [selectedCurrency?.contract, price, amount, account, activeOtcContract, model, text]);

    const closeModal = async () => {
        refetchVault();
        refetchOffers();
        setter();

        setTimeout(() => {
            setAmount(allocationMin);
            setMultiplier(1);
            setTransactionSuccessful(false);
        }, 400);
    };

    const calcMulti = (price_) => {
        setMultiplier(Number(Number(price_) / Number(amount).toFixed(2)));
    };
    const setPriceHandler = (amt) => {
        setPrice(amt);
        if (amt && amount) calcMulti(amt);
    };
    const setMultiplierHandler = (add) => {
        if (add) {
            setMultiplier((current) => {
                calcPrice(current + 0.25, amount);
                return current + 0.25;
            });
        } else {
            setMultiplier((current) => {
                if (current - 0.25 < 0) {
                    return 0;
                } else {
                    calcPrice(current - 0.25, amount);
                    return current - 0.25;
                }
            });
        }
    };

    const title = () => {
        return (
            <>
                {transactionSuccessful ? (
                    <>
                        OTC offer <span className="text-app-success">created</span>
                    </>
                ) : (
                    <>
                        <span className="text-app-success">Create</span> OTC offer
                    </>
                )}
            </>
        );
    };

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div>
                    Congratulations! You have successfully created OTC offer to{" "}
                    <span className="text-app-success font-bold">
                        {textCopy} ${amount}
                    </span>{" "}
                    allocation in <span className="font-bold text-app-success">{currentMarket.name}</span>.
                </div>
                <div className={"flex flex-1 justify-center items-center"}>
                    <Lottie
                        animationData={lottieOtc}
                        loop={true}
                        autoplay={true}
                        style={{ width: "320px", margin: "-40px auto 0px" }}
                    />
                </div>

                <div className="mt-auto fullWidth pb-5">
                    <div className="flex flex-1 justify-center items-center ">
                        <a href={ExternalLinks.OTC} target={"_blank"} className={"w-full"} rel="noreferrer">
                            <RoundButton
                                text={"Announce"}
                                isLoading={false}
                                isDisabled={false}
                                is3d={false}
                                isWide={true}
                                zoom={1.1}
                                size={"text-sm sm"}
                                icon={<IconDiscord className={ButtonIconSize.hero} />}
                            />
                        </a>
                    </div>
                </div>
                <div className="absolute -bottom-6 w-full text-center">
                    <Linker url={ExternalLinks.OTC} /> <span className={"ml-5"}>before creating an offer.</span>
                </div>
            </div>
        );
    };

    const contentForm = () => {
        return (
            <div className={`flex flex-1 flex-col relative sidebarOtc`}>
                <div className={"pt-2 nav select-none"}>
                    <ul>
                        <li
                            className={`cursor-pointer flex flex-1 p-2 border justify-center items-center font-bold text-xl text-app-success ${TABS.BUY === selectedTab ? " border-app-success border-solid" : "border-transparent"}`}
                            onClick={() => switchTab(TABS.BUY)}
                        >
                            BUY
                        </li>
                        <li
                            className={`cursor-pointer flex flex-1 p-2 border justify-center items-center font-bold text-xl text-app-error ${TABS.SELL === selectedTab ? " border-app-error border-solid" : "border-transparent"}  ${allocationMax === 0 ? "disabled" : ""}`}
                            onClick={() => switchTab(TABS.SELL)}
                        >
                            SELL
                        </li>
                    </ul>
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedTab ? selectedTab.label : "empty"}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={"flex flex-col"}
                    >
                        <div className={"pt-10"}>
                            <Input
                                type={"number"}
                                placeholder={`${titleCopy} allocation`}
                                max={isSeller ? allocationMax : 1000000}
                                min={allocationMin}
                                setStatus={setStatusAmount}
                                setInput={setAmountHandler}
                                input={amount}
                                light={true}
                                full={true}
                                dividable={10}
                                after={"USD"}
                            />
                        </div>
                        <div className={"py-10 flex flex-row justify-center items-center select-none"}>
                            <IconButton
                                zoom={1.1}
                                size={""}
                                noBorder={true}
                                icon={<IconMinus className={"w-6 text-2xl"} />}
                                handler={() => setMultiplierHandler(false)}
                            />
                            <div
                                className={`px-6 font-bold tabular-nums transition-colors duration-300 text-2xl ${multiplier > 1 ? " text-app-success" : " text-app-error"}`}
                            >
                                x<span className={"text-4xl"}>{multiplierParsed}</span>
                            </div>
                            <IconButton
                                zoom={1.1}
                                size={""}
                                noBorder={true}
                                icon={<IconPlus className={"w-6 text-2xl"} />}
                                handler={() => setMultiplierHandler(true)}
                            />
                        </div>
                        <div className={"flex flex-row w-full"}>
                            <Input
                                type={"number"}
                                placeholder={`For price`}
                                min={priceMin}
                                max={1000000}
                                setStatus={setStatusPrice}
                                setInput={setPriceHandler}
                                input={price}
                                light={true}
                                full={true}
                                customCss={"flex-1"}
                            />
                            <Dropdown
                                options={dropdownCurrencyOptions}
                                selector={"symbol"}
                                classes={"!text-inherit blended"}
                                propSelected={setSelectedCurrency}
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>
                {model && (
                    <div className={"flex flex-1 flex-col"}>
                        {isSeller && <BlockchainSteps data={blockchainInteractionDataSELL} />}
                        {!isSeller && <BlockchainSteps data={blockchainInteractionDataBUY} />}
                    </div>
                )}

                <div className="absolute -bottom-6 w-full text-center">
                    <Linker url={ExternalLinks.OTC} /> <span className={"ml-5"}>before creating an offer.</span>
                </div>
            </div>
        );
    };

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentForm();
    };

    return (
        <GenericRightModal
            isOpen={model}
            closeModal={() => closeModal()}
            title={title()}
            content={content()}
            persistent={true}
        />
    );
}

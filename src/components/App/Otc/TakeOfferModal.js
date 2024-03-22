import moment from "moment";
import Lottie from "lottie-react";
import { useMemo, useState } from "react";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import { getSignature } from "@/fetchers/otc.fetcher";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import DynamicIcon from "@/components/Icon";
import { NETWORKS } from "@/lib/utils";
import GenericRightModal from "@/components/Modal/GenericRightModal";
import lottieSuccess from "@/assets/lottie/success.json";
import { METHOD } from "@/components/BlockchainSteps/utils";
import BlockchainSteps from "@/components/BlockchainSteps";
import useGetToken from "@/lib/hooks/useGetToken";

export const blockchainPrerequisite = async (params) => {
    const { globalState, requiredNetwork, account, offerDetails } = params;
    console.log("TAK_OFFER_VALID", params);
    const { extra: signature } = globalState.prerequisite;
    console.log(
        "TAK_OFFER_VALID2",
        signature,
        signature?.expiry && signature.expiry > moment.utc().unix() && !offerDetails.isSell,
        offerDetails.isSell,
    );

    if (signature?.expiry && signature.expiry > moment.utc().unix() && !offerDetails.isSell) {
        return {
            ok: true,
            data: { signature },
        };
    } else if (offerDetails.isSell) {
        return {
            ok: true,
            data: { valid: true },
        };
    } else {
        const transaction = await getSignature(
            offerDetails.offerId,
            requiredNetwork,
            offerDetails.otcId,
            offerDetails.dealId,
            account,
        );
        console.log("TAK_OFFER_VALID3", transaction);
        if (transaction.ok) {
            return {
                ok: true,
                data: { signature: transaction.data },
            };
        } else {
            //todo: error handling
            return {
                ok: false,
            };
        }
    }
};

export default function TakeOfferModal({ model, setter, props }) {
    const { vault, currentMarket, offerDetails, refetchVault, refetchOffers } = props;
    const {
        getCurrencySymbolByAddress,
        getCurrencySettlement,
        account,
        currencies,
        network,
        activeOtcContract,
        otcFee,
    } = useEnvironmentContext();
    const [transactionSuccessful, setTransactionSuccessful] = useState(false);

    const selectedCurrency = offerDetails ? currencies[offerDetails.currency] : {};
    const userAllocation =
        currentMarket && vault?.length > 0 ? vault.find((el) => el.id === currentMarket.offerId) : {};
    const ownedAllocation = userAllocation?.invested ? userAllocation.invested - userAllocation.locked : 0;
    const haveEnoughAllocation = offerDetails.isSell ? true : ownedAllocation >= offerDetails.amount;
    const totalPayment = offerDetails.isSell ? offerDetails.price + otcFee : otcFee;

    const customLocks = () => {
        if (!haveEnoughAllocation) return { lock: true, text: "Not enough allocation" };
        else return { lock: false };
    };

    const { lock, text } = customLocks();

    console.log("selectedCurrency", selectedCurrency, offerDetails);
    const token = useGetToken(selectedCurrency?.contract || getCurrencySettlement()[0].contract);

    const blockchainInteractionData = useMemo(() => {
        return {
            steps: {
                network: true,
                liquidity: true,
                allowance: true,
                transaction: true,
            },
            params: {
                requiredNetwork: offerDetails?.chainId,
                account: account.address,
                amount: Number(totalPayment),
                liquidity: Number(totalPayment),
                allowance: Number(totalPayment),
                offerDetails: offerDetails,
                spender: activeOtcContract,
                contract: activeOtcContract,
                buttonCustomText: text,
                buttonCustomLock: lock,
                buttonText: "Take Offer",
                prerequisiteTextWaiting: "Sign transaction",
                prerequisiteTextProcessing: "Getting signature",
                prerequisiteTextSuccess: "Hash obtained",
                prerequisiteTextError: "Invalid transaction data",
                transactionType: METHOD.OTC_TAKE,
            },
            token,
            setTransactionSuccessful,
        };
    }, [
        selectedCurrency,
        totalPayment,
        account,
        activeOtcContract,
        model,
        text,
        currentMarket?.id,
        offerDetails?.chainId,
        offerDetails?.otcId,
        offerDetails?.dealId,
    ]);

    if (!currentMarket?.name || !offerDetails?.currency) return;

    const chainDesired = network.chains.find((el) => el.id === offerDetails?.chainId);
    const cancelOfferAmount_parsed = offerDetails?.amount?.toLocaleString();
    const cancelOfferPrice_parsed = offerDetails?.price?.toLocaleString();

    const closeModal = async () => {
        if (transactionSuccessful) {
            await refetchVault();
            await refetchOffers();
        }
        setter();
        setTimeout(() => {
            setTransactionSuccessful(false);
        }, 400);
    };

    const title = () => {
        return (
            <>
                {transactionSuccessful ? (
                    <>
                        OTC offer <span className="text-app-success">filled</span>
                    </>
                ) : (
                    <>
                        <span className="text-app-success">Take</span> OTC offer
                    </>
                )}
            </>
        );
    };

    const contentQuery = () => {
        return (
            <div className="flex flex-col flex-1">
                <div>
                    {offerDetails?.isSell
                        ? "Are you sure you want to buy allocation from this SELL offer?"
                        : "Are you sure you want to sell your allocation to this BUY offer?"}
                </div>
                <div className="grid gap-1 grid-cols-2 my-10 mb-0">
                    <div className="font-bold">MARKET</div>
                    <div className={"text-right text-app-success"}>{currentMarket.name}</div>
                    <div className="font-bold">TYPE</div>
                    <div className={`text-right ${offerDetails.isSell ? "text-app-error" : "text-app-success"} `}>
                        {offerDetails.isSell ? "SELL" : "BUY"}
                    </div>
                    <div className="font-bold">BLOCKCHAIN</div>
                    <div className={"text-right flex flex-row justify-end"}>
                        <DynamicIcon name={NETWORKS[chainDesired?.id]} style={ButtonIconSize.hero4} />
                        <span className={"truncate"}>{chainDesired?.name}</span>
                    </div>
                    <div className="font-bold">AMOUNT</div>
                    <div className={"text-right text-ellipsis overflow-hidden block "}>${cancelOfferAmount_parsed}</div>
                    <div className="font-bold">PRICE</div>
                    <div className={"text-right text-ellipsis overflow-hidden block"}>${cancelOfferPrice_parsed}</div>
                    <div className="font-bold">FEES</div>
                    <div className={"text-right"}>${otcFee}</div>
                    <hr />
                    <hr />
                    <div className="font-bold text-gold pt-2">TOTAL PAYMENT</div>
                    <div className={"flex justify-end text-gold pt-2"}>
                        <DynamicIcon name={getCurrencySymbolByAddress(offerDetails.currency)} style={"w-6"} />
                        <span className={"ml-2"}>${totalPayment}</span>
                    </div>
                </div>
                {model && <BlockchainSteps data={blockchainInteractionData} />}
            </div>
        );
    };

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div className={"flex flex-1 flex-col justify-center items-center"}>
                    <div className={"-mt-10"}>You have successfully filled OTC offer.</div>
                    <Lottie
                        animationData={lottieSuccess}
                        loop={true}
                        autoplay={true}
                        style={{ width: "320px", margin: "30px auto 0px" }}
                    />
                </div>
            </div>
        );
    };

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentQuery();
    };

    return <GenericRightModal isOpen={model} closeModal={() => closeModal()} title={title()} content={content()} />;
}

import GenericModal from "@/components/Modal/GenericModal";
import {useEffect} from "react";
import PAGE, {ExternalLinks} from "@/routes";
import Linker from "@/components/link";
import {
    INTERACTION_TYPE
} from "@/components/App/BlockchainSteps/config";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {isBased} from "@/lib/utils";
import RocketIcon from "@/assets/svg/Rocket.svg";
import Lottie from "lottie-react";
import lottieSuccess from "@/assets/lottie/success.json";
import {useRouter} from "next/router";
import Dropdown from "@/components/App/Dropdown";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {useBlockchainContext} from "@/components/App/BlockchainSteps/BlockchainContext";

export default function BuyMysteryBoxModal({model, setter, buyModalProps}) {
    const {account, order, setOrder, contract, currency, setCurrency, currencyNames, selectedCurrency} = buyModalProps
    const router = useRouter()
    const { insertConfiguration, blockchainCleanup, blockchainProps } = useBlockchainContext();
    const transactionSuccessful = blockchainProps.result.transaction?.confirmation_data

    const closeModal = () => {
        setter()
        setTimeout(() => {
            setOrder(null)
            blockchainCleanup()
        }, 400);
    }

    const redirect = () => {
        router.push(PAGE.Settings).then(e => {
            closeModal()
        })
    }


    useEffect(() => {
        if(!model || !selectedCurrency?.address) return;

        insertConfiguration({
            data: {
                requiredNetwork: 1,
                amount: order.price,
                amountAllowance: order.price,
                userWallet: account.address,
                currency: selectedCurrency,
                diamond: contract,
                button: {
                    icon: <RocketIcon className="w-10 mr-2"/>,
                    text: "Buy",
                },
                transaction: {
                    type: INTERACTION_TYPE.MYSTERYBOX,
                    params: {
                        contract,
                        selectedCurrency,
                        amount: 1
                    },
                },
            },
            steps: {
                network:!isBased,
                liquidity:true,
                allowance:true,
                transaction:true,
                button:true,
            },
        });
    }, [
        selectedCurrency?.address,
        model
    ]);


    const title = () => {
        return (
            <>
                {transactionSuccessful ?
                    <>Transaction <span className="text-app-success">successful</span></> :
                    <><span className="text-app-success">Buy</span> MysteryBox</>
                }
            </>
        )
    }

    const contentSuccess = () => {
        return (
            <div className=" flex flex-col flex-1">
                <div>Congratulations! You have successfully bought <span
                    className="text-app-success font-bold">{order.name}</span>.
                </div>
                <Lottie animationData={lottieSuccess} loop={true} autoplay={true}
                        style={{width: '320px', margin: '30px auto 0px'}}/>

                <div className="flex flex-1 justify-center items-center py-10 fullWidth">
                    {/*<Link href={PAGE.Settings} className={` w-full fullWidth ${isBased ? "" : "flex flex-1 justify-center"}`}>*/}
                    <div className={` w-full fullWidth ${isBased ? "" : "flex flex-1 justify-center"}`}>
                        <UniButton type={ButtonTypes.BASE} text={'Check PROFILE'} state={"danger"} isLoading={false}
                                   isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'}
                                   handler={() => redirect()}/>
                    </div>
                </div>
                <div className="mt-auto">What's next? <Linker url={ExternalLinks.LOOTBOX}/></div>
            </div>
        )
    }
    const contentSteps = () => {
        return (
            <div className={`flex flex-1 flex-col`}>
                <div className={`flex flex-col gap-2 mt-5 ${isBased ? "" : "font-accent"}`}>
                    <div className={"detailRow"}><p>Item</p>
                        <hr className={"spacer"}/>
                        <p>{order.name}</p></div>
                    <div className={"detailRow"}>
                        <p>Total Cost</p>
                        <hr className={"spacer"}/>
                        <div className="font-bold text-gold flex items-center">
                            <span className={"mr-2"}>{order.price}</span>
                            {isBased ? <Dropdown options={currencyNames} propSelected={setCurrency} position={currency}
                                                 isSmall={true}/> : <>BYTES</>}
                        </div>
                    </div>
                </div>
                <BlockchainSteps/>

            </div>
        )
    }

    const content = () => {
        return transactionSuccessful ? contentSuccess() : contentSteps()
    }

    return (
        <GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} persistent={true}/>)
}


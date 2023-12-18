import GenericModal from "@/components/Modal/GenericModal";
import {useState} from "react";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import PAGE, {ExternalLinks} from "@/routes";
import Linker from "@/components/link";
import {
    getMysteryBoxFunction
} from "@/components/App/BlockchainSteps/config";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {isBased} from "@/lib/utils";
import RocketIcon from "@/assets/svg/Rocket.svg";
import Lottie from "lottie-react";
import lottieSuccess from "@/assets/lottie/success.json";
import {useRouter} from "next/router";
import Dropdown from "@/components/App/Dropdown";
import BlockchainSteps from "@/components/App/BlockchainSteps";
import {useRef} from "react";

export default function BuyMysteryBoxModal({model, setter, buyModalProps}) {
    const {account, order, setOrder, contract, currency, setCurrency, currencyNames, selectedCurrency} = buyModalProps
    const router = useRouter()

    const [blockchainData, setBlockchainData] = useState(false)

    const {transactionData} = blockchainData


    const purchaseMysteryBoxFunction = getMysteryBoxFunction(contract, selectedCurrency.address, 1)

    const closeModal = () => {
        setter()
        setTimeout(() => {
            setOrder(null)
            setBlockchainData(false)
        }, 400);
    }

    const redirect = () => {
        router.push(PAGE.Settings).then(e => {
            closeModal()
        })
    }

    const blockchainProps = {
        processingData: {
            requiredNetwork: 1,
            amount: order.price,
            amountAllowance: order.price,
            userWallet: account.address,
            currency: selectedCurrency,
            diamond: contract,
            transactionData: purchaseMysteryBoxFunction
        },
        buttonData: {
            // buttonFn,
            icon: <RocketIcon className={ButtonIconSize.hero}/>,
            text: "Buy",
        },
        checkNetwork: !isBased,
        checkLiquidity: true,
        checkAllowance: true,
        checkTransaction: true,
        showButton: true,
        saveData: true,
        saveDataFn: setBlockchainData,
    }


    const title = () => {
        return (
            <>
                {transactionData?.transferConfirmed ?
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
                <BlockchainSteps blockchainProps={blockchainProps}/>

            </div>
        )
    }

    const content = () => {
        return transactionData?.transferConfirmed ? contentSuccess() : contentSteps()
    }

    return (
        <GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()} persistent={true}/>)
}


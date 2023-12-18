import LayoutApp from '@/components/Layout/LayoutApp';
import {verifyID} from "@/lib/authHelpers";
import routes, {ExternalLinks} from "@/routes";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import IconMysteryBox from "@/assets/svg/MysteryBox.svg";
import Linker from "@/components/link";
 import {getCopy} from "@/lib/seoConfig";
import {isBased} from "@/lib/utils";
import {useEffect, useRef, useState} from "react";
import VanillaTilt from "vanilla-tilt";
import Head from "next/head";
import {useQuery} from "@tanstack/react-query";
import {fetchStore, fetchStoreItemsOwned} from "@/fetchers/store.fetcher";
import {useNetwork} from "wagmi";
import BuyMysteryBoxModal from "@/components/App/MysteryBox/BuyMysteryBoxModal";
import ClaimMysteryBoxModal from "@/components/App/MysteryBox/ClaimMysteryBoxModal";
import {claimMysterybox} from "@/fetchers/mysterbox.fetcher";
import dynamic from "next/dynamic";
import {PremiumItemsENUM} from "@/lib/enum/store";
import {BlockchainProvider} from "@/components/App/BlockchainSteps/BlockchainContext";
const ErrorModal = dynamic(() => import('@/components/App/MysteryBox/ClaimErrorModal'), {ssr: false})


export default function AppLootbox({account}) {
    const {address} = account
    const imageTilt = useRef(null);
    const [isBuyModal, setBuyModal] = useState(false)
    const [isClaimError, setClaimError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [claimData, setClaimData] = useState({})
    const [claimModal, setClaimModal] = useState(false)
    const [claimProcessing, setClaimProcessing] = useState(false)
    const [order, setOrder] = useState(null)
    const [currency, setCurrency] = useState(0)

    const {chain} = useNetwork()

    const {data: storeData, refetch: refetchStoreState} = useQuery({
            queryKey: ["store"],
            queryFn: fetchStore,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 0,
        }
    );

    const {data: premiumData, refetch: refetchStoreItems} = useQuery({
            queryKey: ["premiumOwned", {address}],
            queryFn: fetchStoreItemsOwned,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 15 * 1000,
        }
    );


    const mysteryBox = storeData?.store?.find(el => el.id === PremiumItemsENUM.MysteryBox)
    const storeAvailable = mysteryBox ? mysteryBox.availability : 0

    const mysteryBoxOwned = premiumData?.find(el => el.storeId === PremiumItemsENUM.MysteryBox)
    const mysteryBoxOwnedAmount = mysteryBoxOwned ? mysteryBoxOwned.amount : 0

    const storeEnvironment = storeData?.env


    const chainId = chain?.id
    const diamondContract = storeEnvironment?.contract[chainId]
    const availableCurrencies = storeEnvironment?.currency[chainId]

    const currencyList = availableCurrencies ? Object.keys(availableCurrencies).map(el => {
        let currency = availableCurrencies[el]
        currency.address = el
        return currency
    }) : [{}]

    const currencyNames = currencyList.map(el => el.symbol)
    const selectedCurrency = currencyList[currency]

    const closeBuy = () => {
        refetchStoreItems()
        refetchStoreState()
        setBuyModal(false)
    }

    const openMysteryBox = async () => {
        if(claimProcessing) return;
        setClaimProcessing(true)
        const data = await claimMysterybox()
        if(data.ok) {
            setClaimData(data)
            setClaimModal(true)
        } else {
            setErrorMessage(data.error)
            setClaimError(true)
        }
        await refetchStoreItems()
        await refetchStoreState()
        setTimeout(() => {
            setClaimProcessing(false)
        }, 2000);

    }

    useEffect(() => {
        VanillaTilt.init(imageTilt.current, {scale: 1.1, speed: 1000, max: 0.2});
    }, []);

    useEffect(() => {
        if (!!order) {
            setBuyModal(true)
        }
    }, [order]);

    useEffect(() => {
        setCurrency(0)
    }, [chain])

    const buyModalProps = {
        account,
        order: !!order ? order : {},
        setOrder,
        currency,
        selectedCurrency,
        setCurrency,
        currencyNames,
        contract: diamondContract,

    }



    const title = `Mystery Box - ${getCopy("NAME")}`
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={`mystery flex flex-1 flex-col select-none justify-center items-center gap-10  relative ${isBased ? "" : "font-accent"}`}>
                {mysteryBoxOwnedAmount > 0 && <div className={`${isBased ? " font-medium text-[1.7rem]" : "text-app-error font-accent glowRed uppercase font-light text-2xl absolute top-[50px] text-center collap:top-[50px]"} flex glowNormal pb-5`}>You have {mysteryBoxOwnedAmount} unopened MysteryBox!</div>}

                {isBased ? <div className={"video-wrapper"}>
                        <video loop autoPlay muted playsInline className="">
                            <source src="https://cdn.basedvc.fund/webapp/1.mp4" type="video/mp4"/>
                        </video>
                        </div> :
                        <div className={"mt-[150px] sm:mt-0"} ref={imageTilt}>
                                <IconMysteryBox className="w-[250px] sm:w-[450px] text-white"/>
                        </div>
                }


                <div className={`flex gap-5 mt-5 z-10 ${isBased ? "absolute bottom-10": ""}`}>
                    <UniButton type={ButtonTypes.BASE}
                               text={'OPEN'}
                               state={"success"}
                               isDisabled={mysteryBoxOwnedAmount<1 || claimProcessing}
                               isPrimary={true}
                               isWide={true}
                               zoom={1.05}
                               size={'text-sm xs'}
                               handler={()=> { openMysteryBox() }}
                    />
                    <UniButton type={ButtonTypes.BASE}
                               text={`BUY (${storeAvailable})`}
                               isDisabled={storeAvailable<=0}
                               isWide={true}
                               zoom={1.05}
                               size={'text-sm xs'}
                               handler={()=> { setOrder(mysteryBox) }}

                    />
                </div>

                <div className={"absolute bottom-0 z-10"}><Linker url={ExternalLinks.LOOTBOX} text={"Learn more"}/></div>

            </div>
            <BlockchainProvider>
                <BuyMysteryBoxModal model={isBuyModal} setter={() => {closeBuy()}} buyModalProps={buyModalProps} />
            </BlockchainProvider>
            <ClaimMysteryBoxModal model={claimModal} setter={() => {setClaimModal(false)}} claimData={claimData} />
            <ErrorModal model={isClaimError}  setter={() => {setClaimError(false)}} errorMessage={errorMessage}/>
        </>


    )
}


export const getServerSideProps = async({res}) => {
    const account = await verifyID(res.req)

    if(account.exists){
        return {
            redirect: {
                permanent: true,
                destination: `/app/auth?callbackUrl=${routes.Mysterybox}`
            }
        }
    }

    if(!account.auth){
        return {
            redirect: {
                permanent: true,
                destination: `/login?callbackUrl=${routes.Mysterybox}`
            }
        }
    }

    return {
        props: {
            account: account.user
        }
    }
}

AppLootbox.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};

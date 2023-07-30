import LayoutApp from '@/components/Layout/LayoutApp';
import {verifyID} from "@/lib/authHelpers";
import routes, {ExternalLinks} from "@/routes";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import IconMysteryBox from "@/assets/svg/MysteryBox.svg";
import Linker from "@/components/link";
 import {getCopy} from "@/lib/seoConfig";
import {is3VC} from "@/lib/utils";
import {useEffect, useRef, useState} from "react";
import VanillaTilt from "vanilla-tilt";
import Head from "next/head";
import {useQuery} from "@tanstack/react-query";
import {fetchLootbox} from "@/fetchers/lootbox.fetcher";
import {fetchStore, fetchStoreItemsOwned} from "@/fetchers/store.fetcher";
import {PremiumItemsENUM} from "@/components/App/Settings/PremiumSummary";
import BuyStoreItemModal from "@/components/App/Store/BuyStoreItemModal";
import StoreNetwork from "@/components/Navigation/StoreNetwork";
import {useNetwork} from "wagmi";
import BuyMysteryBoxModal from "@/components/App/MysteryBox/BuyMysteryBoxModal";
import Lottie from "lottie-react";
import lootboxLottie from "@/assets/lottie/lootbox.json";
import ClaimMysteryBoxModal from "@/components/App/MysteryBox/ClaimMysteryBoxModal";


export default function AppLootbox({account}) {
    const {ACL, address} = account
    const imageTilt = useRef(null);
    const [isBuyModal, setBuyModal] = useState(false)
    const [claimModal, setClaimModal] = useState(false)
    const [order, setOrder] = useState(null)
    const [networkOk, setNetworkOk] = useState(true)
    const [currency, setCurrency] = useState({})

    const {chain} = useNetwork()


    const {isLoading, data: storeData} = useQuery({
            queryKey: ["store"],
            queryFn: fetchStore,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 0,
        }
    );

    const {isSuccess: premiumIsSuccess, data: premiumData} = useQuery({
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

    console.log("mysteryBoxOwned",mysteryBoxOwned)
    console.log("mysteryBoxOwnedAmount",mysteryBoxOwnedAmount)

    const storeEnvironment = storeData?.env
    const supportedNetworks = storeEnvironment?.currency ? Object.keys(storeEnvironment?.currency) : []


    const chainId = chain?.id
    const diamondContract = storeEnvironment?.contract[chainId]
    const availableCurrencies = storeEnvironment?.currency[chainId]



    useEffect(() => {
        VanillaTilt.init(imageTilt.current, {scale: 1.1, speed: 1000, max: 0.2});
    }, []);

    useEffect(() => {
        if (!!order) {
            setBuyModal(true)
        }
    }, [order]);

    useEffect(() => {
        if (!!availableCurrencies) {
            const address = Object.keys(availableCurrencies)[0]
            setCurrency({
                address: address,
                ...availableCurrencies[address]
            })
        }
    }, [availableCurrencies]);

    const buyModalProps = {
        account,
        order: !!order ? order : {},
        setOrder,
        currency,
        contract: diamondContract,
    }



    const title = `Mystery Box - ${getCopy("NAME")}`
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={`flex flex-1 flex-col select-none justify-center items-center gap-y-5 mobile:gap-y-10 mobile:gap-10  relative ${is3VC ? "" : "font-accent"}`}>
                {mysteryBoxOwnedAmount > 0 && <div className={`${is3VC ? " font-medium text-[1.7rem]" : "text-app-error font-accent glowRed uppercase font-light text-2xl absolute top-[50px] text-center collap:top-[50px]"} flex glowNormal pb-5`}>You have {mysteryBoxOwnedAmount} unopened MysteryBox!</div>}

                <div className={"mt-[150px] sm:mt-0"} ref={imageTilt}>
                        <IconMysteryBox className="w-[250px] sm:w-[450px] text-white"/>
                 </div>
                <div className={"flex gap-5 mt-10 sm:mt-0"}>
                    <UniButton type={ButtonTypes.BASE}
                               text={'OPEN'}
                               state={"success"}
                               isDisabled={mysteryBoxOwnedAmount<1}
                               isPrimary={true}
                               isWide={true}
                               zoom={1.05}
                               size={'text-sm sm'}
                               handler={()=> { setClaimModal(true)}}
                    />
                    <UniButton type={ButtonTypes.BASE}
                               text={`BUY`}
                               isDisabled={storeAvailable<=0}
                               isWide={true}
                               zoom={1.05}
                               size={'text-sm sm'}
                               handler={()=> { setOrder(mysteryBox) }}

                    />
                    {/*<button className="button is-glowing w-full mt-4 modal_open" onClick={()=> {setClaimModal(true)}}>*/}
                    {/*    <span>Claim prize</span>*/}
                    {/*    <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>*/}
                    {/*</button>*/}
                </div>
                <div className={"-mt-5"}>Left to buy: {storeAvailable}</div>

                <div className={"absolute bottom-5"}><Linker url={ExternalLinks.LOOTBOX} text={"Learn more"}/></div>

            </div>
            <BuyMysteryBoxModal model={isBuyModal} setter={() => {setBuyModal(false)}} buyModalProps={buyModalProps} networkOk={networkOk}/>
            <ClaimMysteryBoxModal model={claimModal} setter={() => {setClaimModal(false)}} />
            <StoreNetwork supportedNetworks={supportedNetworks} isPurchase={isBuyModal} setNetworkOk={setNetworkOk}/>

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

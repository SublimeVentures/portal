import LayoutApp from '@/components/Layout/LayoutApp';
import {verifyID} from "@/lib/authHelpers";
import routes, {ExternalLinks} from "@/routes";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
 import {getCopy} from "@/lib/seoConfig";
import {isBased} from "@/lib/utils";
import Head from "next/head";
import {useQuery} from "@tanstack/react-query";
import Loader from "@/components/App/Loader";
import Empty from "@/components/App/Empty";
import StoreItem from "@/components/App/Store/StoreItem";
import {fetchStore} from "@/fetchers/store.fetcher";
import ReadIcon from "@/assets/svg/Read.svg";
import {ButtonIconSize} from "@/components/Button/RoundButton";
import {useState, useEffect} from "react";
import dynamic from "next/dynamic";
import {useNetwork} from "wagmi";
import {PremiumItemsENUM} from "@/components/App/Settings/PremiumSummary";
const StoreNetwork = dynamic(() => import('@/components/Navigation/StoreNetwork'), {ssr: false})
const BuyStoreItemModal = dynamic(() => import('@/components/App/Store/BuyStoreItemModal'), {ssr: false})


export default function AppUpgrades({account}) {
    const [isBuyModal, setBuyModal] = useState(false)
    const [order, setOrder] = useState(null)
    const [networkOk, setNetworkOk] = useState(true)
    const [currency, setCurrency] = useState({})

    const {chain} = useNetwork()

    const {isLoading, data: response, refetch} = useQuery({
            queryKey: ["store"],
            queryFn: fetchStore,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 0,
        }
    );

    const storeData = response?.store?.filter(el => el.id !== PremiumItemsENUM.MysteryBox)
    const storeEnvironment = response?.env
    const supportedNetworks = storeEnvironment?.currency ? Object.keys(storeEnvironment?.currency) : []


    const chainId = chain?.id
    const diamondContract = storeEnvironment?.contract[chainId]
    const availableCurrencies = storeEnvironment?.currency[chainId]

    const renderPage = () => {
        if(isLoading) return <Loader/>
        if(!storeData || storeData.length === 0) return  <Empty/>

        return (
            <div className="grid grid-cols-12 gap-y-8  mobile:gap-10">
                {!!storeData && storeData.map(el =>
                    <StoreItem item={el} key={el.id} env={storeEnvironment} setOrder={setOrder}/>
                )}
            </div>
        )
    }

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

    const closeBuy = () => {
        setBuyModal(false);
        refetch()
    }

    const buyModalProps = {
        account,
        order: !!order ? order : {},
        setOrder,
        currency,
        contract: diamondContract,
    }


    const title = `Upgrades - ${getCopy("NAME")}`
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={"flex flex-col justify-between gap-7 sm:flex-row"}>
                <div className={"flex flex-col justify-center"}>
                    <div className={`glow font-extrabold text-3xl ${isBased ? "" : "font-accent uppercase font-light"}`}>UPGRADES</div>
                    <div className={"text-outline text-md mt-2 white min-w-[250px]"}>Supercharge your investments.</div>
                </div>
                <div className={"mx-auto flex items-center sm:ml-auto sm:mr-0"}>
                    <div>
                        <UniButton type={ButtonTypes.BASE} text={'Learn more'} isWide={true}
                                   size={'text-sm sm'}
                                   handler={()=> {window.open(ExternalLinks.UPGRADES, '_blank');}}
                                   icon={<ReadIcon className={ButtonIconSize.hero}/>}/>
                    </div>

                </div>
            </div>
            <div className={`flex flex-1 flex-col select-none items-center gap-y-5 mobile:gap-y-10 mobile:gap-10  ${isBased ? "" : "font-accent"}`}>
                {renderPage()}
            </div>
            <BuyStoreItemModal model={isBuyModal} setter={() => { closeBuy() }} buyModalProps={buyModalProps} networkOk={networkOk}/>
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
                destination: `/app/auth?callbackUrl=${routes.Upgrades}`
            }
        }
    }

    if(!account.auth){
        return {
            redirect: {
                permanent: true,
                destination: `/login?callbackUrl=${routes.Upgrades}`
            }
        }
    }

    return {
        props: {
            account: account.user
        }
    }
}

AppUpgrades.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};

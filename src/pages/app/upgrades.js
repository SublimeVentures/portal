import LayoutApp from '@/components/Layout/LayoutApp';
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
import {PremiumItemsENUM} from "@/lib/enum/store";
import {BlockchainProvider} from "@/components/App/BlockchainSteps/BlockchainContext";
import { processServerSideData} from "@/lib/serverSideHelpers";
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";

const BuyStoreItemModal = dynamic(() => import('@/components/App/Store/BuyStoreItemModal'), {ssr: false})


export default function AppUpgrades({session}) {
    const { tenantId} = session
    const {cdn, network} = useEnvironmentContext();

    const [isBuyModal, setBuyModal] = useState(false)
    const [order, setOrder] = useState(null)
    const [currency, setCurrency] = useState(0)


    const {isLoading, data: response, refetch} = useQuery({
            queryKey: ["store", tenantId],
            queryFn: fetchStore,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            cacheTime: 0,
        }
    );

    const storeData = response?.filter(el => el.id !== PremiumItemsENUM.MysteryBox)

    console.log("storeData",storeData )

    const renderPage = () => {
        if(isLoading) return <Loader/>
        if(!storeData || storeData.length === 0) return  <Empty/>

        return (
            <div className="grid grid-cols-12 gap-y-8  mobile:gap-10">
                {!!storeData && storeData.map(el =>
                    <StoreItem item={el} key={el.id} cdn={cdn} setOrder={setOrder}/>
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
        setCurrency(0)
    }, [network.chainId])

    const closeBuy = () => {
        setBuyModal(false);
        refetch()
    }

    const buyModalProps = {
        order: !!order ? order : {},
        setOrder,
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
            <BlockchainProvider>
                <BuyStoreItemModal model={isBuyModal} setter={() => { closeBuy() }} buyModalProps={buyModalProps}/>
            </BlockchainProvider>
        </>


    )
}

export const getServerSideProps = async({ req, res }) => {
    return await processServerSideData(req, res, routes.Upgrades);
}


AppUpgrades.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};

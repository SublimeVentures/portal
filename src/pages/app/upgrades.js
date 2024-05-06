import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineRead as ReadIcon } from "react-icons/ai";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import routes, { ExternalLinks } from "@/routes";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import Empty from "@/components/App/Empty";
import LayoutApp from "@/components/Layout/LayoutApp";
import Loader from "@/components/App/Loader";
import { PremiumItemsENUM } from "@/lib/enum/store";
import StoreItem from "@/components/App/Store/StoreItem";
import { fetchStore } from "@/fetchers/store.fetcher";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { getTenantConfig } from "@/lib/tenantHelper";

const BuyStoreItemModal = dynamic(() => import("@/components/App/Store/BuyStoreItemModal"), { ssr: false });

const { NAME } = getTenantConfig().seo;

export default function AppUpgrades({ session }) {
    const { tenantId } = session;
    const { cdn, network, getCurrencyStore } = useEnvironmentContext();
    console.log("getCurrencyStore", getCurrencyStore());

    const [isBuyModal, setBuyModal] = useState(false);
    const [order, setOrder] = useState(null);

    const {
        isLoading,
        data: response,
        refetch,
    } = useQuery({
        queryKey: ["store", tenantId],
        queryFn: fetchStore,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 0,
    });

    const storeData = response?.filter((el) => el.id !== PremiumItemsENUM.MysteryBox);
    const currency = getCurrencyStore()[0];

    const renderPage = () => {
        if (isLoading) return <Loader />;
        if (!storeData || storeData.length === 0) return <Empty />;

        return (
            <div className="grid grid-cols-12 gap-y-8 mobile:gap-10">
                {!!storeData &&
                    storeData.map((el) => (
                        <StoreItem item={el} key={el.id} cdn={cdn} setOrder={setOrder} currency={currency} />
                    ))}
            </div>
        );
    };

    useEffect(() => {
        if (order) {
            setBuyModal(true);
        }
    }, [order]);

    const closeBuy = () => {
        setBuyModal(false);
        refetch();
    };

    const buyModalProps = {
        order: order ? order : {},
        setOrder,
    };

    const title = `Upgrades - ${NAME}`;

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="flex flex-col justify-between gap-7 sm:flex-row">
                <div className="flex flex-col justify-center">
                    <div className="glow text-3xl page-header-text">UPGRADES</div>
                    <div className="text-outline text-md mt-2 white min-w-[250px]">Supercharge your investments.</div>
                </div>
                <div className="mx-auto flex items-center sm:ml-auto sm:mr-0">
                    <div>
                        <UniButton
                            type={ButtonTypes.BASE}
                            text="Learn more"
                            isWide={true}
                            size="text-sm sm"
                            handler={() => {
                                window.open(ExternalLinks.UPGRADES, "_blank");
                            }}
                            icon={<ReadIcon className={ButtonIconSize.hero} />}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-1 flex-col select-none items-center gap-y-5 mobile:gap-y-10 mobile:gap-10 page-content-text">
                {renderPage()}
            </div>
            <BuyStoreItemModal
                model={isBuyModal}
                setter={() => {
                    closeBuy();
                }}
                buyModalProps={buyModalProps}
            />
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Upgrades);
};

AppUpgrades.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};

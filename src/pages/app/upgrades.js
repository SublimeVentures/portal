import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineRead as ReadIcon } from "react-icons/ai";
import Image from "next/image";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import routes, { ExternalLinks } from "@/routes";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import Empty from "@/components/App/Empty";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import Loader from "@/components/App/Loader";
import { PremiumItemsENUM } from "@/lib/enum/store";
import StoreItem from "@/components/App/Store/StoreItem";
import { fetchStore } from "@/fetchers/store.fetcher";
import { getCopy } from "@/lib/seoConfig";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Card } from "@/v2/components/ui/card";
import { cn } from "@/lib/cn";
import { getCurrency } from "@/components/App/Store/helper";
import { Button } from "@/v2/components/ui/button";

const BuyStoreItemModal = dynamic(() => import("@/components/App/Store/BuyStoreItemModal"), { ssr: false });

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

    const title = `Upgrades - ${getCopy("NAME")}`;

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="flex grow 3xl:px-19 3xl:py-12 3xl:gap-11">
                {!!storeData &&
                    storeData.map((data, index) => (
                        <Card
                            key={data.slug}
                            variant={data.id === 1 ? "accent" : "default"}
                            className="text-white flex-1 flex flex-col gap-11 py-14 items-center justify-center"
                        >
                            <Image
                                src={`${cdn}/webapp/store/${data.img}`}
                                className="rounded-full size-80"
                                alt={data.name}
                                width={320}
                                height={320}
                            />
                            <div className="w-4/5 mx-auto">
                                <h1
                                    className={cn("text-center text-9xl mb-6", {
                                        "text-accent": !index,
                                        "text-primary": !!index,
                                    })}
                                >
                                    {data.name}
                                </h1>
                                <p className="text-center text-lg">{data.description}</p>
                            </div>
                            <div className="flex items-center px-11 py-6 rounded-md bg-white/5 backdrop-blur-2xl w-9/12 mx-auto">
                                <dl className="grid grid-rows-2 grid-flow-col w-2/3">
                                    <DefinitionTerm>Type</DefinitionTerm>
                                    <DefinitionDescription>
                                        {data.id === 1 ? "Not Stackable" : "Stackable"}
                                    </DefinitionDescription>
                                    <DefinitionTerm>Price</DefinitionTerm>
                                    <DefinitionDescription>
                                        {data.price} {currency && getCurrency(currency.symbol)}
                                    </DefinitionDescription>
                                </dl>
                                <Button className="w-1/3" variant={data.id === 1 ? "accent" : "default"}>
                                    Buy
                                </Button>
                            </div>
                        </Card>
                    ))}
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

function DefinitionTerm({ children }) {
    return <dt className="text-md font-light leading-5 self-end">{children}</dt>;
}

function DefinitionDescription({ children }) {
    return <dd className="text-2xl leading-7">{children}</dd>;
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Upgrades);
};

AppUpgrades.getLayout = function (page) {
    return <AppLayout>{page}</AppLayout>;
};

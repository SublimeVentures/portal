import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import routes from "@/routes";
import { AppLayout } from "@/v2/components/Layout";
import { PremiumItemsENUM } from "@/lib/enum/store";
import { fetchStore } from "@/fetchers/store.fetcher";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Card } from "@/v2/components/ui/card";
import { cn } from "@/lib/cn";
import { getCurrency } from "@/components/App/Store/helper";
import { Button } from "@/v2/components/ui/button";
import Header from "@/v2/components/App/Upgrades/Header";
import DefinitionList, { Definition } from "@/v2/modules/upgrades/DefinitionList";
import BackdropCard from "@/v2/modules/upgrades/BackdropCard";
import useImage from "@/v2/hooks/useImage";
import { getCopy } from "@/lib/seoConfig";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/v2/components/ui/tooltip";

const BuyStoreItemModal = dynamic(() => import("@/v2/components/App/Upgrades/BuyStoreItemModal"), { ssr: false });

export default function AppUpgrades({ session }) {
    const { tenantId } = session;
    const { getStoreSrc } = useImage();
    const { getCurrencyStore } = useEnvironmentContext();
    const client = useQueryClient();

    console.log("getCurrencyStore", getCurrencyStore());

    const [isBuyModal, setBuyModal] = useState(false);
    const [order, setOrder] = useState(null);

    const { data: response, refetch } = useQuery({
        queryKey: ["store", tenantId],
        queryFn: fetchStore,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 0,
    });

    const storeData = response?.filter((el) => el.id !== PremiumItemsENUM.MysteryBox);
    const currency = getCurrencyStore()[0];

    const closeBuy = () => {
        setBuyModal(false);
        refetch();
        client.refetchQueries({ queryKey: ["store-items", "owned"] });
    };

    const openBuy = (order) => {
        setOrder(order);
        setBuyModal(true);
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
            <Header title="Supercharge your investments" className="sm:mb-4 lg:mb-0" />
            <div className="flex flex-col md:flex-row md:grow md:overflow-hidden lg:overflow-auto gap-7 sm:gap-4 lg:gap-6 3xl:gap-11 pointer-events-none group lg:mb-12 select-none">
                {!!storeData &&
                    storeData.map((data, index) => (
                        <Card
                            key={data.id}
                            variant={data.id === 1 ? "accent" : "static"}
                            className={cn(
                                "cursor-auto text-white flex-1 flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap lg:flex-col gap-4 3xl:gap-11 py-8 lg:py-4 3xl:py-14 items-center justify-center pointer-events-auto group-hover:opacity-25 hover:!opacity-100 !bg-cover bg-center",
                                {
                                    "!bg-pattern-gold": data.id === 1,
                                    "!bg-pattern-blue": data.id !== 1,
                                },
                            )}
                        >
                            <Image
                                src={getStoreSrc(data.img)}
                                className="rounded-full size-46 sm:size-32 3xl:size-80 pointer-events-none"
                                alt={data.name}
                                width={320}
                                height={320}
                            />
                            <div className="w-4/5 sm:w-1/2 lg:w-4/5 mx-auto sm:mx-0 lg:mx-auto text-center sm:text-left lg:text-center">
                                <h1
                                    className={cn("text-lg 3xl:text-3xl font-medium mb-4", {
                                        "text-accent": !index,
                                        "text-primary": !!index,
                                    })}
                                >
                                    {data.name}
                                </h1>
                                <p className=" text-xs 3xl:text-base font-light">{data.description}</p>
                            </div>
                            <BackdropCard className="w-11/12 sm:w-full 3xl:w-9/12 3xl:mx-auto">
                                <DefinitionList className="w-full sm:w-2/3">
                                    <Definition term="Type">{data.id === 1 ? "Not Stackable" : "Stackable"}</Definition>
                                    <Definition term="Price">
                                        {data.price} {currency && getCurrency(currency.symbol)}
                                    </Definition>
                                </DefinitionList>
                                {data.availability < 1 ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                className="w-full sm:w-1/3"
                                                variant={data.id === 1 ? "accent" : "default"}
                                                disabled={data.availability < 1}
                                                onClick={() => openBuy(data)}
                                            >
                                                Buy
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>No more {data.name} available for purchase</TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Button
                                        className="w-full sm:w-1/3"
                                        variant={data.id === 1 ? "accent" : "default"}
                                        disabled={data.availability < 1}
                                        onClick={() => openBuy(data)}
                                    >
                                        Buy
                                    </Button>
                                )}
                            </BackdropCard>
                        </Card>
                    ))}
            </div>
            <BuyStoreItemModal model={isBuyModal} setter={closeBuy} buyModalProps={buyModalProps} />
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Upgrades);
};

AppUpgrades.getLayout = function (page) {
    return <AppLayout title="Upgrades">{page}</AppLayout>;
};

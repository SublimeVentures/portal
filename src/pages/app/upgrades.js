import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import routes from "@/routes";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import { PremiumItemsENUM } from "@/lib/enum/store";
import { fetchStore } from "@/fetchers/store.fetcher";
import { getCopy } from "@/lib/seoConfig";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Card } from "@/v2/components/ui/card";
import { cn } from "@/lib/cn";
import { getCurrency } from "@/components/App/Store/helper";
import { Button } from "@/v2/components/ui/button";
import Header from "@/v2/components/App/Upgrades/Header";
import DefinitionList, { Definition } from "@/v2/modules/upgrades/DefinitionList";
import BackdropCard from "@/v2/modules/upgrades/BackdropCard";

const BuyStoreItemModal = dynamic(() => import("@/v2/components/App/Upgrades/BuyStoreItemModal"), { ssr: false });

export default function AppUpgrades({ session }) {
    const { tenantId } = session;
    const { cdn, getCurrencyStore } = useEnvironmentContext();
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
        <div className="flex flex-col grow 3xl:pt-11 gap-7 3xl:gap-11">
            <Head>
                <title>{title}</title>
            </Head>
            <Header title="Supercharge your investments" />
            <div className="flex flex-col 3xl:flex-row 3xl:grow gap-7 3xl:gap-11 pointer-events-none group mb-20 3xl:mb-0">
                {!!storeData &&
                    storeData.map((data, index) => (
                        <Card
                            key={data.slug}
                            variant={data.id === 1 ? "accent" : "static"}
                            className={cn(
                                "text-white flex-1 flex flex-col gap-4 3xl:gap-11 py-8 3xl:py-14 items-center justify-center pointer-events-auto group-hover:opacity-25 hover:!opacity-100 !bg-cover bg-center",
                                {
                                    "!bg-pattern-gold": data.id === 1,
                                    "!bg-pattern-blue": data.id !== 1,
                                },
                            )}
                        >
                            <Image
                                src={`${cdn}/webapp/store/${data.img}`}
                                className="rounded-full size-46 3xl:size-80"
                                alt={data.name}
                                width={320}
                                height={320}
                            />
                            <div className="w-4/5 mx-auto">
                                <h1
                                    className={cn("text-center text-lg 3xl:text-3xl font-medium mb-4", {
                                        "text-accent": !index,
                                        "text-primary": !!index,
                                    })}
                                >
                                    {data.name}
                                </h1>
                                <p className="text-center text-xs 3xl:text-base font-light">{data.description}</p>
                            </div>
                            <BackdropCard className="w-11/12 3xl:w-9/12 3xl:mx-auto">
                                <DefinitionList className="w-full 3xl:w-2/3">
                                    <Definition term="Type">{data.id === 1 ? "Not Stackable" : "Stackable"}</Definition>
                                    <Definition term="Price">
                                        {data.price} {currency && getCurrency(currency.symbol)}
                                    </Definition>
                                </DefinitionList>
                                <Button
                                    className="w-full 3xl:w-1/3"
                                    variant={data.id === 1 ? "accent" : "default"}
                                    disabled={data.availability < 1}
                                    onClick={() => setOrder(data)}
                                >
                                    Buy
                                </Button>
                            </BackdropCard>
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
        </div>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Upgrades);
};

AppUpgrades.getLayout = function (page) {
    return <AppLayout title="Upgrades">{page}</AppLayout>;
};

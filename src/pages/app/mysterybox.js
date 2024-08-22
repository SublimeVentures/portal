import { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import routes, { ExternalLinks } from "@/routes";
import { getCopy } from "@/lib/seoConfig";
import { fetchStore, fetchStoreItemsOwned } from "@/fetchers/store.fetcher";
import BuyMysteryBoxModal from "@/v2/components/App/MysteryBox/BuyMysteryBoxModal";
import { claimMysterybox } from "@/fetchers/mysterbox.fetcher";
import { PremiumItemsENUM } from "@/lib/enum/store";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { TENANT } from "@/lib/tenantHelper";
import { AppLayout } from "@/v2/components/Layout";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import DefinitionList, { Definition } from "@/v2/modules/upgrades/DefinitionList";
import BackdropCard from "@/v2/modules/upgrades/BackdropCard";
import { Button } from "@/v2/components/ui/button";

const ErrorModal = dynamic(() => import("@/v2/components/App/MysteryBox/ClaimErrorModal"), { ssr: false });
const ClaimMysteryBoxModal = dynamic(() => import("@/v2/components/App/MysteryBox/ClaimMysteryBoxModal"), {
    ssr: false,
});

export default function MysteryBoxPage({ session }) {
    const router = useRouter();

    const { settings } = useEnvironmentContext();

    const { userId, tenantId } = session;
    const imageTilt = useRef(null);
    const [isBuyModal, setBuyModal] = useState(false);
    const [isClaimError, setClaimError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [claimData, setClaimData] = useState({});
    const [claimModal, setClaimModal] = useState(false);
    const [claimProcessing, setClaimProcessing] = useState(false);
    const [order, setOrder] = useState(null);

    const { data: storeData, refetch: refetchStoreState } = useQuery({
        queryKey: ["store", tenantId],
        queryFn: fetchStore,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 0,
    });

    const { data: premiumData, refetch: refetchStoreItems } = useQuery({
        queryKey: ["premiumOwned", userId, tenantId],
        queryFn: fetchStoreItemsOwned,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        cacheTime: 15 * 1000,
    });

    const mysteryBox = storeData?.find((el) => el.id === PremiumItemsENUM.MysteryBox);
    const storeAvailable = mysteryBox ? mysteryBox.availability : 0;

    const mysteryBoxOwned = premiumData?.find((el) => el.id === PremiumItemsENUM.MysteryBox);
    const mysteryBoxOwnedAmount = mysteryBoxOwned ? mysteryBoxOwned.amount : 0;

    const closeBuy = () => {
        refetchStoreItems();
        refetchStoreState();
        setBuyModal(false);
    };

    const openMysteryBox = async () => {
        if (claimProcessing) return;
        setClaimProcessing(true);
        const data = await claimMysterybox();
        if (data.ok) {
            setClaimData(data);
            setClaimModal(true);
        } else {
            setErrorMessage(data.error);
            setClaimError(true);
        }
        await refetchStoreItems();
        await refetchStoreState();
        setTimeout(() => {
            setClaimProcessing(false);
        }, 2000);
    };

    useEffect(() => {
        if (settings.isMysteryboxEnabled === false) {
            router.replace(routes.App);
        }
        if (TENANT.basedVC !== Number(process.env.NEXT_PUBLIC_TENANT)) {
            VanillaTilt.init(imageTilt.current, {
                scale: 1.1,
                speed: 1000,
                max: 0.2,
            });
        }
    }, []);

    useEffect(() => {
        if (order) {
            setBuyModal(true);
        }
    }, [order]);

    const buyModalProps = {
        order: order ? order : {},
        setOrder,
    };

    const title = `Mystery Box - ${getCopy("NAME")}`;

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="grow flex flex-col items-start justify-center 3xl:py-12">
                <div className="3xl:w-[532px] md:max-w-[45%]">
                    <div className="flex flex-col items-start 3xl:gap-4 mb-10 pt-10 3xl:pt-0">
                        <h1 className="font-semibold 3xl:font-medium text-base 3xl:text-3xl text-accent">
                            The Sunken Mystery Box
                        </h1>
                        <p className="text-sm 3xl:text-base font-light leading-7 text-white/50 3xl:text-white mb-8 3xl:mb-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua.
                        </p>
                        <Link
                            href={ExternalLinks.LOOTBOX}
                            className="text-white inline-flex items-center gap-2 text-sm"
                            target="_blank"
                        >
                            Learn more
                            <ArrowIcon className="size-2" />
                        </Link>
                    </div>
                    <BackdropCard className="mb-5">
                        <DefinitionList className="grid-cols-2 w-full 3xl:w-2/3">
                            <Definition term="Type">Stackable</Definition>
                            <Definition term="Price">$150</Definition>
                        </DefinitionList>
                        <Button
                            className="w-full 3xl:w-1/3"
                            disabled={storeAvailable <= 0}
                            onClick={() => {
                                setOrder(mysteryBox);
                            }}
                        >
                            Buy
                        </Button>
                    </BackdropCard>
                    {mysteryBoxOwnedAmount > 0 && (
                        <BackdropCard className="!flex-row">
                            <figure className="w-2/5 3xl:w-1/3">
                                <Image
                                    src="/img/icon-chest.webp"
                                    className="rounded-md w-full 3xl:size-18 3xl:-my-2"
                                    alt="Mystery Box"
                                    width={72}
                                    height={72}
                                />
                            </figure>
                            <div className="w-3/5 3xl:w-2/3 flex flex-col 3xl:flex-row gap-5 3xl:items-center">
                                <DefinitionList className="3xl:w-1/2">
                                    <Definition term="Owned">{mysteryBoxOwnedAmount}</Definition>
                                </DefinitionList>
                                <Button
                                    variant="accent"
                                    className="3xl:w-1/2"
                                    disabled={mysteryBoxOwnedAmount < 1 || claimProcessing}
                                    onClick={openMysteryBox}
                                >
                                    Open
                                </Button>
                            </div>
                        </BackdropCard>
                    )}
                </div>
            </div>
            <BuyMysteryBoxModal
                model={isBuyModal}
                setter={() => {
                    closeBuy();
                }}
                buyModalProps={buyModalProps}
            />
            <ClaimMysteryBoxModal
                model={claimModal}
                setter={() => {
                    setClaimModal(false);
                }}
                claimData={claimData}
            />
            <ErrorModal
                model={isClaimError}
                setter={() => {
                    setClaimError(false);
                }}
                errorMessage={errorMessage}
            />
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    //todo: ssr redirect if mysteryboxes not enabled
    return await processServerSideData(req, res, routes.Mysterybox);
};

MysteryBoxPage.getLayout = function (page) {
    return (
        <AppLayout contentClassName="bg-mystery-box h-full bg-cover bg-center md:bg-left" title="Mystery Box">
            {page}
        </AppLayout>
    );
};

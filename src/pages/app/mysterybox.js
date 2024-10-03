import { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import LayoutApp from "@/components/Layout/LayoutApp";
import routes from "@/routes";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import IconMysteryBox from "@/assets/svg/MysteryBox.svg";
import Linker from "@/components/link";
import { fetchStore, fetchStoreItemsOwned } from "@/fetchers/store.fetcher";
import BuyMysteryBoxModal from "@/components/App/MysteryBox/BuyMysteryBoxModal";
import { claimMysterybox } from "@/fetchers/mysterbox.fetcher";
import { PremiumItemsENUM } from "@/lib/enum/store";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { getTenantConfig, TENANT } from "@/lib/tenantHelper";
const ErrorModal = dynamic(() => import("@/components/App/MysteryBox/ClaimErrorModal"), { ssr: false });
const ClaimMysteryBoxModal = dynamic(() => import("@/components/App/MysteryBox/ClaimMysteryBoxModal"), { ssr: false });

const {
    seo: { NAME },
    externalLinks,
} = getTenantConfig();

const TENANT_MYSTERYBOX = () => {
    switch (Number(process.env.NEXT_PUBLIC_TENANT)) {
        case TENANT.basedVC: {
            return (
                <div className={"video-wrapper"}>
                    <video loop autoPlay muted playsInline className="">
                        <source src="https://cdn.basedvc.fund/webapp/1.mp4" type="video/mp4" />
                    </video>
                </div>
            );
        }
        case TENANT.NeoTokyo: {
            return <IconMysteryBox className="w-[250px] sm:w-[450px] text-white" />;
        }
        case TENANT.CyberKongz: {
            return (
                <img
                    src={"https://vc-cdn.s3.eu-central-1.amazonaws.com/webapp/store/0_14.png"}
                    className={"max-w-[350px]"}
                />
            );
        }
    }
};

export default function AppLootbox({ session }) {
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

    const title = `Mystery Box - ${NAME}`;
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="mystery flex flex-1 flex-col select-none justify-center items-center gap-10  relative">
                {mysteryBoxOwnedAmount > 0 && (
                    <div className="header-text-dedicated text-2xl flex absolute top-5 glow-normal pb-5 z-10">
                        You have {mysteryBoxOwnedAmount} unopened MysteryBox!
                    </div>
                )}
                <div className="mt-[150px] sm:mt-0" ref={imageTilt}>
                    {TENANT_MYSTERYBOX()}
                </div>

                <div className="flex gap-5 mt-5 z-10 absolute bottom-10">
                    <UniButton
                        type={ButtonTypes.BASE}
                        text="OPEN"
                        state="success"
                        isDisabled={mysteryBoxOwnedAmount < 1 || claimProcessing}
                        isPrimary={true}
                        isWide={true}
                        zoom={1.05}
                        size="text-sm xs"
                        handler={() => {
                            openMysteryBox();
                        }}
                    />
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={`BUY (${storeAvailable})`}
                        isDisabled={storeAvailable <= 0}
                        isWide={true}
                        zoom={1.05}
                        size="text-sm xs"
                        handler={() => {
                            setOrder(mysteryBox);
                        }}
                    />
                </div>

                <div className="absolute bottom-0 z-10">
                    <Linker url={externalLinks.LOOTBOX} text="Learn more" />
                </div>
            </div>
            <BuyMysteryBoxModal
                model={isBuyModal}
                setter={() => {
                    closeBuy();
                }}
                buyModalProps={buyModalProps}
                userId={userId}
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

AppLootbox.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};

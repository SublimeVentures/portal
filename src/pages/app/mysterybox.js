import { useEffect, useRef, useState } from "react";
import VanillaTilt from "vanilla-tilt";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
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
import DefinitionList, { Definition } from "@/v2/modules/upgrades/DefinitionList";
import BackdropCard from "@/v2/modules/upgrades/BackdropCard";
import { Button } from "@/v2/components/ui/button";
import { formatCurrency } from "@/v2/helpers/formatters.js";
import ExternalLink from "@/v2/components/ui/external-link";
import { userInvestmentsKeys } from "@/v2/constants";

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
        queryKey: userInvestmentsKeys.premiumOwned([userId, tenantId]),
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
            <div className="grow flex flex-col items-start justify-center lg:py-6 3xl:py-12 select-none">
                <div className="3xl:w-[532px] md:max-w-[45%]">
                    <div className="flex flex-col items-start lg:gap-2 3xl:gap-4 mb-10 lg:mb-4 3xl:mb-10 pt-10 sm:pt-0">
                        <h1 className="font-semibold 3xl:font-medium text-base 3xl:text-3xl text-accent">
                            The Sunken Mystery Box
                        </h1>
                        <p className="text-sm lg:text-xs 3xl:text-base font-light leading-7 lg:leading-4 3xl:leading-7 text-white/50 3xl:text-white mb-8 lg:mb-0">
                            Unearth treasures from an ancient aquatic empire, including rare allocations, powerful
                            upgrades, exclusive NFTs, and valuable discounts. The depths hold secrets, waiting for you
                            to discover.
                        </p>
                        <ExternalLink href={ExternalLinks.LOOTBOX} className="text-white text-sm">
                            Learn more
                        </ExternalLink>
                    </div>
                    <BackdropCard className="mb-5">
                        <DefinitionList className="grid-cols-2 w-full sm:w-2/3">
                            <Definition term="Type">Stackable</Definition>
                            <Definition term="Price">{formatCurrency(mysteryBox?.price)}</Definition>
                        </DefinitionList>
                        <Button
                            className="w-full sm:w-1/3"
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
                            <figure className="w-2/5 sm:w-1/3">
                                <Image
                                    src="/img/mysterybox.webp"
                                    placeholder="blur"
                                    className="rounded-md w-full sm:size-18 lg:-my-2 pointer-events-none"
                                    alt="Mystery Box"
                                    width={72}
                                    height={72}
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QCgRXhpZgAATU0AKgAAAAgABQEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAAEyAAIAAAAUAAAAWodpAAQAAAABAAAAbgAAAAAAAABIAAAAAQAAAEgAAAABMjAyNDowOTowMiAxNToyNDowNQAAA6ABAAMAAAABAAEAAKACAAMAAAABAAoAAKADAAMAAAABAAoAAAAAAAD/4QtCaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjUuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wOS0wMlQxNToyNDowNSswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wOS0wMlQxNToyNDowNSswMjowMCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InByb2R1Y2VkIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZmZpbml0eSBQaG90byAyIDIuNS41IiBzdEV2dDp3aGVuPSIyMDI0LTA5LTAyVDE1OjI0OjA1KzAyOjAwIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/iAmRJQ0NfUFJPRklMRQABAQAAAlRsY21zBDAAAG1udHJSR0IgWFlaIAfoAAkAAgAMAAkAJGFjc3BBUFBMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD21gABAAAAANMtbGNtcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC2Rlc2MAAAEIAAAAPmNwcnQAAAFIAAAATHd0cHQAAAGUAAAAFGNoYWQAAAGoAAAALHJYWVoAAAHUAAAAFGJYWVoAAAHoAAAAFGdYWVoAAAH8AAAAFHJUUkMAAAIQAAAAIGdUUkMAAAIQAAAAIGJUUkMAAAIQAAAAIGNocm0AAAIwAAAAJG1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIgAAABwAcwBSAEcAQgAgAEkARQBDADYAMQA5ADYANgAtADIALgAxAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAADAAAAAcAE4AbwAgAGMAbwBwAHkAcgBpAGcAaAB0ACwAIAB1AHMAZQAgAGYAcgBlAGUAbAB5WFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEIAAAXe///zJQAAB5MAAP2Q///7of///aIAAAPcAADAblhZWiAAAAAAAABvoAAAOPUAAAOQWFlaIAAAAAAAACSfAAAPhAAAtsNYWVogAAAAAAAAYpcAALeHAAAY2XBhcmEAAAAAAAMAAAACZmYAAPKnAAANWQAAE9AAAApbY2hybQAAAAAAAwAAAACj1wAAVHsAAEzNAACZmgAAJmYAAA9c/9sAQwABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/9sAQwEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/8AAEQgACgAKAwERAAIRAQMRAf/EABQAAQAAAAAAAAAAAAAAAAAAAAn/xAAgEAACAwEAAgIDAAAAAAAAAAABBAIDBQYHEQAIIVGR/8QAGAEBAAMBAAAAAAAAAAAAAAAABgMEBQf/xAAnEQADAQABAwQABwEAAAAAAAABAgMEBRESIQAGBxMIFCIjMUFCYf/aAAwDAQACEQMRAD8AF3V8kfVHzzg1999yd3oa/JGZzLamw7zOL1m323e7dMa0+f1di3Q6jJ4ulbF5ykIrRxjjllnLzIawdcZ1LhL8r8l8lZd6y9k4OLb7W49Bu5fTL6WCYYHYnYqmke+zzCVK6qAjWPy01TK9S/4ePaPxdxPtfLLn7cqwW/OWrj4t9KiSaOc3vic0uL/Y6SVvsjOMImVMrJqrQ6UkKIyUiAYVynEgGMzG8GcSPYkRGUgDIej6EpAe/QJH5+LDfjiSa7xOpP7k1rDtnT/aDukG6K3VR3AN0HkdfWt2c6v6c3DWtnHjPZp1DViPEqMF0lQzp2sQpKgnwenpHmsvM1/onh9zrZyOp2uhuUov9hoqLu9S8ks7vJrqOdAzXbrMq0KJpq0r3NzqqWVWohCNVFUY831aNFffWbLW9qZUxXdM1Ku8EdEmEZYsxmrIPCsFBUeAQPS7FlzYvam18eeGRzsRS+aM4MVoWpRS0lQkUoS7jr0ZyWbqST6LD0P0P4Pi/wBU1J7R5P8AA/v/AJ6//9k="
                                />
                            </figure>
                            <div className="w-3/5 sm:w-2/3 flex flex-col sm:flex-row gap-5 sm:items-center">
                                <DefinitionList className="sm:w-1/2">
                                    <Definition term="Owned">{mysteryBoxOwnedAmount}</Definition>
                                </DefinitionList>
                                <Button
                                    variant="accent"
                                    className="sm:w-1/2"
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
            <BuyMysteryBoxModal open={isBuyModal} onClose={closeBuy} buyModalProps={buyModalProps} />
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
        <AppLayout contentClassName="bg-mystery-box bg-cover bg-center" title="Mystery Box">
            {page}
        </AppLayout>
    );
};

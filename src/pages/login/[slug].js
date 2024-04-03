import { useEffect, useRef } from "react";
import Image from "next/image";
import { dehydrate } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import VanillaTilt from "vanilla-tilt";
import { useRouter } from "next/router";
import { IoWalletOutline as WalletIcon } from "react-icons/io5";
import HeroBg from "@/components/Home/HeroBg";
import { ButtonIconSize, RoundButton } from "@/components/Button/RoundButton";
import { verifyID } from "@/lib/authHelpers";
import { queryClient } from "@/lib/queryCache";
import { fetchPartners } from "@/fetchers/public.fecher";
import { seoConfig } from "@/lib/seoConfig";
import PAGE, { ExternalLinks } from "@/routes";
import { tenantIndex } from "@/lib/utils";
import Linker from "@/components/link";
import useLoginFlow from "@/components/Login/useLoginFlow";
import LoginModal from "@/components/SignupFlow/LoginModal";
import { TENANT } from "@/lib/tenantHelper";
import Layout from "@/components/Layout/Layout";

const isBaseVCTenant = tenantIndex === TENANT.basedVC;

export default function LoginPartner({ selectedPartner, isAuthenticated }) {
    const seo = seoConfig(PAGE.Login);
    const router = useRouter();
    const tilt = useRef(null);
    const { isLoginLoading, handleConnect, setPartner, loginData } = useLoginFlow();

    useEffect(() => {
        VanillaTilt.init(tilt.current, {
            scale: 1.05,
            speed: 1000,
            max: isBaseVCTenant ? 5 : 0.2,
        });
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/app");
        }

        setPartner(selectedPartner.id);
    }, []);

    const renderOptions = () => {
        return (
            <div className={"flex justify-between flex-wrap gap-10 w-full  md:w-2/3"}>
                <div className="flex flex-1 flex-col p-10 sm:p-10 sm:w-max font-accent blurred glareBg bg-black lg:flex-row ">
                    <div className="flex flex-col">
                        <div className="text-3xl font-bold">
                            <span className={"text-app-success"}>Partner</span> Login
                        </div>
                        <div className="pt-3">
                            <div>
                                Unlock exclusive partner privileges by connecting a wallet with your Partner NFT. Ensure
                                you hold the NFT or have been granted delegated access to journey forward.
                            </div>
                            <Linker url={ExternalLinks.DELEGATED_ACCESS} text={"Delegated access?"} />
                        </div>
                        <div className="flex flex-col gap-5 justify-end flex-1 pt-10 lg:mt-0">
                            <RoundButton
                                text={"Connect Wallet"}
                                isLoading={isLoginLoading}
                                isLoadingWithIcon={true}
                                isWide={true}
                                zoom={1.1}
                                size={"text-sm sm"}
                                icon={<WalletIcon className={ButtonIconSize.hero} />}
                                handler={() => {
                                    handleConnect();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const logo = () => {
        return (
            <div className={"flex flex-row items-center"}>
                <div className={"w-[60px] h-[60px] relative mr-2"}>
                    <Image src={selectedPartner.logo} layout="fill" objectFit="contain" alt="logo" ref={tilt} />
                </div>
                <div>{selectedPartner.name}</div>
            </div>
        );
    };

    return (
        <>
            <NextSeo
                title={seo.title}
                description={seo.description}
                canonical={seo.url}
                openGraph={seo.og}
                twitter={seo.twitter}
            />
            <HeroBg subtitle={"powered by basedVC"} title={logo()} content={renderOptions()} />
            <LoginModal loginModalProps={loginData} />
        </>
    );
}

export const getServerSideProps = async (context) => {
    const { params } = context;
    const { slug } = params;

    const account = await verifyID(context.res.req);

    await queryClient.prefetchQuery({
        queryKey: ["partnerList"],
        queryFn: fetchPartners,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000,
    });

    const partnersData = queryClient.getQueryData(["partnerList"]);
    const selectedPartner = partnersData?.find((el) => el.slug === slug);

    if (!selectedPartner || Number(process.env.NEXT_PUBLIC_TENANT) !== TENANT.basedVC) {
        return {
            redirect: {
                permanent: false,
                destination: PAGE.Login,
            },
        };
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            selectedPartner,
            isAuthenticated: account.auth,
        },
    };
};

LoginPartner.getLayout = function (page) {
    return <Layout>{page}</Layout>;
};

import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import Empty from "@/components/App/Empty";
import LayoutApp from "@/components/Layout/LayoutApp";
import Loader from "@/components/App/Loader";
import { processServerSideData } from "@/lib/serverSideHelpers";
import routes from "@/routes";
import { createInviteLink, fetchUserReferralCode, fetchUserReferralClaims, fetchUserReferrals } from "@/fetchers/referral.fetcher";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { useEffect, useState } from "react";
import ClaimItem from "@/components/App/Referral/ClaimItem";
import DetailsSidebar from "@/components/App/Referral/DetailsSidebar";
import ReferralsTable from "@/components/App/Referral/ReferralsTable";
import { getTenantConfig } from "@/lib/tenantHelper";

const {
    seo: { NAME }
} = getTenantConfig();

export default function AppReferral({ session }) {

    const [referral, setReferral] = useState(null)
    const [claimModal, setClaimModal] = useState(false);
    const [claimModalDetails, setClaimModalDetails] = useState({});

    const {
        isLoadingReferralCode,
        data: response,
        isReferralCodeError,
    } = useQuery({
        queryKey: ["fetchUserReferralCode"],
        queryFn: fetchUserReferralCode,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const {
        isLoadingReferralClaims,
        data: referralClaimsResponse,
        isReferralClaimsError,
        refetch: refetchReferralClaims,
    } = useQuery({
        queryKey: ["fetchUserReferralClaims"],
        queryFn: fetchUserReferralClaims,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const {
        isLoadingReferrals,
        data: userReferrals,
        isUserReferralsError,
    } = useQuery({
        queryKey: ["fetchUserReferrals"],
        queryFn: fetchUserReferrals,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (response) {
            setReferral(`${process.env.DOMAIN}/login?referral=${response.hash}`)
        }
    }, [response])


    const closeClaimModal = () => {
        setClaimModal(false);
        setTimeout(() => {
            setClaimModalDetails({});
        }, 400);
    };
    const openClaimModal = (data) => {
        setClaimModalDetails(data);
        setClaimModal(true);
    };

    const createHandler = async () => {
        const createData = await createInviteLink()
        if (createData) {
            setReferral(`${process.env.DOMAIN}/login?referral=${createData.hash}`)
        }
    }

    const renderList = () => {
        if (!referralClaimsResponse) return;
        const consolidatedClaims = referralClaimsResponse.reduce((acc, claim) => {
            if (!acc[claim.offer.id]) {
                acc[claim.offer.id] = {
                    offer: claim.offer,
                    claims: []
                };
            }
            acc[claim.offer.id].claims.push(claim);
            return acc;
        }, {});

        return Object.values(consolidatedClaims).map((el, i) => {
            return <ClaimItem item={el} key={el.offer.id} passData={openClaimModal} />;
        });
    };

    const claimModalProps = {
        claimModalDetails,
        refetchReferralClaims,
    };

    const renderPage = () => {
        if (isLoadingReferralClaims || isLoadingReferralCode || isLoadingReferrals ) return <Loader />;
        if (isReferralClaimsError || isReferralCodeError || isUserReferralsError) return <Empty />;

        return (
            <div className="h-full flex flex-row items-start justify-center">
                <div className="flex-col">
                    <div
                        className="bordered-container bg-navy-accent flex text-center border-transparent border mb-4"
                    >
                        <div className="flex flex-1 flex-col bg-navy-accent">
                            <div className="flex flex-1 flex-col text-left py-4">
                                <div className={"px-10 pt-5"}>
                                    <div className="text-3xl font-bold flex flex-1 glow">Referral Link</div>
                                    <div className="text-md flex flex-1 mt-1 pb-5 color">Share this link so people can use your referral</div>
                                </div>

                                {!referral ? <UniButton
                                    type={ButtonTypes.BASE}
                                    text="Create Invite Link"
                                    isLoading={false}
                                    isDisabled={false}
                                    is3d={false}
                                    isWide={true}
                                    zoom={1.1}
                                    size={"text-sm sm"}
                                    handler={() => createHandler()}
                                /> :

                                    <div className="font-bold text-center py-2 my-6 w-full mt-auto bordered-container">
                                        <input className="w-3/4 text-white p-2" disabled={true} type="text" value={referral} />
                                    </div>}
                            </div>
                        </div>
                    </div>

                    <div
                        className="bordered-container bg-navy-accent flex text-center border-transparent border offerItem mb-4"
                    >
                        <div className="flex flex-1 flex-col bg-navy-accent">
                            <div className="flex flex-1 flex-col text-left">
                                <div className={"px-10 pt-5 mb-8"}>
                                    <div className="text-3xl font-bold flex flex-1 glow">Summary</div>
                                    <div className="text-md flex flex-1 mt-1 pb-5 color">Summary of all referrals</div>
                                    <div className="">
                                        {userReferrals && <ReferralsTable dataProp={userReferrals} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="bordered-container bg-navy-accent flex text-center border-transparent border offerItem"
                    >
                        <div className="flex flex-1 flex-col bg-navy-accent">
                            <div className="flex flex-1 flex-col text-left ">
                                <div className={"px-10 pt-5 mb-8"}>
                                    <div className="text-3xl font-bold flex flex-1 glow">Claim Payouts</div>
                                    <div className="text-md flex flex-1 mt-1 pb-5 color">Claim payouts from different referrals</div>
                                    <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">{renderList()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DetailsSidebar
                    model={claimModal}
                    setter={closeClaimModal}
                    claimModalProps={claimModalProps}
                />
            </div>
        );
    };

    const title = `Referral - ${NAME}`;
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="flex flex-col justify-between gap-7 xl:flex-row">
                <div className="flex flex-col justify-center">
                    <div className="glow text-3xl page-header-text">Referral</div>
                    <div className="text-outline text-md mt-2 white min-w-[250px]">
                        Share with your friends and be rewarded for it
                    </div>
                </div>
            </div>
            {renderPage()}
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Launchpad);
};

AppReferral.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};

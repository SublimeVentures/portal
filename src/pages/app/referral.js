import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Empty from "@/components/App/Empty";
import Loader from "@/components/App/Loader";
import { processServerSideData } from "@/lib/serverSideHelpers";
import routes from "@/routes";
import {
    createInviteLink,
    fetchUserReferralCode,
    fetchUserReferralClaims,
    fetchUserReferrals,
} from "@/fetchers/referral.fetcher";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { getTenantConfig } from "@/lib/tenantHelper";
import InlineCopyButton from "@/components/Button/InlineCopyButton";
import { AppLayout } from "@/v2/components/Layout";
import Header from "@/v2/components/App/Referrals/Header";
import Table from "@/v2/components/Table/Table";
import { referrals as columns } from "@/v2/modules/referrals/logic/columns";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { Input } from "@/v2/components/ui/input";
import { ClaimsList } from "@/v2/modules/referrals/ClaimsList";
import ReferralClaimPayoutModal from "@/v2/modules/referrals/Payout";

const { NAME } = getTenantConfig().seo;

export default function AppReferral() {
    const [referral, setReferral] = useState(null);
    
    const [claimDetailsModal, setClaimModalDetails] = useState({});
    const [claimIsOpenModal, setIsOpenClaimModal] = useState(false);

    const {
        isLoadingReferralCode,
        data: referralCodeResponse,
        isReferralCodeError,
    } = useQuery({
        queryKey: ["fetchUserReferralCode"],
        queryFn: fetchUserReferralCode,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        refetchOnMount: false,
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
    });

    const {
        isLoadingReferrals,
        data: userReferrals = [],
        isUserReferralsError,
    } = useQuery({
        queryKey: ["fetchUserReferrals"],
        queryFn: fetchUserReferrals,
        cacheTime: 5 * 60 * 1000,
        staleTime: 1 * 60 * 1000,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });
    const referralsTable = useReactTable({
        data: userReferrals,
        columns,
        manualFiltering: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    useEffect(() => {
        if (referralCodeResponse) {
            setReferral(`${process.env.DOMAIN}/login?referral=${referralCodeResponse.hash}`);
        }
    }, [referralCodeResponse]);

    const setClaimModalData = (data) => {
        setClaimModalDetails(data);
    };

    const createHandler = async () => {
        const createData = await createInviteLink();
        if (createData) {
            setReferral(`${process.env.DOMAIN}/login?referral=${createData.hash}`);
        }
    };

    const claimDetailsModalProps = {
        claimDetailsModal,
        refetchReferralClaims,
    };

    const title = `Referral - ${NAME}`;

    const isNextPayout = claimDetailsModal?.referralPayouts?.length > 0;
    const nextPayout = isNextPayout ? claimDetailsModal?.referralPayouts[0] : {};
    const symbol = isNextPayout ? nextPayout?.currencySymbol : "USD";
    const currency = {
        symbol: symbol,
        precision: nextPayout.precision,
        chainId: nextPayout.chainId,
    };
    const payoutProps = {
        ...claimDetailsModal,
        currency,
    };

    const renderPage = () => {
        if (isLoadingReferralClaims || isLoadingReferralCode || isLoadingReferrals) return <Loader />;
        if (isReferralClaimsError || isReferralCodeError || isUserReferralsError) return <Empty />;

        return (
            <div className="h-full flex flex-row items-start justify-center">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-1 flex-col text-left py-4 bordered-container text-center border-transparent border bg-navy-accent">
                        <div className="px-10 pt-5">
                            <div className="text-3xl font-bold flex flex-1 text-white">Referral Link</div>
                            <div className="text-md flex flex-1 mt-1 pb-5 text-white/50">
                                Share this link so people can use your referral
                            </div>
                        </div>

                        {!referral ? (
                            <UniButton
                                type={ButtonTypes.BASE}
                                text="Create Invite Link"
                                isLoading={false}
                                isDisabled={false}
                                is3d={false}
                                isWide={true}
                                zoom={1.1}
                                size={"text-sm sm"}
                                handler={() => createHandler()}
                            />
                        ) : (
                            <div>
                                <div className="flex justify-center font-bold py-2 my-6 w-full mt-auto">
                                    <Input
                                        disabled={true}
                                        type="text"
                                        className="w-3/4 text-white p-2"
                                        value={referral}
                                    />
                                    <InlineCopyButton className="-ml-10 text-white" copiable={referral} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bordered-container bg-navy-accent px-10 py-5 md:block">
                        <div className="">
                            <h2 className="text-3xl font-bold flex flex-1 text-white">Summary</h2>
                            <div className="text-md flex flex-1 mt-1 pb-5 text-white/50">Summary of all referrals</div>
                            <Table table={referralsTable} isLoading={isLoadingReferrals} colCount={columns.length} />
                        </div>
                    </div>

                    <div className="flex bordered-container bg-navy-accent text-center">
                        <div className="flex flex-1 flex-col bg-navy-accent">
                            <div className="flex flex-1 flex-col text-left ">
                                <div className="px-10 pt-5 mb-8">
                                    <h2 className="text-3xl font-bold flex flex-1 text-white">Claim Payouts</h2>
                                    <div className="text-md flex flex-1 mt-1 pb-5 text-white/50">
                                        Claim payouts from different referrals
                                    </div>
                                    <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                                        <ClaimsList
                                            claims={referralClaimsResponse}
                                            claimModalProps={claimDetailsModalProps}
                                            setIsOpenClaimModal={setIsOpenClaimModal}
                                            setModalData={setClaimModalData}
                                            payoutProps={payoutProps}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

   

   

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            
            <Header title="Share with your friends and be rewarded for it" className="sm:mb-4 lg:mb-0" />

            {renderPage()}
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Referral);
};

AppReferral.getLayout = function (page) {
    return <AppLayout title="Referrals">{page}</AppLayout>;
};

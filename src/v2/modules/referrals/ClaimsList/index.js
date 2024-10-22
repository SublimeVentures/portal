import { getTenantConfig } from "@/lib/tenantHelper";
import ClaimItem from "@/v2/components/App/Referrals/ClaimItem";
import ClaimDetailsSidebar from "@/v2/components/App/Referrals/ClaimDetailsSidebar";

const { NAME } = getTenantConfig().seo;

export const ClaimsList = ({
    claims,
    claimModalProps,
    setIsOpenClaimModal,
    setModalData,
    payoutProps
}) => {
    if (!claims) return;
    const consolidatedClaims = claims.reduce((acc, claim) => {
        if (!acc[claim.offer.id]) {
            acc[claim.offer.id] = {
                offer: claim.offer,
                claims: [],
            };
        }
        acc[claim.offer.id].claims.push(claim);
        return acc;
    }, {});

    return Object.values(consolidatedClaims).map((el) => {
        return (
            <ClaimItem
                modal={
                    <ClaimDetailsSidebar
                        claimModalProps={claimModalProps}
                        payoutProps={payoutProps}
                        setIsChildModalOpen={setIsOpenClaimModal}
                    />
                }
                item={el}
                key={el.offer.id}
                passData={setModalData}
            />
        );
    });
};

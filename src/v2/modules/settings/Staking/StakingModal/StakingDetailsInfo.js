import DefinitionItem from "@/v2/components/Definition/DefinitionItem";

export default function StakingDetailsInfo({ session, isStake = true }) {
    const remainingToNextTier = session.tier.nextTierUnlock;
    const remainingToPrevTier = session.tier.prevTierUnlock;

    return (
        <dl className="mb-12 definition-grid definition-section">
            <DefinitionItem term="NFT ID">{session.accountId}</DefinitionItem>
            <DefinitionItem term="Current NFT Tier">{session.tier.name}</DefinitionItem>
            <DefinitionItem term="Tokens Staked">{session.stakeSize}</DefinitionItem>
            {isStake && (
                <DefinitionItem term="Next Tier">
                    {remainingToNextTier === 0 ? (
                        <>You reached max tier level</>
                    ) : (
                        <>
                            Stake <span className="font-bold text-green-500">{remainingToNextTier}</span> more BASED to
                            upgrade your tier.
                        </>
                    )}
                </DefinitionItem>
            )}
            {!isStake && (
                <DefinitionItem term="Previous Tier">
                    {remainingToPrevTier === 0 ? (
                        <>You are on the first tier.</>
                    ) : (
                        <>
                            Unstake <span className="font-bold text-green-500">{remainingToPrevTier}</span> more BASED
                            to downgrade your tier.
                        </>
                    )}
                </DefinitionItem>
            )}
        </dl>
    );
}

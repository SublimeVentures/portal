import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import { cn } from "@/lib/cn";

export default function StakingDetails({ session, staking }) {
    const { allocationBonus, staked, unstake, stakeReq, nextDate, nextDateH } = staking;

    return (
        <>
            <dl className="definition-section my-0 grid grid-cols-2 gap-4">
                <DefinitionItem term="Allocation base">{session.multi * 100}%</DefinitionItem>
                <DefinitionItem term="Allocation bonus">
                    <span className={cn(allocationBonus > 0 ? "text-success-500" : "text-foreground")}>
                        ${allocationBonus}
                    </span>
                </DefinitionItem>
                <DefinitionItem term="Allocation max">${session.stakeSize}</DefinitionItem>
                <DefinitionItem term="Staked">
                    <span className={cn(staked > 0 ? "text-success-500" : "text-error-500")}>
                        {staked ? session.stakeSize || stakeReq : session.stakeReq}
                    </span>
                </DefinitionItem>
                {staked ? (
                    <DefinitionItem term={`Next ${unstake ? "re" : "un"}stake`}>
                        {nextDate > 3 ? `${nextDate} days` : `${nextDateH} hour${nextDateH > 1 ? "s" : ""}`}
                    </DefinitionItem>
                ) : null}
            </dl>
        </>
    );
}

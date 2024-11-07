import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import { cn } from "@/lib/cn";

export default function StakingDetails({ session, staking }) {
    const { allocationBonus = 0, staked, unstake, stakeReq, nextDate, nextDateH } = staking;

    return (
        <div className="p-4">
            <dl className="2xl:py-3 2xl:px-8 2xl:bg-white/[.03] w-full grid grid-cols-2 gap-4 rounded">
                <DefinitionItem term="Allocation base">{session.multi * 100}%</DefinitionItem>

                {/* Only for citcap */}
                {/* <DefinitionItem term="Allocation bonus">
                    <span className={cn(allocationBonus > 0 ? "text-success-500" : "text-white")}>
                        ${allocationBonus}
                    </span>
                </DefinitionItem> */}
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

                <DefinitionItem term="Staking type (?)">Reverse staking</DefinitionItem>

                {/* Single sided / Double sided  */}
                <DefinitionItem term="Staking type 2 (?)">Single sided</DefinitionItem>
            </dl>
        </div>
    );
}

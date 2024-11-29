import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import { cn } from "@/lib/cn";

export default function StakingDetails({ staking }) {
    const { isStaked, isDoubleSided, unstake, stakeSize, nextDate, nextDateH } = staking;

    return (
        <div className="p-4">
            <dl className="2xl:py-3 2xl:px-8 2xl:bg-white/[.03] w-full grid grid-cols-2 gap-4 rounded">
                <DefinitionItem term="Staked">
                    <span className={cn(isStaked ? "text-success-500" : "text-error-500")}>{stakeSize}</span>
                </DefinitionItem>
                {isStaked ? (
                    <DefinitionItem term={`Next ${unstake ? "re" : "un"}stake`}>
                        {nextDate > 3 ? `${nextDate} days` : `${nextDateH} hour${nextDateH > 1 ? "s" : ""}`}
                    </DefinitionItem>
                ) : null}
                <DefinitionItem term="Liquidity pool">{isDoubleSided ? "Double sided" : "Single sided"}</DefinitionItem>
            </dl>
        </div>
    );
}

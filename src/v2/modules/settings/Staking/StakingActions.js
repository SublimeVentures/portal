import Link from "next/link";

import StakingModal from "./StakingModal";
import UnstakingModal from "./UnstakingModal";
import { Button } from "@/v2/components/ui/button";

export default function StakeActions({ session, staking }) {
    const { staked, unstake } = staking;

    return (
        <div className="flex flex-col gap-2 md:flex-row">
            {!staked && <StakingModal session={session} staking={staking} />}
            {unstake && <UnstakingModal staking={staking} />}

            <Button asChild variant="gradient" aria-label="Buy tokens">
                <Link href="/" target="_blank" rel="noopener noreferrer">
                    Buy tokens
                </Link>
            </Button>
        </div>
    );
}

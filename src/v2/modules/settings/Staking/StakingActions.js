import Link from "next/link";
import { Button } from "@/v2/components/ui/button";

export default function StakeActions({ staked, unstake }) {
    return (
        <div className="flex flex-col gap-2 md:flex-row">
            {!staked && (
                <Button variant="outline" aria-label="Stake">
                    Stake
                </Button>
            )}
            {unstake && (
                <Button variant="outline" aria-label="Unstake">
                    Unstake
                </Button>
            )}
            <Button asChild variant="gradient" aria-label="Buy tokens">
                <Link href="/" target="_blank" rel="noopener noreferrer">
                    Buy tokens
                </Link>
            </Button>
        </div>
    );
};

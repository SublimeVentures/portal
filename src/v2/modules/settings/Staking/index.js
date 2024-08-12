import useStakingSettings from "./useStakingSettings";
import StakingDetails from "./StakingDetails";
import StakingActions from "./StakingActions";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { Card, CardTitle } from "@/v2/components/ui/card";
import { Badge } from "@/v2/components/ui/badge";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";

export default function Staking({ session }) {
    const { currencyStaking, activeCurrencyStaking, account } = useEnvironmentContext();
    const stakingEnabled = currencyStaking?.length > 0 && session.stakingEnabled;
    // const stakingCurrency = activeCurrencyStaking?.name ? activeCurrencyStaking : currencyStaking[0];

    const { staked, unstake, ...rest } = useStakingSettings({ session, account });
    const isNew = true;
    const isElite = session.isElite;

    return (
        <Card variant="none" className="py-6 px-12 h-full flex flex-col w-full bg-settings-gradient md:flex-row">
            <div className="h-full flex flex-col gap-8 w-full md:flex-row md:h-max">
                <div className="hidden h-[200px] w-[200px] shrink-0 bg-blue-500 rounded md:block" />

                <div className="flex flex-col justify-center w-full gap-4">
                    <div className="flex items-center gap-4 md:hidden">
                        <CardTitle className="text-base font-normal md:text-lg md:font-medium text-foreground leading-10">
                            Staking
                        </CardTitle>
                        {isNew ? <Badge variant="warning">New</Badge> : null}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-[87px] w-[87px] shrink-0 bg-blue-500 rounded md:hidden" />

                        <div>
                            <div className="hidden items-center gap-4 md:flex">
                                <CardTitle className="my-1 text-2xl font-medium text-foreground">Staking</CardTitle>
                                {isNew ? <Badge variant="warning">New</Badge> : null}
                            </div>

                            <div className="flex flex-col gap-4 md:flex-row">
                                <dl className="flex gap-2">
                                    <DefinitionItem className="font-bold" term="Citizen ID:">
                                        <span className="font-light">#{session.tokenId}</span>
                                    </DefinitionItem>
                                </dl>
                                <dl className="flex gap-2">
                                    <DefinitionItem className="font-bold" term="Season:">
                                        <span className="font-light">
                                            {isElite ? "Season 1 - Elite" : session.isS1 ? "Season 1" : "Season 2"}
                                        </span>
                                    </DefinitionItem>
                                </dl>
                            </div>
                        </div>
                        <div className="hidden ml-auto md:block">
                            {stakingEnabled && <StakingActions staked={staked} unstake={unstake} />}
                        </div>
                    </div>

                    {stakingEnabled ? (
                        <StakingDetails session={session} stakingDetails={{ staked, unstake, ...rest }} />
                    ) : (
                        <div className="mb-2 mt-4 py-4 px-8 flex flex-col gap-6 text-foreground font-medium bg-foreground/[.02] text-center rounded">
                            Staking available soon
                        </div>
                    )}

                    <div className=" md:hidden">
                        {stakingEnabled && <StakingActions staked={staked} unstake={unstake} />}
                    </div>
                </div>
            </div>
        </Card>
    );
}

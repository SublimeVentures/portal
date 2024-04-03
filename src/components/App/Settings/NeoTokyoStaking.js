import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AiOutlineInfoCircle as IconInfo } from "react-icons/ai";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { ExternalLinks } from "@/routes";
import { IconButton } from "@/components/Button/IconButton";
import { timeUntilNextUnstakeWindow } from "@/components/App/Settings/helper";
import { updateStaking } from "@/fetchers/settings.fetcher";
import InlineCopyButton from "@/components/Button/InlineCopyButton";

const StakingModal = dynamic(() => import("@/components/App/Settings/StakingModal"), { ssr: true });
const UnStakingModal = dynamic(() => import("@/components/App/Settings/UnStakingModal"), { ssr: true });

export default function NeoTokyoStaking({ stakingProps }) {
    const { session, account, stakingCurrency } = stakingProps;
    const router = useRouter();

    const [staked, setStaked] = useState(false);
    const [stakeReq, setStakeReq] = useState(0);
    const [stakeDate, setStakeDate] = useState(0);
    const [stakingModal, setStakingModal] = useState(false);
    const [unstakingModal, setUnStakingModal] = useState(false);
    const isElite = session.isElite;

    const unstakeDate = session?.stakeDate ? session.stakeDate : stakeDate;
    const { unstake, nextDate, nextDateH } = timeUntilNextUnstakeWindow(unstakeDate, staked);

    const refreshSession = async (force) => {
        const result = await updateStaking(account.address);
        // if(!result?.ok) {
        //
        // } else {
        const updatedSession = result.data.updates;
        if (updatedSession.isStaked) setStaked(true);
        if (updatedSession.stakeSize) setStakeReq(updatedSession.stakeSize);
        if (updatedSession.stakeDate) setStakeDate(updatedSession.stakeDate);
        if (updatedSession.isStaked || force) {
            router.reload();
        }
        // }
    };

    const stakingModalProps = {
        stakeReq: session.stakeReq,
        stakeSize: session.stakeSize,
        isS1: session.isS1,
        stakingCurrency,
        refreshSession,
    };

    useEffect(() => {
        setStaked(session.isStaked);
    }, []);

    return (
        <div className={`relative offerWrap flex flex-1 max-w-[600px]`}>
            <div className={"bg-navy-accent p-5 font-accent flex flex-1 flex-col uppercase"}>
                <div className={"flex flex-row items-center pb-5 justify-between "}>
                    <div className={`text-app-error font-accent glowRed  font-light text-2xl flex glowNormal`}>
                        IDENTITY
                    </div>
                    <a href={ExternalLinks.STAKING} target={"_blank"}>
                        <IconButton zoom={1.1} size={"w-8"} icon={<IconInfo />} noBorder={true} />
                    </a>
                </div>
                <div className={"detailRow"}>
                    <p>CITIZEN</p>
                    <hr className={"spacer"} />
                    <p>#{session.tokenId}</p>
                </div>
                <div className="detailRow">
                    <p>ACCOUNT ID</p>
                    <hr className="spacer" />
                    <p className="flex gap-1 justify-end items-center">
                        <span>{session.accountId}</span>
                        <InlineCopyButton copiable={session.accountId} />
                    </p>
                </div>
                <div className={`detailRow  ${isElite ? "text-gold" : ""}`}>
                    <p>SEASON</p>
                    <hr className={"spacer"} />
                    <p>{isElite ? "Season 1 - Elite" : session.isS1 ? "Season 1" : "Season 2"}</p>
                </div>
                <div className={"detailRow"}>
                    <p>ALLOCATION BASE</p>
                    <hr className={"spacer"} />
                    <p>{session.multi * 100}%</p>
                </div>
                <div className={"detailRow"}>
                    <p>ALLOCATION BONUS</p>
                    <hr className={"spacer"} />
                    <p>${session.allocationBonus}</p>
                </div>
                <div className={`detailRow ${staked ? "text-app-success" : "text-app-error"}`}>
                    <p>Staked</p>
                    <hr className={"spacer"} />
                    {staked ? (
                        <p>({session.stakeSize ? session.stakeSize : stakeReq} BYTES) TRUE</p>
                    ) : (
                        <p>({session.stakeReq} BYTES) NO</p>
                    )}
                </div>
                {staked && (
                    <div className={"detailRow text-app-success"}>
                        <p>Next {unstake ? "re" : "un"}stake</p>
                        <hr className={"spacer"} />
                        <p>
                            in{" "}
                            {nextDate > 3 ? (
                                <>{nextDate} days</>
                            ) : (
                                <>
                                    {nextDateH} hour{nextDateH > 1 ? "s" : ""}
                                </>
                            )}
                        </p>
                    </div>
                )}

                <div className={" flex flex-1 justify-between mt-5"}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={"GET BYTES"}
                        handler={() => {
                            window.open(ExternalLinks.GETBYTES, "_blank");
                        }}
                    />

                    {!staked && (
                        <UniButton
                            type={ButtonTypes.BASE}
                            text={"Stake"}
                            state={"danger"}
                            handler={() => {
                                setStakingModal(true);
                            }}
                        />
                    )}
                    {unstake && (
                        <UniButton
                            type={ButtonTypes.BASE}
                            text={"Unstake"}
                            handler={() => {
                                setUnStakingModal(true);
                            }}
                        />
                    )}
                </div>
            </div>
            {!staked && (
                <StakingModal
                    stakingModalProps={stakingModalProps}
                    model={stakingModal}
                    setter={async () => {
                        setStakingModal(false);
                        await refreshSession();
                    }}
                />
            )}
            {unstake && (
                <UnStakingModal
                    stakingModalProps={stakingModalProps}
                    model={unstakingModal}
                    setter={async () => {
                        setUnStakingModal(false);
                        await refreshSession(true);
                    }}
                />
            )}
        </div>
    );
}

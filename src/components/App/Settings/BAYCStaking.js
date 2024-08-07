import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AiOutlineInfoCircle as IconInfo } from "react-icons/ai";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";
import { IconButton } from "@/components/Button/IconButton";
import { timeUntilNextUnstakeWindow } from "@/components/App/Settings/helper";
import { updateStaking } from "@/fetchers/settings.fetcher";
import InlineCopyButton from "@/components/Button/InlineCopyButton";
import { getTenantConfig } from "@/lib/tenantHelper";

const StakingModal = dynamic(() => import("@/components/App/Settings/StakingModal"), { ssr: true });
const UnStakingModal = dynamic(() => import("@/components/App/Settings/UnStakingModal"), { ssr: true });

const { staking, externalLinks } = getTenantConfig();

export default function BAYCStaking({ stakingProps }) {
    const { session, account, stakingCurrency, userWallets } = stakingProps;
    const router = useRouter();

    const [staked, setStaked] = useState(false);
    const [stakeReq, setStakeReq] = useState(0);
    const [stakeDate, setStakeDate] = useState(0);
    const [stakingModal, setStakingModal] = useState(false);
    const [unstakingModal, setUnStakingModal] = useState(false);
    const isElite = session.isElite;

    const stakeOnCurrentWallet = session.stakedOn === account.address;

    const unstakeDate = session?.stakeDate ? session.stakeDate : stakeDate;

    const unstakingData = useMemo(() => {
        return timeUntilNextUnstakeWindow(unstakeDate, staked);
    }, [staked, unstakeDate]);

    const refreshSession = async (force) => {
        const result = await updateStaking(account.address);
        // if (result?.ok) {
        const updatedSession = result.data.updates;
        if (updatedSession.isStaked) setStaked(true);
        if (updatedSession.stakeSize) setStakeReq(updatedSession.stakeSize);
        if (updatedSession.stakeDate) setStakeDate(updatedSession.stakeDate);
        // if (updatedSession.isStaked) {
        //     router.reload();
        // }
        // } else if (force) {
        router.reload();
        // }
    };

    const stakingModalProps = {
        stakeReq: session.stakeReq,
        stakeSize: session.stakeSize,
        stakeMulti: session.stakeMulti,
        isS1: session.isS1,
        isStaked: session.isStaked,
        stakingCurrency,
        userWallets,
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
                    <a href={externalLinks.STAKING} target={"_blank"} rel="noreferrer">
                        <IconButton zoom={1.1} size={"w-8"} icon={<IconInfo className="h-8 w-8" />} noBorder={true} />
                    </a>
                </div>
                <div className="detailRow">
                    <p>ACCOUNT ID</p>
                    <hr className="spacer" />
                    <p className="flex gap-1 justify-end items-center">
                        <span>{session.accountId}</span>
                        <InlineCopyButton copiable={session.accountId} />
                    </p>
                </div>
                <div className={"detailRow"}>
                    <p>{session.isS1 ? staking[0] : staking[1]} ID</p>
                    <hr className={"spacer"} />
                    <p>#{session.tokenId}</p>
                </div>
                <div className={`detailRow  ${isElite ? "text-gold" : ""}`}>
                    <p>SEASON</p>
                    <hr className={"spacer"} />
                    <p>{session.isS1 ? staking[0] : staking[1]}</p>
                </div>
                <div className={`detailRow ${staked ? "text-app-success" : "text-app-error"}`}>
                    <p>Staked</p>
                    <hr className={"spacer"} />
                    {staked ? (
                        <p>
                            ({session.stakeSize ? session.stakeSize : stakeReq} {stakingCurrency.symbol}) TRUE
                        </p>
                    ) : (
                        <p>
                            ({session.stakeReq ? `${session.stakeReq} ` : ""}
                            {stakingCurrency.symbol}) NO
                        </p>
                    )}
                </div>
                {Boolean(staked) && (
                    <div className={"detailRow text-app-success"}>
                        <p>Next {unstakingData.unstake ? "re" : "un"}stake</p>
                        <hr className={"spacer"} />
                        <p>
                            in{" "}
                            {unstakingData.nextDate > 3 ? (
                                <>{unstakingData.nextDate} days</>
                            ) : (
                                <>
                                    {unstakingData.nextDateH} hour{unstakingData.nextDateH > 1 ? "s" : ""}
                                </>
                            )}
                        </p>
                    </div>
                )}

                <div className={"flex flex-1 justify-between mt-5"}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        text={"GET APE"}
                        handler={() => {
                            window.open(externalLinks.GET_APE, "_blank");
                        }}
                    />

                    <UniButton
                        type={ButtonTypes.BASE}
                        text={"Stake"}
                        state={"danger"}
                        handler={() => {
                            setStakingModal(true);
                        }}
                    />
                    {unstakingData.unstake && (
                        <UniButton
                            type={ButtonTypes.BASE}
                            text={"Unstake"}
                            handler={() => {
                                setUnStakingModal(true);
                            }}
                            isDisabled={!stakeOnCurrentWallet}
                        />
                    )}
                </div>
            </div>
            <StakingModal
                stakingModalProps={stakingModalProps}
                model={stakingModal}
                onSuccessClose={async () => {
                    setStakingModal(false);
                    await refreshSession();
                }}
                onClose={() => {
                    setStakingModal(false);
                }}
            />
            {unstakingData.unstake && (
                <UnStakingModal
                    stakingModalProps={stakingModalProps}
                    model={unstakingModal}
                    onSuccessClose={async () => {
                        setUnStakingModal(false);
                        await refreshSession(true);
                    }}
                    onClose={() => {
                        setUnStakingModal(false);
                    }}
                />
            )}
        </div>
    );
}

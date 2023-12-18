import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {ExternalLinks} from "@/routes";
import {useState, useEffect} from "react";
import IconInfo from "@/assets/svg/Info.svg";
import {IconButton} from "@/components/Button/IconButton";
import {useRouter} from 'next/router';

import dynamic from "next/dynamic";

import {updateSession_CitCapStaking} from "@/fetchers/auth.fetcher";
import {isBased} from "@/lib/utils";
import {BlockchainProvider} from "@/components/App/BlockchainSteps/BlockchainContext";

const CitCapStakingModal = dynamic(() => import('@/components/App/Settings/CitCapStakingModal'), {ssr: false})
const CitCapUnStakingModal = dynamic(() => import('@/components/App/Settings/CitCapUnStakingModal'), {ssr: false})


function timeUntilNextUnstakeWindow(stakedAt, staked) {
    if(!staked) return {
        unstake:false
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const SECONDS_IN_A_DAY = 24 * 60 * 60;
    const SECONDS_IN_A_HOUR = 1 * 60 * 60;
    const PERIOD_LENGTH = 90 * SECONDS_IN_A_DAY; // 90 days in seconds
    const UNSTAKING_WINDOW_LENGTH = 3 * SECONDS_IN_A_DAY; // 3 days in seconds


    let timeSinceStaked = currentTimestamp - stakedAt;
    let periodPosition = timeSinceStaked % PERIOD_LENGTH;

    console.log("periodPosition",periodPosition)
    if (periodPosition >= (PERIOD_LENGTH - UNSTAKING_WINDOW_LENGTH)) {
        let timeUntilNextRestake = (PERIOD_LENGTH - periodPosition) / SECONDS_IN_A_DAY;
        let timeUntilNextRestakeHours = (PERIOD_LENGTH - periodPosition) / SECONDS_IN_A_HOUR;
        return {
            unstake: true,
            nextDate: timeUntilNextRestake.toFixed(0),
            nextDateH: timeUntilNextRestakeHours.toFixed(0)
        }
    } else {
        let timeUntilUnstakeWindow = (PERIOD_LENGTH - UNSTAKING_WINDOW_LENGTH - periodPosition) / SECONDS_IN_A_DAY;
        let timeUntilUnstakeWindowHours = (PERIOD_LENGTH - UNSTAKING_WINDOW_LENGTH - periodPosition) / SECONDS_IN_A_HOUR;
        return {
            unstake: false,
            nextDate: timeUntilUnstakeWindow.toFixed(0),
            nextDateH: timeUntilUnstakeWindowHours.toFixed(0)
        }

    }
}

export default function CitCapAccount({account}) {
    const router = useRouter();

    const [staked, setStaked] = useState(false);
    const [stakeReq, setStakeReq] = useState(0);
    const [stakeDate, setStakeDate] = useState(0);
    const [stakingModal, setStakingModal] = useState(false);
    const [unstakingModal, setUnStakingModal] = useState(false);
    const isElite = account.isElite

    const unstakeDate = account?.stakeDate ? account.stakeDate : stakeDate
    const {unstake, nextDate, nextDateH} = timeUntilNextUnstakeWindow(unstakeDate, staked)


    const refreshSession = async (force) => {
        const {updatedSession} = await updateSession_CitCapStaking()
        if (!updatedSession) return
        if (updatedSession.isStaked) setStaked(true)
        if (updatedSession.stakeSize) setStakeReq(updatedSession.stakeSize)
        if (updatedSession.stakeDate) setStakeDate(updatedSession.stakeDate)
        if (updatedSession.isStaked || force) {
            router.reload();
        }
    }
    const stakingModalProps = {
        account: account,
        isS1: account.isS1,
        refreshSession
    }

    useEffect(() => {
        setStaked(account.isStaked)
    }, [])

    return (
        <div className={`relative offerWrap flex flex-1 max-w-[600px]`}>
            <div className={"bg-navy-accent p-5 font-accent flex flex-1 flex-col uppercase"}>
                <div className={"flex flex-row items-center pb-5 justify-between "}>
                    <div
                        className={`text-app-error font-accent glowRed  font-light text-2xl flex glowNormal`}>IDENTITY
                    </div>
                    <a href={ExternalLinks.STAKING} target={"_blank"}><IconButton zoom={1.1} size={'w-8'}
                                                                                  icon={<IconInfo/>}
                                                                                  noBorder={!isBased}/></a>

                </div>
                <div className={"detailRow"}><p>WALLET</p>
                    <hr className={"spacer"}/>
                    <p>{`${account.address.slice(0, 3)}...${account.address.slice(account.address.length - 3, account.address.length)}`}</p>
                </div>
                <div className={"detailRow"}><p>CITIZEN</p>
                    <hr className={"spacer"}/>
                    <p>#{account.id}</p></div>
                <div className={`detailRow  ${isElite ? "text-gold" : ""}`}><p>SEASON</p>
                    <hr className={"spacer"}/>
                    <p>{isElite ? "Season 1 - Elite" : (account.isS1 ? "Season 1" : "Season 2")}</p></div>
                <div className={"detailRow"}><p>ALLOCATION BASE</p>
                    <hr className={"spacer"}/>
                    <p>{account.multi * 100}%</p></div>
                <div className={"detailRow"}><p>ALLOCATION BONUS</p>
                    <hr className={"spacer"}/>
                    <p>${account.allocationBonus}</p></div>

                <div className={`detailRow ${staked ? "text-app-success" : "text-app-error"}`}>
                    <p>Staked</p>
                    <hr className={"spacer"}/>
                    {staked ? <p>({account.stakeSize ? account.stakeSize : stakeReq} BYTES) TRUE</p> :
                        <p>({account.stakeReq} BYTES) NO</p>}
                </div>
                {staked && <div className={"detailRow text-app-success"}><p>Next {unstake ? "re" : "un"}stake</p>
                    <hr className={"spacer"}/>
                    <p>in {nextDate > 3 ? <>{nextDate} days</> : <>{nextDateH} hour{nextDateH > 1 ? "s" : ""}</>} </p>
                </div>}

                {(!staked || unstake) && <div className={" flex flex-1 justify-between mt-5"}>
                    <UniButton type={ButtonTypes.BASE} text={'GET BYTES'}
                               handler={() => {
                                   window.open(ExternalLinks.GETBYTES, '_blank');
                               }}/>
                    <UniButton type={ButtonTypes.BASE} text={unstake ? "Unstake" : 'Stake'}
                               state={unstake ? "" : "danger"}
                               handler={() => {
                                   if (unstake) {
                                       setUnStakingModal(true)
                                   } else {
                                       setStakingModal(true)
                                   }
                               }}/>
                </div>
                }
            </div>
            <BlockchainProvider>
                <CitCapStakingModal stakingModalProps={stakingModalProps} model={stakingModal} setter={async () => {
                    setStakingModal(false)
                    await refreshSession()
                }}/>
            </BlockchainProvider>
            {unstake &&
                <CitCapUnStakingModal stakingModalProps={stakingModalProps} model={unstakingModal} setter={async () => {
                    setUnStakingModal(false)
                    await refreshSession(true)
                }}/>}

        </div>
    )
}

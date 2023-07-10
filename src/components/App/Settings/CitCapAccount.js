import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {ExternalLinks} from "@/routes";
import {useState, useEffect} from "react";
import IconInfo from "@/assets/svg/Info.svg";
import {IconButton} from "@/components/Button/IconButton";
import {is3VC} from "@/lib/seoConfig";
import dynamic from "next/dynamic";

import {updateSession_CitCapStaking} from "@/fetchers/auth.fetcher";
const CitCapStakingModal = dynamic(() => import('@/components/App/Settings/CitCapStakingModal'), {ssr: false})


function timeUntilNextUnstakeWindow(stakedAt) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const SECONDS_IN_A_DAY = 24 * 60 * 60;
    const PERIOD_LENGTH = 90 * SECONDS_IN_A_DAY; // 90 days in seconds
    const UNSTAKING_WINDOW_LENGTH = 3 * SECONDS_IN_A_DAY; // 3 days in seconds


    let timeSinceStaked = currentTimestamp - stakedAt;
    let periodPosition = timeSinceStaked % PERIOD_LENGTH;

    if (periodPosition >= (PERIOD_LENGTH - UNSTAKING_WINDOW_LENGTH)) {
        let timeUntilNextRestake = (PERIOD_LENGTH - periodPosition) / SECONDS_IN_A_DAY;
        return {unstake:true, nextDate: timeUntilNextRestake}
    } else {
        let timeUntilUnstakeWindow = (PERIOD_LENGTH - UNSTAKING_WINDOW_LENGTH - periodPosition) / SECONDS_IN_A_DAY;
        return {unstake:false, nextDate: timeUntilUnstakeWindow.toFixed(0)}

    }
}

export default function CitCapAccount({account}) {
    const [staked, setStaked] = useState(false);
    const [stakeReq, setStakeReq] = useState(0);
    const [stakeDate, setStakeDate] = useState(0);
    const [stakingModal, setStakingModal] = useState(false);
    const isTranscended = account.transcendence

    const unstakeDate = account?.stakeDate ? account.stakeDate : stakeDate
    const {unstake, nextDate} = timeUntilNextUnstakeWindow(unstakeDate)
    const refreshSession = async () => {
        const {updatedSession} = await updateSession_CitCapStaking()
        if(updatedSession.isStaked) setStaked(true)
        if(updatedSession.stakeSize) setStakeReq(updatedSession.stakeSize)
        if(updatedSession.stakeDate) setStakeDate(updatedSession.stakeDate)
    }

    const stakingModalProps = {
        stakeReq: account.stakeReq,
        account: account.address,
        refreshSession
    }

    useEffect(() => {
        setStaked(account.isStaked)
    }, [])

    return (
        <div className={`relative offerWrap flex flex-1 max-w-[600px]`}>
            <div className={"bg-navy-accent p-5 font-accent flex flex-1 flex-col uppercase"}>
                <div className={"flex flex-row items-center pb-5 justify-between "}>
                    <div className={`text-app-error font-accent glowRed  font-light text-2xl flex glowNormal`}>IDENTITY</div>
                    <a href={ExternalLinks.DISCORD_CITCAP} target={"_blank"}><IconButton zoom={1.1} size={'w-8'} icon={<IconInfo />} noBorder={!is3VC} /></a>

                </div>
                <div className={"detailRow"}><p>Address</p><hr className={"spacer"}/><p>{`${account.address.slice(0,3)}...${account.address.slice(account.address.length-3,account.address.length)}`}</p></div>
                <div className={"detailRow"}><p>ID</p><hr className={"spacer"}/><p>{account.id}</p></div>
                <div className={"detailRow"}><p>Multiplier</p><hr className={"spacer"}/><p>{account.multi}</p></div>
                    <div className={`detailRow ${isTranscended ? "text-gold" :"text-app-error"}`}>
                        <p>Transcended</p>
                        <hr className={"spacer"}/>
                        <p>{isTranscended ? "YES" :"NO"}</p>
                    </div>

                <div className={`detailRow ${staked ? "text-app-success" :"text-app-error"}`}>
                    <p>Staked</p>
                    <hr className={"spacer"}/>
                    {staked ? <p>({account.stakeSize ? account.stakeSize : stakeReq} BYTES) TRUE</p> : <p>({account.stakeReq} BYTES) NO</p>}
                </div>
                {staked && <div className={"detailRow text-app-success"}><p>Next restake</p><hr className={"spacer"}/>
                     <p>in {nextDate} days</p>
                </div>}

                {!staked || unstake && <div className={" flex flex-1 justify-between mt-5"}>
                    <UniButton type={ButtonTypes.BASE} text={'GET BYTES'}
                               handler={()=> {window.open(ExternalLinks.VAULT, '_blank');}}/>
                    <UniButton type={ButtonTypes.BASE} text={unstake ? "Unstake" : 'Stake'} state={unstake ? "": "danger"}
                               handler={()=> {setStakingModal(true)}}/>
                </div> }
            </div>
            <CitCapStakingModal stakingModalProps={stakingModalProps} model={stakingModal} setter={() => {setStakingModal(false)}}/>

        </div>
    )
}

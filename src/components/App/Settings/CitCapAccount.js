import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {ExternalLinks} from "@/routes";
import {useState, useEffect} from "react";
import IconInfo from "@/assets/svg/Info.svg";
import {IconButton} from "@/components/Button/IconButton";
import {is3VC} from "@/lib/seoConfig";
import dynamic from "next/dynamic";

// import {updateSession_CitCapStaking} from "@/fetchers/auth.fetcher";
const CitCapStakingModal = dynamic(() => import('@/components/App/Settings/CitCapStakingModal'), {ssr: false})

export default function CitCapAccount({account}) {
    const [staked, setStaked] = useState(false);
    const [stakingModal, setStakingModal] = useState(false);
    const isTranscended = account.transcendence
    //
    // const refreshSession = async () => {
    //     await updateSession_CitCapStaking()
    // }

    const stakingModalProps = {
        stakeReq: account.stakeReq,
        account: account.address,
        refreshSession
    }

    useEffect(() => {
        setStaked(account.isStaked)
    }, [])

    console.log("account",account)
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
                    {staked ? <p>({account.stakeSize} BYTES) TRUE</p> : <p>({account.stakeReq} BYTES) NO</p>}
                </div>
                {staked && <div className={"detailRow text-app-success"}><p>Next restake</p><hr className={"spacer"}/><p>27.02.2023</p></div>}

                {!staked && <div className={" flex flex-1 justify-between mt-5"}>
                    <UniButton type={ButtonTypes.BASE} text={'GET BYTES'}
                               handler={()=> {window.open(ExternalLinks.VAULT, '_blank');}}/>
                    <UniButton type={ButtonTypes.BASE} text={'Stake'} state={"danger"}
                               handler={()=> {setStakingModal(true)}}/>
                </div> }

            </div>
            <CitCapStakingModal stakingModalProps={stakingModalProps} model={stakingModal} setter={() => {setStakingModal(false)}}/>

        </div>
    )
}

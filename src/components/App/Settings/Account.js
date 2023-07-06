import {is3VC} from "@/lib/seoConfig";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {ExternalLinks} from "@/routes";
import {useState} from "react";

export default function Account({account}) {
    const [staked, setStaked] = useState(false);

    return (
        <div className={`${is3VC ? "rounded-xl" : ""} relative offerWrap flex flex-1 max-w-[600px]`}>
            <div className={"bg-navy-accent p-5 font-accent flex flex-1 flex-col"}>
                <div className={`${is3VC ? " font-medium text-[1.7rem]" : "text-app-error font-accent glowRed uppercase font-light text-2xl"} flex glowNormal pb-5`}>IDENTITY</div>
                <div className={"detailRow"}><p>Address</p><hr className={"spacer"}/><p>{`${account.address.slice(0,3)}...${account.address.slice(account.address.length-3,account.address.length)}`}</p></div>
                <div className={"detailRow"}><p>ID</p><hr className={"spacer"}/><p>{account.id}</p></div>
                <div className={"detailRow"}><p>Multiplier</p><hr className={"spacer"}/><p>{account.multi}</p></div>
                <div className={"detailRow text-gold"}><p>Transcended</p><hr className={"spacer"}/><p>YES</p></div>
                <div className={`detailRow ${staked ? "text-app-success" :"text-app-error"}`}><p className={"uppercase"}>Staked</p><hr className={"spacer"}/>
                    {staked ? <p>(200 BYTES) TRUE</p> : <p>(200 BYTES) NO</p>}
                </div>
                {staked && <div className={"detailRow text-app-success"}><p className={"uppercase"}>Next restake</p><hr className={"spacer"}/><p>27.02.2023</p></div>}

                {!staked && <div className={" flex flex-1 justify-between mt-5"}>
                    <UniButton type={ButtonTypes.BASE} text={'GET BYTES'}
                               handler={()=> {window.open(ExternalLinks.VAULT, '_blank');}}/>
                    <UniButton type={ButtonTypes.BASE} text={'Stake'} state={"danger"}
                               handler={()=> {window.open(ExternalLinks.VAULT, '_blank');}}/>
                </div> }

            </div>

        </div>
    )
}

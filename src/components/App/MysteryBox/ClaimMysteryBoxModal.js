import Lottie from "lottie-react";
import lootboxLottie from "@/assets/lottie/lootbox.json";
import {useRef} from "react";
import {useEffect} from "react";
import TransparentModal from "@/components/Modal/TransparentModal";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import Linker from "@/components/link";
import {MYSTERY_TYPES} from "@/lib/premiumHelper";



export default function ClaimMysteryBoxModal({model, setter, claimData}) {
    if(!model) return;

    const lottieRef = useRef(null);

    useEffect(() => {
        if(model) {
            lottieRef.current.goToAndPlay(100)
        }
    }, [model]);

    const closeModal = () => {
        setter()
    }

    const rewardType = (type, item) => {
        switch(type){
            case MYSTERY_TYPES.NFT: {
                return <div>
                    To redeem your NFT, all you need to do is head over to <br/>our Discord and <Linker text={"create a ticket."}/><br/>
                    <span className={"text-app-error"}>Make sure to include your redeem code in the ticket message!</span><br/>
                    It's a one-time-use code to claim your shiny new NFT, so don't share it with anyone - you risk losing your prize. <br/>
                    <span className={"text-app-error"}>The redeem code won't appear again, save it before closing!</span>
                </div>
            }
            case MYSTERY_TYPES.Discount: {
                return <div>
                    To redeem your discount, all you need to do is head over to <br/>our Discord and <Linker text={"create a ticket."}/><br/>
                    <span className={"text-app-error"}>Make sure to include your redeem code in the ticket message!</span><br/>
                    It's a one-time-use code that ensures {item.discount}% discount on floor price of the {item.item}, so don't share it with anyone - you risk losing your prize. <br/>
                    <span className={"text-app-error"}>The redeem code won't appear again, save it before closing!</span>
                </div>
            }
            case MYSTERY_TYPES.Upgrade: {
                return <div>
                    The Upgrade was assigned to your vault.<br/>
                    Read more how it works <Linker text={"here."}/>
                </div>
            }
            case MYSTERY_TYPES.Allocation: {
                return <div>
                    The allocation was assigned to your vault.
                </div>
            }
        }
    }



    const content = () => {
        return (     <div className={"loot"}>
            <div className="website">
                <section className={`modal pt-10 ${model ? 'is-in' : ''}`}>
                    <div className="modal-content">
                        <div className={"lottie-container"}>
                            <Lottie animationData={lootboxLottie} renderer={"svg"} loop={false} autoplay={true} lottieRef={lottieRef}/>
                        </div>
                        <div className="rewards">
                            <div className="rewards-container">

                                <div className="card">
                                    <div className="card-content p-10 flex flex-col items-center">
                                        <div className={`spinningasset  ${claimData.type}`}>
                                            <div>
                                                <div></div>
                                                <i></i>
                                                <i></i>
                                                <i></i>
                                                <i></i>
                                                <i></i>
                                                <i></i>
                                                <i></i>
                                                <i></i>
                                                <i></i>
                                                <i></i>
                                                <i></i>
                                                <em></em>
                                                <em></em>
                                                <div></div>
                                            </div>
                                        </div>

                                        <div className="reward-text mt-10 flex flex-col">
                                            <div className={"text-xl text-app-success uppercase"}>{claimData.type}</div>
                                            <div>{claimData.name}</div>
                                            {claimData?.code && <div className={"text-app-success font-bold"}>REDEEM CODE: #{claimData.code}</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="reward-comments p-5">
                                <div className={`text-3xl font-accent tracking-widest font-md colorText pb-5`}>Congratulations</div>
                                <div className={"text-app-white text-sm"}>
                                    {rewardType(claimData.type, claimData)}
                                {/*    telated investment*/}
                                </div>
                                <div className="flex flex-1 absolute  bottom-10 justify-center mx-auto left-0 right-0">
                                    <UniButton type={ButtonTypes.BASE}
                                               text={`Close`}
                                               isWide={true}
                                               zoom={1.05}
                                               size={'text-sm sm'}
                                               handler={()=> { setter() }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="glow glow-1"></div>
                        <div className="glow glow-2"></div>
                    </div>
                </section>
            </div>

        </div>)
    }
    const title = () => {
        return <></>
    }

    return (<TransparentModal isOpen={model} closeModal={closeModal} title={title()} content={content()} persistent={true}/>)

}


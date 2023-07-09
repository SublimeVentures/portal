import LayoutApp from '@/components/Layout/LayoutApp';
import {verifyID} from "@/lib/authHelpers";
import routes, {ExternalLinks} from "@/routes";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import IconMysteryBox from "@/assets/svg/MysteryBox.svg";
import Linker from "@/components/link";
import {getCopy, is3VC} from "@/lib/seoConfig";
import {useEffect, useRef} from "react";
import VanillaTilt from "vanilla-tilt";
import {useState} from "react";
import Head from "next/head";


export default function AppLootbox({account}) {
    const [availableLoot, setAvailableLoot] = useState(0);

    const imageTilt = useRef(null);

    useEffect(() => {
        VanillaTilt.init(imageTilt.current, {scale: 1.1, speed: 1000, max: is3VC ? 5 : 0.2});
    }, []);

//     // loads the lottie animation
//
//     var anim1 = lottie.loadAnimation({
//         container: document.getElementById("anim1"),
//         renderer: "svg",
//         loop: false,
//         autoplay: true,
//         path: "https://assets5.lottiefiles.com/private_files/lf30_brfwfvq7.json"
//     });
//
// // first click: open modal
//
//     $(document).on("click", ".modal_open", function ($e) {
//         $(".modal").addClass("is-in");
//         anim1.goToAndPlay(100);
//     });
//
// // second click: close modal
//
//     $(document).on("click", "#claim-done", function ($e) {
//         $(".modal").removeClass("is-in");
//     });

    const title = `Lootbox - ${getCopy("NAME")}`
    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className={`flex flex-1 flex-col select-none justify-center items-center gap-y-5 mobile:gap-y-10 mobile:gap-10 loot ${is3VC ? "" : "font-accent"}`}>
                {availableLoot > 0 && <div className={`${is3VC ? " font-medium text-[1.7rem]" : "text-app-error font-accent glowRed uppercase font-light text-2xl absolute top-[100px] text-center collap:top-[100px]"} flex glowNormal pb-5`}>You have 1 unclaimed Lootbox!</div>}
                {!is3VC && <div className={`${is3VC ? " font-medium text-[1.7rem]" : "text-app-error font-accent glowRed uppercase font-light text-2xl absolute top-[100px] text-center collap:top-[100px]"} flex glowNormal pb-5`}>You have 1 unclaimed Lootbox!</div>}

                <div className={"mt-[150px] sm:mt-0"} ref={imageTilt}>
                    <IconMysteryBox className="w-[250px] sm:w-[450px] text-white"/>
                    {/*    <div class="website">*/}
                    {/*        <section class="website-content">*/}
                    {/*            <div class="card">*/}
                    {/*                <div class="card-content text-center">*/}
                    {/*                    <h3 class="m-t-0 m-b-2">*/}
                    {/*                        Prize unlocked*/}
                    {/*                    </h3>*/}
                    {/*                    <div class="glowingasset token is-sm">*/}
                    {/*                        <img*/}
                    {/*                            src="https://res.cloudinary.com/gloot/image/upload/v1632915687/Marketing/202109_gloot2/rewards.png"*/}
                    {/*                            width="240" height="auto" alt=""/>*/}
                    {/*                            <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>*/}
                    {/*                    </div>*/}
                    {/*                    <p class="m-t-0 m-b-2">*/}
                    {/*                        You have just won a prize. Claim it now!*/}
                    {/*                    </p>*/}
                    {/*                    <button className="button is-glowing w-full mt-4 modal_open">*/}
                    {/*                        <span>Claim prize</span>*/}
                    {/*                        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>*/}
                    {/*                    </button>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </section>*/}
                    {/*        <section class="modal">*/}
                    {/*            <div class="modal-content">*/}
                    {/*                <div class="lottie-container">*/}
                    {/*                    <div id="anim1" class="lottie-glow"></div>*/}
                    {/*                </div>*/}
                    {/*                <div class="rewards">*/}
                    {/*                    <div class="rewards-container">*/}
                    {/*                        <div class="card">*/}
                    {/*                            <div class="card-content p-0">*/}
                    {/*                                <div class="spinningasset coin">*/}
                    {/*                                    <div>*/}
                    {/*                                        <div></div>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <em></em>*/}
                    {/*                                        <em></em>*/}
                    {/*                                        <div></div>*/}
                    {/*                                    </div>*/}
                    {/*                                </div>*/}

                    {/*                                <div class="reward-text">*/}
                    {/*                                    24 G-LOOT<br/>COINS*/}
                    {/*                                </div>*/}
                    {/*                            </div>*/}
                    {/*                        </div>*/}

                    {/*                        <div class="card">*/}
                    {/*                            <div class="card-content p-0">*/}
                    {/*                                <div class="spinningasset token">*/}
                    {/*                                    <div>*/}
                    {/*                                        <div></div>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <i></i>*/}
                    {/*                                        <em></em>*/}
                    {/*                                        <em></em>*/}
                    {/*                                        <div></div>*/}
                    {/*                                    </div>*/}
                    {/*                                </div>*/}

                    {/*                                <div class="reward-text">*/}
                    {/*                                    1 WEEKLY<br/>BRAWL TOKENS*/}
                    {/*                                </div>*/}
                    {/*                            </div>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}

                    {/*                    <div class="reward-comments">*/}
                    {/*                        <h2>Congratulations</h2>*/}
                    {/*                        <p>*/}
                    {/*                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et ex sit amet*/}
                    {/*                            metus varius tempus. Duis sed velit lobortis, aliquam lectus eu, feugiat nibh.*/}
                    {/*                            Nulla facilisi.*/}
                    {/*                        </p>*/}
                    {/*                        <div class="flex-container is-col is-justify-center">*/}
                    {/*                            <button id="claim-done" className="button m-y-md">*/}
                    {/*                                <span>Claim prize</span>*/}
                    {/*                            </button>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*                <div class="glow glow-1"></div>*/}
                    {/*                <div class="glow glow-2"></div>*/}
                    {/*            </div>*/}
                    {/*        </section>*/}
                    {/*    </div>*/}
                </div>

                <div className={"flex gap-5 mt-10 sm:mt-0"}>
                    <UniButton type={ButtonTypes.BASE} text={'OPEN'} state={"success"} isDisabled={availableLoot === 0}
                               handler={()=> {window.open(ExternalLinks.VAULT, '_blank');}}/>
                    <UniButton type={ButtonTypes.BASE} text={'BUY'} isDisabled={true}
                               handler={()=> {window.open(ExternalLinks.VAULT, '_blank');}}/>
                </div>
                <div className={"absolute bottom-5"}><Linker url={is3VC ? ExternalLinks.LOOTBOX : ExternalLinks.LOOTBOX_CITCAP } text={"Learn more"}/></div>


            </div>

        </>


    )
}


export const getServerSideProps = async({res}) => {
    const account = await verifyID(res.req)

    if(account.exists){
        return {
            redirect: {
                permanent: true,
                destination: `/app/auth?callbackUrl=${routes.Lootbox}`
            }
        }
    }

    if(!account.auth){
        return {
            redirect: {
                permanent: true,
                destination: `/login?callbackUrl=${routes.Lootbox}`
            }
        }
    }

    return {
        props: {
            account: account.user
        }
    }
}

AppLootbox.getLayout = function (page) {
    return <LayoutApp>{page}</LayoutApp>;
};

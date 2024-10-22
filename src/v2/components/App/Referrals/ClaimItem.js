import VanillaTilt from "vanilla-tilt";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import PAGE from "@/routes";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

export default function ClaimItem({ item, passData, modal }) {
    const { cdn } = useEnvironmentContext();
    const tilt = useRef(null);

    const setPassData = (claim) => {
        return {
            ...claim
        };
    };

    useEffect(() => {
        VanillaTilt.init(tilt.current, {
            scale: 1,
            speed: 1000,
            max: 1,
        });
    }, []);

    return (
        <div className="flex bordered-box col-span-12 lg:col-span-6 3xl:col-span-4 bg-foreground/[0.03]">
            <div className="flex flex-1 sm:bordered-box-left lg:bordered-box xl:bordered-box-left relative  flex-col p-5">
                <h2 className="font-bold text-2xl flex items-center glowNormal">
                    <div className="flex flex-1 text-white">{item.offer.name}</div>
                </h2>

                <div className="flex items-center text-md py-2">
                    {item.claims.sort((a, b) => a.investmentStage - b.investmentStage).map((claim, index) => (
                        <div key={index} className="flex items-center justify-between w-full text-white/50 my-2">
                            <p>
                                {claim.investmentStage === 1
                                    ? 'Haircut'
                                    : `Carry (Vest # ${claim.investmentStage - 1})`}
                            </p>
                            {claim.isClaimed ? (
                                <div className="bordered-container text-sm text-black bg-app-accent px-3 py-1 rounded-xl select-none">
                                    {' '}
                                    {'CLAIMED'}{' '}
                                </div>
                            ) : (
                                <div 
                                    onClick={() => passData(setPassData(claim))}
                                >
                                    {modal}
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>

            <div
                className="bordered-box-right relative w-[150px] cursor-pointer flex hidden sm:flex lg:hidden xl:!flex"
                ref={tilt}
            >
                <Link href={`${PAGE.Opportunities}/${item.offer.slug}`}>
                    <Image
                        src={`${cdn}/research/${item.offer.slug}/logo.jpg`}
                        fill
                        className={`imageOfferList bg-cover bordered-box-right`}
                        alt={item.slug}
                        sizes="(max-width: 2000px) 200px"
                    />
                </Link>
            </div>
        </div>
    );
}
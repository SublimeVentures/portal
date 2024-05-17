import VanillaTilt from "vanilla-tilt";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import PAGE from "@/routes";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

export default function ClaimItem({ item, passData }) {
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
        <div className="bordered-box boxshadow vaultItem timeline flex col-span-12 lg:col-span-6 3xl:col-span-4">
            <div className="sm:bordered-box-left lg:bordered-box xl:bordered-box-left relative bg-navy-accent flex flex-1 flex-col p-5">
                <div className="font-bold text-2xl flex items-center glowNormal">
                    <div className="flex flex-1">{item.offer.name}</div>
                </div>

                <div className="card-content-description text-md py-2">
                    {item.claims.sort((a, b) => a.investmentStage - b.investmentStage).map((claim, index) => (
                        <div key={index} className="detailRow mb-4">
                            <p>
                                {claim.investmentStage === 1
                                    ? 'Haircut'
                                    : `Carry (Vest # ${claim.investmentStage - 1})`}
                            </p>
                            <hr className="spacer" />
                            {claim.isClaimed ? (
                                <div className="bordered-container text-sm text-black bg-app-accent px-3 py-1 rounded-xl select-none">
                                    {' '}
                                    {'CLAIMED'}{' '}
                                </div>
                            ) : (
                                <div 
                                    className="bordered-container text-sm text-black bg-app-success px-3 py-1 rounded-xl select-none cursor-pointer hover:bg-app-accent2"
                                    onClick={() => passData(setPassData(claim))}
                                >
                                    {' '}
                                    {'CLAIM'}{' '}
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>

            <div
                className="bordered-box-right relative w-[200px] cursor-pointer flex hidden sm:flex lg:hidden xl:!flex"
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

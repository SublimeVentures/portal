import Lottie from "lottie-react";
import { IoTimeOutline as IconClock } from "react-icons/io5";
import { BiMoneyWithdraw as IconMoney } from "react-icons/bi";
import Image from "next/image";
import lottieAvatar from "@/assets/lottie/avatar.json";
import FallbackImage from "@/components/App/Vault/FallbackImage";
import Stat from "@/components/Stat";
import IconStars from "@/assets/svg/Stars.svg";
import PremiumSummary from "@/components/App/Settings/PremiumSummary";
import { Skeleton } from "@/components/Skeleton";

const vaultSkeletonsNumber = 6;

const BaseVaultContainerLoader = (props) => {
    console.log(props);
    return (
        <>
            <div className="grid grid-cols-12  gap-y-5 mobile:gap-y-10 mobile:gap-10">
                <div className="col-span-12 flex custom:col-span-4">
                    <div className="flex flex-1 flex-col justify-center items-center">
                        <div className="relative px-10 sm:-ml-10 custom:ml-0">
                            <div
                                className="absolute avatarAnim"
                                style={{
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <Lottie
                                    animationData={lottieAvatar}
                                    loop={true}
                                    autoplay={true}
                                    style={{ width: "400px" }}
                                />
                            </div>
                            <div className={"max-w-[15rem] flex rounded-full shadow-lg"}>
                                <FallbackImage src={props.session?.img} alt="Profile" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-12 flex flex-col gap-10 custom:col-span-8 justify-center">
                    <div className={"w-full flex gap-5 flex-col md:flex-row "}>
                        <Stat
                            color="gold"
                            title="Projects Invested"
                            isLoading={true}
                            icon={<IconStars className="w-9 text-2xl" />}
                        />
                        <Stat
                            color="teal"
                            title="Nearest Unlock"
                            value="TBA"
                            icon={<IconClock className="w-7 text-2xl" />}
                        />
                        <Stat
                            color="blue"
                            title="Portfolio Size"
                            isLoading={true}
                            icon={<IconMoney className="w-7 text-2xl" />}
                        />
                    </div>
                    <PremiumSummary />
                </div>
            </div>
            <div className="grid grid-cols-12 gap-y-5 mobile:gap-y-10 mobile:gap-10">
                {new Array(vaultSkeletonsNumber).fill(null).map(() => (
                    <div className="bordered-box boxshadow vaultItem timeline flex col-span-12 lg:col-span-6 3xl:col-span-4">
                        <div className="sm:bordered-box-left lg:bordered-box xl:bordered-box-left relative bg-navy-accent flex flex-1 flex-col p-5">
                            <Skeleton className="h-4 w-[200px] skeleton glowNormal inline-block" />
                            <br />
                            <Skeleton className="h-2 w-[150px] skeleton glowNormal inline-block" />
                            <br />
                            <Skeleton className="h-3 fullWidth skeleton glowNormal inline-block" />
                            <br />
                            <Skeleton className="h-3 fullWidth skeleton glowNormal inline-block" />
                            <br />
                            <Skeleton className="h-3 fullWidth skeleton glowNormal inline-block" />
                        </div>
                        <div className="bordered-box-right relative w-[200px] cursor-pointer flex hidden sm:flex lg:hidden xl:!flex">
                            <Image
                                src={props.session?.img}
                                fill
                                className={`imageOfferList bg-cover bordered-box-right`}
                                alt=""
                                sizes="(max-width: 2000px) 200px"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default BaseVaultContainerLoader;

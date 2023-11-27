import Hero from "@/components/HomeCitCap/Hero";
import Highlights from "@/components/HomeCitCap/Highlights";
import About from "@/components/HomeCitCap/About";
import Callout from "@/components/HomeCitCap/Callout";
import Investors from "@/components/Home/Investors";
import Linker from "@/components/link";
import PAGE, {ExternalLinks} from "@/routes";
import {ButtonCitCapIconSize, CitCapButton} from "@/components/Button/CitCapButton";
import PlayIcon from "@/assets/svg/Play.svg";
import IconNT from "@/assets/svg/NT.svg";
import Link from "next/link";
import Input from "@/components/App/Input";
import {IconButton} from "@/components/Button/IconButton";
import IconMinus from "@/assets/svg/MinusZ.svg";
import IconPlus from "@/assets/svg/PlusZ.svg";
import {CITIZENS, isBased} from "@/lib/utils";
import {useEffect, useState} from "react";
import Dropdown from "@/components/App/Dropdown";
import {useQuery} from "@tanstack/react-query";
import {fetchNeoTokyoEnvs} from "@/fetchers/public.fecher";
import VanillaTilt from "vanilla-tilt";




export default function TokenomicsCitCap({}) {
    const [investmentAllocation, setInvestmentAllocation] = useState(0)
    const [bytesHeld, setBytesHeld] = useState(0)
    const [bytesStaked, setBytesStaked] = useState(0)
    const [citizenType, setCitizenType] = useState(CITIZENS.S1)

    const [rewardRate, setRewardRate] = useState(0)
    const [stakeLength, setStakeLength] = useState(0)
    const [alloTrait, setAlloTrait] = useState(0)

    const [rewardRateLabel, setRewardRateLabel] = useState([])
    const [stakeLengthLabel, setStakeLengthLabel] = useState([])
    const [alloTraitLabel, setAlloTraitLabel] = useState([])



    const [allocationBase, setAllocationBase] = useState(0)
    const [allocationBonus, setAllocationBonus] = useState(0)

    const { isLoading, data, isError, isSuccess } = useQuery({
            queryKey: ["publicInvestment"],
            queryFn: fetchNeoTokyoEnvs,
            cacheTime: 180 * 60 * 1000,
            staleTime: 90 * 60 * 1000,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        }
    );

    console.log("data0",data)


    const setAmountHandler = (amt) => {
        setInvestmentAllocation(amt)
        // if(amt) calcPrice(multiplier, amt)
    }

    const processEnvs = () => {
        const rewardRate = data[0]
        const alloTrait = data[1]
        const stakeLength = data[2]
        const rewardRate_dd = Object.keys(rewardRate).map(key => `${key} point${key>1 ? "s" : ""}`);
        const stakeLength_dd = Object.keys(stakeLength).map(key => `${key} days`);
        const alloTrait_dd = Object.keys(alloTrait).map(key => `${key}`);
        setRewardRateLabel(rewardRate_dd)
        setStakeLengthLabel(stakeLength_dd)
        setAlloTraitLabel(alloTrait_dd)
        console.log("stakeLength_dd",stakeLength_dd)
        console.log("alloTrait_dd",alloTrait_dd)
        console.log("rewardRate_dd",rewardRate_dd)

    }

    useEffect(() => {
        processEnvs()
    }, [isSuccess]);


    return (
        <div className={"flex flex-1 justify-between flex-wrap gap-10"}>
            <div className="flex flex-col p-10 sm:p-20 w-full  font-accent blurred glareBg bg-black">
                <div className="flex flex-col flex-1 ">
                    <div className={"pb-2"}>Use the calculator below to check your maximum allocation.</div>
                </div>
                <div className=" flex flex-1 flex-row">
                    <div className=" flex flex-1 flex-col">
                        <Dropdown options={rewardRateLabel} classes={'!text-inherit blended'} propSelected={setRewardRate} position={rewardRate}/>
                        <Dropdown options={rewardRateLabel} classes={'!text-inherit blended'} propSelected={setRewardRate} position={rewardRate}/>
                        <Dropdown options={rewardRateLabel} classes={'!text-inherit blended'} propSelected={setRewardRate} position={rewardRate}/>

                    </div>
                    <div className=" flex flex-1 flex-col">
                        <div className={'pt-10'}>
                            <Input type={'number'}
                                   placeholder={'BYTES staked in Neo Tokyo Bank'}
                                   initialValue={100}
                                   setStatus={()=>{}}
                                   setInput={setBytesStaked}
                                   input={bytesStaked}
                                   light={true}
                                   full={true}
                                   after={"BYTES"}
                            />
                        </div>
                        <div className={'pt-10'}>

                        <Input type={'number'}
                                   placeholder={'BYTES held on wallet'}
                               initialValue={200}
                                   setStatus={()=>{}}
                                   setInput={setBytesHeld}
                                   input={bytesHeld}
                                   light={true}
                                   full={true}
                                   after={"BYTES"}
                            />
                        </div>
                        <div className={'pt-10'}>

                        <Input type={'number'}
                                   placeholder={'Total Investment Allocation'}
                                   setStatus={()=>{}}
                                   setInput={setAmountHandler}
                                   input={investmentAllocation}
                                    initialValue={250000}
                                   light={true}
                                   full={true}
                                   after={"USD"}
                            />
                        </div>
                    </div>

                    {/*<div className={"py-10 flex flex-row justify-center items-center select-none"}>*/}
                    {/*    <IconButton zoom={1.1} size={''} noBorder={true} icon={<IconMinus className={"w-8"}/>} handler={() => setMultiplierHandler(false)}/>*/}
                    {/*    <div className={`px-6 font-bold tabular-nums transition-colors duration-300 text-2xl ${multiplier>1 ? ' text-app-success' : ' text-app-error'}`}>x<span className={"text-5xl"}>{multiplierParsed}</span></div>*/}
                    {/*    <IconButton zoom={1.1} size={''} noBorder={true} icon={<IconPlus className={"w-8"}/>} handler={() => setMultiplierHandler(true)}/>*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*    <Input type={'number'}*/}
                    {/*           placeholder={'Return'}*/}
                    {/*           input={price}*/}
                    {/*           light={true}*/}
                    {/*           setInput={() => {}}*/}
                    {/*           setStatus={() => {}}*/}
                    {/*           full={true}*/}
                    {/*           after={"USD"}*/}
                    {/*    />*/}
                    {/*</div>*/}


                    {/*<div className=" pt-10">Usual multiplier for seed investment is between 20-50x. <Linker url={ExternalLinks.INVESTMENT_RETURN}/></div>*/}
                </div>
                <div className={"flex flex-col gap-0 md:flex-row md:gap-10 justify-center mt-10"}>
                    <div>
                        <Link href={PAGE.Login} className={"flex min-w-[200px]"}>
                            <CitCapButton text={'LOGIN'}  isWhite={true} icon={<PlayIcon className={ButtonCitCapIconSize.hero}/>}/>
                        </Link>
                    </div>
                    <div className={""}>
                        <div className={""}><Linker url={ExternalLinks.GETBYTES} text={"Get BYTES"}/></div>
                        <div className={""}><Linker url={ExternalLinks.STAKE_NT} text={"Stake in Neo Tokyo Bank"}/></div>

                    </div>



                </div>
            </div>


        </div>

    )
}


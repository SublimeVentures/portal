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
import {CITIZENS} from "@/lib/utils";
import {useState} from "react";




export default function TokenomicsCitCap({}) {
    const [investmentAllocation, setInvestmentAllocation] = useState(250000)
    const [citizenType, setCitizenType] = useState(CITIZENS.S1)


    const [allocationBase, setAllocationBase] = useState(0)
    const [allocationBonus, setAllocationBonus] = useState(0)

    const setAmountHandler = (amt) => {
        setInvestmentAllocation(amt)
        // if(amt) calcPrice(multiplier, amt)
    }


    return (
        <div className={"flex flex-1 justify-between flex-wrap gap-10"}>
            <div className="flex flex-col p-10 sm:p-20 w-full sm:w-max font-accent blurred glareBg bg-black lg:flex-row ">
                <div className="flex flex-col flex-1 ">
                    <div className={"pb-2"}>Use the calculator below to check your maximum allocation.</div>
                </div>
                <div className=" flex flex-1 flex-col">
                    <div className={'pt-10'}>
                        <Input type={'number'}
                               placeholder={'Total Investment Allocation'}
                               min={1}
                               setStatus={()=>{}}
                               setInput={setAmountHandler}
                               input={investmentAllocation}
                               light={true}
                               full={true}
                               after={"USD"}
                        />
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
                <div className={"flex flex-col gap-0 md:flex-row md:gap-10 justify-center"}>
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


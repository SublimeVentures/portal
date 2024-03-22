import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Linker from "@/components/link";
import PAGE, { ExternalLinks } from "@/routes";
import { ButtonCitCapIconSize, CitCapButton } from "@/components/Button/CitCapButton";
import PlayIcon from "@/assets/svg/Play.svg";
import Input from "@/components/App/Input";
import { CITIZENS, CITIZENS_NAME } from "@/lib/utils";
import { fetchNeoTokyoEnvs } from "@/fetchers/public.fecher";
import Select from "@/components/App/Select";
import { MIN_DIVISIBLE } from "@/lib/investment";

export default function TokenomicsCitCap({}) {
    const [investmentAllocation, setInvestmentAllocation] = useState(0);
    const [bytesHeld, setBytesHeld] = useState(0);
    const [bytesStaked, setBytesStaked] = useState(0);

    const [citizenType, setCitizenType] = useState({});
    const [rewardRate, setRewardRate] = useState({});
    const [stakeLength, setStakeLength] = useState({});
    const [alloTrait, setAlloTrait] = useState({});

    const [rewardRateLabel, setRewardRateLabel] = useState([]);
    const [stakeLengthLabel, setStakeLengthLabel] = useState([]);
    const [alloTraitLabel, setAlloTraitLabel] = useState([]);
    const [citizenTypeLabel, setCitizenTypeLabel] = useState([]);

    const [allocationBase, setAllocationBase] = useState("");
    const [allocationBonus, setAllocationBonus] = useState("");
    const [allocationTotal, setAllocationTotal] = useState("");

    const { isLoading, data, isError, isSuccess } = useQuery({
        queryKey: ["ntTokenomics"],
        queryFn: fetchNeoTokyoEnvs,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const setAmountHandler = (amt) => {
        setInvestmentAllocation(amt);
        // if(amt) calcPrice(multiplier, amt)
    };

    const processEnvs = () => {
        if (data?.length > 0) {
            const rewardRate = data[0];
            const alloTrait = data[1];
            const stakeLength = data[2];
            const allocationBase = data[3];

            const rewardRate_final = Object.keys(rewardRate).map((key) => ({
                label: `${key} point${key > 1 ? "s" : ""}`,
                key: Number(rewardRate[key]),
                value: key,
            }));
            setRewardRateLabel(rewardRate_final);

            const alloTrait_final = Object.keys(alloTrait).map((key) => ({
                label: `${key}`,
                key: Number(alloTrait[key]),
                value: key,
            }));
            setAlloTraitLabel(alloTrait_final);

            const stakeLength_final = Object.keys(stakeLength).map((key) => ({
                label: `${key} days`,
                key: Number(stakeLength[key]),
                value: key,
            }));
            setStakeLengthLabel(stakeLength_final);

            const allocationBase_final = Object.keys(allocationBase).map((key) => ({
                label: `${CITIZENS_NAME[key]}`,
                key: allocationBase[key],
                value: CITIZENS[key],
            }));
            setCitizenTypeLabel(allocationBase_final);
        }
    };

    const recalculate = () => {
        // console.log("calc - citizen",citizenType)
        // console.log("calc - reward rate",rewardRate)
        // console.log("calc - allo trait",alloTrait)
        // console.log("calc - stake length",stakeLength)
        // console.log("calc - bytes Held",bytesHeld)
        // console.log("calc - bytes staked",bytesStaked)
        const allocationBase = Math.ceil((citizenType?.key * 10000 * investmentAllocation) / 10000);
        const nft = citizenType?.value > CITIZENS.S1 ? alloTrait?.key : rewardRate?.key;
        const allocationBonus =
            ((stakeLength?.key * Number(bytesStaked) + 200 + Number(bytesHeld) * 0.25) * (nft * 10)) / 10;
        // console.log("calc - BYTES STAKED", (stakeLength?.key * Number(bytesStaked)))
        setAllocationBase(Number(allocationBase).toLocaleString());
        setAllocationBonus(Number(allocationBonus).toLocaleString());
        const total = Math.floor((allocationBonus + allocationBase) / MIN_DIVISIBLE) * MIN_DIVISIBLE;
        setAllocationTotal(Number(total).toLocaleString());
        // console.log("============")
        // console.log("calc - allocationBase",allocationBase)
        // console.log("calc - allocationBonus",allocationBonus)
        // console.log("============")
        // console.log("============")
    };

    useEffect(() => {
        processEnvs();
    }, [isSuccess]);

    useEffect(() => {
        recalculate();
    }, [
        citizenType?.key,
        rewardRate?.key,
        stakeLength?.key,
        alloTrait?.key,
        bytesHeld,
        bytesStaked,
        investmentAllocation,
    ]);

    return (
        <div className={"flex flex-1 justify-between flex-wrap gap-10 max-w-[1000px]"}>
            <div className="flex flex-col p-10 sm:p-20 w-full  font-accent blurred glareBg bg-black">
                <div className="flex flex-col flex-1 ">
                    <div className={"pb-2"}>Use the calculator below to check your maximum allocation.</div>
                </div>
                <div className=" flex flex-1 flex-col gap-5 custom:flex-row">
                    <div className=" flex flex-1 flex-col mt-[1px]">
                        <div className={"pt-10"}>
                            <Select options={citizenTypeLabel} setter={setCitizenType} label={"Citizen"} />
                        </div>
                        {citizenType?.value < CITIZENS.S2 ? (
                            <div className={"pt-10"}>
                                <Select options={rewardRateLabel} setter={setRewardRate} label={"Reward rate"} />
                            </div>
                        ) : (
                            <div className={"pt-10"}>
                                <Select options={alloTraitLabel} setter={setAlloTrait} label={"Allocation trait"} />
                            </div>
                        )}
                        <div className={"pt-10"}>
                            <Select options={stakeLengthLabel} setter={setStakeLength} label={"Citizen stake period"} />
                        </div>
                    </div>
                    <div className=" flex flex-1 flex-col">
                        <div className={"pt-10"}>
                            <Input
                                type={"number"}
                                placeholder={"Staked in Bank of NT"}
                                initialValue={100}
                                setStatus={() => {}}
                                setInput={setBytesStaked}
                                input={bytesStaked}
                                light={true}
                                full={true}
                                after={"BYTES"}
                            />
                        </div>
                        <div className={"pt-10"}>
                            <Input
                                type={"number"}
                                placeholder={"In wallet"}
                                initialValue={200}
                                setStatus={() => {}}
                                setInput={setBytesHeld}
                                input={bytesHeld}
                                light={true}
                                full={true}
                                after={"BYTES"}
                            />
                        </div>
                        <div className={"pt-10"}>
                            <Input
                                type={"number"}
                                placeholder={"Total Offer Allocation"}
                                setStatus={() => {}}
                                setInput={setAmountHandler}
                                input={investmentAllocation}
                                initialValue={250000}
                                light={true}
                                full={true}
                                after={"USD"}
                            />
                        </div>
                    </div>
                </div>
                <div className={"mt-10 text-center text-xl"}>
                    <span className={""}>Maximum allocation </span>
                    <span className={"font-bold text-gold"}>${allocationTotal || 0}</span>
                </div>
                <div className={"flex flex-col gap-0 md:flex-row md:gap-10 justify-center mt-10"}>
                    <div className={"flex"}>
                        <Link href={PAGE.Login} className={"flex min-w-[200px] "}>
                            <CitCapButton
                                text={"LOGIN"}
                                isWhite={true}
                                icon={<PlayIcon className={ButtonCitCapIconSize.hero} />}
                            />
                        </Link>
                    </div>
                    <div className={""}>
                        <div className={""}>
                            <Linker url={ExternalLinks.GETBYTES} text={"Get BYTES"} />
                        </div>
                        <div className={""}>
                            <Linker url={ExternalLinks.STAKE_NT} text={"Stake in Bank of Neo Tokyo"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

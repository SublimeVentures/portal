import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Linker from "@/components/link";
import PAGE, { ExternalLinks } from "@/routes";
import { ButtonCitCapIconSize, CitCapButton } from "@/components/Button/CitCapButton";
import PlayIcon from "@/assets/svg/Play.svg";
import Input from "@/components/App/Input";
import { fetchCyberKongzEnvs } from "@/fetchers/public.fecher";

export default function TokenomicsCitCap({}) {
    const [bananaStaked, setBananaStaked] = useState(0);

    const [allocationTotal, setAllocationTotal] = useState("");

    const { isLoading, data, isError, isSuccess } = useQuery({
        queryKey: ["kongzTokenomics"],
        queryFn: fetchCyberKongzEnvs,
        cacheTime: 180 * 60 * 1000,
        staleTime: 90 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const minStake = isSuccess ? Number(data.find((el) => el.name === "stakeRequired").value) : 500;
    const divider = isSuccess ? Number(data.find((el) => el.name === "stakeMulti").value) : 500;

    const recalculate = () => {
        const allocation = divider * Math.ceil(bananaStaked / divider);
        setAllocationTotal(Number(allocation).toLocaleString());
    };

    useEffect(() => {
        recalculate();
    }, [bananaStaked, minStake, divider]);

    return (
        <div className={"flex flex-1 justify-between flex-wrap gap-10 max-w-[1000px]"}>
            <div className="flex flex-col p-10 sm:p-20 w-full  font-accent blurred glareBg bg-black">
                <div className="flex flex-col flex-1 ">
                    <div className={"pb-2 text-center"}>Use the calculator below to check your maximum allocation.</div>
                </div>
                <div className=" flex flex-1 flex-col gap-5 custom:flex-row">
                    <div className="flex flex-1 flex-col justify-center items-center">
                        <div className={"pt-[50px] max-w-[350px] "}>
                            <Input
                                type={"number"}
                                placeholder={"Staked in KongzCapital"}
                                initialValue={500}
                                setStatus={() => {}}
                                setInput={setBananaStaked}
                                input={bananaStaked}
                                min={minStake}
                                light={true}
                                full={true}
                                after={"BANANA"}
                                extraCurrency={"BANANA"}
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
                    <div className={"flex justify-center items-center"}>
                        <div className={""}>
                            <Linker url={ExternalLinks.GET_BANANA_ETH} text={"Get BANANA"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

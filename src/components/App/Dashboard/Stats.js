import RoundContainer from "@/components/App/RoundContainer";
import BitcoinIcon from "@/assets/svg/Bitcoin.svg";
import KeyIcon from "@/assets/svg/Key.svg";
import ChartIcon from "@/assets/svg/Chart.svg";

export default function Stats() {
    const projectInvestedWidget = () => {
        return (<>
            <div className="font-bold text-3xl">3</div>
            <div className="text-sm capitalize mt-2">Project invested</div>
        </>)
    }

    const stakeLeftWidget = () => {
        return (<>
            <div className="font-bold text-3xl">Q1 2024</div>
            <div className="text-sm capitalize mt-2">nearest unlock</div>
        </>)
    }

    const apyWidget = () => {
        return (<>
            <div className="font-bold text-3xl">TBD</div>
            <div className="text-sm capitalize mt-2">APY</div>
        </>)
    }


    return (
        <div className="flex grid grid-cols-12 mt-5 gap-y-10 mobile:gap-10 ">
            <div className="col-span-12 mt-5 flex sm:col-span-4 sm:mt-0">
                <RoundContainer isSuccess={true} icon={<BitcoinIcon className="w-14 -mt-2"/>}
                                content={projectInvestedWidget()} forcedClass={"min-h-[150px]"}/>
            </div>
            <div className="col-span-12 mt-5 flex sm:col-span-4 sm:mt-0">
                <RoundContainer isSuccess={false} icon={<KeyIcon className="w-10 -mt-2"/>}
                                content={stakeLeftWidget()} forcedClass={"min-h-[150px]"}/>
            </div>
            <div className="col-span-12 mt-5 flex sm:col-span-4 sm:mt-0">
                <RoundContainer isSuccess={false} icon={<ChartIcon className="w-10 -mt-2"/>}
                                content={apyWidget()} forcedClass={"min-h-[150px]"}/>

            </div>
        </div>

    )
}

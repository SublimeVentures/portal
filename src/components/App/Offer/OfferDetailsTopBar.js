import Image from "next/image";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import moment from "moment";
import {isBased} from "@/lib/utils";



export default function OfferDetailsTopBar({paramsBar}) {
    let {offer, phaseCurrent, phaseNext, refreshInvestmentPhase, phaseIsClosed} = paramsBar
    let {name, genre, slug, cdn} = offer

    return (
        <div className={"col-span-12 flex flex-col gap-10 md:flex-row"}>
            <div className={"flex flex-row gap-5 flex-1 items-center"}>
                <div className={"rounded-lg "}>
                    <Image src={`${cdn}/research/${slug}/icon.jpg`}  className={'p-1 rounded-full boxshadow'} alt={slug} width={100} height={100}/>
                </div>
                <div>
                    <div className="text-4xl font-bold flex flex-1 glow">{name}</div>
                    <div className={`text-xl flex flex-1 mt-1 ${isBased ? "text-outline" : "font-accent"}`}>#{genre}</div>
                </div>
            </div>

            {!phaseIsClosed && <div
                className={`flex flex-col gap-5 flex-wrap justify-center items-center custom:flex-row ${isBased ? "" : "font-accent"}`}>
                <div className={`text-lg custom:-mt-5 `}>
                    <span className={` uppercase font-[500] ${isBased ? "text-gold glow" : "text-app-error glowRed "}`}>{phaseCurrent.phaseName}</span> ends in
                </div>
                <div>
                    <FlipClockCountdown
                        className="flip-clock"
                        onComplete={() => refreshInvestmentPhase()}
                        to={moment.unix(phaseNext.startDate)}
                        labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
                    />
                </div>

            </div> }

        </div>

    )
}

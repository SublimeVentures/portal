import Image from "next/image";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import moment from "moment";


export default function OfferDetailsTopBar({paramsBar}) {
    let {offer, currentPhase, nextPhase, refreshInvestmentPhase} = paramsBar
    let {name, genre, slug, research} = offer


    return (
        <div className={"col-span-12 flex flex-col gap-10 sm:flex-row"}>
            <div className={"flex flex-row gap-5 flex-1 items-center"}>
                <div className={"rounded-lg "}>
                    <Image src={`${research}${slug}/logo.jpg`}  className={'p-1 rounded-full boxshadow'} alt={slug} width={100} height={100}/>
                </div>
                <div>
                    <div className="text-4xl font-bold flex flex-1 glow">{name}</div>
                    <div className="text-xl flex flex-1 mt-1 text-outline">#{genre}</div>
                </div>
            </div>

            <div
                className="flex flex-col gap-5 flex-wrap justify-center items-center xl:flex-row">
                <div className="text-lg xl:-mt-5">
                    <span className="text-gold glow uppercase font-[500]">{currentPhase.step}</span> ends in
                </div>
                <div>
                    <FlipClockCountdown
                        className="flip-clock"
                        onComplete={() => refreshInvestmentPhase()}
                        to={moment.unix(nextPhase.start)}
                        labels={['DAYS', 'HOURS', 'MINUTES', 'SECONDS']}
                    />
                </div>

            </div>

        </div>

    )
}

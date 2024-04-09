import Image from "next/image";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import moment from "moment";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";

export default function OfferDetailsTopBar({ paramsBar }) {
    const { cdn } = useEnvironmentContext();
    let { offer, phaseCurrent, phaseNext, refreshInvestmentPhase, phaseIsClosed } = paramsBar;
    let { name, genre, slug } = offer;

    console.log('test-0', phaseNext.startDate)
    console.log('test-00', phaseNext.startDate + 1)
    console.log('test-1', moment.unix(phaseNext.startDate + 1))
    console.log('test-2', moment.unix(phaseNext.startDate + 1).format('YYYY-MM-DD HH:mm:ss'))

    return (
        <div className={"col-span-12 flex flex-col gap-10 md:flex-row"}>
            <div className={"flex flex-row gap-5 flex-1 items-center"}>
                <div className={"rounded-lg "}>
                    <Image
                        src={`${cdn}/research/${slug}/icon.jpg`}
                        className={"p-1 rounded-full boxshadow"}
                        alt={slug}
                        width={100}
                        height={100}
                    />
                </div>
                <div>
                    <div className="text-4xl font-bold flex flex-1 glow select-none">{name}</div>
                    <div className="text-xl flex flex-1 mt-1 background-text-description">#{genre}</div>
                </div>
            </div>
            {!phaseIsClosed && (
                <div className="flex flex-col gap-5 flex-wrap justify-center items-center custom:flex-row background-text-description">
                    <div className="text-lg custom:-mt-5">
                        <span className="uppercase font-[500] background-text-dedicated glow-normal">
                            {phaseCurrent.phaseName}
                        </span>{" "}
                        ends in
                    </div>
                    <div>
                        <FlipClockCountdown
                            className="flip-clock"
                            onComplete={async () => {
                                refreshInvestmentPhase();
                            }}
                            to={`${moment.unix(phaseNext.startDate + 1).format('YYYY-MM-DD HH:mm:ss')}`}
                            labels={["DAYS", "HOURS", "MINUTES", "SECONDS"]}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

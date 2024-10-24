import Title from "./Title";
import Claim from "./Claim";
import PercentWrapper from "./PercentWrapper";
import { SheetBody, SheetClose } from "@/v2/components/ui/sheet";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import { formatCurrency, formatPercentage } from "@/v2/helpers/formatters";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";

export const getSymbol = (data) => {
    return data.currentPayout?.currencySymbol ?? (data?.isManaged ? "USD" : data.coin);
};

export default function Details({ data, onClick, items, openReassignModal }) {
    const symbol = getSymbol(data);
    const notifications = items?.pages?.flat() || [];
    const hasNotifications = notifications.length > 0;

    return (
        <>
            <SheetBody className="overflow-x-auto px-4 md:px-30 py-3 md:py-4 flex flex-col gap-3 md:gap-4">
                <div>
                    <Title>Status</Title>
                    <div className="definition-section my-0">
                        <dl className="definition-grid">
                            <DefinitionItem term="Progress">{formatPercentage(data.progress / 100)}</DefinitionItem>
                            <DefinitionItem term="Invested">{formatCurrency(data.invested)}</DefinitionItem>
                            <DefinitionItem term="Vested">{formatCurrency(data.vested, symbol)}</DefinitionItem>
                        </dl>
                        <SheetClose
                            onClick={openReassignModal}
                            className="box-border inline-flex items-center justify-center text-xs sm:text-sm sm:leading-6 text-white rounded transition-all whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none bg-transparent border border-white hover:bg-white/20 group-hover/button:bg-white/20 py-2 px-4 sm:px-8 mb-3.5 mt-auto w-full font-xs"
                        >
                            Reassign My Allocation
                        </SheetClose>
                    </div>
                </div>
                <div>
                    <Title>Performance</Title>
                    <div className="definition-section my-0">
                        <dl className="definition-grid">
                            {data.isManaged ? (
                                <>
                                    <DefinitionItem term="TGE Gain">
                                        <PercentWrapper value={data.tgeGain} />
                                    </DefinitionItem>
                                    <DefinitionItem term="Return">
                                        <PercentWrapper value={data.performance} />
                                    </DefinitionItem>
                                </>
                            ) : (
                                <DefinitionItem term="ATH">{formatCurrency(data.ath)}</DefinitionItem>
                            )}
                        </dl>
                    </div>
                </div>
                <div>
                    <Title>Dates</Title>
                    <div className="definition-section my-0">
                        <dl className="definition-grid">
                            <DefinitionItem term="Participated">{data.participatedDate}</DefinitionItem>
                            <DefinitionItem term="Next Unlock">{data.nextPayout?.unlockDate || "TBA"}</DefinitionItem>
                            <DefinitionItem term="Allocation Snapshot">
                                {data.nextPayout?.snapshotDate || "TBA"}
                            </DefinitionItem>
                            <DefinitionItem term="Claim Date">{data.nextPayout?.claimDate || "TBA"}</DefinitionItem>
                        </dl>
                    </div>
                </div>
                {hasNotifications && (
                    <div className="hidden md:block">
                        <Title>Timeline</Title>
                        {notifications.map((notification) => {
                            return (
                                <div onClick={onClick} key={notification.id} className="cursor-pointer">
                                    <TimelineItem item={notification} showTimeline={false} onClick={onClick} />
                                </div>
                            );
                        })}
                    </div>
                )}
                {data.canClaim && <Claim data={data} />}
            </SheetBody>
        </>
    );
}

import Title from "./Title";
import Claim from "./Claim";
import PercentWrapper from "./PercentWrapper";
import { SheetBody } from "@/v2/components/ui/sheet";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import { formatCurrency, formatPercentage } from "@/v2/helpers/formatters";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";

export const getSymbol = (data) => {
    return data.currentPayout?.currencySymbol ?? (data?.isManaged ? "USD" : data.coin);
};

export default function Details({ data, onClick, items }) {
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

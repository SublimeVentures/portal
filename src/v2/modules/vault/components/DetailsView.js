import { views } from "./DetailsSidebar";
import { Button } from "@/v2/components/ui/button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import DynamicIcon from "@/components/Icon";
import { NETWORKS } from "@/lib/utils";
import { updateToLocalString, getFormattedDate } from "@/v2/lib/helpers";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import { cn } from "@/lib/cn";

const DetailsView = ({ setView, ...props }) => {
    const {
        vestedPercentage,
        invested,
        claimed,
        availablePayouts,
        currency,
        isManaged,
        tgeParsed,
        performance,
        participated,
        nextUnlock,
        nextSnapshot,
        nextClaim,
        notifications,
        ticker,
        createdAt,
    } = props;

    return (
        <>
            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-white">Status</h3>
            <dl className="definition-grid definition-section">
                <DefinitionItem term="Progress">{vestedPercentage}%</DefinitionItem>
                <DefinitionItem term="Invested">{updateToLocalString(invested)}</DefinitionItem>
                <DefinitionItem term="Vested">{updateToLocalString(claimed, currency?.symbol)}</DefinitionItem>
                <DefinitionItem term="Available payout">
                    <DynamicIcon name={NETWORKS[currency?.chainId]} style={ButtonIconSize.clicksLow} />
                    {Number(availablePayouts).toLocaleString()} {currency?.symbol}
                </DefinitionItem>
            </dl>

            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-white">Performance</h3>
            <dl className="definition-grid definition-section">
                <DefinitionItem term="TGE gain" className={cn(tgeParsed !== "TBA" ? "text-success-500" : "text-white")}>
                    {tgeParsed}
                </DefinitionItem>
                {isManaged ? (
                    <DefinitionItem
                        term="Return"
                        className={cn(tgeParsed !== "TBA" ? "text-success-500" : "text-white")}
                    >
                        +{updateToLocalString(performance, "%")}
                    </DefinitionItem>
                ) : (
                    <DefinitionItem term="ATH Profit">Soon</DefinitionItem>
                )}
            </dl>

            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-white">Dates</h3>
            <dl className="definition-grid definition-section">
                <DefinitionItem term="Participated">{getFormattedDate(participated)}</DefinitionItem>
                <DefinitionItem term="Next Unlock">{nextUnlock !== 0 ? nextUnlock : "TBA"}</DefinitionItem>
                <DefinitionItem term="Allocation Snapshot">{nextSnapshot !== 0 ? nextSnapshot : "TBA"}</DefinitionItem>
                <DefinitionItem term="Claim Date">{nextClaim !== 0 ? nextClaim : "TBA"}</DefinitionItem>
            </dl>

            {notifications && notifications.length > 0 ? (
                <>
                    <div className="pb-2 pt-4 px-8 flex items-center">
                        <h3 className="mr-4 text-lg font-medium text-white">Timeline</h3>
                        <Button variant="link" onClick={() => setView(views.timeline)}>
                            <span>See all</span>
                            <ArrowIcon className="ml-1" />
                        </Button>
                    </div>

                    <TimelineItem item={notifications[0]} showTimeline={false} />
                </>
            ) : null}
        </>
    );
};

export default DetailsView;

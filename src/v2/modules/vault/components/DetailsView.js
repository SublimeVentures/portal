import { Button } from "@/v2/components/ui/button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import DefinitionItem from "@/v2/components/Definition/DefinitionItem";
import DynamicIcon from "@/components/Icon";
import { NETWORKS } from "@/lib/utils";
import { updateToLocalString, getFormattedDate } from "@/v2/lib/helpers";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import { cn } from "@/lib/cn";
import { views } from "./DetailsSidebar";

const DetailsView = ({ setView, ...props }) => {
    const { vestedPercentage, invested, claimed, availablePayouts, currency, isManaged, tgeParsed, performance, participated, nextUnlock, nextSnapshot, nextClaim, notifications, ticker, createdAt } = props;

    return (
        <>
            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Status</h3>
            <dl className='definition-grid definition-section'>
                <DefinitionItem term="Progress">{vestedPercentage}%</DefinitionItem>
                <DefinitionItem term="Invested">{updateToLocalString(invested)}</DefinitionItem>
                <DefinitionItem term="Vested">{updateToLocalString(claimed, currency?.symbol)}</DefinitionItem>
                <DefinitionItem term="Available payout">
                    <DynamicIcon name={NETWORKS[currency?.chainId]} style={ButtonIconSize.clicksLow} />
                    {Number(availablePayouts).toLocaleString()} {currency?.symbol}
                </DefinitionItem>
            </dl>

            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Performance</h3>
            <dl className='definition-grid definition-section'>
                <DefinitionItem term="TGE gain" className={cn(tgeParsed !== "TBA" ? "text-green-500" : "text-foreground")}>{tgeParsed}</DefinitionItem>
                {isManaged
                    ? <DeinitionItem term="Return" className={cn(tgeParsed !== "TBA" ? "text-green-500" : "text-foreground")}>+{updateToLocalString(performance, '%')}</DeinitionItem> 
                    : <DefinitionItem term="ATH Profit">Soon</DefinitionItem>
                }
            </dl>

            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Dates</h3>
            <dl className='definition-grid definition-section'>
                <DefinitionItem term="Participated">{getFormattedDate(participated)}</DefinitionItem>
                <DefinitionItem term="Next Unlock">{nextUnlock !== 0 ? nextUnlock : "TBA"}</DefinitionItem>
                <DefinitionItem term="Allocation Snapshot">{nextSnapshot !== 0 ? nextSnapshot : "TBA"}</DefinitionItem>
                <DefinitionItem term="Claim Date">{nextClaim !== 0 ? nextClaim : "TBA"}</DefinitionItem>
            </dl>

            <div className="pb-2 pt-4 px-8 flex items-center">
                <h3 className="mr-4 text-lg font-medium text-foreground">Timeline</h3>
                <Button variant="link" onClick={() => setView(views.timeline)}>
                    <span>See all</span>
                    <ArrowIcon className="ml-1" />
                </Button>
            </div>

            {notifications && notifications.length > 0 && <TimelineItem item={notifications[0]} showTimeline={false} />}
        </>
    );
};

export default DetailsView;

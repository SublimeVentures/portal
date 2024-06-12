import { Button } from "@/v2/components/ui/button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import { ButtonIconSize } from "@/components/Button/RoundButton";
import DynamicIcon from "@/components/Icon";
import { NETWORKS } from "@/lib/utils";
import { updateToLocalString, getFormattedDate } from "@/v2/lib/helpers";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import { views } from "./DetailsSidebar";

const DetailsView = ({ setView, ...props }) => {
    const { vestedPercentage, invested, claimed, availablePayouts, currency, isManaged, tgeParsed, performance, participated, nextUnlock, nextSnapshot, nextClaim, notifications, ticker, createdAt } = props;

    return (
        <>
            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Status</h3>

            <dl className='py-4 px-8 flex flex-col gap-4 bg-foreground/[.02]'>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Progress</dt>
                    <dd className="text-lg font-medium text-foreground">{vestedPercentage}%</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Invested</dt>
                    <dd className="text-lg font-medium text-foreground">
                        {updateToLocalString(invested)}
                    </dd>
                </div>
                <div className="flex justify-between items-center">
                      <dt className="text-md font-light text-foreground">Vested</dt>
                      <dd className="text-lg font-medium text-foreground">
                          {updateToLocalString(claimed, currency?.symbol)}
                      </dd>
                </div>

                {availablePayouts > 0 && (
                    <div className="flex justify-between items-center">
                        <dt className="text-md font-light text-foreground">Available payout</dt>
                        <dd className="text-lg font-medium text-foreground">
                            <p className="flex gap-1 h-[18px] font-mono">
                                <DynamicIcon name={NETWORKS[currency?.chainId]} style={ButtonIconSize.clicksLow} />
                                {Number(availablePayouts).toLocaleString()} {currency?.symbol}
                            </p>
                        </dd>
                    </div>
                )}
            </dl>

            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Performance</h3>
            <dl className='py-4 px-8 flex flex-col gap-4 bg-foreground/[.02]'>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">TGE gain</dt>
                    <dd className="text-lg font-medium">
                        <span className={`${tgeParsed !== "TBA" ? "text-green-500" : "text-foreground"}`}>
                            {tgeParsed}
                        </span>
                    </dd>
                </div>
                <div className="flex justify-between items-center">
                    {isManaged ? (
                        <>
                            <dt className="text-md font-light text-foreground">Return</dt>
                            <dd className="text-lg font-medium text-foreground">
                                <span className={`${tgeParsed !== "TBA" ? "text-green-500" : "text-foreground"}`}>
                                    +{updateToLocalString(performance, '%')}
                                </span>
                            </dd>
                        </>
                    ) : (
                        <>
                            <dt className="text-md font-light text-foreground">ATH Profit</dt>
                            <dd className="text-lg font-medium text-foreground">Soon</dd>
                        </>
                    )}
                </div>
            </dl>

            <h3 className="pb-2 pt-4 px-8 text-lg font-medium text-foreground">Dates</h3>
            <dl className='py-4 px-8 flex flex-col gap-4 bg-foreground/[.02]'>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Participated</dt>
                    <dd className="text-lg font-medium text-foreground">{getFormattedDate(participated)}</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Next Unlock</dt>
                    <dd className="text-lg font-medium text-foreground">{nextUnlock !== 0 ? nextUnlock : "TBA"}</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Allocation Snapshot</dt>
                    <dd className="text-lg font-medium text-foreground">{nextSnapshot !== 0 ? nextSnapshot : "TBA"}</dd>
                </div>
                <div className="flex justify-between items-center">
                    <dt className="text-md font-light text-foreground">Claim Date</dt>
                    <dd className="text-lg font-medium text-foreground">{nextClaim !== 0 ? nextClaim : "TBA"}</dd>
                </div>
            </dl>

            <div className="pb-2 pt-4 px-8 flex items-center">
                <h3 className="mr-4 text-lg font-medium text-foreground">Timeline</h3>
                <Button variant="link" onClick={() => setView(views.timeline)}>
                    <span>See all</span>
                    <ArrowIcon className="ml-1" />
                </Button>
            </div>

            {notifications.length >= 0 ? <TimelineItem item={notifications[0]} showTimeline={false} /> : null}
        </>
    );
};

export default DetailsView;

import PropTypes from "prop-types";

import { views } from "./DetailsSidebar";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import { Button } from "@/v2/components/ui/button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";

export default function DetailsTimeline({ setView, notifications }) {
    const hasNotifications = notifications.length > 0;

    if (!hasNotifications) {
        return <p className="p-4 my-8 text-center">No notifications found</p>;
    }

    return (
        <>
            <div className="w-full pb-2 pt-4 px-8 flex items-center justify-between">
                <div className="flex items-center">
                    <h3 className="text-lg font-medium text-white">Timeline</h3>
                </div>

                <Button variant="link" onClick={() => setView(views.details)}>
                    <span>Back</span>
                    <ArrowIcon className="ml-1" />
                </Button>
            </div>

            <ul>
                {notifications.map((item) => (
                    <li key={item.id} className="group">
                        <TimelineItem item={item} />
                    </li>
                ))}
            </ul>
        </>
    );
}

DetailsTimeline.propTypes = {
    offerId: PropTypes.number,
};

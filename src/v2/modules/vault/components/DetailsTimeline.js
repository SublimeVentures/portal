import PropTypes from "prop-types";

import TimelineItem from "@/v2/components/Timeline/TimelineItem";
import { Button } from "@/v2/components/ui/button";
import ArrowIcon from "@/v2/assets/svg/arrow.svg";
import { views } from "./DetailsSidebar";

export default function DetailsTimeline({ setView, notifications }) {    
    return (
        <>
            <div className="w-full pb-2 pt-4 px-8 flex items-center justify-between">
                <div className="flex items-center">
                    <h3 className="text-lg font-medium text-foreground">Timeline</h3>
                </div>

                <Button variant="link" onClick={() => setView(views.details)}>
                    <span>Back</span>
                    <ArrowIcon className="ml-1" />
                </Button>
            </div>

            <ul>
                {notifications.map((item, idx) => (
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

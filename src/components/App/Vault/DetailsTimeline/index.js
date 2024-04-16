import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { IoRefreshOutline } from "react-icons/io5";
import debounce from "lodash.debounce";
import TimelineItem from "./TimelineItem";
import { cn } from "@/lib/cn";
import { fetchNotificationList } from "@/fetchers/notifications.fetcher";

export default function DetailsTimeline({ offerId }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleNotificationsFetch = () => {
        if (offerId) {
            setLoading(true);
            fetchNotificationList({ offerId })
                .then(setNotifications)
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const debouncedFetch = debounce(handleNotificationsFetch, 1000, { leading: true });

    useEffect(() => handleNotificationsFetch(), []);

    return (
        <>
            <div className="flex gap-1 items-center pt-5 pb-2 text-xl font-bold">
                <span>Timeline</span>
                <button onClick={debouncedFetch}>
                    <IoRefreshOutline className={cn({ "animate-spin": loading })} />
                </button>
            </div>
            <div>
                {notifications.map((item, idx, arr) => (
                    <TimelineItem key={item.id} item={item} first={idx === 0} last={idx === arr.length - 1} />
                ))}
            </div>
        </>
    );
}

DetailsTimeline.propTypes = {
    offerId: PropTypes.number,
};

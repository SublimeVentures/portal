import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { IoRefreshOutline } from "react-icons/io5";
import debounce from "lodash.debounce";
import TimelineItem from "./TimelineItem";
import { cn } from "@/lib/cn";
import { fetchNotificationList } from "@/fetchers/notifications.fetcher";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";

export default function DetailsTimeline({ offerId }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const last = useRef(-1);

    /**
     * @param [lastId]
     */
    const handleNotificationsFetch = (lastId) => {
        if (offerId) {
            let filters = { offerId, profile: "timeline" };
            if (lastId) {
                filters = { ...filters, lastId };
            }
            setLoading(true);
            fetchNotificationList(filters)
                .then((list) => {
                    setNotifications(list);
                    last.current = list[list.length - 1];
                })
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
                <UniButton
                    type={ButtonTypes.BASE}
                    isWide={true}
                    size="text-sm sm border-transparent my-3"
                    text="Show more"
                    handler={() => {}}
                />
            </div>
        </>
    );
}

DetailsTimeline.propTypes = {
    offerId: PropTypes.number,
};

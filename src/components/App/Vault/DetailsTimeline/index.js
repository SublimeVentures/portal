import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoRefreshOutline } from "react-icons/io5";
import debounce from "lodash.debounce";
import TimelineItem from "./TimelineItem";
import { cn } from "@/lib/cn";
import { fetchNotificationList } from "@/fetchers/notifications.fetcher";
import { ButtonTypes, UniButton } from "@/components/Button/UniButton";

export default function DetailsTimeline({ offerId }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const last = useRef(0);

    /**
     * @param [lastId]
     */
    const handleNotificationsFetch = useCallback(
        (incremental = false) => {
            if (offerId) {
                let filters = { offerId, profile: "timeline" };
                if (last.current) {
                    filters = { ...filters, lastId: last.current };
                }
                setLoading(true);
                fetchNotificationList(filters)
                    .then((list) => {
                        if (incremental) {
                            setNotifications((prev) => [...prev, ...list]);
                        } else {
                            setNotifications(list);
                        }
                        last.current = list[list.length - 1].id;
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        },
        [offerId],
    );

    const debouncedFetch = debounce(handleNotificationsFetch, 1000, { leading: true });

    useEffect(() => handleNotificationsFetch(), [handleNotificationsFetch]);

    return (
        <>
            <div className="flex gap-1 items-center pt-5 pb-2 text-xl font-bold">
                <span>Timeline</span>
                <button onClick={debouncedFetch}>
                    <IoRefreshOutline className={cn({ "animate-spin": loading })} />
                </button>
            </div>
            <div>
                {notifications.map((item) => (
                    <TimelineItem key={item.id} item={item} />
                ))}
                <UniButton
                    type={ButtonTypes.BASE}
                    isWide={true}
                    size="text-sm sm border-transparent my-3"
                    text="Show more"
                    handler={() => handleNotificationsFetch(true)}
                />
            </div>
        </>
    );
}

DetailsTimeline.propTypes = {
    offerId: PropTypes.number,
};

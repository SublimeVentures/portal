import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchExtendedNotification } from "@/fetchers/notifications.fetcher";

export default function TimelineItemExpansion({ id }) {
    const [loading, setLoading] = useState(false);
    const [extendedNotification, setExtendedNotification] = useState(/** @type {Record<string, string | number>} */ {});

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetchExtendedNotification(id)
                .then(setExtendedNotification)
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    return <div></div>;
}

TimelineItemExpansion.propTypes = {
    id: PropTypes.number,
};

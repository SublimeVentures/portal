import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { fetchExtendedNotification } from "@/fetchers/notifications.fetcher";
import InlineCopyButton from "@/components/Button/InlineCopyButton";

/**
 * @typedef {Record<string, Record<string, any>>} FrontendNotification
 */

export default function TimelineItemExtension({ id }) {
    const [loading, setLoading] = useState(false);
    const [extended, setExtended] = useState(/** @type {FrontendNotification} */ {});

    useEffect(() => {
        if (id) {
            setLoading(true);
            fetchExtendedNotification(id)
                .then((ext) => {
                    setExtended(ext);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    return (
        <div className="basis-full">
            {loading && <div className="w-4 h-4 border border-t-none rounded-full border-white animate-spin"></div>}
            {extended && !loading && (
                <ExtendedEntry scope={extended.notification?.notificationType?.name} entry={extended} />
            )}
        </div>
    );
}

TimelineItemExtension.propTypes = {
    id: PropTypes.number,
};

function ExtendedEntry({ scope, entry }) {
    console.log(Object.keys(entry));

    const items = Object.entries(entry);

    /**
     * @type {Record<string, any>}
     */
    const mappedProps = items.reduce((acc, [key, value]) => {
        if (["OTC_MADE", "OTC_TAKE", "OTC_CANCEL"].includes(scope)) {
            if (key === "isSell") {
                acc["offer type"] = value ? "sell" : "buy";
            } else if (key === "otcDeal") {
                if (!value) {
                    acc["OTC deal"] = "no data";
                } else {
                    acc["amount"] = value.amount;
                    acc["price"] = `$${value.price.toFixed(2)}`;
                    acc["hash"] = (
                        <span className="flex justify-start items-center gap-2">
                            {value.hash}
                            <InlineCopyButton copiable={value.hash} />
                        </span>
                    );
                    acc["filled"] = value.isFilled ? "yes" : "no";
                    if (value.isCancelled) acc["cancelled"] = "yes";
                }
            }
        } else if (scope === "INVESTMENT") {
            if (key === "value") {
                acc[key] = `$${value}`;
            }
        } else if (scope === "CLAIM") {
            if (key === "claim") {
                acc["claimed"] = value.isClaimed ? "yes" : "no";
            }
            if (key === "payout") {
                acc["total amount"] = value.totalAmount.toFixed(2);
                acc["currency"] = value.currencySymbol;
            }
        } else if (["boolean", "number", "string"].includes(typeof value)) {
            acc[key] = value;
        }
        return acc;
    }, {});

    return (
        <div className="flex flex-row flex-wrap">
            {Object.entries(mappedProps).map(([key, value], idx) => (
                <div key={idx} className="basis-1/2">
                    <p className="text-gray">{key}</p>
                    <p className="font-mono">{value}</p>
                </div>
            ))}
        </div>
    );
}

ExtendedEntry.propTypes = {
    scope: PropTypes.string,
    entry: /** @type {Record<string, any>} */ PropTypes.object,
};

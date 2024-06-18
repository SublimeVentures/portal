// import PropTypes from "prop-types";
// // import { useEffect, useState } from "react";
// // import { NotificationTypes } from "../../../../../server/enum/NotificationTypes";
// // import { fetchExtendedNotification } from "@/fetchers/notifications.fetcher";
// // import InlineCopyButton from "@/components/Button/InlineCopyButton";

// /**
//  * @typedef {Record<string, Record<string, any>>} FrontendNotification
//  */

// export default function TimelineItemExtension({ id }) {
//     // const [loading, setLoading] = useState(false);
//     // const [extended, setExtended] = useState(/** @type {FrontendNotification} */ {});

//     // useEffect(() => {
//     //     if (id) {
//     //         setLoading(true);
//     //         fetchExtendedNotification(id)
//     //             .then((ext) => {
//     //                 setExtended(ext);
//     //             })
//     //             .finally(() => {
//     //                 setLoading(false);
//     //             });
//     //     }
//     // }, [id]);

//     return (
//         <div className="basis-full">
//             extension
//             {/* {loading && <div className="w-4 h-4 border border-t-none rounded-full border-white animate-spin"></div>} */}
//             {/* {extended && !loading && <ExtendedEntry scopeId={extended.notification?.typeId} entry={extended} />} */}
//         </div>
//     );
// }

// TimelineItemExtension.propTypes = {
//     id: PropTypes.number,
// };

// function ExtendedEntry({ scopeId, entry }) {
//     // const items = Object.entries(entry);

//     // /**
//     //  * @type {Record<string, import("react").ReactNode>}
//     //  */
//     // const mappedProps = items.reduce((acc, [key, value]) => {
//     //     if (NotificationTypes.OTCS.includes(scopeId)) {
//     //         if (key === "isSell") {
//     //             acc["offer type"] = <span>{value ? "sell" : "buy"}</span>;
//     //         } else if (key === "otcDeal") {
//     //             if (!value) {
//     //                 acc["OTC deal"] = <span>no data</span>;
//     //             } else {
//     //                 acc["amount"] = <span>{value.amount}</span>;
//     //                 acc["price"] = <span>${value.price.toFixed(2)}</span>;
//     //                 acc["hash"] = (
//     //                     <span className="flex justify-start items-center gap-2">
//     //                         {value.hash}
//     //                         <InlineCopyButton copiable={value.hash} />
//     //                     </span>
//     //                 );
//     //                 acc["filled"] = <span>{value.isFilled ? "yes" : "no"}</span>;
//     //                 if (value.isCancelled) acc["cancelled"] = <span>yes</span>;
//     //             }
//     //         }
//     //     } else if (scopeId === NotificationTypes.INVESTMENT) {
//     //         if (key === "value") {
//     //             acc[key] = <span>${value}</span>;
//     //         }
//     //     } else if (scopeId === NotificationTypes.CLAIM) {
//     //         if (key === "claim") {
//     //             acc["claimed"] = <span>{value.isClaimed ? "yes" : "no"}</span>;
//     //         }
//     //         if (key === "payout") {
//     //             acc["total amount"] = <span>{value.totalAmount.toFixed(2)}</span>;
//     //             acc["currency"] = <span>{value.currencySymbol}</span>;
//     //         }
//     //     } else if (["boolean", "number", "string"].includes(typeof value)) {
//     //         acc[key] = <span>{value}</span>;
//     //     }
//     //     return acc;
//     // }, {});

//     return (
//         <div className="flex flex-row flex-wrap">
//             extension
//             {/* {Object.entries(mappedProps).map(([key, value], idx) => (
//                 <div key={idx} className="basis-1/2">
//                     <p className="text-gray">{key}</p>
//                     <p className="font-mono">{value}</p>
//                 </div>
//             ))} */}
//         </div>
//     );
// }

// ExtendedEntry.propTypes = {
//     scopeId: PropTypes.number,
//     entry: /** @type {Record<string, any>} */ PropTypes.object,
// };

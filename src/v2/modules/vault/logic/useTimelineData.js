import { useQuery } from "@tanstack/react-query";

import { fetchNotificationList } from "@/fetchers/notifications.fetcher";

const options = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  cacheTime: 5 * 60 * 1000,
  staleTime: 3 * 60 * 1000,
}

export default function useTimelineData() {
    const filters = {};

    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => fetchNotificationList(filters),
        ...options,
    });

    return {
        notifications: data,
        isLoading,
        isSuccess,
    };
}

// Implement pagination:
// https://tanstack.com/query/v4/docs/framework/react/guides/paginated-queries

// const [notifications, setNotifications] = useState([]);
// const [loading, setLoading] = useState(false);
// const last = useRef(0);

// Incremental - informacja czy strona ktora sie zaciaga jest pierwsza czy nie 
// - w momencie gdy zaciaga sie dane mechanizm bierze ostatni element z listy i umieszcza go w ref last 

// /**
//  * @param {boolean} [incremental=false]
//  */
// const handleNotificationsFetch = (incremental = false) => {
//     if (offerId) {
//         let filters = { offerId, profile: "timeline" };
//         if (last.current) {
//             filters = { ...filters, lastId: incremental ? last.current : 0 };
//         }
//         setLoading(true);
//         
            // fetchNotificationList(filters)
//             .then((list) => {
//                 if (incremental) {
//                     setNotifications((prev) => [...prev, ...list]);
//                 } else {
//                     setNotifications((_prev) => list);
//                 }
//                 if (list[list.length - 1] && list[list.length - 1].id) {
//                     last.current = list[list.length - 1].id;
//                 }
//             })
//             .finally(() => setLoading(false));
//     }
// };

// const mockedNotificatioms = [
//   {
//     createdAt: "2024-01-17T04:14:22.429Z",
//     data: { amount: 1, item: 1 },
//     id: 5,
//     notificationType: { name: "OTC_MADE" },
//     onchainId: 24473,
//     offerId: 37,
//     onchain: {
//       blockConfirmed: "52417528",
//       blockRegistered: "52417786",
//       blockReverted: null,
//       chainId: 137,
//       createdAt: "2023-12-22T16:08:44.622Z",
//       data: { amount: 1, item: 1 },
//       from: "0x678DF4F67507e86B059BD7540521E7b55c55c7a",
//       id: 24473,
//       isConfirmed: true,
//       isRegistered: false,
//       isReverted: false,
//       network: {
//         chainId: 137,
//         name: "Polygon",
//         isDev: false,
//         createdAt: "2023-05-24T16:54:04.169Z",
//         updatedAt: "2023-05-24T16:54:04.850Z"
//       },
//       onchainType: { name: "OtcBuy" },
//       tenant: 1,
//       to: "0x60dc62Fa12e7df85e94b2a967f61ac0688EF",
//       txID: "0xb061cf4cfda42e819c3d0891524b170e0e063f1fb10242ac99a181569a",
//       typeId: 4,
//       updatedAt: "2024-01-17T04:14:23.893Z",
//       userId: null,
//     },
//     onchainId: 24473,
//     tenantId: 1,
//     typeId: 4,
//     updatedAt: "2024-01-17T04:14:23.893Z",
//     userId: 11302
//   },
//   {
//     createdAt: "2024-01-17T04:14:22.429Z",
//     data: { amount: 1, item: 1 },
//     id: 6,
//     notificationType: { name: "OTC_MADE" },
//     onchainId: 24473,
//     offerId: 37,
//     onchain: {
//       blockConfirmed: "52417528",
//       blockRegistered: "52417786",
//       blockReverted: null,
//       chainId: 137,
//       createdAt: "2023-12-22T16:08:44.622Z",
//       data: { amount: 1, item: 1 },
//       from: "0x678DF4F67507e86B059BD7540521E7b55c55c7a",
//       id: 24473,
//       isConfirmed: true,
//       isRegistered: false,
//       isReverted: false,
//       network: {
//         chainId: 137,
//         name: "Polygon",
//         isDev: false,
//         createdAt: "2023-05-24T16:54:04.169Z",
//         updatedAt: "2023-05-24T16:54:04.850Z"
//       },
//       onchainType: { name: "OtcMade" },
//       tenant: 1,
//       to: "0x60dc62Fa12e7df85e94b2a967f61ac0688EF",
//       txID: "0xb061cf4cfda42e819c3d0891524b170e0e063f1fb10242ac99a181569a",
//       typeId: 4,
//       updatedAt: "2024-01-17T04:14:23.893Z",
//       userId: null,
//     },
//     onchainId: 24473,
//     tenantId: 1,
//     typeId: 4,
//     updatedAt: "2024-01-17T04:14:23.893Z",
//     userId: 11302
//   },
// ]

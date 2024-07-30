import { dehydrate, useQuery } from "@tanstack/react-query";

import { AppLayout } from "@/v2/components/Layout";
import { processServerSideData } from "@/lib/serverSideHelpers";
import { getUserAlocation } from "@/v2/fetchers/otc";

// import { Input } from "@/v2/components/ui/input";
// import { Search } from "@/v2/components/ui/search";
// import { Checkbox } from "@/v2/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from "@/v2/components/ui/radio-group";
import { Button } from "@/v2/components/ui/button";

// import { DropdownMenu, DropdownMenuButton, DropdownMenuLabelReset, DropdownMenuLabel, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal } from "@/v2/components/ui/dropdown-menu";
import { DatePicker } from "@/v2/components/ui/date-picker";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuPortal,
//     DropdownMenuShortcut,
//     DropdownMenuSub,
//     DropdownMenuSubContent,
//     DropdownMenuSubTrigger,
//     DropdownMenuTrigger,
//   } from "@/components/ui/dropdown-menu"

// export default function AppTest({ session }) {
//     const { data } = useQuery({
//         queryKey: ["networkList"],
//         queryFn: () => getNetwork(),
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//         cacheTime: 5 * 60 * 1000,
//         staleTime: 3 * 60 * 1000,
//     });

//     console.log('data', data)

//     return (
//         <div className="bg-black h-screen p-4 space-y-6">test</div>
//     );
// }

// export const getServerSideProps = async ({ req, res }) => {
//     // await queryClient.prefetchQuery({
//     //     queryKey: ["notificationList"],
//     //     queryFn: () => fetchNotificationList(),
//     //     ...queryOptions,
//     // });

//     // return {
//     //     props: {
//     //         dehydratedState: dehydrate(queryClient),
//     //     },
//     // };

//     // return await processServerSideData(req, res, '/app/test');
//     // const customLogicCallback = async (account, token) => {
//     //     const userId = account?.userId;

//     //     await queryClient.prefetchQuery({
//     //         queryKey: ["notificationList", userId],
//     //         queryFn: () => fetchNotificationList(token),
//     //         ...queryOptions,
//     //     });

//     //     return {
//     //         additionalProps: {
//     //             dehydratedState: dehydrate(queryClient),
//     //         },
//     //     };
//     // };

//     return await processServerSideData(req, res, '/app/test');
// };

// Co jest potrzebne
// const userAllocation = currentMarket && vault?.length > 0 ? vault.find((el) => el.id === currentMarket.offerId) : {};
// const ownedAllocation = userAllocation?.invested ? userAllocation.invested - userAllocation.locked : 0;

// function useVaultQuery() {
//     const { data } = useQuery({
//         queryKey: ["userAllocation"],
//         queryFn: getUserAlocation,
//         refetchOnMount: false,
//         refetchOnWindowFocus: false,
//         cacheTime: 5 * 60 * 1000,
//         staleTime: 3 * 60 * 1000,
//     });

//     // const userAllocation = currentMarket && vault?.length > 0 ? vault.find((el) => el.id === currentMarket.offerId) : {};

//     // console.log('555', data)

//     return {}
// }

export default function AppTest({ session }) {
    // const test = useVaultQuery();

    return (

        <div>
            <div className="h-[2500px] bg-black flex flex-col gap-4">
                <Button variant="default">1</Button>
                <Button variant="accent">1</Button>
                <Button variant="gradient">1</Button>
                <Button variant="outline">1</Button>
                <Button variant="secondary">1</Button>
                <Button variant="destructive">1</Button>
                <Button variant="tertiary">1</Button>
                <Button variant="link">1</Button>
            </div>
        </div>
    )
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, '/app/test');
};

AppTest.getLayout = function (page) {
    return <AppLayout title="Test">{page}</AppLayout>;
}
import { processServerSideData } from "@/lib/serverSideHelpers";
import { AppLayout, Metadata } from "@/v2/components/Layout";
import Notifications from "@/v2/modules/notifications/Notifications";
import NotificationFilters from "@/v2/modules/notifications/NotificationFilters";
import useNotificationInfiniteLoader from "@/v2/modules/notifications/logic/useNotificationInfiniteLoader";
import routes from "@/routes";

export default function AppNotifications() {
    const { data, isFetching, hasNextPage, fetchNextPage, getFiltersProps } = useNotificationInfiniteLoader();
    return (
        <>
            <Metadata title="History" />
            <NotificationFilters {...getFiltersProps()} />
            <Notifications
                data={data}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
            />
        </>
    );
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Notifications);
};

AppNotifications.getLayout = function (page) {
    return <AppLayout title="History">{page}</AppLayout>;
};

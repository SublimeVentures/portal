import { processServerSideData } from "@/lib/serverSideHelpers";
import { AppLayout } from "@/v2/components/Layout";
import Notifications from '@/v2/modules/notifications/Notifications';
import NotificationFilters from '@/v2/modules/notifications/NotificationFilters';
import useNotificationsLoader from '@/v2/modules/notifications/logic/useNotificationsLoader';
import routes from "@/routes";

export default function AppNotifications() {
    const { data, error, isLoading, isError, isFetching, getFiltersProps } = useNotificationsLoader();

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>{error}</div>
    }

    return (
        <div className="md:p-12 xl:p-16 h-[75vh] overflow-hidden">
            <NotificationFilters {...getFiltersProps()} />
            <Notifications data={data[0].notifications} isFetching={isFetching} />
        </div>
    )
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Notifications);
};


AppNotifications.getLayout = function (page) {
    return <AppLayout title="History">{page}</AppLayout>;
};

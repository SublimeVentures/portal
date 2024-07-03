import { processServerSideData } from "@/lib/serverSideHelpers";
import { AppLayout } from "@/v2/components/Layout";
import Notifications from '@/v2/modules/notifications/Notifications';
import NotificationFilters from '@/v2/modules/notifications/NotificationFilters';
import useNotificationsLoader from '@/v2/modules/notifications/logic/useNotificationsLoader';
import routes from "@/routes";

export default function AppNotifications() {
    const { notifications, error, isLoading, isError, isFetching, getFiltersProps } = useNotificationsLoader();

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>{error}</div>
    }

    return (
        <div className="p-2 h-full md:p-16">
            <div className="mb-8 flex items-center gap-4">
                <div className="flex items-baseline text-foreground">
                    <h3 className="text-nowrap text-2xl">Notifications</h3>
                </div>
            </div>

            <NotificationFilters {...getFiltersProps()} />
            <Notifications data={notifications} isFetching={isFetching} />
        </div>
    )
}

export const getServerSideProps = async ({ req, res }) => {
    return await processServerSideData(req, res, routes.Notifications);
};


AppNotifications.getLayout = function (page) {
    return <AppLayout title="Notifications">{page}</AppLayout>;
};

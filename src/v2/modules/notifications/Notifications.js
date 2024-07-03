import TimelineItem from "@/v2/components/Timeline/TimelineItem";

export default function NotificationList({ data, isFetching }) {
    return (
        <>
            <ol>
                {data.map(notification => (
                    <li key={notification.id} className="group">
                        <TimelineItem item={notification} />
                    </li>
                ))}
            </ol>
            
            <div>{isFetching ? 'Loading older...' : null}</div>
        </>
    )
};

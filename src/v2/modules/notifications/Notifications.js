import { Card } from "@/v2/components/ui/card";
import TimelineItem from "@/v2/components/Timeline/TimelineItem";

export default function NotificationList({ data, isFetching }) {
    return (
        <Card variant="none" className="px-4 flex flex-col h-full bg-settings-gradient">
            <div className="pt-4 pb-8 flex flex-col h-full">
                <ol className="flex flex-col grow gap-4 overflow-y-auto block-scrollbar">
                    {data.map(notification => (
                        <li key={notification.id} className="group">
                            <TimelineItem item={notification} />
                        </li>
                    ))}
                </ol>
            </div>
                
            <div>{isFetching ? 'Loading older...' : null}</div> 
        </Card>
    );
};

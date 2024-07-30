import { format } from "date-fns";

import { Button } from "@/v2/components/ui/button";
import { DatePicker } from "@/v2/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { NotificationTypeNames } from "@/v2/enum/notifications";

export default function NotificationFilters({ query, handleInputChange }) {
    const { startDate, endDate, type } = query;
    const unreadCount = 1;

    return (
        <div className="mb-4 flex flex-col gap-8 2xl:mb-12 2xl:flex-row 2xl:items-center">
            <div className="flex items-baseline text-foreground">
                <h3 className="text-nowrap text-lg font-medium">
                    My notifications {" "}
                    {unreadCount ? <span className="text-white/50 font-light">({unreadCount} unread)</span> : null}
                </h3>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                    <DatePicker
                        className="w-full md:w-auto"
                        date={startDate}
                        setDate={(value) => handleInputChange("startDate", format(value, "yyyy-MM-dd"))}
                        toDate={endDate && new Date()}
                    />
                    <span className="text-white">-</span>
                    <DatePicker
                        className="w-full md:w-auto"
                        date={endDate}
                        setDate={(value) => handleInputChange("endDate", format(value, "yyyy-MM-dd"))}
                        fromDate={startDate ? new Date(startDate) : null}
                        toDate={new Date()}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Select size="sm" value={type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger className="px-8 w-full md:w-auto">
                            <SelectValue placeholder="Event type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key={0} value={null}>All</SelectItem>
                            {Object.entries(NotificationTypeNames).map(([key, value]) => (
                                <SelectItem key={key} value={key}>{value}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select> 

                    <Button className="w-full md:w-auto" variant="secondary">Sort by newest</Button>
                </div>
            </div>
        </div>
    );
};

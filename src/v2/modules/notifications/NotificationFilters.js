import { format } from "date-fns";

import { Button } from "@/v2/components/ui/button";
import { DatePicker } from "@/v2/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { NotificationTypeNames } from "@/v2/enum/notifications";

export default function NotificationFilters({ query, handleInputChange, fetchPreviousPage }) {
    const { startDate, endDate, type } = query;
    const unreadCount = 1;

    return (
        <div className="flex flex-col items-center gap-4 md:flex-row sm:mb-4 lg:mb-0">
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
                    <Select value={type} onValueChange={(value) => handleInputChange("type", value)}>
                        <SelectTrigger className="px-8 w-full md:w-auto">
                            <SelectValue placeholder="Event type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key={0} value={null}>
                                All
                            </SelectItem>
                            {Object.entries(NotificationTypeNames).map(([key, value]) => (
                                <SelectItem key={key} value={key}>
                                    {value}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button className="w-full md:w-auto" variant="secondary" onClick={fetchPreviousPage}>
                        Get older
                    </Button>
                </div>
            </div>
        </div>
    );
}

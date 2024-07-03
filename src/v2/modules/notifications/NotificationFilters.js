import { format } from "date-fns";

import { DatePicker } from "@/v2/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { NotificationTypeNames } from "@/v2/enum/notifications";

export default function NotificationFilters({ query, handleInputChange }) {
    const { startDate, endDate, type } = query;

    return (
        <div className="flex flex-col items-center gap-4 md:flex-row">
            <DatePicker
                className="w-full md:w-auto"
                date={startDate}
                setDate={(value) => handleInputChange("startDate", format(value, "yyyy-MM-dd"))}
                toDate={endDate && new Date()}
            />
            <span className="hidden text-white md:block">-</span>
            <DatePicker
                className="w-full md:w-auto"
                date={endDate}
                setDate={(value) => handleInputChange("endDate", format(value, "yyyy-MM-dd"))}
                fromDate={startDate ? new Date(startDate) : null}
                toDate={new Date()}
            />

            <Select value={type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem key={0} value={null}>All</SelectItem>
                    {Object.entries(NotificationTypeNames).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
};

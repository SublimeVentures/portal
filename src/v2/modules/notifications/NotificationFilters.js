import moment from "moment";
import { Button } from "@/v2/components/ui/button";
import { DatePicker } from "@/v2/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/v2/components/ui/select";
import { NotificationTypeNames } from "@/v2/enum/notifications";
import Title from "@/v2/modules/opportunities/Title";

export default function NotificationFilters({ query, handleInputChange, fetchPreviousPage }) {
    const { after, before, typeId } = query;
    const unreadCount = 0;
    const props = unreadCount > 0 ? { count: `${unreadCount} unread` } : {};

    return (
        <div className="flex flex-col items-center gap-4 3xl:gap-12 md:flex-row sm:mb-4 lg:mb-0 ">
            <Title {...props}>My notifications</Title>
            <div className="w-full flex flex-col gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                    <DatePicker
                        className="w-full md:w-auto"
                        value={after}
                        onChange={(value) =>
                            handleInputChange("after", value ? moment(value).format("YYYY-MM-DD") : null)
                        }
                        toDate={before && new Date()}
                    />
                    <span className="text-white">-</span>
                    <DatePicker
                        className="w-full md:w-auto"
                        value={before}
                        onChange={(value) =>
                            handleInputChange("before", value ? moment(value).format("YYYY-MM-DD") : null)
                        }
                        fromDate={after ? new Date(after) : null}
                        toDate={new Date()}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Select
                        value={typeId ?? 0}
                        onValueChange={(value) => handleInputChange("typeId", value === 0 ? null : value)}
                    >
                        <SelectTrigger
                            className="px-8 w-full md:w-auto text-xs md:text-sm !leading-1 md:!leading-6"
                            size="sm"
                        >
                            <SelectValue placeholder="Event type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key={0} value={0}>
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

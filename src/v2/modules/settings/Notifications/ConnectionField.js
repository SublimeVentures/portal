import Image from "next/image";
import { Checkbox } from "@/v2/components/ui/checkbox";
import { cn } from "@/lib/cn";
import { updateNotificationPreferences } from "@/fetchers/notifications.fetcher";

export default function ConnectionField({
    id,
    name,
    defaultChecked,
    onBeforeUpdate = async (_enabled) => true,
    onUpdate,
    disabled = false,
}) {
    const [categoryId, channelId] = id.split("|");

    const handleValueChange = (enabled) =>
        onBeforeUpdate(enabled)
            .then(
                (allowed) =>
                    allowed &&
                    updateNotificationPreferences([
                        {
                            categoryId,
                            channelId,
                            enabled: allowed && enabled,
                        },
                    ]),
            )
            .then((updated) => {
                if (updated) {
                    onUpdate();
                }
            });

    return (
        <div className="p-4 bg-foreground/[.05] rounded shadow-lg">
            <label
                htmlFor={id}
                className={cn("flex items-center justify-between", {
                    "cursor-pointer": !disabled,
                    "cursor-not-allowed text-gray": disabled,
                })}
            >
                <div className="flex items-center">
                    <Image
                        src={`/img/icons/${channelId}.png`}
                        alt={`Image shows ${name} notification icon`}
                        width={50}
                        height={50}
                    />
                    <div className="ml-4">
                        <h4 className="text-sm font-medium">{name}</h4>
                    </div>
                </div>

                <Checkbox disabled={disabled} id={id} onCheckedChange={handleValueChange} checked={defaultChecked} />
            </label>
        </div>
    );
}

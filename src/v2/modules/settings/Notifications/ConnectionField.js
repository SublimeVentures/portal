import Image from "next/image";

import { useState } from "react";
import { Checkbox } from "@/v2/components/ui/checkbox";
import { Input } from "@/v2/components/ui/input";
import ArrowRightIcon from "@/v2/assets/svg/arrow-right.svg";
import { IconButton } from "@/v2/components/ui/icon-button";
import { updateUser } from "@/fetchers/auth.fetcher";
import { cn } from "@/lib/cn";
import { updateNotificationPreferences } from "@/fetchers/notifications.fetcher";

export default function ConnectionField({
    id,
    name,
    placeholder,
    fieldValue = null,
    fieldKey,
    defaultChecked,
    onBeforeUpdate = async (_enabled) => true,
    onUpdate,
    disabled = false,
}) {
    const [input, setInput] = useState(fieldValue);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const [categoryId, channelId] = id.split("|");

    const onUserDataUpdate = () => {
        updateUser({
            [fieldKey]: input,
        }).then((res) => {
            setUpdateSuccess(res.ok);
        });
    };

    const handleInputChange = (ev) => {
        setInput(ev.target.value);
    };

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
                className={cn("flex items-center justify-between cursor-pointer", { "mb-4": !!fieldKey })}
            >
                <div className="flex items-center">
                    <Image
                        src={`/img/icons/${channelId}.png`}
                        alt={`Image shows ${name} notification icon`}
                        width={50}
                        height={50}
                    />
                    <div className="ml-4 text-white">
                        <h4 className="text-sm font-medium">{name}</h4>
                    </div>
                </div>

                <Checkbox disabled={disabled} id={id} onCheckedChange={handleValueChange} checked={defaultChecked} />
            </label>

            {fieldKey && (
                <div className="relative flex items-center justify-center">
                    <Input
                        type="text"
                        name={fieldKey}
                        placeholder={placeholder}
                        className={cn("w-full", {
                            "border-app-success": updateSuccess,
                        })}
                        value={input}
                        onChange={handleInputChange}
                    />
                    <IconButton
                        variant="primary"
                        name="Connect"
                        icon={ArrowRightIcon}
                        className="p-0 absolute top-3 right-2 w-6 h-6"
                        onClick={onUserDataUpdate}
                    />
                </div>
            )}
        </div>
    );
}

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "@/components/Checkbox";
import { useFirebase } from "@/lib/hooks/useFirebase";

export default function NotificationPreferenceRow({
    disabledKeys,
    selection,
    category,
    channels,
    onChange,
    onPushRequest,
}) {
    const [chosenChannels, setChosenChannels] = useState(/** @type {Record<string, boolean>} */ selection);

    const { fcm } = useFirebase();

    const handleChange = (channelId) => async (checked) => {
        if (channelId === "push") {
            const token = checked ? await onPushRequest() : checked;
            setChosenChannels((prev) => {
                const updated = { ...prev };
                updated[channelId] = checked ? !!token : checked;
                return updated;
            });
        } else {
            setChosenChannels((prev) => {
                const updated = { ...prev };
                updated[channelId] = checked;
                return updated;
            });
        }
    };

    useEffect(() => {
        onChange(chosenChannels);
    }, [chosenChannels, onChange]);

    return (
        <tr>
            <td className="uppercase font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                {category.name.toUpperCase()}
            </td>
            {channels.map((channel) => {
                const checked = chosenChannels[channel.id] ?? false;
                return (
                    <td key={`${category.id}_${channel.id}`} className="text-center">
                        <Checkbox
                            className="mx-auto sm:my-4"
                            checked={checked}
                            onCheckedChange={handleChange(channel.id)}
                            disabled={disabledKeys[channel.id]}
                        />
                    </td>
                );
            })}
        </tr>
    );
}

NotificationPreferenceRow.propTypes = {
    channels: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    category: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
    selection: PropTypes.object,
    disabledKeys: PropTypes.object,
    onPushRequest: PropTypes.func.isRequired,
};

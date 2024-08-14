import { useState } from "react";
import PropTypes from "prop-types";
import Switch from "@/components/Switch";

export default function NotificationPreferenceRow({ disabledKeys, selection, category, channels, onChange }) {
    const [chosenChannels, setChosenChannels] = useState(/** @type {Record<string, boolean>} */ selection);

    const handleChange = (channelId) => (checked) => {
        setChosenChannels((prev) => {
            prev[channelId] = checked;
            return prev;
        });
        onChange(chosenChannels);
    };

    return (
        <tr>
            <td className="uppercase font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                {category.name.toUpperCase()}
            </td>
            {channels.map((channel) => {
                const checked = chosenChannels[channel.id] ? chosenChannels[channel.id] : false;
                return (
                    <td key={`${category.id}|${channel.id}`} className="text-center">
                        <Switch
                            checked={checked}
                            onChange={handleChange(channel.id)}
                            disabled={disabledKeys.includes(channel.id)}
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
    disabledKeys: PropTypes.arrayOf(PropTypes.string),
};

import PropTypes from "prop-types";
import { Checkbox } from "@/components/Checkbox";

export default function NotificationPreferenceRow({ disabledKeys, selection, category, channels, onChange }) {
    const handleChange = (channelId) => (checked) => {
        const updated = { ...selection, [channelId]: checked };
        onChange(updated);
        return updated;
    };

    return (
        <tr>
            <td className="uppercase font-bold text-sm text-left sm:py-4 sm:pl-5 sm:pr-2">
                {category.name.toUpperCase()}
            </td>
            {channels.map((channel) => {
                const checked = selection[channel.id] ?? false;
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
};

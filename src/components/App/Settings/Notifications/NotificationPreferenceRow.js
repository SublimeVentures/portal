import { useState } from "react";
import Switch from "@/components/Switch";

export default function NotificationPreferenceRow({ category, channels, onChange }) {
    const [chosenChannels, setChosenChannels] = useState({});

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
            {channels.map((channel) => (
                <td key={`${category}|${channel.id}`} className="text-center">
                    <Switch checked={chosenChannels[channel.id]} onChange={handleChange(channel.id)} />
                </td>
            ))}
        </tr>
    );
}

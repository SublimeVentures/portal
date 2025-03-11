import React, { useState, useEffect } from "react";

const DynamicIcon = ({ name, style, color }) => {
    const [Icon, setIcon] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const icon = (await import(`@/assets/svg/${name}.svg`)).default;
                setIcon(() => icon);
            } catch (error) {
                console.error(`Failed to load icon: ${name}`, error);
            }
        })();
    }, [name]);

    if (!Icon) return null;

    return <Icon className={style} fill={color} />;
};

export default DynamicIcon;

import { Switch } from "@headlessui/react";
import { useState } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/cn";

export default function SwitchGeneric({ checked = false, onChange, disabled = false }) {
    const [isChecked, setChecked] = useState(/** @type {boolean} */ checked);
    const classes = isChecked ? "bg-app-success" : "bg-app-error";
    return (
        <Switch
            checked={isChecked}
            onChange={(val) => {
                setChecked(val);
                onChange(val);
            }}
            className={cn(
                classes,
                { disabled },
                "bg-opacity-70 relative inline-flex h-[32px] w-[68px] outline-0 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-0  focus-visible:ring-white focus-visible:ring-opacity-75",
            )}
        >
            <span
                aria-hidden="true"
                className={`${isChecked ? "translate-x-9" : "translate-x-0"}
             pointer-events-none inline-block -mt-[0px] h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            ></span>
        </Switch>
    );
}

SwitchGeneric.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
};

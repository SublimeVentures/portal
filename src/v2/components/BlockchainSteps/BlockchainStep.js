import React from "react";

import { STEPS_STATE } from "./enums";
import { cn } from "@/lib/cn";

const BlockchainStep = ({ data, icon: Icon }) => {
    const { state } = data;

    return (
        <li>
            <div className="relative h-[43px]">
                <div className="relative flex items-center h-full justify-center w-max gap-3 scale-110">
                    <div
                        className={cn("mx-1.5 flex items-center justify-center w-[31px] h-[31px] rounded-full", {
                            "bg-foreground/[.25]": [STEPS_STATE.PENDING, STEPS_STATE.PROCESSING].includes(state),
                            "bg-gradient-to-b from-[#44DA66] to-[#226D33]": state === STEPS_STATE.SUCCESS,
                            "bg-gradient-to-b from-[#F46F6F] to-[#711D1D]": state === STEPS_STATE.ERROR,
                        })}
                    >
                        <Icon className={cn("p-2 text-gray-200", { "text-foreground": true })} />
                    </div>
                </div>
            </div>
        </li>
    );
};

export default BlockchainStep;

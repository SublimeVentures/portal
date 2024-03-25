import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import DynamicIcon from "@/components/Icon";
import { ICONS } from "@/lib/icons";
import { Tooltiper, TooltipType } from "@/components/Tooltip";
import { STEP_STATE } from "@/components/BlockchainSteps/StepsState";

const getStatusColor = (status) => {
    switch (status) {
        case STEP_STATE.PENDING: {
            return "text-gray";
        }
        case STEP_STATE.PROCESSING: {
            return "text-gold";
        }
        case STEP_STATE.SUCCESS: {
            return "text-app-success";
        }
        case STEP_STATE.ERROR: {
            return "text-app-error";
        }
        default: {
            return "";
        }
    }
};

const BlockchainStep = ({ data }) => {
    const { state, content, icon, iconPadding, error, colorOverride } = data;
    console.log(icon);
    return (
        <>
            <motion.div
                className={`flex flex-row  items-center text-[14px] ${colorOverride ? colorOverride : getStatusColor(state)}`}
                layout
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={state}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={"flex flex-1 gap-3 items-center"}
                    >
                        <div className={`blob relative ${state === STEP_STATE.PROCESSING ? "active" : ""}`}>
                            <DynamicIcon name={icon} style={iconPadding} />
                        </div>

                        <div className={"flex flex-1"}>{content}</div>

                        {state === STEP_STATE.SUCCESS && (
                            <div className="rightIcon">
                                <DynamicIcon name={ICONS.CHECKMARK} style={"p-[2px]"} />
                            </div>
                        )}
                        {state === STEP_STATE.ERROR && (
                            <div
                                className={"rightIcon "}
                                onClick={() => {
                                    if (error?.action) error?.action();
                                }}
                            >
                                <Tooltiper
                                    wrapper={<DynamicIcon name={ICONS.ALERT} style={""} />}
                                    text={`${error?.text}`}
                                    type={TooltipType.Error}
                                />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
            {icon !== ICONS.ROCKET && <div className={"spacer"}></div>}
        </>
    );
};

export default BlockchainStep;

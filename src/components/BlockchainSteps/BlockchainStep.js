import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STEP_STATE } from "./enums";
import DynamicIcon from "@/components/Icon";
import { Tooltiper, TooltipType } from "@/components/Tooltip";
import { ICONS } from "@/lib/icons";
import { cn } from "@/lib/cn";

const colors = {
    [STEP_STATE.PENDING]: "text-gray",
    [STEP_STATE.PROCESSING]: "text-gold",
    [STEP_STATE.SUCCESS]: "text-app-success",
    [STEP_STATE.ERROR]: "text-app-error",
};

const getStatusColor = (status) => colors[status] || "";

const BlockchainStep = ({ data }) => {
    const { state, content, icon, iconPadding, error, colorOverride } = data;
    return (
        <>
            <motion.div className="flex flex-row items-center text-[14px]" layout>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${state}-${icon}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className={cn("flex flex-1 gap-3 items-center", colorOverride ?? getStatusColor(state))}
                    >
                        <div className={cn("blob relative", { active: state === STEP_STATE.PROCESSING })}>
                            <DynamicIcon name={icon} style={iconPadding} />
                        </div>

                        <div className="flex flex-1">{content}</div>

                        {state === STEP_STATE.SUCCESS && (
                            <div className="rightIcon">
                                <DynamicIcon name={ICONS.CHECKMARK} style="p-[2px]" />
                            </div>
                        )}
                        {state === STEP_STATE.ERROR && (
                            <div
                                className="rightIcon "
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
            {icon !== ICONS.ROCKET && <div className="spacer"></div>}
        </>
    );
};

export default BlockchainStep;

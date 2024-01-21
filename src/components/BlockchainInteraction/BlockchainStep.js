import React from "react";
import {AnimatePresence, motion} from "framer-motion";
import DynamicIcon from "@/components/Icon";
import {ICONS} from "@/lib/icons";
import {Tooltiper, TooltipType} from "@/components/Tooltip";
import {v4 as uuidv4} from "uuid";
import {STEP_STATE} from "@/components/BlockchainInteraction/StepsState";

const getStatusColor = (status) => {
    switch (status) {
        case STEP_STATE.Waiting: {
            return 'text-gray'
        }
        case STEP_STATE.Processing: {
            return 'text-gold'
        }
        case STEP_STATE.Executed: {
            return 'text-app-success'
        }
        case STEP_STATE.Failed: {
            return 'text-app-error'
        }
        default: {
            return ''
        }
    }
}


const BlockchainStep = ({data}) => {
    const {state, content, icon, iconPadding, error, colorOverride} = data
    console.log("BIX step detail",data)
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
                        <div className={`blob relative ${state === STEP_STATE.Processing ? 'active' : ''}`}>
                            <DynamicIcon name={icon} style={iconPadding}/>
                        </div>

                        <div className={"flex flex-1"}>{content}</div>

                        {state === STEP_STATE.Executed && <div className={"rightIcon "}><DynamicIcon name={ICONS.CHECKMARK} style={"p-[2px]"}/></div>}
                        {state === STEP_STATE.Failed && <div className={"rightIcon "} onClick={()=> {if(error?.action) error?.action()} }><Tooltiper wrapper={<DynamicIcon name={ICONS.ALERT} style={""}/>} text={`${error?.text}`} type={TooltipType.Error}/></div>}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
            {icon !== ICONS.ROCKET && <div className={"spacer"}></div> }
        </>
    );
};

export default BlockchainStep;

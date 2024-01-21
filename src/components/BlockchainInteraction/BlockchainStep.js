import React, { memo} from "react";
import useGetTokenBalance from "@/lib/hooks/useGetTokenBalance";
import {AnimatePresence, motion} from "framer-motion";
import DynamicIcon from "@/components/Icon";
import {ICONS} from "@/lib/icons";
import {Tooltiper, TooltipType} from "@/components/Tooltip";
import {getStatusColor, Transaction} from "@/components/App/BlockchainSteps/config";
import {v4 as uuidv4} from "uuid";

const Transaction = {
    Waiting: 0,
    Processing: 1,
    Executed: 2,
    Failed: 3,
}


const getStatusColor = (status) => {
    switch (status) {
        case Transaction.Waiting: {
            return 'text-gray'
        }
        case Transaction.Processing: {
            return 'text-gold'
        }
        case Transaction.Executed: {
            return 'text-app-success'
        }
        case Transaction.PrecheckFailed:
        case Transaction.Failed: {
            return 'text-app-error'
        }
        default: {
            return ''
        }
    }
}


const BlockchainStep = (state, data, error, colorOverride) => {
    const transactionId = uuidv4();
    const {content, icon, iconPadding} = data
    const {errorText, errorAction} = error

    return (
        <>
            <motion.div
                className={`flex flex-row  items-center text-[14px] ${colorOverride ? colorOverride : getStatusColor(state)}`}
                layout
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={transactionId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className={"flex flex-1 gap-3 items-center"}
                    >
                        <div className={`blob relative ${state === Transaction.Processing ? 'active' : ''}`}>
                            <DynamicIcon name={icon} style={iconPadding}/>
                        </div>

                        <div className={"flex flex-1"}>{content}</div>

                        {state === Transaction.Executed && <div className={"rightIcon "}><DynamicIcon name={ICONS.CHECKMARK} style={"p-[2px]"}/></div>}
                        {state === Transaction.Failed && <div className={"rightIcon "} onClick={()=> {if(errorAction) errorAction()} }><Tooltiper wrapper={<DynamicIcon name={ICONS.ALERT} style={""}/>} text={`${errorText}`} type={TooltipType.Error}/></div>}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
            {icon !== ICONS.ROCKET && <div className={"spacer"}></div> }
        </>
    );
};

export default BlockchainStep;

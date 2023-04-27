import { Tooltip } from 'react-tooltip';
import {useState} from "react";

export const TooltipType = {
    Success: 'app-success',
    Error: 'app-error',
    Accent: 'app-accent2',
}

export function Tooltiper({wrapper, text, type}) {
    const [id] = useState(() => `component-${Math.random().toString(16).slice(2)}`)

    return (
        <div className={"inline-block tooltip"}>
            <a id={id} className={`text-${type} cursor-pointer`}>{wrapper}</a>
            <Tooltip
                anchorSelect={`#${id}`}
                className={`basic bg-app-accent2`}
                content={text}
            />
        </div>
    )
}

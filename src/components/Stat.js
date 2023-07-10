import {is3VC} from "@/lib/utils";

function Stat({color, title, value, icon}) {
    return (
        <div className={`stat ${color} flex flex-1 ${is3VC ? "rounded" :""}`}>
            <div className={"icon"}>{icon}</div>
            <div className={" text-right"}>
                <div className={`title ${is3VC ? "" : "font-accent text-xs"}`}>{title}</div>
                <div className={"glowNormal font-bold uppercase text-xl"}>{value}</div>
            </div>

        </div>
    )
}

export default Stat

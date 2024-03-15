import { isBased } from "@/lib/utils";

function Stat({ color, title, value, icon }) {
    return (
        <div
            className={`stat ${color} flex flex-1 ${isBased ? "rounded" : ""}`}
        >
            <div className={"icon"}>{icon}</div>
            <div className={" text-right"}>
                <div
                    className={`title ${isBased ? "" : "font-accent text-xs"}`}
                >
                    {title}
                </div>
                <div className={"glowNormal font-bold uppercase text-xl"}>
                    {value}
                </div>
            </div>
        </div>
    );
}

export default Stat;

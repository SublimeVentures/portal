import {is3VC} from "@/lib/utils";

export default function RoundSpacer({title, subtitle, action}) {
    return (
        <div className={`
                   ${is3VC ? "rounded-xl" : ""} bg-app-accent banner
                   flex flex-1 flex-wrap items-center justify-between
                   px-10 py-5 gap-5
                   `}>
                <div className={"flex flex-col"}>
                    <div className={`text-3xl font-bold mb-2 mt-2 ${is3VC ? "" : "font-accent uppercase font-light"}`}>{ title }</div>
                    <div>{ subtitle }</div>
                </div>
                <div className="flex md:ml-auto">
                    {action}
                </div>
        </div>

    )
}

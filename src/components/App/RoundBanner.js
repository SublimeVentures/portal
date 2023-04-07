
export default function RoundBanner({title, subtitle, action}) {
    return (
        <div className="rounded-xl bg-app-accent flex flex-1 banner items-center flex items-stretch">
            <div className="m-10 ml-12 flex flex-col items-start max-w-[70%] relative flex flex-1">
                <div className="text-3xl font-bold mb-2 mt-2">{ title }</div>
                <div>{ subtitle }</div>
                <div className="mt-auto -ml-1 mt-5">
                    {action}
                </div>
            </div>
        </div>

    )
}

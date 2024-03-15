export default function NotificationsSetting({}) {
    // let {image, name, starts, ends} = offer

    return (
        <>
            <div className="flex flex-col rounded-xl bg-navy-accent p-5 gap-1 justify-start flex-1">
                <div className="text-xl uppercase font-medium text-outline mb-2">
                    CHANNELS
                </div>

                <div className="flex ">
                    <div className="flex-1 ">E-MAIL</div>
                    <div className="tabular-nums">$0,23</div>
                </div>
                <div className="flex ">
                    <div className="flex-1 ">WEB PUSH</div>
                    <div className="tabular-nums">$LNDX</div>
                </div>

                <div className="flex ">
                    <div className="flex-1 ">SMS</div>
                    <div className="tabular-nums">$0,50</div>
                </div>
                <div className="flex text-app-success">
                    <div className="flex-1 ">DISCORD</div>
                    <div className="tabular-nums">+117%</div>
                </div>
            </div>
            <div className="flex flex-col rounded-xl bg-navy-accent p-5 gap-1 justify-start flex-1 ">
                <div className="text-xl uppercase font-medium text-outline mb-2">
                    NOTIFICATIONS
                </div>

                <div className="flex ">
                    <div className="flex-1 ">ANNOUNCEMENTS</div>
                    <div className="">$550 000</div>
                </div>
                <div className="flex ">
                    <div className="flex-1 ">NEW OPPORTUNITY</div>
                    <div className="">$350 000</div>
                </div>
                <div className="flex text-app-success mb-1">
                    <div className="flex-1 ">CLAIMABLE</div>
                    <div className="">$35 000</div>
                </div>
            </div>
        </>
    );
}

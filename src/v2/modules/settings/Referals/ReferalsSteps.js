import Copy from "@/v2/components/Copy";

export default function ReferalsSteps() {
    return (
        <div className="rounded opacity-100 steps-gradient mt-8 py-12 px-9 flex flex-col">
            <div className="flex">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 opacity-100 step-gradient flex items-center justify-center rounded-3xl text-white text-sm">
                        1
                    </div>
                    <div className="h-10 bg-gray-500 w-px my-7" />
                    <div className="w-8 h-8 opacity-100 step-gradient flex items-center justify-center rounded-3xl text-white text-sm">
                        2
                    </div>
                    <div className="h-10 bg-gray-500 w-px my-7" />
                    <div className="w-8 h-8 opacity-100 step-gradient flex items-center justify-center rounded-3xl text-white text-sm">
                        3
                    </div>
                </div>
                <div>
                    <div className="px-10 h-32">
                        <div className="text-nowrap text-md md:text-2xl text-foreground">Send invitation</div>
                        <div className="text-md text-[#C4C4C4] whitespace-pre-line font-light">
                            Send your referral link to your friends.
                        </div>
                    </div>
                    <div className="px-10 h-32">
                        <div className="text-nowrap text-md md:text-2xl text-foreground">Register and trade</div>
                        <div className="text-md text-[#C4C4C4] whitespace-pre-line font-light">
                            Let them register and trade through your ID.
                        </div>
                    </div>
                    <div className="px-10 h-32">
                        <div className="text-nowrap text-md md:text-2xl text-foreground">Earn Rewrds</div>
                        <div className="text-md text-[#C4C4C4] whitespace-pre-line font-light">
                            Once they trade, you both will recieve the rewards.
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-xl py-2 font-light text-foreground hover:bg-primary/[.5] rounded cursor-pointer bg-primary-light-gradient flex justify-center">
                <Copy text={"0x12d...560eF/based.VC"} />
            </div>
        </div>
    );
}

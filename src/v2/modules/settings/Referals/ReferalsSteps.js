import Copy from "@/v2/components/Copy";

const Title = ({ children }) => <div className="text-nowrap text-sm md:text-base text-foreground">{children}</div>;
const Description = ({ children }) => (
    <div className="text-xs md:text-sm text-[#C4C4C4] whitespace-pre-line font-light">{children}</div>
);
const Bullet = ({ children }) => (
    <div className="w-8 h-8 opacity-100 step-gradient flex items-center justify-center rounded-3xl text-white text-xs md:text-sm">
        {children}
    </div>
);

export default function ReferalsSteps() {
    return (
        <div className="rounded opacity-100 steps-gradient mt-8 py-12 px-9 flex flex-col">
            <div className="flex">
                <div className="flex flex-col items-center">
                    <Bullet>1</Bullet>
                    <div className="h-5 md:h-10 bg-gray-500 w-px my-7" />
                    <Bullet>2</Bullet>
                    <div className="h-5 md:h-10 bg-gray-500 w-px my-7" />
                    <Bullet>3</Bullet>
                </div>
                <div>
                    <div className="px-10 h-26 md:h-32">
                        <Title>Send invitation</Title>
                        <Description>Send your referral link to your friends.</Description>
                    </div>
                    <div className="px-10 h-26 md:h-32">
                        <Title>Register and trade</Title>
                        <Description>Let them register and trade through your ID.</Description>
                    </div>
                    <div className="px-10 h-26 md:h-32">
                        <Title>Earn Rewrds</Title>
                        <Description>Once they trade, you both will recieve the rewards.</Description>
                    </div>
                </div>
            </div>

            <div className="text-base font-normal py-2 text-foreground hover:bg-primary/[.5] rounded cursor-pointer bg-primary-light-gradient flex justify-center">
                <Copy text={"0x12d...560eF/based.VC"} />
            </div>
        </div>
    );
}

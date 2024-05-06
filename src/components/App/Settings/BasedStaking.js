import InlineCopyButton from "@/components/Button/InlineCopyButton";

export default function BasedStaking({ stakingProps }) {
    const { session } = stakingProps;
    return (
        <div className={`rounded-xl boxshadow relative offerWrap flex flex-1 max-w-[600px]`}>
            <div className={` rounded-xl relative bg-navy-accent flex flex-1 flex-col p-5 `}>
                <div className="font-bold text-2xl flex items-center glowNormal mb-4">
                    <div className={"flex flex-1"}>IDENTITY</div>
                    {/*<a href={ExternalLinks.STAKING} target={"_blank"}>*/}
                    {/*    <IconButton zoom={1.1} size={'w-8'} icon={<IconInfo/>} noBorder={true}/>*/}
                    {/*</a>*/}
                </div>
                <div className="detailRow">
                    <p>ACCOUNT ID</p>
                    <hr className="spacer" />
                    <p className="flex gap-1 justify-end items-center">
                        <span>{session.accountId}</span>
                        <InlineCopyButton copiable={session.accountId} />
                    </p>
                </div>
                <div className={"flex flex-1 justify-center items-center"}>Staking available soon</div>
            </div>
        </div>
    );
}

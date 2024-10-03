import Notifications from "./Notifications";
import Staking from "./Staking";
import Wallet from "./Wallet";

export default function General({ session, wallets }) {
    return (
        <div className="mb-4 md:mb-12 flex flex-col gap-4 xl:mb-0 xl:h-full xl:overflow-hidden xl:grid xl:grid-cols-[440px_1fr] xl:grid-rows-1 xl:gap-8 3xl:grid-cols-[520px_1fr]">
            <div className="order-2 flex flex-col h-full overflow-hidden xl:order-1 xl:shrink-0">
                <Notifications />
            </div>
            <div className="order-1 flex flex-col gap-4 xl:pb-0 xl:order-2 xl:gap-8">
                <div className="flex flex-col shrink-0 overflow-hidden">
                    <Staking session={session} />
                </div>
                <Wallet wallets={wallets} />
            </div>
        </div>
    );
}

import Notifications from "./Notifications";
import Staking from "./Staking";
import Wallet from "./Wallet";

export default function General({ session, wallets }) {
    return (
        <div className="flex flex-col gap-4 2xl:gap-x-8 2xl:gap-y-0 2xl:grid 2xl:grid-cols-3 2xl:h-full">
            <div className="2xl:row-span-12">
                <Notifications />
            </div>
            <div className="2xl:row-span-1 2xl:col-span-2">
                <Staking session={session} />
            </div>
            <div className="2xl:row-span-11 2xl:col-span-2">
                <Wallet wallets={wallets} />
            </div>
        </div>
    );
};

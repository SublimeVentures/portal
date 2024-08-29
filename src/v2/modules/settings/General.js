import Notifications from "./Notifications";
import Staking from "./Staking";
import Wallet from "./Wallet";

export default function General({ session, wallets }) {
    return (
        <div className="grid grid-cols-1 gap-y-5 sm:gap-5 h-full box-border sm:grid-cols-3 grid-rows-[auto_1fr]">
            <div className="bg-gray-800 rounded-lg sm:row-span-2">
                <Notifications />
            </div>
            <div className="bg-gray-800 rounded-lg sm:col-span-2">
                <Staking session={session} />
            </div>
            <div className="bg-gray-800 rounded-lg sm:col-span-2 h-full">
                <Wallet wallets={wallets} />
            </div>
        </div>
    );
}

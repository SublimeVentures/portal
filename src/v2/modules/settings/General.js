import Notifications from "./Notifications";
import Staking from "./Staking";
import Wallet from "./Wallet";

export default function General({ session, wallets }) {
    return (
        <div className="grid grid-cols-1 gap-y-5 2xl:gap-5 h-full box-border 2xl:grid-cols-3">
            <div className="bg-gray-800 rounded-lg col-span-1 md:col-span-1 md:row-span-2">
                <Notifications />
            </div>
            <div className="bg-gray-800 rounded-lg col-span-1 md:col-span-2">
                <Staking session={session} />
            </div>
            <div className="bg-gray-800 rounded-lg col-span-1 md:col-span-2">
                <Wallet wallets={wallets} />
            </div>
        </div>
    );
}

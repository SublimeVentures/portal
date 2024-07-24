import Notifications from "./Notifications";
import Staking from "./Staking";
import Wallet from "./Wallet";

export default function General({ session, wallets }) {
    return (
        <div class="grid grid-cols-1 gap-5 h-full box-border 2xl:grid-cols-3">
          <div class="bg-gray-800 p-2 rounded-lg col-span-1 md:col-span-1 md:row-span-2">
              <Notifications />
          </div>
          <div class="bg-gray-800 p-2 rounded-lg col-span-1 md:col-span-2">
              <Staking session={session} />
          </div>
          <div class="bg-gray-800 p-2 rounded-lg col-span-1 md:col-span-2">
              <Wallet wallets={wallets} />
          </div>
        </div>
    );
};

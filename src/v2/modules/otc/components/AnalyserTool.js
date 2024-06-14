import ChainsList from "@/v2/components/App/Vault/ChainsList";
import LinkIcon from "@/v2/assets/svg/link.svg";
import BalanceIcon from "@/v2/assets/svg/balance.svg";
import AccountBalanceIcon from "@/v2/assets/svg/account-balance.svg";
import PriorityIcon from "@/v2/assets/svg/priority.svg";
import RocketLaunchIcon from "@/v2/assets/svg/rocket.svg";

export default function AnalyserTool() {
    return (
        <div className="mb-2 mt-4 py-4 px-8 flex flex-col items-center gap-4 bg-foreground/[.02] rounded">
            <h3 className="text-2xl font-medium text-foreground text-center">Analyser Tool</h3>
            <p className="mb-2 text-md text-foreground text-center">This will guide you through each step for a seamless purchase</p>
            <ChainsList chains={analyserToolList} />
        </div>
    )
}

const analyserToolList = [
  {
      name: "link",
      icon: LinkIcon,
  },
  {
      name: "balance",
      icon: BalanceIcon,
  },
  {
      name: "account-balance",
      icon: AccountBalanceIcon,
  },
  {
      name: "priority",
      icon: PriorityIcon,
  },
  {
      name: "rocket-launch",
      icon: RocketLaunchIcon,
  },
];

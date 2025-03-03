import Link from "next/link";
import Sidebar from "@/components/Navigation/Sidebar";
import routes from "@/routes";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { cn } from "@/lib/cn";
import { logOut } from "@/fetchers/auth.fetcher";

const alertHeight = "60px";

export default function LayoutApp({ children }) {
    const { currencyStaking, activeCurrencyStaking } = useEnvironmentContext();
    const stakingEnabled = children.props?.session.stakingEnabled;
    const isStaked = children.props?.session.isStaked;
    const stakingCurrency = activeCurrencyStaking ? activeCurrencyStaking : currencyStaking[0];
    const { account } = useEnvironmentContext();

    const isBlockedAlert = stakingEnabled && !isStaked;
    const isDifferentAccount = !isBlockedAlert && account.address !== children.props?.session.stakedOn;

    const BlockedAlert = () => (
        <div className="fixed top-0 flex items-center justify-center bg-app-error uppercase text-white font-accent z-[100000] w-full text-center px-5 h-[var(--alertHeight)]">
            Investments are blocked!&nbsp;
            <u>
                <Link href={routes.Settings}>Stake {stakingCurrency?.symbol} to unlock</Link>.
            </u>
        </div>
    );

    const DifferentAccountAlert = () => (
        <div className="fixed top-0 flex items-center justify-center bg-app-accent uppercase text-white font-accent z-[100000] w-full text-center px-5 h-[var(--alertHeight)]">
            Your tokens are staked on another account!&nbsp;
            <button className="underline" onClick={() => logOut()}>
                Logout and choose a wallet with staked tokens.
            </button>
        </div>
    );

    // noinspection JSValidateTypes / JS does not validate custom vars
    return (
        <div style={{ "--alertHeight": alertHeight }}>
            {isBlockedAlert && <BlockedAlert />}
            {isDifferentAccount && <DifferentAccountAlert />}
            <div
                className={cn(
                    "flex flex-col collap:flex-row bg-app-bg",
                    isBlockedAlert || isDifferentAccount
                        ? "min-h-[calc(100vh_-_var(--alertHeight))] mt-[var(--alertHeight)]"
                        : "min-h-screen",
                )}
            >
                <div
                    className={cn(
                        "sticky top-0 z-20",
                        isBlockedAlert || isDifferentAccount
                            ? "max-h-[calc(100vh_-_var(--alertHeight))] top-[var(--alertHeight)]"
                            : "max-h-screen",
                    )}
                >
                    <Sidebar session={children.props?.session} />
                </div>
                <main className="flex flex-col w-full grow sm:min-h-full max-w-[1920px] p-5 mobile:p-10 gap-5 mobile:gap-10 text-app-white">
                    {children}
                </main>
            </div>
        </div>
    );
}

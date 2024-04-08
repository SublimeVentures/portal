import Link from "next/link";
import Sidebar from "@/components/Navigation/Sidebar";
import routes from "@/routes";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { cn } from "@/lib/cn";

const alertHeight = "60px";

export default function LayoutApp({ children }) {
    const { currencyStaking, activeCurrencyStaking } = useEnvironmentContext();
    const stakingEnabled = children.props?.session.stakingEnabled;
    const isStaked = children.props?.session.isStaked;
    const stakingCurrency = activeCurrencyStaking ? activeCurrencyStaking : currencyStaking[0];

    const isBlockedAlert = stakingEnabled && !isStaked;

    return (
        <div style={{ "--alertHeight": alertHeight }}>
            {isBlockedAlert && (
                <div
                    className={`fixed top-0 flex items-center justify-center bg-app-error uppercase text-white font-accent z-[100000] w-full text-center px-5 h-[var(--alertHeight)]`}
                >
                    Investments are blocked!&nbsp;
                    <u>
                        <Link href={routes.Settings}>Stake {stakingCurrency?.symbol} to unlock</Link>.
                    </u>
                </div>
            )}

            <div
                className={cn(
                    "flex flex-col collap:flex-row bg-app-bg",
                    isBlockedAlert
                        ? "min-h-[calc(100vh_-_var(--alertHeight))] mt-[var(--alertHeight)]"
                        : "min-h-screen",
                )}
            >
                <Sidebar session={children.props?.session} />
                <main className="flex flex-col w-full grow sm:min-h-full max-w-[1920px] p-5 mobile:p-10 gap-5 mobile:gap-10 text-app-white">
                    {children}
                </main>
            </div>
        </div>
    );
}

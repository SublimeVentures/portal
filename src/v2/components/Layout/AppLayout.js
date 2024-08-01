import { Sidebar, Navbar, Header, TabletNavbar } from "@/v2/components/Layout";
import { BlockedAlert } from "@/v2/components/Alert";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import WalletErrorModal from "@/v2/components/Modal/WalletErrorModal";
import { cn } from "@/lib/cn";
import ChainListModal from "@/v2/components/Modal/ChainListModal";

export const layoutStyles = {
    "--navbarHeight": "100px",
    "--alertHeight": "60px",
    // "--headerHeight": "100px",
    "--sidebarWidth": "260px",
};

const DesktopLayout = ({ children, isBlockedAlert, title, bg }) => {
    return (
        <div className={cn("hidden h-full grow 2xl:flex", { "mt-[var(--alertHeight)]": isBlockedAlert })}>
            <Sidebar session={children.props?.session} isBlockedAlert={isBlockedAlert} />
            <div className="flex grow pl-[var(--sidebarWidth)] ml-0 m-6">
                <div
                    className={cn(
                        "grow bg-[#05060B] rounded-[33px] md:overflow-y-auto 2x:overflow-y-hidden",
                        {
                            "max-h-[calc(100vh_-_theme('spacing.12'))]": !isBlockedAlert,
                            "max-h-[calc(100vh_-_theme('spacing.12')_-_var(--alertHeight))]": isBlockedAlert,
                        },
                        bg,
                    )}
                >
                    <main className="py-12 px-16 flex flex-col w-full h-full">
                        <Header title={title} />
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

const TabletLayout = ({ children, isBlockedAlert }) => {
    return (
        <div
            className={cn("hidden p-4 flex-col gap-4 h-full grow md:flex 2xl:hidden", {
                "mt-[var(--alertHeight)]": isBlockedAlert,
            })}
        >
            <Header isBlockedAlert={isBlockedAlert} />
            <TabletNavbar />

            <div
                className={cn("grow bg-[#05060B] rounded-[33px] md:overflow-y-auto 2x:overflow-y-hidden", {
                    "max-h-[calc(100vh_-_theme('spacing.12'))]": !isBlockedAlert,
                    "max-h-[calc(100vh_-_theme('spacing.12')_-_var(--alertHeight))]": isBlockedAlert,
                })}
            >
                <main className="flex flex-col w-full h-full">{children}</main>
            </div>
        </div>
    );
};

const MobileLayout = ({ children, isBlockedAlert }) => {
    return (
        <div className="relative">
            <div className="block mt-[var(--alertHeight)] h-[calc(100vh_-_var(--navbarHeight)_-_var(--alertHeight))] relative rounded-b-lg overflow-hidden md:hidden">
                <div className="z-10 p-4 h-full bg-[#071321] overflow-hidden sm:px-8">
                    <Header isBlockedAlert={isBlockedAlert} />
                    <main className="relative z-10 h-full mobile-scrollbar overflow-y-scroll">{children}</main>
                </div>

                <div className="absolute z-20 bottom-0 h-8 w-full bg-navbar-gradient " />
            </div>

            <Navbar />
        </div>
    );
};

export default function LayoutApp({ children, title }) {
    const { currencyStaking, activeCurrencyStaking } = useEnvironmentContext();
    const stakingEnabled = children.props?.session.stakingEnabled;
    const isStaked = children.props?.session.isStaked;
    const stakingCurrency = activeCurrencyStaking ? activeCurrencyStaking : currencyStaking[0];

    const isBlockedAlert = stakingEnabled && !isStaked;

    return (
        <div
            style={{ ...layoutStyles, "--alertHeight": isBlockedAlert ? layoutStyles["--alertHeight"] : "0px" }}
            className="relative min-h-screen h-full w-full flex flex-col bg-[#082536]"
        >
            <WalletErrorModal session={children.props?.session} />
            {isBlockedAlert && <BlockedAlert currency={stakingCurrency?.symbol} />}
            <ChainListModal />
            <MobileLayout isBlockedAlert={isBlockedAlert}>{children}</MobileLayout>
            <TabletLayout isBlockedAlert={isBlockedAlert}>{children}</TabletLayout>
            <DesktopLayout isBlockedAlert={isBlockedAlert} title={title}>
                {children}
            </DesktopLayout>
        </div>
    );
}

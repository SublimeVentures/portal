import { Sidebar, Navbar, Header, TabletNavbar } from "@/v2/components/Layout";
import { BlockedAlert } from "@/v2/components/Alert";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import WalletErrorModal from "@/v2/components/Modal/WalletErrorModal";
import { cn } from "@/lib/cn";
import ChainListModal from "@/v2/components/Modal/ChainListModal";

export const layoutStyles = {
    "--navbarHeight": "100px",
    "--alertHeight": "50px",
    "--headerHeight": "100px",
    "--sidebarWidth": "260px",
};

const DesktopLayout = ({ children, isBlockedAlert, title, className }) => {
    return (
        <div className={cn("hidden h-full grow 2xl:flex", { "mt-[var(--alertHeight)]": isBlockedAlert })}>
            <Sidebar session={children.props?.session} isBlockedAlert={isBlockedAlert} />
            <div className="m-6 ml-0 flex grow pl-[var(--sidebarWidth)]">
                <div
                    className={cn("grow bg-[#05060B] rounded-[33px] overflow-y-auto page-scrollbar", {
                        "max-h-[calc(100vh_-_theme('spacing.12'))]": !isBlockedAlert,
                        "max-h-[calc(100vh_-_theme('spacing.12')_-_var(--alertHeight))]": isBlockedAlert,
                    })}
                >
                    <main className={cn("py-12 px-16 flex flex-col w-full h-max", className)}>
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
            className={cn("hidden flex-col gap-4 h-full grow md:flex 2xl:hidden", {
                "mt-[var(--alertHeight)]": isBlockedAlert,
            })}
        >
            <div className="px-4">
                <Header isBlockedAlert={isBlockedAlert} />
                <TabletNavbar />
            </div>

            <div
                className={cn("grow bg-[#05060B] rounded-t-[33px] overflow-y-auto page-scrollbar h-max p-12", {
                    "h-[calc(100vh_-_theme('spacing.16')_-_var(--headerHeight))]": !isBlockedAlert,
                    "h-[calc(100vh_-_theme('spacing.16')_-_var(--alertHeight)_-_var(--headerHeight))]": isBlockedAlert,
                })}
            >
                <main className="flex flex-col w-full">{children}</main>
            </div>
        </div>
    );
};

const MobileLayout = ({ children, isBlockedAlert, className }) => {
    return (
        <div className="relative">
            <div className="flex flex-col mt-[var(--alertHeight)] h-[calc(100vh_-_var(--navbarHeight)_-_var(--alertHeight))] relative rounded-b-lg overflow-hidden md:hidden">
                <div className="pb-16 px-4 z-10 grow bg-[#071321] page-scrollbar overflow-y-auto sm:px-8">
                    <Header isBlockedAlert={isBlockedAlert} />
                    <main className={cn("relative z-10", className)}>{children}</main>
                </div>

                <div className="absolute z-10 bottom-0 h-8 w-full bg-navbar-gradient " />
            </div>

            <Navbar />
        </div>
    );
};

export default function LayoutApp({ children, title, contentClassName }) {
    const { currencyStaking, activeCurrencyStaking } = useEnvironmentContext();
    const stakingEnabled = children.props?.session.stakingEnabled;
    const isStaked = children.props?.session.isStaked;
    const stakingCurrency = activeCurrencyStaking ? activeCurrencyStaking : currencyStaking[0];

    const isBlockedAlert = stakingEnabled && !isStaked;

    return (
        <div
            style={{ ...layoutStyles, "--alertHeight": isBlockedAlert ? layoutStyles["--alertHeight"] : "0px" }}
            className={cn("relative min-h-screen h-full w-full flex flex-col bg-[#082536]")}
        >
            {isBlockedAlert && <BlockedAlert currency={stakingCurrency?.symbol} />}
            <MobileLayout isBlockedAlert={isBlockedAlert} className={contentClassName}>{children}</MobileLayout>
            <TabletLayout isBlockedAlert={isBlockedAlert}>{children}</TabletLayout>
            <DesktopLayout isBlockedAlert={isBlockedAlert} title={title} className={contentClassName}>{children}</DesktopLayout>

            {/* <WalletErrorModal session={children.props?.session} /> */}
            {/* <ChainListModal /> */}
        </div>
    );
}

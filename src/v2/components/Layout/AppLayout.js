import { Sidebar, Navbar, Header, TabletNavbar } from "@/v2/components/Layout";
import { BlockedAlert } from "@/v2/components/Alert";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import WalletErrorModal from "@/v2/components/Modal/WalletErrorModal";
import { cn } from "@/lib/cn";
import ChainListModal from "@/v2/components/Modal/ChainListModal";

export const layoutStyles = {
    "--navbarHeight": "100px",
    "--alertHeight": "60px",
    "--headerHeight": "100px",
    "--sidebarWidth": "260px",
};

const DesktopLayout = ({ children, isBlockedAlert, title, className }) => {
    return (
        <>
            <Sidebar session={children.props?.session} isBlockedAlert={isBlockedAlert} className="w-60" />
            <div className="grow lg:p-3 3xl:p-7 lg:pl-60 3xl:pl-60 overflow-hidden h-screen box-border">
                <main className="bg-[#05060B] lg:rounded-2xl 3xl:rounded-4xl w-full h-full flex flex-col lg:gap-6 3xl:gap-8 lg:px-9 3xl:px-18 lg:pt-6 3xl:pt-12">
                    <Header title={title} />
                    {children}
                </main>
            </div>
        </>
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
        <div className={cn("bg-gradient angle-30 to-[#082536] from-[#0A1728] flex")}>
            {isBlockedAlert && <BlockedAlert currency={stakingCurrency?.symbol} />}
            {/* <MobileLayout isBlockedAlert={isBlockedAlert} className={contentClassName}>{children}</MobileLayout> */}
            {/* <TabletLayout isBlockedAlert={isBlockedAlert}>{children}</TabletLayout> */}
            <DesktopLayout isBlockedAlert={isBlockedAlert} title={title} className={contentClassName}>
                {children}
            </DesktopLayout>

            <WalletErrorModal session={children.props?.session} />
            <ChainListModal />
        </div>
    );
}

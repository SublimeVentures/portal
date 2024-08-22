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
            <div className="px-4 pt-4 flex flex-col gap-4 lg:hidden">
                <Header isBlockedAlert={isBlockedAlert} />
                <TabletNavbar />
            </div>
            <Sidebar
                session={children.props?.session}
                isBlockedAlert={isBlockedAlert}
                className="hidden lg:flex w-60"
            />
            <div className="grow sm:p-4 lg:p-3 3xl:p-7 lg:pl-60 3xl:pl-60 overflow-hidden lg:h-screen box-border">
                <main className="sm:bg-[#05060B] sm:rounded-2xl 3xl:rounded-4xl w-full h-full flex flex-col overflow-y-auto lg:overflow-auto lg:gap-6 3xl:gap-8 sm:py-4 lg:py-0 sm:px-9 lg:px-9 3xl:px-18 lg:pt-6 3xl:pt-12">
                    <Header title={title} className="hidden lg:flex" />
                    {children}
                </main>
            </div>
            <Navbar />
        </>
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
            className={cn(
                "bg-[#05060B] sm:bg-gradient angle-30 to-[#082536] from-[#0A1728] flex flex-col lg:flex-row h-screen relative",
            )}
        >
            {isBlockedAlert && <BlockedAlert currency={stakingCurrency?.symbol} />}
            {/* <MobileLayout isBlockedAlert={isBlockedAlert} className={contentClassName}>{children}</MobileLayout> */}
            <DesktopLayout isBlockedAlert={isBlockedAlert} title={title} className={contentClassName}>
                {children}
            </DesktopLayout>

            <WalletErrorModal session={children.props?.session} />
            <ChainListModal />
        </div>
    );
}

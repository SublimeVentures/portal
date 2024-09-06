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

const DesktopLayout = ({ children, isBlockedAlert, title, contentClassName }) => {
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
            <div className="grow mb-24 sm:mb-0 sm:p-4 lg:p-3 3xl:p-7 lg:pl-60 3xl:pl-60 overflow-hidden lg:h-screen box-border">
                <main
                    className={cn(
                        "sm:bg-primary-950 sm:rounded-2xl 3xl:rounded-4xl w-full h-full flex flex-col overflow-y-auto lg:overflow-auto gap-4 lg:gap-6 3xl:gap-8 p-4 pb-8 sm:py-4 lg:py-0 sm:px-9 lg:px-9 3xl:px-18 lg:pt-6 3xl:pt-12",
                        contentClassName,
                    )}
                >
                    <Header title={title} className="hidden lg:flex" />
                    {children}
                </main>
            </div>
            <Navbar />
        </>
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
                "bg-primary-950 sm:bg-gradient angle-30 to-primary-800 from-primary-900 flex flex-col lg:flex-row h-screen relative",
            )}
        >
            {isBlockedAlert && <BlockedAlert currency={stakingCurrency?.symbol} />}
            <DesktopLayout isBlockedAlert={isBlockedAlert} title={title} contentClassName={contentClassName}>
                {children}
            </DesktopLayout>

            <WalletErrorModal session={children.props?.session} />
            <ChainListModal />
        </div>
    );
}

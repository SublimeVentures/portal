import { Sidebar, MobileHeader, Navbar, DesktopHeader } from "@/v2/components/Layout";
import { BlockedAlert } from "@/v2/components/Alert";
import useMediaQuery, { breakpoints } from "@/v2/hooks/useMediaQuery";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { cn } from "@/lib/cn";
export const layoutStyles = {
    "--alertHeight": "60px",
    "--headerHeight": "100px",
    "--sidebarWidth": "260px",
    "--navbarHeight": "100px",
};

const MobileLayout = ({ children, isBlockedAlert }) => {
    return (
        <>
            <div className="relative mt-[var(--alertHeight)] h-[calc(100vh_-_var(--navbarHeight)_-_var(--alertHeight))] rounded-b-lg overflow-hidden">
                <div className="z-10 px-4 py-8 h-full bg-[#071321] overflow-y-auto">
                    <MobileHeader isBlockedAlert={isBlockedAlert} />
                    <main className="relative z-10">{children}</main>
                </div>

                <div className="absolute z-20 bottom-0 h-8 w-full bg-navbar-gradient" />
            </div>

            <Navbar />
        </>
    );
};

const DesktopLayout = ({ children, isBlockedAlert, title }) => {
    return (
        <div className={cn("flex h-full grow", { "mt-[var(--alertHeight)]": isBlockedAlert })}>
            <Sidebar session={children.props?.session} isBlockedAlert={isBlockedAlert} />

            <div className="flex grow pl-[var(--sidebarWidth)] ml-0 m-6">
                <div
                    className={cn("grow bg-[#05060B] rounded-[33px] md:overflow-y-auto 2x:overflow-y-hidden", {
                        "max-h-[calc(100vh_-_theme('spacing.12'))]": !isBlockedAlert,
                        "max-h-[calc(100vh_-_theme('spacing.12')_-_var(--alertHeight))]": isBlockedAlert,
                    })}
                >
                    <main className="flex flex-col w-full h-full">
                        <DesktopHeader title={title} />
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default function LayoutApp({ children, title }) {
    const isDesktop = useMediaQuery(breakpoints.md);

    const { currencyStaking, activeCurrencyStaking } = useEnvironmentContext();
    const stakingEnabled = children.props?.session.stakingEnabled;
    const isStaked = children.props?.session.isStaked;
    const stakingCurrency = activeCurrencyStaking ? activeCurrencyStaking : currencyStaking[0];

    // const isBlockedAlert = stakingEnabled && !isStaked;
    const isBlockedAlert = false;

    return (
        <div
            style={{ ...layoutStyles, "--alertHeight": isBlockedAlert ? layoutStyles["--alertHeight"] : "0px" }}
            className="min-h-screen h-full w-full flex flex-col bg-[#082536]"
        >
            {isBlockedAlert && <BlockedAlert currency={stakingCurrency?.symbol} />}

            {isDesktop ? (
                <DesktopLayout title={title} isBlockedAlert={isBlockedAlert}>
                    {children}
                </DesktopLayout>
            ) : (
                <MobileLayout isBlockedAlert={isBlockedAlert}>{children}</MobileLayout>
            )}
        </div>
    );
}

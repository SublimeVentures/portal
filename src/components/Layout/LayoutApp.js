import Link from "next/link";

import { Sidebar, MobileHeader, Navbar } from "@/v2/components/Layout";
import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import { cn } from "@/lib/cn";
import routes from "@/routes";

const layoutStyles = {
    "--alertHeight": "60px",
    "--headerHeight": "100px",
    "--sidebarWidth": "300px",
    "--navbarHeight": "100px",
}

const BlockedAlert = ({ currency = "" }) => (
    <div className="fixed top-0 flex items-center justify-center bg-app-error uppercase text-white font-accent z-[100000] w-full text-center px-5 h-[var(--alertHeight)]">
        Investments are blocked!&nbsp;
        <u>
            <Link href={routes.Settings}>Stake {currency} to unlock</Link>.
        </u>
    </div> 
)

export default function LayoutApp({ children }) {
    const { currencyStaking, activeCurrencyStaking } = useEnvironmentContext();
    const stakingEnabled = children.props?.session.stakingEnabled;
    const isStaked = children.props?.session.isStaked;
    const stakingCurrency = activeCurrencyStaking ? activeCurrencyStaking : currencyStaking[0];

    // const isBlockedAlert = stakingEnabled && !isStaked;
    const isBlockedAlert = false

    return (
        // <div style={layoutStyles} className="min-h-screen h-full w-full flex flex-col bg-[#082536]">
        //     {isBlockedAlert && <BlockedAlert currency={stakingCurrency?.symbol} />}

        //     <div className={cn("flex h-full grow", { "mt-[var(--alertHeight)]": isBlockedAlert } )}>
        //         <Sidebar session={children.props?.session} isBlockedAlert={isBlockedAlert} />
                
        //         <div className="flex grow lg:pl-[var(--sidebarWidth)] lg:ml-0 lg:m-6">
        //             <div className={cn("grow bg-[#05060B] rounded-b-[33px] lg:rounded-[33px]", {
        //                 "max-h-[calc(100vh_-_var(--navbarHeight))] lg:max-h-[calc(100vh_-_theme('spacing.12'))]": !isBlockedAlert,
        //                 "max-h-[calc(100vh_-_var(--navbarHeight)_-_var(--alertHeight))] lg:max-h-[calc(100vh_-_theme('spacing.12')_-_var(--alertHeight))]": isBlockedAlert,
        //             })}>
        //                 <div className="flex flex-col w-full h-full">
        //                   <MobileHeader />
                          
        //                   <main className="p-4 flex flex-col grow w-full overflow-y-auto lg:p-0 lg:overflow-y-hidden">
        //                     {children}
        //                   </main>
        //                 </div>
        //             </div>
        //         </div>

        //     </div>
              
        //     <Navbar />
        // </div>

        // Mobile only
        <div style={layoutStyles} className="min-h-screen bg-[#082536]">
            <div className="relative h-[calc(100vh_-_var(--navbarHeight))] rounded-b-lg overflow-hidden">
                <div className="relative z-10 px-4 py-8 h-full bg-[#071321] overflow-y-scroll">
                    <main>{children}</main>                    
                </div>
                <div className='absolute z-10 bottom-0 h-8 w-full bg-navbar-gradient' />
            </div>

            <Navbar />
        </div>
    );
}

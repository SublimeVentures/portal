import Link from "next/link";

import routes from "@/routes";

export default function BlockedAlert({ currency = "" }) {
    return (
        <div className="fixed top-0 z-10 px-5 h-[var(--alertHeight)] w-full flex items-center justify-center bg-app-error text-white font-accent text-center uppercase">
            Investments are blocked!&nbsp;
            
            <u>
                <Link href={routes.Settings}>Stake {currency} to unlock</Link>.
            </u>
        </div> 
    )
}

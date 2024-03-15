import { useRouter } from "next/router";
import PAGE from "@/routes";
import { getCopy } from "@/lib/seoConfig";
import Link from "next/link";

export default function Navbar() {
    const { pathname } = useRouter();
    return (
        <div
            className={`bg-footer font-accent text-white w-full p-10 text-center ${(pathname.startsWith(PAGE.Login) || pathname === PAGE.Investments || pathname === PAGE.Join) && "notFullGradient"}  `}
        >
            <div>
                Copyright © 2024 {getCopy("NAME")}. All rights reserved. Made
                with
                <span className="text-app-error"> ❤</span>.
            </div>
            <div className={"flex flex-row gap-10 justify-center pt-2 text-xs"}>
                <div>
                    <Link href={PAGE.Privacy}>Privacy Policy</Link>
                </div>
                <div>
                    <Link href={PAGE.ToS}>Terms of Service</Link>
                </div>
            </div>
        </div>
    );
}

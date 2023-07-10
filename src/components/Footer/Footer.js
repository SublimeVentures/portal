import { useRouter } from 'next/router'
import PAGE from "@/routes";
import {getCopy} from "@/lib/seoConfig";

export default function Navbar() {
    const {pathname} = useRouter()
    return (
        <div className={`bg-footer font-accent text-white w-full p-10 text-center ${(pathname === PAGE.Login || pathname ===PAGE.Investments || pathname ===PAGE.Join) && "notFullGradient"}  `}>
            <div>Copyright © 2023 {getCopy("NAME")}. All rights reserved. Made with
                <span className="text-app-error"> ❤</span>.
            </div>
        </div>
    )
}

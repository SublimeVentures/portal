import { useRouter } from 'next/router'
import PAGE from "@/routes";

export default function Navbar() {
    const {pathname} = useRouter()
    return (
        <div className={`bg-footer f-work text-white w-full p-10 text-center ${(pathname === PAGE.Login || pathname ===PAGE.Investments || pathname ===PAGE.Join) && "notFullGradient"}  `}>
            <div>Copyright © 2022 3VC. All rights reserved. Made with
                <span className="text-red">❤</span>.
            </div>
        </div>
    )
}

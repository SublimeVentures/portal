import { useRouter } from 'next/router'

export default function Navbar() {
    const {pathname} = useRouter()
    return (
        <div className={`bg-footer f-work text-white w-full p-10 text-center ${(pathname ==='/login' || pathname ==='/investments' || pathname ==='/join') && "notFullGradient"}  `}>
            <div>Copyright © 2022 3VC. All rights reserved. Made with
                <span className="text-red">❤</span>.
            </div>
        </div>
    )
}

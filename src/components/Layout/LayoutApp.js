import Sidebar from "@/components/Navigation/Sidebar";
import routes from "@/routes";
import Link from "next/link";
import {isBased} from "@/lib/utils";

export default function LayoutApp({ children }) {
    const notStaked = !children.props?.session?.isStaked
    return (
        <>
            {!isBased && notStaked && <div className={"sticky top-0 bg-app-error uppercase text-white font-accent z-[100000] w-full text-center px-5 py-2"}>
                Investments are blocked! <u><Link href={routes.Settings}>Stake BYTES to unlock</Link></u>.
            </div> }

            <div className="flex flex-col collap:flex-row bg-app-bg min-h-screen">
                <Sidebar session={children.props?.session}/>
                <main className="flex flex-col w-full grow sm:min-h-screen max-w-[1920px] p-5 mobile:p-10 gap-5 mobile:gap-10 text-app-white">{children}</main>
                {/*<main className="flex flex-col w-full sm:min-h-screen max-w-[1920px] p-5 mobile:p-10 gap-5 mobile:gap-10 text-app-white">{children}</main>*/}
            </div>
        </>

    );
}

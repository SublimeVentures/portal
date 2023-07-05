import Sidebar from "@/components/Navigation/Sidebar";
import {useEffect} from "react";

export default function Layout({ children }) {
    useEffect(() => {
        import('@lottiefiles/lottie-player');
    }, []);

    return (
        <div className="flex flex-col collap:flex-row bg-app-bg min-h-screen">
            <Sidebar account={children.props.children.props.children.props.account}/>
            <main className="flex flex-col w-full sm:min-h-screen max-w-[1920px] p-5 mobile:p-10 gap-5 mobile:gap-10 text-app-white">{children}</main>
        </div>
    );
}

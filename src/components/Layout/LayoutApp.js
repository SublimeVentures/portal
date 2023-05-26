import Sidebar from "@/components/Navigation/Sidebar";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col collap:flex-row bg-navy2 min-h-screen">
            <Sidebar/>
            <main className="flex flex-col w-full sm:min-h-screen max-w-[1920px] p-5 mobile:p-10 gap-5 mobile:gap-10 text-app-white">{children}</main>
        </div>
    );
}

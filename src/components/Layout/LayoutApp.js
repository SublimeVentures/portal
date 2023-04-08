import Sidebar from "@/components/Navigation/Sidebar";

export default function Layout({ children }) {
    return (
        <div className="flex flex-col collap:flex-row bg-navy2 min-h-screen">
            <Sidebar/>
            <main className="flex flex-col w-full min-h-screen max-w-[1920px] p-10 gap-10 text-app-white ">{children}</main>
        </div>
    );
}

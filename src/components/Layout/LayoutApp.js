import Sidebar from "@/components/Navigation/Sidebar";

export default function Layout({ children }) {
    return (
        <div className="w-full flex flex-col collap:flex-row bg-navy2 min-h-screen">
            <Sidebar/>
            <main>{children}</main>
        </div>
    );
}

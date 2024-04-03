import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/Footer/Footer";

export default function Layout({ children }) {
    return (
        <div className="w-full">
            <Navbar />
            <main className='min-h-screen w-full bg'>{children}</main>
            <Footer />
        </div>
    );
}

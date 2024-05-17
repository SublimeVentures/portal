import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import NotificationMenu from "@/components/V2/Layout/NotificationMenu";
import MobileMenu from "@/components/V2/Navigation/MobileMenu";
import { Button } from "@/components/ui/button";

const Header = () => {
    const { environmentCleanup } = useEnvironmentContext();
    const handleLogout = () => environmentCleanup();

    return (
        <header classname="w-full">
            <div className="p-4 flex items-center justify-between">
                <div className='relative z-10 flex flex-col collap:hidden'>
                    <h1 className="text-8xl font-semibold text-foreground">based.vc</h1>
                    <p className="text-md font-light text-foreground">VC for all</p>
                </div>

                <div className="ml-auto relative z-10 flex items-center">
                    <NotificationMenu />
                    
                    <div className="ml-4">
                        <Button className="hidden collap:flex" variant="secondary" onClick={handleLogout}>Logout</Button>
                    </div>
                </div>
                
                <MobileMenu />
            </div>
        </header>
    );
};

export default Header;

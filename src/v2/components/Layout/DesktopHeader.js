import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import NotificationMenu from "@/v2/components/Notification/NotificationMenu";
import { Button } from "@/v2/components/ui/button";
import { ChainSwitch } from "@/v2/components/App/Vault";
import { Avatar } from "@/v2/components/ui/avatar";
import { shortenAddress } from "@/v2/lib/helpers";

const mockedUser = {
    username: "Steady Stacker",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
};

export default function Header({ title }) {
    const { environmentCleanup } = useEnvironmentContext();
    const handleLogout = () => environmentCleanup();

    return (
        <header className="pt-9 3xl:pt-12 px-12 3xl:px-19 w-full">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-baseline">
                    <h2 className="text-7xl font-bold text-foreground">{title}</h2>

                    <p className="text-4xl font-normal text-foreground">
                        Welcome back, <span className="text-accent">{mockedUser.username}!</span>
                    </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-4">
                    <div className="flex flex-col text-end">
                        <p className="text-md text-foreground">{shortenAddress(mockedUser.walletAddress)}</p>
                        <p className="text-foreground/[.2]">Settings</p>
                    </div>
                    <Avatar className="bg-white" session={null} />

                    <div className="mx-2 h-6 w-0.5 bg-foreground" />

                    <ChainSwitch />
                    <NotificationMenu />
                    <Button className="hidden md:flex" variant="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}

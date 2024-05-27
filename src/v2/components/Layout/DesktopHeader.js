import { useEnvironmentContext } from "@/lib/context/EnvironmentContext";
import NotificationMenu from "@/v2/components/Notification/NotificationMenu";
import { Button } from "@/v2/components/ui/button";
import { SingleChain } from "@/v2/components/App/Vault";
import { Avatar } from "@/v2/components/ui/avatar";
import { shortenAddress } from "@/v2/lib/helpers";
import DiamondIcon from "@/v2/assets/svg/diamond.svg";

const mockedUser = {
    username: "Steady Stacker",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
}

export default function Header() {
    const { environmentCleanup } = useEnvironmentContext();
    const handleLogout = () => environmentCleanup();

    return (
        <header className="px-16 pt-16 w-full hidden md:block">
            <div className="flex justify-between flex-wrap gap-4">
                <h3 className="hidden text-4xl font-regular text-foreground md:block">
                    Welcome back, {" "}
                    <span className="text-accent">{mockedUser.username}!</span>
                </h3>

                <div className="relative z-10 flex flex-wrap items-center gap-4">
                    <div className="flex flex-col text-end">
                        <p className="text-md text-foreground">{shortenAddress(mockedUser.walletAddress)}</p>
                        <p className="text-foreground/[.2]">Settings</p>
                    </div>
                    <Avatar className="bg-white" session={null} />

                    <div className="mx-2 h-6 w-0.5 bg-foreground" />

                    <p className="text-foreground">+4</p>
                    <SingleChain icon={DiamondIcon} active />
                    <NotificationMenu />
                    <Button className="hidden md:flex" variant="secondary" onClick={handleLogout}>Logout</Button>
                </div>
            </div>
        </header>
    );
};

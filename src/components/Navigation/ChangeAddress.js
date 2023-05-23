import {useAccount} from "wagmi";
import GenericModal from "@/components/Modal/GenericModal";
import {signOut, useSession} from "next-auth/react";
import {useEffect} from "react";

export default function ChangeAddress() {
    const {isConnected, address} = useAccount()
    const {data: session} = useSession()
    const userAddress = session?.user?.address
    const isAddressNotSupported = (userAddress !== undefined && address !== undefined && userAddress !== address)


    useEffect(() => {
        if (!isConnected) {
            signOut({callbackUrl: "/"})
        }
    }, [isConnected]);

    const title = () => {
        return (
            <>
                Wallet <span className="text-app-error">error</span>
            </>
        )
    }

    const content = () => {
        return (
            <div className={"flex flex-1 flex-col"}>
                You've changed the wallet account. <br/>
                Please use the account you logged in with.
                <div className={"flex flex-col my-10"}>
                    <div className="text-app-success">Signed</div>
                    <div className="truncate text-app-success">{userAddress}</div>
                    <div className="text-app-error mt-5">Current</div>
                    <div className="truncate text-app-error">{address}</div>
                </div>

                <div className="mt-auto"><a href="#" target="_blank">Read more.</a></div>
            </div>
        )
    }

    return (
        <GenericModal isOpen={isAddressNotSupported} closeModal={() => {
        }} title={title()} content={content()} persistent={true} noClose={true}/>
    )
}

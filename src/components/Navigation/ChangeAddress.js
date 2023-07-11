import {useAccount} from "wagmi";
import GenericModal from "@/components/Modal/GenericModal";
import {useEffect} from "react";
import {logOut} from "@/fetchers/auth.fetcher";
import routes from "@/routes";
import {useRouter} from "next/router";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";

export default function ChangeAddress({account}) {
    const router = useRouter();
    const {isConnected, address} = useAccount()
    const userAddress = account?.address
    const isAddressNotSupported = (userAddress !== undefined && address !== undefined && userAddress !== address)


    const signOut = () => {
        logOut()
        router.push(routes.Landing)
    }

    useEffect(() => {
        if (!isConnected) {
            signOut()
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

                <div className="mt-auto w-full">
                    <div className={" w-full fullWidth"}>

                        <UniButton type={ButtonTypes.BASE}
                                   state={"danger ml-auto"} text={'Logout'} isWide={true} zoom={1.1} size={'text-sm sm'} handler={() => {
                            signOut()
                        }} />


                    </div>
                </div>
            </div>
        )
    }

    return (
        <GenericModal isOpen={isAddressNotSupported} closeModal={() => {
        }} title={title()} content={content()} persistent={true} noClose={true}/>
    )
}

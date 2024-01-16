import GenericModal from "@/components/Modal/GenericModal";
import {useState} from "react";
import {ButtonTypes, UniButton} from "@/components/Button/UniButton";
import {useEnvironmentContext} from "@/components/App/BlockchainSteps/EnvironmentContext";
import {addUserWallet} from "@/fetchers/settings.fetcher";
import {isBased} from "@/lib/utils";
import {useSignMessage} from "wagmi";

export default function WalletAddModal({model, setter, addProps}) {
    const {wallets, maxWallets, refetchUserWallets} = addProps
    const {account} = useEnvironmentContext();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const newWallet = !wallets.find(el => el.wallet === account?.address) && !!account?.address


    const {error: signMessageError, signMessageAsync: signMessageFn} = useSignMessage();

    const closeModal = () => {
        setter()
        setTimeout(() => {
            setSuccess(false)
        }, 400);
    }

    const addWallet = async () => {
        if (!newWallet) return;
        setError("")
        setProcessing(true)
        let signature
        try {
            signature = await signMessageFn({
                account: account?.address,
                message: 'I acknowledge that all linked wallets will have the capability to perform actions on my behalf, including selling assets and claiming allocations associated with my account.',
            })
        } catch (error) {
            setProcessing(false)
            setError(error.shortMessage)

            return;
        }

        if (!signature || !!signMessageError) return
        const result = await addUserWallet(signature)

        if(result?.ok) {
            refetchUserWallets()
        } else {
            setError(result?.error)
        }
        setSuccess(result?.ok)
        setProcessing(false)
    }


    const title = () => {
        return (
            <>
                <span className="text-app-success">Add</span> wallet
            </>
        )
    }

    const contentStake = () => {
        return (
            <div className={"min-w-[300px]"}>
                <div>
                    You can add up to <span className={"text-app-success font-bold"}>{maxWallets - wallets.length}</span> more wallets to your account.<br/>
                    <span className={"text-app-error"}>Wallet can be assigned only to one account!</span><br/><br/>
                    Switch to wallet you want to add, and sign message.
                </div>
                <div className={"py-5"}>
                    <div className={" h-[60px]"}>
                        {newWallet && <div>
                            <div className={"glowNormal font-bold pb-2 w-full text-center"}>New wallet</div>
                            <div
                                className={`text-xs p-2 bg-app-accent2 text-center ${isBased ? "rounded-xl" : ""}`}>{account?.address}</div>
                        </div>}
                        <div className={"pt-2 w-full text-center text-app-error"}>{error}</div>
                    </div>

                </div>

                <div className={"fullWidth pt-5"}>
                    <UniButton
                        type={ButtonTypes.BASE}
                        isWide={true}
                        size={'text-sm sm'}
                        state={"danger"}
                        isDisabled={!newWallet}
                        isLoading={processing}
                        text={"Add wallet"}
                        handler={async () => {
                            await addWallet()
                        }}/>
                </div>

            </div>
        )
    }

    const contentSuccess = () => {
        return (
            <div className={"min-w-[300px]"}>
                <div className={"text-app-success"}>
                    Wallet added successfully.
                </div>
            </div>
        )
    }

    const content = () => {
        return success ? contentSuccess() : contentStake()
    }

    return (<GenericModal isOpen={model} closeModal={closeModal} title={title()} content={content()}/>)
}


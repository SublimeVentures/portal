import { useState} from "react";
import {ButtonIconSize, RoundButton} from "@/components/Button/RoundButton";
import GenericModal from "@/components/Modal/GenericModal";
import WalletIcon from "@/svg/Wallet.svg";
import Image from "next/image";

import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
// <script setup>
//     import {ref} from "vue";
//     const config = useRuntimeConfig();
//     import {connect, signMessage} from '@wagmi/core'
//     import {useAuthStore} from "@/stores/auth";
//     import { SiweMessage } from "siwe"
//     const { status, data, signOut, signIn, getCsrfToken } = useAuth()
//     const router = useRouter();
//     const route = useRoute()
//
//     const authStore = useAuthStore()
//     import {mainnet} from '@wagmi/core/chains'
//
//
//     const errorMsg = ref("")
//
//     const props = defineProps({loginPartner: Boolean,});
//
//     const openModal = async () => {
//     authStore.isModalOpen = true
// }
//
//     const connectMetamask = async (disabled) => {
//     if(disabled) return;
//     const connector = new MetaMaskConnector()
//     await connectWallet(connector, 1)
// }
//
//     const connectLedger = async (disabled) => {
//     if(disabled) return;
//     const connector = new LedgerConnector({
//     chains: [mainnet],
// })
//     await connectWallet(connector, 2)
// }
//     const connectWalletConnect = async (disabled) => {
//     if(disabled) return;
//     const connector = new WalletConnectConnector({
//     chains: [mainnet],
//     options: {
//     projectId: '4e50725964f93f97d921a3c1e98e432c',
// },
// })
//     await connectWallet(connector, 3)
// }
//
//     const connectWallet = async (connector_, type) => {
//     // await signOut()
//
//     const a =  await getCsrfToken()
//     console.log("aaa",a)
//
//     try {
//     authStore.connectorID = type
//     errorMsg.value = ""
//     const result = await connect({
//     connector: connector_,
// })
//     console.log("connected obj", result, authStore.address, config.origin)
//
//     const message = new SiweMessage({
//     domain: config.domain,
//     address: authStore.address,
//     statement: "3VC - invest ground floor",
//     uri: config.domain,
//     version: "1",
//     chainId: 1,
//     nonce: await getCsrfToken(),
// })
//     console.log("sign", message)
//
//     const signature = await signMessage({
//     message: message.prepareMessage(),
// })
//     console.log("sign message", signature)
//     const signed = await signIn('credentials', {
//     message: JSON.stringify(message),
//     redirect: false,
//     signature,
// })
//     if(signed.status===200 && signed.ok) {
//     const redirect = route.query?.callbackUrl ? route.query.callbackUrl.replace(config.domain,"") : "/app"
//     console.log("redirect", redirect)
//     router.push({ path: redirect });
// }
//
//
//
// } catch (e) {
//     console.log("e",e)
//     errorMsg.value = "User rejected login!"
//     authStore.connectorID = null
// }
// }
//
// </script>

export default function LoginModal({isPartner}) {
    let [isOpen, setIsOpen] = useState(false)
    let [errorMsg, setErrorMsg] = useState("")

    //
    // const { address, isConnected } = useAccount()
    // const { data: ensName } = useEnsName({ address })
    // const { connect } = useConnect({
    //     connector: new InjectedConnector(),
    // })

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const title = () => {
        return (<>Connect Wallet <span className="text-gold">{isPartner ? "Partners" : "Whale"}</span></>)
    }

    const content = () => {
        return (<> <div className="pb-10">
            Don't want connect your cold wallet? You can delegate access! Read more
            here.
        </div>
            <div className="flex flex-col gap-5 fullWidth">
                <RoundButton handler={connect} text={'Metamask'} isWide={true} zoom={1.05} size={'text-sm sm'} icon={<Image src="/img/login/MetaMask.png" width={32} height={32} alt={"Metamask"} className={ButtonIconSize.hero}/>}
                             isLoading={false} isDisabled={false} />
                <RoundButton text={'Ledger'} isWide={true} zoom={1.05} size={'text-sm sm'} icon={<Image src="/img/login/ledgerconnect.png" width={32} height={32}  alt={"Ledger"} className={ButtonIconSize.hero}/>}
                             isLoading={false} isDisabled={false} />
                <RoundButton text={'WalletConnect'} isWide={true} zoom={1.05} size={'text-sm sm'} icon={<Image src="/img/login/walletconnect.png" width={32} height={32} alt={"WalletConnect"} className={ButtonIconSize.hero}/>}
                             isLoading={false} isDisabled={false} />

            </div>
            <div className="-mb-2 mt-2 text-center text-red h-[10px]">{errorMsg}</div>
        </>)
    }

  return (
      <>
          <RoundButton text={'Connect'} isLoading={false} isDisabled={false} is3d={false} isWide={true} zoom={1.1} size={'text-sm sm'} icon={<WalletIcon className={ButtonIconSize.hero}/> } handler={openModal} />
          <GenericModal isOpen={isOpen} closeModal={closeModal} title={title()} content={content()} />

      </>
  )
}


import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { v4 as uuidv4 } from "uuid";
import { logIn } from "@/fetchers/auth.fetcher";
import routes from "@/routes";
import { TENANT } from "@/lib/tenantHelper";
import { LoginErrorsEnum } from "@/constants/enum/login.enum";
import { isUrlTrusted } from "@/components/Login/helper";

const SIGNING_MESSAGE = {
    [TENANT.basedVC]: "INVEST GROUND FLOOR\nDON'T BE EXIT LIQUIDITY",
    [TENANT.NeoTokyo]: "INVEST EARLY\nINVEST WITH THE CITADEL",
    [TENANT.CyberKongz]: "INVEST EARLY\nINVEST WITH THE KONG",
};

const LOGIN_TYPE = {
    WEB3: 1,
};

export default function useLoginFlow() {
    const router = useRouter();

    const [signErrorMsg, setErrorMsg] = useState("");
    const [isSigningMessage, setIsSigningMessage] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [partner, setPartner] = useState(0);

    const {
        address: accountAddress,
        isConnected: accountIsConnected,
        isConnecting: accountIsConnecting,
        connector: connectorActive,
    } = useAccount();
    const { signMessageAsync: signMessageFn } = useSignMessage();
    const { connectors, connectAsync: connect, isLoading: connectorIsLoading } = useConnect();

    const signMessage = useCallback(async () => {
        setErrorMsg("");
        setIsLoginLoading(true);
        setIsSigningMessage(true);

        try {
            const time = Math.floor(new Date().getTime() / 1000);
            const nonce = uuidv4();
            const message = `${SIGNING_MESSAGE[process.env.NEXT_PUBLIC_TENANT]}\n\nDOMAIN: ${window.location.host.replace("www.", "")}\nTIME: ${time}\nNONCE: ${nonce}\n\nI herby accept Privacy Policy and Terms of Use available https://${window.location.host.replace("www.", "")}/terms and https://${window.location.host.replace("www.", "")}/privacy`;
            const signature = await signMessageFn({ message });

            const callbackUrl = router.query.callbackUrl;

            const isAuth = await logIn(
                message,
                signature,
                Number(process.env.NEXT_PUBLIC_TENANT),
                partner,
                LOGIN_TYPE.WEB3,
            );

            if (isAuth?.ok) {
                router.replace(callbackUrl && isUrlTrusted(callbackUrl) ? callbackUrl : routes.App);
            } else {
                router.push({
                    pathname: routes.Login,
                    query: { error: LoginErrorsEnum.CREDENTIALS_ERROR },
                });
                setIsSigningMessage(false);
                setIsLoginLoading(false);
            }
        } catch (error) {
            setIsSigningMessage(false);
            setErrorMsg(error.shortMessage);
            setIsLoginLoading(false);
        }
    }, [signMessageFn, router, accountAddress, accountIsConnected, partner]);

    const handleConnect = useCallback(async () => {
        if (isLoginLoading) return;

        if (accountAddress && accountIsConnected) {
            try {
                await signMessage();
                return;
            } catch (error) {
                setErrorMsg(error.shortMessage);
            }
        }

        setLoginModalOpen(true);
    }, [accountAddress, accountIsConnected, isLoginLoading, signMessage]);

    useEffect(() => {
        if (loginModalOpen) {
            setErrorMsg("");
        }
    }, [loginModalOpen]);

    useEffect(() => {
        if (accountAddress && loginModalOpen) {
            setLoginModalOpen(false);
            void handleConnect();
        }
    }, [accountAddress, handleConnect, loginModalOpen]);

    const loginData = {
        connectors,
        connectorIsLoading,
        connectorActive,
        connect,
        handleConnect,
        loginModalOpen,
        setLoginModalOpen,
        signErrorMsg,
        setErrorMsg,
        accountIsConnecting,
        isSigningMessage,
        isLoginLoading,
    };

    return {
        loginData,
        isLoginLoading,
        setPartner,
        handleConnect,
    };
}

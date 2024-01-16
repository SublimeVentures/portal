import {useState, useCallback, useEffect} from 'react';
import {useRouter} from 'next/router';
import {useAccount, useConnect, useSignMessage} from "wagmi";
import moment from "moment";
import {v4 as uuidv4} from 'uuid';
import {logIn} from "@/fetchers/auth.fetcher";
import routes from "@/routes";

const SIGNING_MESSAGE = {
    1: "INVEST GROUND FLOOR\nDON'T BE EXIT LIQUIDITY",
    6: "INVEST EARLY\nINVEST WITH THE CITADEL",
}

const LOGIN_TYPE = {
    WEB3: 1
}

export default function useLoginFlow() {
    const router = useRouter();

    const [signErrorMsg, setErrorMsg] = useState("");
    const [isSigningMessage, setIsSigningMessage] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [partner, setPartner] = useState(0);

    const {
        address: accountAddress,
        isConnected: accountIsConnected,
        isConnecting: accountIsConnecting,
        connector: connectorActive
    } = useAccount();
    const {error: signMessageError, signMessageAsync: signMessageFn} = useSignMessage();
    const {
        connectors,
        connectAsync: connect,
        error: connectorError,
        isLoading: connectorIsLoading,
        variables: connectVariables
    } = useConnect()

    const signMessage = useCallback(async () => {
        setErrorMsg("");
        setIsLoginLoading(true);
        setIsSigningMessage(true);
        try {
            const time = moment.utc().unix();
            const nonce = uuidv4();
            const message = `${SIGNING_MESSAGE[1]}\n\nDOMAIN: ${window.location.host.replace("www.", "")}\nTIME: ${time}\nNONCE: ${nonce}`;
            const signature = await signMessageFn({message});

            const callbackUrl = router.query.callbackUrl;
            const isAuth = await logIn(message, signature, Number(process.env.NEXT_PUBLIC_TENANT), partner, LOGIN_TYPE.WEB3);
            if (isAuth?.ok) {
                router.replace(callbackUrl ? callbackUrl : routes.App);
            } else {
                router.push({
                    pathname: routes.Login,
                    query: {error: "CredentialsSignin"}
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

        setModalOpen(true);
    }, [accountAddress, accountIsConnected, isLoginLoading, signMessage]);

    useEffect(() => {
        if (modalOpen) {
            setErrorMsg("");
        }
    }, [modalOpen])

    const loginData = {
        connectors,
        connectorIsLoading,
        connectorActive,
        connect,
        handleConnect,
        modalOpen,
        setModalOpen,
        signErrorMsg,
        setErrorMsg,
        accountIsConnecting,
        isSigningMessage,
        isLoginLoading
    }

    return {
        loginData,
        isLoginLoading,
        setPartner,
        handleConnect
    };
}

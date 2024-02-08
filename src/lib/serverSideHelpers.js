import {authTokenName, refreshTokenName, refreshTokens, verifyID} from "@/lib/authHelpers";
import {fetchEnvironment} from "@/fetchers/environment.fetcher";

async function handleCustomLogic(account, accessToken, customLogicCallback) {
    if (customLogicCallback) {
        const customResult = await customLogicCallback(account, accessToken);
        if (customResult && customResult.redirect) {
            return { redirect: customResult.redirect };
        }
        return { ...customResult || {} };
    }
    return { additionalProps: {} };
}


async function processServerSideData(req, res, route, customLogicCallback) {
    const session = await verifyID(req);
    let accessToken = req.cookies[authTokenName];
    let accountData = session.user
    if (session.auth) {
        const { additionalProps, redirect } = await handleCustomLogic(accountData, accessToken, customLogicCallback);
        if (redirect) return redirect;

        const env = await fetchEnvironment(req.cookies[authTokenName], authTokenName)
        if(!env.ok) {
            console.log("ERROR - filed env refetch")
            return {
                redirect: {
                    permanent: true,
                    destination: `/login?callbackUrl=${route}`,
                },
            };
        }
        return {
            props: {
                environmentData: env,
                session: session.user,
                ...additionalProps,
            },
        };
    } else if (session.exists) {
        const newSession = await refreshTokens(req.cookies[refreshTokenName]);

        if (newSession?.ok) {
            res.setHeader('Set-Cookie', [newSession.cookie.refreshCookie, newSession.cookie.accessCookie]);
            accessToken = newSession.token.accessToken;
            accountData = newSession.data.user

            const customResult = await handleCustomLogic(accountData, accessToken, customLogicCallback);
            console.log("customResult",customResult)
            if (!!customResult.redirect) return customResult;

            const env = await fetchEnvironment(newSession.token.accessToken, authTokenName)
            return {
                props: {
                    environmentData: env,
                    session: accountData,
                    ...customResult.additionalProps,
                },
            };
        } else {
            return {
                redirect: {
                    permanent: true,
                    destination: `/login?callbackUrl=${route}`,
                },
            };
        }
    } else {
        return {
            redirect: {
                permanent: true,
                destination: `/login?callbackUrl=${route}`,
            },
        };
    }
}

export { processServerSideData };

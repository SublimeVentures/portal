import { refreshCookies } from "../../server/controllers/login/tokenHelper";

import { authTokenName, refreshTokenName, refreshData, verifyID } from "@/lib/authHelpers";
import { fetchEnvironment } from "@/fetchers/environment.fetcher";

async function handleCustomLogic(account, accessToken, customLogicCallback) {
    if (customLogicCallback) {
        const customResult = await customLogicCallback(account, accessToken);

        if (customResult && customResult.redirect) {
            return { redirect: customResult.redirect };
        }
        return { ...(customResult || {}) };
    }
    return { additionalProps: {} };
}

async function processServerSideData(req, res, route, customLogicCallback) {
    const session = await verifyID(req);
    let accessToken = req.cookies[authTokenName];
    let accountData = session.user;
    if (session.auth) {
        const { additionalProps, redirect } = await handleCustomLogic(accountData, accessToken, customLogicCallback);
        if (redirect) return redirect;

        const env = await fetchEnvironment(req.cookies[authTokenName], authTokenName);
        if (!env.ok) {
            console.log("ERROR - filed env refetch");
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
        const newData = await refreshData(req.cookies[refreshTokenName]);
        if (newData?.ok) {
            const newSession = await refreshCookies(newData.token);

            if (newSession?.ok) {
                res.setHeader("Set-Cookie", [newSession.cookie.refreshCookie, newSession.cookie.accessCookie]);
                accessToken = newSession.token.accessToken;
                accountData = newData.data.user;

                const customResult = await handleCustomLogic(accountData, accessToken, customLogicCallback);

                console.log("INFO - customResult:", customResult);

                if (customResult.redirect) return customResult;

                const env = await fetchEnvironment(accessToken, authTokenName);

                return {
                    props: {
                        environmentData: env,
                        session: accountData,
                        ...customResult.additionalProps,
                    },
                };
            }
        }
    }

    return {
        redirect: {
            permanent: true,
            destination: `/login?callbackUrl=${route}`,
        },
    };
}

export { processServerSideData };

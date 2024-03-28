export const isUrlTrusted = (url, environment) => {
    const trustedURLs = process.env.TRUSTED_DOMAINS?.split(" ");
    const isDevEnvironment = process.env.ENV === "dev";

    return (
        trustedURLs &&
        !!trustedURLs.find(
            (domain) => (isDevEnvironment && url.startsWith("http://" + domain)) || url.startsWith("https://" + domain),
        )
    );
};

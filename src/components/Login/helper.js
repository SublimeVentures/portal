export const isUrlTrusted = (url) => {
    const trustedURLs = process.env.TRUSTED_DOMAINS?.split(" ");

    return (
        trustedURLs &&
        trustedURLs.some((domain) => url.startsWith("http://" + domain) || url.startsWith("https://" + domain))
    );
};

export const isUrlTrusted = (url) => {
    const trustedURLs = process.env.TRUSTED_DOMAINS?.split(" ");
    const isDevEnvironment = process.env.NEXT_PUBLIC_ENV === "dev";

    return (
        trustedURLs &&
        !!trustedURLs.find(
            (domain) => (isDevEnvironment && url.startsWith("http://" + domain)) || url.startsWith("https://" + domain),
        )
    );
};

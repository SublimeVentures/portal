function sleeper(ms) {
    return function(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}

const isBased = process.env.NEXT_PUBLIC_SITE === "based"

const NETWORKS = {
    1: 'eth',
    137: 'matic',
    56: 'bsc',
}

module.exports = {
    sleeper,
    isBased,
    NETWORKS
}

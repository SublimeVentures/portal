function sleeper(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const isBased = process.env.NEXT_PUBLIC_SITE === "based"

const NETWORKS = {
    1: 'eth',
    137: 'matic',
    56: 'bsc',
}

const checkIfNumberKey = (event) => {
    if (event.key.length === 1 && /\D/.test(event.key)) {
        return;
    }
}

module.exports = {
    sleeper,
    isBased,
    NETWORKS,
    checkIfNumberKey
}

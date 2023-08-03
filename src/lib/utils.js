function sleeper(ms) {
    return function(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}

const isBased = process.env.NEXT_PUBLIC_SITE === "based"


module.exports = {
    sleeper,
    isBased
}

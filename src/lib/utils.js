

function sleeper(ms) {
    return function(x) {
        return new Promise(resolve => setTimeout(() => resolve(x), ms));
    };
}

const is3VC = process.env.NEXT_PUBLIC_SITE === "3VC"

module.exports = {
    sleeper,
    is3VC,
}

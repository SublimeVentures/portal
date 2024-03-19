function sleeper(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const isBased = process.env.NEXT_PUBLIC_TENANT === "1";

const NETWORKS = {
    1: "eth",
    137: "matic",
    56: "bsc",
};

const checkIfNumberKey = (event) => {
    if (event.key.length === 1 && /\D/.test(event.key)) {
        return;
    }
};

const CITIZENS = {
    Elite: 0,
    S1: 1,
    S2: 2,
    elite: 0,
    s1: 1,
    s2: 2,
};

const CITIZENS_NAME = {
    s1: "Season 1",
    s2: "Season 2",
    elite: "Elite",
};

module.exports = {
    sleeper,
    isBased,
    NETWORKS,
    checkIfNumberKey,
    CITIZENS,
    CITIZENS_NAME,
};

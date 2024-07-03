export const MINUTE = 60 * 1000;

export const cacheOptions = Object.freeze({
    cacheTime: 30 * MINUTE,
    staleTime: 15 * MINUTE,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
});

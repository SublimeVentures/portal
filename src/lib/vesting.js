export function sortUpcomingClaim (offers) {

}

export function parseVesting (offerVesting) {
    if(!offerVesting || offerVesting?.length === 0) {
        return {vested: 0, nextUnlock: 0}
    }
}

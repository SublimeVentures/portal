import {getOffersPublic} from "../../queries/offer";

export default defineEventHandler(async (event) => {
    try {
        return await getOffersPublic()
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});

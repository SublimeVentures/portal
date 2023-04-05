import {getPartners} from "~/server/queries/partner";

export default defineEventHandler(async (event) => {
    try {
        return await getPartners()
    } catch (err) {
        console.dir(err);
        event.res.statusCode = 500;
        return {
            code: "ERROR",
            message: "Something went wrong.",
        };
    }
});

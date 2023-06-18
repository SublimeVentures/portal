import Sentry from "@sentry/nextjs";
import database from "@/services/db/db.setup"
import {getEnvironment} from "@/services/db/queries/environment.query";

export let env = {}
let isConnected = false
let isProcessing = false

// export const getEnv = () => {
//     return env
// }

export const connectDB = async () => {
    isProcessing = true
    try {
        await database.authenticate();
        // await db.sync({alter: true});
        // await db.sync();
        console.log("|---- DB: connected")
        env = await getEnvironment()
        console.log("|---- ENV: ", env)
        isConnected = true
    } catch (error) {
        isConnected = false
        Sentry.captureException({location: "connectDB", error});
        console.error("DB connection failed.", error);
        process.exit(1);
    }
    isProcessing = false
}

export const db = async (callback) => {
    if(isConnected) {
        console.log("DB :: Polaczenie juz instnieje")
        return await callback()
    } else {
        console.log("DB :: Polaczenie NIE instnieje")
        if(!isProcessing) await connectDB()
        return await callback()
    }
}


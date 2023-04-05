import mongoose from "mongoose";
import {getEnvironment} from "../queries/environment";

export let env = {}

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
        });

        console.log("|---- DB: connected",)
        env = await getEnvironment()
        console.log("|---- ENV: ", env)
        mongoose.connection.on('error', console.log)
    } catch (err) {
        console.error("DB connection failed.", err);
    }
}

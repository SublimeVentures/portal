const mongoose = require("mongoose");
const {getEnvironment} = require("../queries/environment");
const Offer = require("../models/offer.js");
const InjectedUsers = require("../models/injectedUser.js");


let env = {}

function getEnv () {
    return env
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
        });

        // await Offer.create({
        //     id:2,
        //     b_otc:0,
        //     b_ppu:0.15,
        //     b_alloMin:100,
        //     b_alloRaised:0,
        //     b_tax:10,
        //     b_isPaused:false,
        //     b_isSettled:false,
        //     b_isRefund:false,
        //     name:"Arcade",
        //     dealStructure:"",
        //     alloTotal:300000,
        //     alloTotalPartner:100000,
        //     alloRequired:150000,
        //     alloRequiredPartner:10000,
        //     rrPages:9,
        //     genre:"Arcade",
        //     image:"https://citcap-public.s3.us-east-2.amazonaws.com/mavia_logo.jpeg",
        //     description:"",
        //     ticker:'ARCADE',
        //     tge:0,
        //     url_discord:"https://discord.com/invite/arcade2earn",
        //     url_twitter:"https://twitter.com/arcade2earn",
        //     url_web:"https://arcade2earn.io/",
        //     icon:"",
        //     slug:"arcade",
        //     t_vesting:"12mo",
        //     t_cliff:"6mo",
        //     t_start:1682985600,
        //     display:true,
        //     displayPublic:true,
        //     access:2,
        //     accessPartnerDate:0,
        //     d_open:1673365325,
        //     d_close:1673367325,
        //     d_openPartner:1682985600,
        //     d_closePartner:1683676800,
        // })

        await InjectedUsers.create({
            address: "0x493ACbD63218bf5b4507a756FBf76952335861b3",
            partner: "0x900FDa71Cf0A823692F99bAe87944252894994cA",
            offerAccess: [1]
        })

        console.log("|---- DB: connected",)
        env = await getEnvironment()
        console.log("|---- ENV: ", env)
        mongoose.connection.on('error', console.log)
    } catch (err) {
        console.error("DB connection failed.", err);
    }
}

module.exports = { connectDB, getEnv }

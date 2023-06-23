require('dotenv').config()
require('dotenv').config({path: `.env.local`, override: true});
const Sentry = require("@sentry/nextjs");
const express = require('express');
const next = require('next');
const url = require('url');

const cookieParser = require("cookie-parser");

const {connectDB} = require("./server/services/db");
const {connectWeb3} = require("./server/services/web3");

const {router: authRoute} = require("./server/routes/auth.router.js");
const {router: publicRoute} = require("./server/routes/public.router.js");
const {router: offerRoute} = require("./server/routes/offer.router.js");
const {router: chainRoute} = require("./server/routes/payable.router.js");
const {router: investRoute} = require("./server/routes/invest.router.js");
const {router: vaultRoute} = require("./server/routes/vault.router.js");
const {router: otcRoute} = require("./server/routes/otc.router.js");
// const {router: protected} = require("./server/routes/protected.js");

const port = process.env.PORT || 3000
const dev = process.env.ENV !== 'production' || process.env.FORCE_DEV === "true" ;
const hostname = process.env.HOSTNAME

const nextApp = next({dir: '.', dev, hostname, port});
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
    await connectDB()
    await connectWeb3()

    const server = express();
    server.use(express.json());
    server.use(express.urlencoded({extended: true}));
    server.use(cookieParser());

    server.use('/api/auth', authRoute);
    server.use('/api/public', publicRoute);
    server.use('/api/offer', offerRoute);
    server.use('/api/chain', chainRoute);
    server.use('/api/invest', investRoute);
    server.use('/api/vault', vaultRoute);
    server.use('/api/otc', otcRoute);

    // Default catch-all renders Next app
    server.all('*', (req, res) => {
        res.set({
          'Cache-Control': 'public, maxAllocation-age=3600'
        });
        const parsedUrl = url.parse(req.url, true);
        nextHandler(req, res, parsedUrl);
    });

    server.listen(port, (err) => {
        if (err) {
            Sentry.captureException({location: "ServerListen", err});
            throw err;
        }
        console.log(`Listening on PORT:${port}`);
    });
});









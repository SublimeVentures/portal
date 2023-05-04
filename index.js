require('dotenv').config()
require('dotenv').config({ path: `.env.local`, override: true });
const express = require('express');
const next = require('next');
const url = require('url');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const cookieParser = require("cookie-parser");

const {connectDB, getEnv} = require("./server/services/db/utils");
const {connectWeb3, getWeb3} = require("./server/services/web3");

const {router: validateRoute} = require("./server/routes/validate.router.js");
const {router: publicRoute} = require("./server/routes/public.router.js");
const {feedNfts, login} = require("./server/controllers/login");
// const {router: offerRoute} = require("./server/routes/offer.js");
// const {router: investRoute} = require("./server/routes/invest.js");
// const {router: payableRoute} = require("./server/routes/payable.js");
// const {router: vaultRoute} = require("./server/routes/vault.js");
// const {router: otcRoute} = require("./server/routes/otc.js");

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const hostname = "127.0.0.1"


// Multi-process to utilize all CPU cores.
if (!dev && cluster.isMaster) {
    console.log(`Node cluster master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });

} else {
    const nextApp = next({dir: '.', dev, hostname, port});
    const nextHandler = nextApp.getRequestHandler();

    nextApp.prepare().then(async () => {
        const server = express();
        await connectDB()
        await connectWeb3()

        // await login("0x58562fb1dceF236d5d0Ed1C5A58725C1D5e61cCd")


        if (!dev) {
            // Enforce SSL & HSTS in production
            server.use(function (req, res, next) {
                const proto = req.headers["x-forwarded-proto"];
                if (proto === "https") {
                    res.set({
                        'Strict-Transport-Security': 'max-age=31557600' // one-year
                    });
                    return next();
                }
                res.redirect("https://" + req.headers.host + req.url);
            });
        }

        // Static files
        // https://github.com/zeit/next.js/tree/4.2.3#user-content-static-file-serving-eg-images
        // server.use('/static', express.static(path.join(__dirname, 'static'), {
        //     maxAge: dev ? '0' : '365d'e
        // }));
        //
        // // Example server-side routing
        // server.get('/a', (req, res) => {
        //     return nextApp.render(req, res, '/b', req.query)
        // })
        //
        // // Example server-side routing
        // server.get('/b', (req, res) => {
        //     return nextApp.render(req, res, '/a', req.query)
        // })


        server.use(express.json());
        server.use(express.urlencoded({ extended: true }));
        server.use(cookieParser());

        server.use('/api/validate', validateRoute);
        server.use('/api/public', publicRoute);
        // server.use('/api/offer', offerRoute);
        // server.use('/api/invest', investRoute);
        // server.use('/api/payable', payableRoute);
        // server.use('/api/vault', vaultRoute);
        // server.use('/api/otc', otcRoute);

        // Default catch-all renders Next app
        server.all('*', (req, res) => {
            // res.set({
            //   'Cache-Control': 'public, max-age=3600'
            // });
            const parsedUrl = url.parse(req.url, true);
            nextHandler(req, res, parsedUrl);
        });

        server.listen(port, (err) => {
            if (err) throw err;
            console.log(`Listening on http://localhost:${port}`);
        });
    });
}









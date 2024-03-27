require("dotenv").config();
const express = require("express");
const next = require("next");
const url = require("url");

const cookieParser = require("cookie-parser");
const { serializeError } = require("serialize-error");
const logger = require("./src/lib/logger");

const { connectDB } = require("./server/services/db");
const { initCron } = require("./server/services/cron");

const { router: authRoute } = require("./server/routes/auth.router.js");
const { router: envRoute } = require("./server/routes/environment.router.js");
const { router: publicRoute } = require("./server/routes/public.router.js");
const { router: offerRoute } = require("./server/routes/offer.router.js");
const { router: investRoute } = require("./server/routes/invest.router.js");
const { router: vaultRoute } = require("./server/routes/vault.router.js");
const { router: otcRoute } = require("./server/routes/otc.router.js");
const { router: mysteryboxRoute } = require("./server/routes/mysterybox.router");
const { router: storeRoute } = require("./server/routes/store.router.js");
const { router: settingsRoute } = require("./server/routes/settings.router.js");
const { router: payoutRoute } = require("./server/routes/payout.router.js");
const { router: claimRoute } = require("./server/routes/claim.router.js");

const port = process.env.PORT || 3000;
const dev = process.env.ENV !== "production" || process.env.FORCE_DEV === "true";
const hostname = process.env.HOSTNAME;

const nextApp = next({ dir: ".", dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
    await connectDB();
    await initCron();

    const server = express();
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cookieParser());

    server.use("/api/auth", authRoute);
    server.use("/api/environment", envRoute);
    server.use("/api/public", publicRoute);
    server.use("/api/offer", offerRoute);
    server.use("/api/invest", investRoute);
    server.use("/api/vault", vaultRoute);
    server.use("/api/otc", otcRoute);
    server.use("/api/mysterybox", mysteryboxRoute);
    server.use("/api/store", storeRoute);
    server.use("/api/settings", settingsRoute);
    server.use("/api/payout", payoutRoute);
    server.use("/api/claim", claimRoute);

    // Default catch-all renders Next app
    server.all("*", (req, res) => {
        res.set({
            "Cache-Control": "public, maxAllocation-age=3600",
        });
        const parsedUrl = url.parse(req.url, true);
        nextHandler(req, res, parsedUrl);
    });

    server.listen(port, (error) => {
        if (error) {
            logger.error(`ERROR :: Server listener`, {
                error: serializeError(error),
            });
            throw error;
        }
        logger.warn(`Listening on PORT:${port}`);
    });
});

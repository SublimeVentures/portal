require("dotenv").config();
const url = require("url");
const express = require("express");
const next = require("next");

const cookieParser = require("cookie-parser");
const { serializeError } = require("serialize-error");
const logger = require("./src/lib/logger");
const authMiddleware = require("./server/middlewares/auth.middleware");

const { connectDB } = require("./server/services/db");
const { initCron } = require("./server/services/cron");

const { router: authRoute } = require("./server/routes/auth.router.js");
const { router: envRoute } = require("./server/routes/environment.router.js");
const { router: publicRoute } = require("./server/routes/public.router.js");
const { router: offerRoute } = require("./server/routes/offer.router.js");
const { router: investRoute } = require("./server/routes/invest.router.js");
const { router: vaultRoute } = require("./server/routes/vault.router.js");
const { router: otcRoute } = require("./server/routes/otc.router.js");
const { router: mysteryboxRoute } = require("./server/routes/mysterybox.router.js");
const { router: storeRoute } = require("./server/routes/store.router.js");
const { router: settingsRoute } = require("./server/routes/settings.router.js");
const { router: payoutRoute } = require("./server/routes/payout.router.js");
const { router: claimRoute } = require("./server/routes/claim.router.js");
const { router: notificationsRoute } = require("./server/routes/notifications.router.js");
const { router: networkRoute } = require("./server/routes/network.router.js");
const { router: newsRoute } = require("./server/routes/news.router.js");

const port = process.env.PORT || 3000;
const dev = (process.env.ENV !== "production" && process.env.ENV !== "staging") || process.env.FORCE_DEV === "true";
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
    server.use("/api/public", publicRoute);

    server.use("/api/environment", authMiddleware, envRoute);
    server.use("/api/offer", authMiddleware, offerRoute);
    server.use("/api/invest", authMiddleware, investRoute);
    server.use("/api/vault", authMiddleware, vaultRoute);
    server.use("/api/otc", authMiddleware, otcRoute);
    server.use("/api/mysterybox", authMiddleware, mysteryboxRoute);
    server.use("/api/store", authMiddleware, storeRoute);
    server.use("/api/settings", authMiddleware, settingsRoute);
    server.use("/api/payout", authMiddleware, payoutRoute);
    server.use("/api/claim", authMiddleware, claimRoute);
    server.use("/api/notifications", authMiddleware, notificationsRoute);
    server.use("/api/network", authMiddleware, networkRoute);
    server.use("/api/news", authMiddleware, newsRoute);

    // Default catch-all renders Next app
    server.all("*", (req, res) => {
        // if (!dev) {
        //     res.set({
        //         "Cache-Control": "public, max-age=3600",
        //     });
        // }
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

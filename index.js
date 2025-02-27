require("dotenv").config();
const url = require("url");
const express = require("express");
const next = require("next");

const cookieParser = require("cookie-parser");
const { serializeError } = require("serialize-error");
const logger = require("./src/lib/logger");

const port = process.env.PORT || 3000;
const dev = process.env.ENV !== "production" || process.env.FORCE_DEV === "true";
const hostname = process.env.HOSTNAME;

const nextApp = next({ dir: ".", dev, hostname, port });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
    const server = express();
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use(cookieParser());

    // Default catch-all renders Next app
    server.all("*", (req, res) => {
        if (req.url === "/") {
            res.set({
                "Cache-Control": dev ? "no-store" : "public, max-age=604800, must-revalidate",
            });
            const parsedUrl = url.parse(req.url, true);
            return nextHandler(req, res, parsedUrl);
        }

        const allowedPaths = ["/assets", "/_next", "/api"];

        if (allowedPaths.some((path) => req.url.startsWith(path))) {
            res.set({
                "Cache-Control": dev ? "no-store" : "public, max-age=604800, must-revalidate",
            });
            const parsedUrl = url.parse(req.url, true);
            return nextHandler(req, res, parsedUrl);
        }

        return res.redirect("https://spring.net/discover/basedvc");
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

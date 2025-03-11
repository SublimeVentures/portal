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

    // Only handle root and login routes
    server.get("/", (req, res) => {
        res.set({
            "Cache-Control": dev ? "no-store" : "public, max-age=604800, must-revalidate",
        });
        const parsedUrl = url.parse(req.url, true);
        return nextHandler(req, res, parsedUrl);
    });

    server.get("/login", (req, res) => {
        res.set({
            "Cache-Control": dev ? "no-store" : "public, max-age=604800, must-revalidate",
        });
        const parsedUrl = url.parse(req.url, true);
        return nextHandler(req, res, parsedUrl);
    });

    // Handle static assets and API routes needed by these pages
    server.get(["/assets/*", "/_next/*", "/api/*"], (req, res) => {
        res.set({
            "Cache-Control": dev ? "no-store" : "public, max-age=604800, must-revalidate",
        });
        const parsedUrl = url.parse(req.url, true);
        return nextHandler(req, res, parsedUrl);
    });

    // Redirect all other routes to the external login URL
    server.all("*", (req, res) => {
        return res.redirect("https://spring.net/discover/basedvc");
    });

    server.listen(port, (error) => {
        if (error) {
            logger.error(`ERROR :: Server listener`, {
                error: serializeError(error),
            });
            throw error;
        }
        logger.warn(`Lightweight server running on PORT:${port}`);
    });
});

const path = require("path");
const express = require("express");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// List of allowed pages
const ALLOWED_PAGES = ["/"];

app.prepare().then(() => {
    const server = express();

    // Handle allowed pages
    ALLOWED_PAGES.forEach((page) => {
        server.get(page, (req, res) => {
            return app.render(req, res, page, req.query);
        });
    });

    // Handle static files and assets
    server.get("/_next/*", (req, res) => {
        return handle(req, res);
    });

    server.get("/assets/*", (req, res) => {
        return handle(req, res);
    });

    // Redirect all other requests
    server.all("*", (req, res) => {
        return res.redirect("https://spring.net/discover/basedvc");
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${PORT} - env ${process.env.NODE_ENV}`);
    });
});

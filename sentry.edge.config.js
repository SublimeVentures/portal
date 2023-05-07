// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
const DNS = process.env.NEXT_PUBLIC_ENV == "dev" ? null : "https://45cad8926c1541e6aae53521e39930f3@o4504865409007616.ingest.sentry.io/4505141853552640"

Sentry.init({
  dsn: DNS,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});

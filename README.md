## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Envs
Example env file
```DATABASE=postgresql://username:password@host:port/db
IS_LOCAL_DB=true

DOMAIN=http://localhost:3000
ENV=dev
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
DATABASE_POOL_MAX=10
DATABASE_POOL_ACQUIRE=20000
DATABASE_POOL_IDLE=10000

HOSTNAME=127.0.0.1
AUTHER=http://localhost:2137
NEXT_PUBLIC_TENANT=1
```

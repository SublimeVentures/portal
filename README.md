## Getting Started

To get the application up and running, follow these steps:

#### Install dependencies

This will install all the necessary packages required for the project.

```bash
yarn install
```

### Run post-install scripts

This will execute any scripts that need to run after the installation of packages. It ensures the project is properly set up and configured.

```bash
yarn run prepare
```

### Run development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

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

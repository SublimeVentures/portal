This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## ToDo
-- https://blockeater.herokuapp.com/v3rify

===

investment -> test + check vault
fix links and style
write copy to fill the links

- homepage datafeed
- support errorów
implement @MrBlank feedback
https://discord.com/channels/@me/997001334328918017/1111268815238594642


- make offer button
- -- (buy) check liquidity 
- -- (buy) check allowance 
- -- (buy) check send transaction 

- processor
- -- receive webhook
- -- match hash with settlement
- -- build otcDeal
- -- expire otcPending after 5 minutes


- przy cancellowaniu sprawdź czy nie ma pending



- connect discord to app
- try catch every query na backendzie
- sprawdź transakcje

- timeline for user activities for each investment in vault tab
- new investment update for api
- reassign allocation
- find external providers of RPC (currently we are using public ones and that's why confirming transaction takes more time)
- -- - providers for bsc, matic, eth ---- https://www.ankr.com/ // https://dashboard.quicknode.com/quick-alerts // https://irwingtello.hashnode.dev/create-your-first-multi-chain-project-with-quicknode-and-wagmish

- promo codes to reduce our fees + rate limit on invest
- notifications
- https://tagmanager.google.com/?authuser=1#/container/accounts/6099625190/containers/116524298/workspaces/2

- extract style to 3vc / citcap
- migrate citcap
- referral system
- clean old otcPending - every month after backup


- whale deposit/ withdraw features in settings
- whale page
- invest from stake
- update data / refeed cach on url call
- w vault osobna kategoria z aktywnymi i nowymi updetami
- lazy loading na ofertach i vault
- onboarding whales





# 1. Add env variables
- whaleId
- vault
- diamond
- feeOtc
- feeReassign
- research
- partnerDelay
- partnerDefaultMulti

# 2. Add currencies 
For each chainId

# 3. For every new investment add Offer, Raise and logs.SLUG

//Bing
0xBe6ccC396255c24D82D609522539a10C3B9e06FC
0x3bd4bdcB7E9148FD14aaD842Bcdb80be869b9a57

//Musthafa
0x15980B1D93CC56a3da52d9908aB372D46Ee242a4
0x0FfD214b8bD957ec23986c3e342c4d9065742A98

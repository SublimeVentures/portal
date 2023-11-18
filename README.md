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


## ToDo
=================
Add click pointer on side toolbars in slider
otc to sidebar
otc bot
fabweilt
new relic to webapp


- bg in sidebar
- auth redirect fix
- clean payload in owned allocation
- dont send whole otc package for sell fill offers
- check prices on-chain


- notion in routes
- ChatGPT - try more https://discord.com/channels/@me/997001334328918017/1155135672894636132

- in app vote
- custom 404 page
- 500, 1000, user max button under investment size

- whale NFT
- whale page
- invest from stake
- whale deposit/ withdraw features in settings
- onboarding whales
- referral system
- update data / refeed cach on url call

- delegate cash fix
- staking (force eth)
  - delegate
  - change total staked
  - wyciagnij swoje
- delegated -> invest to vault or hot






//tasks

- blockeater
  - subscriber
    - callback
    - allow for confirmation on onchain restart
    - for some reason it expires everything- fix it
    - logs around expires
    - onchain event - zapisuj tak czy inaczej
    - filter incoming transaction through signed of wallets
    - better maching system
  - check guarnateed sub on transfer receive
  - check increaed allocation to expire
  - guaranteed allocation cant give more than 5k


- webapp
  - restart investment on timer zero
  - auto-close investment after reaching success
  - make sure guaranteed allow rebooking
  - bytes burn
  - calculator nt

- nt
  - max allo in UI

- add notfications for refunds
- test separate pools
- test all app


- add refund flow
- if someone is whale, should always return the all available allo left (getOfferAllocation())
- guaranteed (either day before or smaller amount to book [select]) && reserveSpot() at  const totalAllocation && bookAllocation()  && bookAllocationGuaranteed



///REQUIREMENTS:
- wallet cant be the same as last two investments

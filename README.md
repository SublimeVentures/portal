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
- rogi w modalu są ostre zanim jest fullscreen
- images for seo
- homepage datafeed
- fix button 
- -- - wszystko przez handler i loader && bubble loader
- -- - bubbles invest
- -- - invest button
- -- - login
- -- - connect

- isDev true hardcode fix + wagmi fix
- cfind elegant way to confirm vault / rollback vault
- providers for bsc, matic, eth ---- https://www.ankr.com/ // https://dashboard.quicknode.com/quick-alerts // https://irwingtello.hashnode.dev/create-your-first-multi-chain-project-with-quicknode-and-wagmish
- otc on success buy not moving to success
- on succesful buy not refreshing offers
- fix grida na buy otc offer (wiecej dla prawje strony)
- sign message
- bug on allocation restart
- add key in logs on amount

- timeline (dashboard, setting, vault)
  -- reassign facet
  -- confiential facet
- todo: reassign facet sprawdź ownership
- wszędzie dodaj check na <10 000 (otc remove, settle, reassign) - dodaj modifier
- validate payout address
- inny adres per invewestycje i inny monitoring

- DEPLOY
==========
- 
- connect discord to user profile
- transition on pages
- extract transition variable to separate file (dialogs)
- extract style for citcap
- citcap - https://layerzero.network/ menu effect + font
- list files / updates from projects
- promo codes

- w vault osobna kategoria z aktywnymi i nowymi updetami
- lazy loading na ofertach i vault
- onboarding whales
- whale deposit/ withdraw features in settings
- whale page


- connect delegate address delegate.cash (solidity)
- referral systems

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

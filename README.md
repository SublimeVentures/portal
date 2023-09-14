
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

## Add to clickup
- add SS integration image
- add SS staked API
- colliseum onboarding
- based login new flow
- fixed staking (refresh, season)
- display partner logo if metadata fetch failed
- migrating ss eq investment
- nft merge
- sentry errors [fixing blockeater processTransactionLog error - foreign key issue on db; fetch metadata from IPFS using pinata and add API KEY auth on backend;]
- piniata basedVC
- tokenomics proposal v2 - 2h - https://docs.google.com/spreadsheets/d/1z4vh7m4YsqrGJDzWoQH8QD_OVzMxFAglK_gC89Ph-qs/edit#gid=0
- info links on settings for citcap
- linked in - job post + job offer- https://docs.google.com/document/d/1PD2DjRvDTg5xEXO7rV3Y8YQfCXv78meWSVSgyWndhQc/edit?usp=sharing
- basedVC info links in app & notion -2h [vault, lootbox, upgrades, bookin system, investment cap, bookin system]
- db auto-backup -2h
- media rearrange
- find external providers of RPC (currently we are using public ones and that's why confirming transaction takes more time)
- -- - providers for bsc, matic, eth ---- https://www.ankr.com/ // https://dashboard.quicknode.com/quick-alerts // https://irwingtello.hashnode.dev/create-your-first-multi-chain-project-with-quicknode-and-wagmish

## ToDo
=================
- clickup

- basedVC costs estimation
- ben's hours https://app.clickup.com/t/86ay8d3v9
- timeline for user activities for each investment in vault tab
- reassign allocation
- w vault osobna kategoria z aktywnymi i nowymi updetami
- lazy loading na ofertach i vault


- notion in routes
- OTC
  - make offer button
  - -- (buy) check liquidity
  - -- (buy) check allowance
  - -- (buy) check send transaction

  - processor
  - -- receive webhook
  - -- match hash with settlement
  - -- build otcDeal
  - -- expire otcPending after 5 minutes
  - clean old otcPending - every month after backup
- =============
- reset modal settings on close
- modal issues - https://discord.com/channels/884204406189490176/996185131989606410/1135253613892091974 // - cant invest on bnb
- unlock button for failed set allowance

- UniButton -> GenericButton

- in app vote
- SS :: https://docs.google.com/document/d/13ZLpE_CvAzMiB7O22gnWeWMpjzGFT02n0KI2LHmYBhs/edit
- set isSettled, isPaused dla zakończonych jeśli raisses ma więce >0
- resolution issues: - https://discord.com/channels/@me/915237510928556052/1146846153917333544

- delegate cash fix
- staking (force eth)
  - delegate
  - change total staked
  - wyciagnij swoje
- delegated -> invest to vault or hot

- custom 404 page
- RR unmount
- investment calendar google
- rasied funds on landing

- 500, 1000, user max button under investment size

- connect discord to app
- notifications

- invest from stake
- update data / refeed cach on url call

- onboarding whales

- referral system

- new investment update for api
- whale deposit/ withdraw features in settings
- whale page


Hey man the site looks really good and stoked to see it on mobile! One issue I did notice was a pretty consistent resizing of the browser when I was checking it out before I connected my wallet. After connecting my wallet the interface was smooth like butter. I was using MetaMask’s in app browser on an iPhone.




code
https://discord.com/channels/959614664386424884/959614666852663408/1128581985779064833
0xb27EE3cDDA91dAe0e68c3fb59C15fff0FADf362f

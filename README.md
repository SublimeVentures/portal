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


============
- add SS integration image
- colliseum onboarding
- based login new flow
- fixed staking refresh
- display partner logo if metadata fetch failed
- migrating ss eq investment
=============

# tasks
simulation tokenomics
check what we want to deliver
then what are the features of our ecosystem + distribution mechnism
tokenomics high level
tokenomics split
What we raise for
wyceny https://docs.google.com/spreadsheets/d/1aU1vWb2f_RbZhc6bbtkPu4B36CRxW3aGPs5Sf9RmYIU/edit#gid=88558860
update diagram
update tiers
https://docs.google.com/spreadsheets/d/1z4vh7m4YsqrGJDzWoQH8QD_OVzMxFAglK_gC89Ph-qs/edit#gid=0
https://docs.google.com/spreadsheets/d/1aU1vWb2f_RbZhc6bbtkPu4B36CRxW3aGPs5Sf9RmYIU/edit#gid=1339721247
https://drive.google.com/file/d/1OZKQgrunAebY8rXRd05p7coeMKGTqLr0/view
elite ann.

## ToDo
=================
- nft mock
- =============
- SS staked - 0xe1d6e2aa30b32ac6ae2bae3b76cd69225f76f8c4
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
- delegate cash fix
- reset modal settings on close

- SS :: https://docs.google.com/document/d/13ZLpE_CvAzMiB7O22gnWeWMpjzGFT02n0KI2LHmYBhs/edit
- set isSettled, isPaused dla zakończonych jeśli raisses ma więce >0
- resolution issues: - https://discord.com/channels/@me/915237510928556052/1146846153917333544
- modal issues - https://discord.com/channels/884204406189490176/996185131989606410/1135253613892091974 // - cant invest on bnb

- staking (force eth)
  - delegate
  - change total staked 
  - wyciagnij swoje

- in app vote
- unlock button for failed set allowance
- sentry error

https://devcenter.heroku.com/articles/heroku-postgres-backups**

- custom 404 page
- media rearrange
- RR unmount
- investment calendar google
- UniButton -> GenericButton
- rasied funds on landing


- 500, 1000, user max button under investment size
- timeline for user activities for each investment in vault tab
- reassign allocation

- connect discord to app
- notifications

- invest from stake
- update data / refeed cach on url call
- w vault osobna kategoria z aktywnymi i nowymi updetami
- lazy loading na ofertach i vault
- onboarding whales

- find external providers of RPC (currently we are using public ones and that's why confirming transaction takes more time)
- -- - providers for bsc, matic, eth ---- https://www.ankr.com/ // https://dashboard.quicknode.com/quick-alerts // https://irwingtello.hashnode.dev/create-your-first-multi-chain-project-with-quicknode-and-wagmish
- delegated -> invest to vault or hot
- referral system

- new investment update for api
- whale deposit/ withdraw features in settings
- whale page


Hey man the site looks really good and stoked to see it on mobile! One issue I did notice was a pretty consistent resizing of the browser when I was checking it out before I connected my wallet. After connecting my wallet the interface was smooth like butter. I was using MetaMask’s in app browser on an iPhone.

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




code
https://discord.com/channels/959614664386424884/959614666852663408/1128581985779064833
0xb27EE3cDDA91dAe0e68c3fb59C15fff0FADf362f

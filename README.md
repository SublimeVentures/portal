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

//tasks
- webapp
  - calculator nt
  - ops
    - tasks
    - 


  - fix withRetry to use my flow
  - migration
    - old data
    - nt stake/withdraw
    - generate
    - graphic for login
    - logo mobile
  - returned fail log
  - bytes burn
- take money back for testing
- wagmi - json rpc
- auto-close investment after reaching success
- make sure guaranteed allow rebooking
- reset hash on chain change on otc and investment size

- refetch env + params.output.allocationUser_min
- fliper to service worker to ensure it will refrehs correctly
- check increaed allocation to expire
- guaranteed allocation cant give more than 5k
- add notfications for refunds
- test separate pools
- guaranteed - midify to be based on canInvestMore and ensure it will allows user to restart 
- check guarnateed sub on transfer receive
- guaranteed (either day before or smaller amount to book [select]) && reserveSpot() at  const totalAllocation && bookAllocation()  && bookAllocationGuaranteed
- checkAllocationConditions - add support for offer.alloMax
- user can have only three active bookings (expire old, inform on frontend, lock from new on frontend if more than 3)
- add refund flow
- if someone is whale, should always return the all available allo left (getOfferAllocation())
  Add click pointer on side toolbars in slider
  otc to sidebar
  otc bot

- bg in sidebar
- auth redirect fix
- clean payload in owned allocation
- dont send whole otc package for sell fill offers
- check prices on-chain
- in app vote for whales
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

///REQUIREMENTS:
- wallet cant be the same as last two investments

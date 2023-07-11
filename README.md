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
- https://discord.com/channels/@me/997001334328918017/1128115893784817765
- double click on login
- notion 
- add steady stacks as partner
- fcfs check
- custom 404 page


- change total staked + wyciagnij swoje
https://devcenter.heroku.com/articles/heroku-postgres-backups
- update costs - cloudflare & heroku
- check bings wallet 0x26e7f5f193354b22da271a57433acadab2c79480 across investments
- media rearrange
- withdraw my stake

- RR unmount
- investment calendar google
- UniButton -> GenericButton
- rasie funds on landing

- =============
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
- 500, 1000, user max button under investment size
- timeline for user activities for each investment in vault tab
- reassign allocation
- lootbox
- promo codes

- transakcje nie działają na rollbacku
- enable for reservation even on blocked reservation button
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


///access
only whales - 0
everyone - 1
nt - 2 


data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAxMjAwIDEyMDAiPjxpbWFnZSBocmVmPSJodHRwczovL25lb3Rva3lvLm15cGluYXRhLmNsb3VkL2lwZnMvUW1lcWVCcHNZVHVKTDhBWmhZOWZHQmVUajlRdXZNVnFhWmVSV0ZuakEyNFFFRS9iYWNrZ3JvdW5kLzQucG5nIi8+PGltYWdlIGhyZWY9Imh0dHBzOi8vbmVvdG9reW8ubXlwaW5hdGEuY2xvdWQvaXBmcy9RbWVxZUJwc1lUdUpMOEFaaFk5ZkdCZVRqOVF1dk1WcWFaZVJXRm5qQTI0UUVFL2JvZHkvMS5wbmciLz48aW1hZ2UgaHJlZj0iaHR0cHM6Ly9uZW90b2t5by5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZXFlQnBzWVR1Skw4QVpoWTlmR0JlVGo5UXV2TVZxYVplUldGbmpBMjRRRUUvY2xvdGgvMTQucG5nIi8+PGltYWdlIGhyZWY9Imh0dHBzOi8vbmVvdG9reW8ubXlwaW5hdGEuY2xvdWQvaXBmcy9RbWVxZUJwc1lUdUpMOEFaaFk5ZkdCZVRqOVF1dk1WcWFaZVJXRm5qQTI0UUVFL2hhbmQvMS0wLnBuZyIvPjxpbWFnZSBocmVmPSJodHRwczovL25lb3Rva3lvLm15cGluYXRhLmNsb3VkL2lwZnMvUW1lcWVCcHNZVHVKTDhBWmhZOWZHQmVUajlRdXZNVnFhWmVSV0ZuakEyNFFFRS93ZWFwb24vMTEucG5nIi8+PGltYWdlIGhyZWY9Imh0dHBzOi8vbmVvdG9reW8ubXlwaW5hdGEuY2xvdWQvaXBmcy9RbWVxZUJwc1lUdUpMOEFaaFk5ZkdCZVRqOVF1dk1WcWFaZVJXRm5qQTI0UUVFL2hlYWQvMS5wbmciLz48aW1hZ2UgaHJlZj0iaHR0cHM6Ly9uZW90b2t5by5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZXFlQnBzWVR1Skw4QVpoWTlmR0JlVGo5UXV2TVZxYVplUldGbmpBMjRRRUUvbW91dGgvMS03LnBuZyIvPjxpbWFnZSBocmVmPSJodHRwczovL25lb3Rva3lvLm15cGluYXRhLmNsb3VkL2lwZnMvUW1lcWVCcHNZVHVKTDhBWmhZOWZHQmVUajlRdXZNVnFhWmVSV0ZuakEyNFFFRS9ub3NlLzEtMi5wbmciLz48aW1hZ2UgaHJlZj0iaHR0cHM6Ly9uZW90b2t5by5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZXFlQnBzWVR1Skw4QVpoWTlmR0JlVGo5UXV2TVZxYVplUldGbmpBMjRRRUUvZXllcy8xLTEucG5nIi8+PGltYWdlIGhyZWY9Imh0dHBzOi8vbmVvdG9reW8ubXlwaW5hdGEuY2xvdWQvaXBmcy9RbWVxZUJwc1lUdUpMOEFaaFk5ZkdCZVRqOVF1dk1WcWFaZVJXRm5qQTI0UUVFL2hhaXIvNy5wbmciLz48aW1hZ2UgaHJlZj0iaHR0cHM6Ly9uZW90b2t5by5teXBpbmF0YS5jbG91ZC9pcGZzL1FtZXFlQnBzWVR1Skw4QVpoWTlmR0JlVGo5UXV2TVZxYVplUldGbmpBMjRRRUUvaGVsbS8yLnBuZyIvPjwvc3ZnPg=
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIHN0cm9rZT0ib3JhbmdlIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9InllbGxvdyIgLz48L3N2Zz4=

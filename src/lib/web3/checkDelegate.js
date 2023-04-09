import {DelegateCash} from "delegatecash";
import {Network, Alchemy} from 'alchemy-sdk';
import {fetchPartners} from "@/fetchers/public";

//todo: replace with env
const settings = {
    apiKey: 'A9Z2dv55CjRNyQlhDMaVDY20sBqXgZku', // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
};

let alchemy, provider, dc

export const checkDelegate = async (address) => {
    if (!alchemy) {
        alchemy = new Alchemy(settings);
        provider = await alchemy.config.getProvider();
        dc = new DelegateCash(provider);
    }

    try {
        const delegations = await dc.getDelegationsByDelegate(address);
        if (delegations?.length > 0) {
            const partners = await fetchPartners()

            let amt = 0;
            let tokenId = 0;
            let tokenIdContract;
            for (let i = 0; i < partners.length; i++) {
                const isDelegated = delegations.filter(el => el.contract === partners[i].address)
                if (isDelegated.length > 0) {
                    amt += isDelegated.length
                    isDelegated.forEach(el => {
                        if (el.tokenId > 0) {
                            tokenId = el.tokenId
                            tokenIdContract = el.contract
                        }
                    })
                }

                if (!tokenIdContract) {
                    tokenIdContract = isDelegated[0].contract
                }
            }

            if (amt > 0) {
                const partner = partners.find(el => el.address === tokenIdContract)

                let image = partner.logo;
                if(tokenId !== 0) {
                     const metadata = await alchemy.nft.getNftMetadata(tokenIdContract, tokenId)
                        image = metadata.contract.openSea.imageUrl
                }
                return {
                    amt: amt,
                    name: partner.name,
                    symbol: partner.symbol,
                    type: `ERC${partner.type}`,
                    img: image,
                    id: tokenId,
                    ACL: 3
                }
            } else return null

        } else {
            return null;
        }
    } catch(e) {
        console.log("e, checkDelegate ::", e)
        return null
    }


}

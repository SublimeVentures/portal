const {getWeb3} = require("../../services/web3");
const delegateAbi = require("../../../abi/delegate.abi.json");
const {upsertDelegation} = require("../../queries/delegate.query");
const {ACLs} = require("../../../src/lib/authHelpers");
const Sentry = require("@sentry/nextjs");

async function isDelegated(address, enabledCollections) {
    console.log("AUTH :: Checking if Delegated")

    try {
        const {jsonResponse: delegations} = await getWeb3().query.EvmApi.utils.runContractFunction({
            "chain": "0x1",
            "functionName": "getDelegationsByDelegate",
            "address": "0x00000000000076A84feF008CDAbe6409d2FE638B",
            "abi": delegateAbi,
            "params": {delegate: address}
        });

        if (!delegations || delegations?.length === 0) return null

        let tokenId = 0;
        let partnerContract;
        let vault;
        let image;
        let multiplier;

        for (let i = 0; i < enabledCollections.length; i++) {
            const isDelegated = delegations.filter(el => el[3] === enabledCollections[i].address)

            if (isDelegated.length > 0) {

                const parsedDelegation = isDelegated.map(el => ({
                    vault: el[1],
                    address: el[2],
                    partner: el[3],
                    tokenId: Number(el[4])
                }))

                parsedDelegation.forEach(el => {
                    if (el.tokenId > 0) {
                        tokenId = el.tokenId
                        partnerContract = el.partner
                        vault = el.vault
                    }
                })

                if (!partnerContract) {
                    partnerContract = parsedDelegation[0].partner
                    vault = parsedDelegation[0].vault
                }
                break;
            }
        }

        const collectionDetails = enabledCollections.find(el => el.address === partnerContract)
        if (!partnerContract) return false

        image = collectionDetails.logo;
        const {jsonResponse: nftUsed} = await getWeb3().query.EvmApi.nft.getNFTMetadata({
            address: partnerContract,
            chain: "0x1",
            "normalizeMetadata": true,
            tokenId,
        });

        if (nftUsed.normalized_metadata?.image?.startsWith("http")) {
            image = nftUsed.normalized_metadata.image
        }

        await upsertDelegation({address, vault, partner: collectionDetails.address, tokenId})
        if (collectionDetails.isMetadata) {
            const attributeVal = nftUsed.normalized_metadata.attributes.find(el => el.trait_type === collectionDetails.metadataProp)?.value
            multiplier = collectionDetails.metadataVal[attributeVal]
        } else {
            multiplier = collectionDetails.multiplier
        }

        return {
            name: collectionDetails.name,
            symbol: collectionDetails.symbol,
            multi: multiplier,
            img: image,
            id: tokenId,
            ACL: ACLs.Delegated,
            vault,
        }
    } catch (e) {

        Sentry.captureException({location: "checkDelegate", error: e, address});
        return false
    }
}

module.exports = {isDelegated}

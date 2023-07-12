const {testData} = require("./json");
const citcapSeasonAbi = require("./abi/citcapS.abi.json");
const {connectWeb3, getWeb3} = require("./server/services/web3_test");

const parseFromUri = async (uri) => {
    const response = await fetch(uri);
    const metadata = await response.json();
    const seasonAttr = metadata.attributes.find(el => el.trait_type === "Season")?.value
    const isS1 = seasonAttr === "Season 1"
    const image = metadata.image
    const id = metadata.name.split("#").at(-1)
    return {
        isS1, image, id
    }
}

const parseFromMetaData = (object) => {
    const metadata = JSON.parse(object.metadata)
    const seasonAttr = metadata.attributes.find(el => el.trait_type === "Season")?.value
    const isS1 = seasonAttr === "Season 1"
    const id = metadata.name.split("#").at(-1)
    const image = false
    return {
        isS1, image, id
    }
}


const getFromBlockchain = async (tokenAddress, tokenID) => {
    const {jsonResponse} = await getWeb3().query.EvmApi.utils.runContractFunction({
        "chain": "0x1",
        "functionName": "tokenURI",
        "address": tokenAddress,
        "abi": citcapSeasonAbi,
        "params": {tokenId: tokenID}
    });
    const base64Url = jsonResponse.replace(/^data:application\/json;base64,/, '');
    const decodedData = atob(base64Url).replace(': ""',':"');
    let metadata = JSON.parse(decodedData.replace( /(\"description\":\s?\")(.+)?(\",)/g, ''));

    const seasonAttr = metadata.attributes.find(el => el.trait_type === "Season")?.value
    const isS1 = seasonAttr === "Season 1"
    const id = metadata.name.split("#").at(-1)
    const image = false
    return {
        isS1, image, id
    }
}

const parse = async () => {
    const array = testData
    await connectWeb3()
    for(let i=0; i< array.length; i++) {
        const uri = array[i].token_uri
        console.log("uri", uri)
        const uriTest = uri ? uri.split("/").at(-1) : null
        let result
        if(!uriTest || uri === uriTest) {
            console.log("test")
            if(array[i].metadata) {
                result = parseFromMetaData(array[i])
            } else {
                result = await getFromBlockchain(array[i].token_address, array[i].token_id)
            }
        } else {
            result = await parseFromUri(uri)
        }

        console.log("result", result)
    }



}

parse ()

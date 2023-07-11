const {testData} = require("./json");

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

const parse = async () => {
    const array = testData

    for(let i=0; i< array.length; i++) {
        const uri = array[i].token_uri
        const uriTest = uri.split("/").at(-1)
        let result
        if(uri === uriTest) {
            if(array[i].metadata) {
                result = parseFromMetaData(array[i])
            }
        } else {
            result = await parseFromUri(uri)
        }

        console.log("result", result)
    }



}

parse ()

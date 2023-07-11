const {s1, s2, s3, s4, s5, s6, s7} = require("./json");

const parseFromUri = async (uri) => {
    const response = await fetch(uri);
    const metadata = await response.json();
    const seasonAttr = metadata.attributes.find(el.trait_type === "Season")?.value
    const isS1 = seasonAttr === "Season 1"
    const image = metadata.image
    const id = metadata.name.split("#").at(-1)
    return {
        isS1, image, id
    }
}


const parse = async () => {
    const array = [s1, s2, s3, s4, s5, s6, s7]

    for(let i=0; i< array.length; i++) {
        const uri = array[i].token_uri
        const uriTest = uri.split("/").at(-1)
        try {
            const Number(uriTest)

        } catch () {

        }
        if(Number.isInteger(uriTest)) {
           const data = await parseFromUri(uri)
            console.log("data", data)
        }
    }



}

parse ()

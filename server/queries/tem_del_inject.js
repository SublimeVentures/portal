const { models } = require('../services/db/db.init');
const toInject = require('./../3vc_LB.json')
// const toInject = require('./../3vc_investors.json')
const Web3Utils = require("web3-utils");
async function insertData() {
    let insert =[]

    toInject.forEach(el => {
        const id = el.offer === "unyfy" ? 24 : (el.offer === "arcade" ? 21 : 26)
        const date = el.offer === "unyfy" ? 1683738000 : (el.offer === "arcade" ? 1678733100 : 1685728800)
        if(!id) {
            console.log("ERROR", id, el)

        }
        insert.push({
            owner: Web3Utils.toChecksumAddress(el.address),
            invested: el.amount,
            refund: 0,
            refundState: 0,
            locked: 0,
            offerId: id,
            createdAt: new Date(date * 1000).toISOString(),
            updatedAt: new Date(date * 1000).toISOString()
        })
    })
    // console.log("insert",insert)

    // const projects = await models.vaults.bulkCreate(insert)

}

module.exports = { insertData }



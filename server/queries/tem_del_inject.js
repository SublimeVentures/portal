const { models } = require('../services/db/db.init');
const Web3Utils = require("web3-utils");
const { v4: uuidv4 } = require('uuid');

const offerID = 24          //TODO: CHANGE
const participants = require(`./../../_temp/${offerID}_participants.json`)
const vaults = require(`./../../_temp/${offerID}_vaults.json`)

async function insertData() {
    let insert_participants =[]
    let insert_vaults =[]

    const data = participants[0].createdAt

    vaults.forEach(el => {
        insert_vaults.push({
            owner: Web3Utils.toChecksumAddress(el.owner),
            invested: el.invested,
            refund: el.refund,
            refundState: el.refundState,
            locked: el.locked,
            offerId: offerID,
            createdAt: new Date(data * 1000).toISOString(),
            updatedAt: new Date(data * 1000).toISOString()
        })
    })

    // participants.forEach(el => {
    //     insert_participants.push({
    //         address: Web3Utils.toChecksumAddress(el.address),
    //         nftId: el.nftId,
    //         amount: el.amount,
    //         acl: el.acl,
    //         hash: uuidv4(),
    //         tx: el.tx,
    //         isConfirmedInitial: el.isConfirmedInitial,
    //         isConfirmed: el.isConfirmed,
    //         isExpired: el.isExpired,
    //         createdAt: new Date(el.createdAt * 1000).toISOString(),
    //         updatedAt: new Date(el.updatedAt* 1000).toISOString()
    //     })
    // })

    console.log("vaults",vaults.length, insert_vaults.length)
    // console.log("participants", participants.length, insert_participants.length)

    // const vault_res = await models.vaults.bulkCreate(insert_vaults)
    // const participants_res = await models.participants_26.bulkCreate(insert_participants) //TODO: CHANGE

}

module.exports = { insertData }



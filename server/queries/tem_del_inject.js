const { models } = require('../services/db/db.init');
const Web3Utils = require("web3-utils");
const { v4: uuidv4 } = require('uuid');
const db = require('../services/db/db.init');

const offerID = 24          //TODO: CHANGE
// const participants = require(`./../../_temp/${offerID}_participants.json`)
// const vaults = require(`./../../_temp/${offerID}_vaults.json`)
const {QueryTypes} = require("sequelize");
//
// async function insertData() {
//     let insert_participants =[]
//     let insert_vaults =[]
//
//     const data = participants[0].createdAt
//
//     vaults.forEach(el => {
//         insert_vaults.push({
//             owner: Web3Utils.toChecksumAddress(el.owner),
//             invested: el.invested,
//             refund: el.refund,
//             refundState: el.refundState,
//             locked: el.locked,
//             offerId: offerID,
//             createdAt: new Date(data * 1000).toISOString(),
//             updatedAt: new Date(data * 1000).toISOString()
//         })
//     })
//
//     // participants.forEach(el => {
//     //     insert_participants.push({
//     //         address: Web3Utils.toChecksumAddress(el.address),
//     //         nftId: el.nftId,
//     //         amount: el.amount,
//     //         acl: el.acl,
//     //         hash: uuidv4(),
//     //         tx: el.tx,
//     //         isConfirmedInitial: el.isConfirmedInitial,
//     //         isConfirmed: el.isConfirmed,
//     //         isExpired: el.isExpired,
//     //         createdAt: new Date(el.createdAt * 1000).toISOString(),
//     //         updatedAt: new Date(el.updatedAt* 1000).toISOString()
//     //     })
//     // })
//
//     console.log("vaults",vaults.length, insert_vaults.length)
//     // console.log("participants", participants.length, insert_participants.length)
//
//     // const vault_res = await models.vaults.bulkCreate(insert_vaults)
//     // const participants_res = await models.participants_26.bulkCreate(insert_participants) //TODO: CHANGE
//
// }



async function insertData () {

    const query = `
        SELECT *
        FROM participants_35
        WHERE "isConfirmed" = true
        ORDER BY "createdAt" ASC;
    `

    const result =  await db.query(query, {
        type: QueryTypes.SELECT,
        raw:true
    })


    let inserts = {}

    let invested = 0
    let refunds = 0
    let amount = 0
    for(let i=0; i<result.length; i++) {
        if(!inserts[result[i].address]) {
            inserts[result[i].address] = {
                invested: 0,
                refund:0
            }
        }
        let transfer_amt = result[i].amount
        let transfer_address = result[i].address
        amount += transfer_amt

        if(amount < 215970) {
            inserts[transfer_address].invested += transfer_amt
            invested += transfer_amt
        } else {
            inserts[transfer_address].refund += transfer_amt
            refunds += transfer_amt
        }
        console.log(`wallet ${transfer_address}: ${transfer_amt}, total: ${amount}`, inserts[result[i].address])

    }

    console.log("amount",amount)
    // console.log("inserts",inserts)
    console.log("refunds",refunds)
    // console.log("invested",invested)
    console.log("invested2",inserts['0xd9881FB8d9c1b4622f15c6929fbA8b2D0f521759'])
    console.log("invested2",inserts['0xEd531bc4eED3bEb5919B7e5eE024Ff0E0B5E8733'])
    //
    for (const owner in inserts) {
        const { invested, refund } = inserts[owner];
        const query2 = `
            UPDATE vaults AS v
            SET invested = ${invested}, refund = ${refund}
            WHERE
                v.owner = '${owner}' and "offerId" = 35
        `;

        await db.query(query2, {
            type: QueryTypes.UPDATE,
            raw: true
        });
    }


}
module.exports = { insertData }



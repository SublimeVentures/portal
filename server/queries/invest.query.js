const {models} = require('../services/db/index');
const db = require('../services/db/index');
const {Op} = require("sequelize");

async function getOfferRaise(id) {
    return await models.raises.findOne({
        where: {id},
        include: {
            attributes: ['id', 'alloTotalPartner'],
            model: models.offers
        }
    })
}

async function bookAllocation(offerId, isSeparatePool, totalAllocation, address, hash, amount, acl, tokenId) {
    let sumFilter
    let variable
    if (isSeparatePool) {
        variable = "alloResPartner"
        sumFilter = `"offerId" = ${offerId} AND COALESCE("alloResPartner",0) + COALESCE("alloFilledPartner",0) + COALESCE("alloSidePartner",0) <= ${totalAllocation}`
    } else {
        variable = "alloRes"
        sumFilter = `"offerId" = ${offerId} AND COALESCE("alloRes",0) + COALESCE("alloFilled",0) + COALESCE("alloSide",0) <= ${totalAllocation}`
    }

    const date = new Date().toISOString();
    const participants = `
        INSERT INTO public.participants_1 (address, "nftId", amount, acl, hash, "createdAt", "updatedAt")
        VALUES ('${address}', '${tokenId}', '${amount}', '${acl}', '${hash}', '${date}', '${date}')
            on conflict("address", "hash") do
        update set amount=EXCLUDED.amount, "acl"=EXCLUDED."acl", "nftId"=EXCLUDED."nftId", "updatedAt"=EXCLUDED."updatedAt";
    `
    try {

        const result = await db.transaction(async (t) => {
                const booked = await models.raises.increment({[variable]: amount}, {
                    where: {
                        [Op.and]: [
                            db.literal(sumFilter)
                        ]
                    }
                }, {transaction: t});

                if (!booked[0][1]) throw new Error("Not enough allocation");

                await db.query(participants, {
                    model: models.participants,
                    mapToModel: true // pass true here if you have any mapped fields
                });

                return true;
            }
        );

        return result

    } catch
        (error) {
        console.log("Transaction error", error)
        return false
    }
}


module.exports = {getOfferRaise, bookAllocation}

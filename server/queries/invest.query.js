const {models} = require('../services/db/index');
const db = require('../services/db/index');
const {Op, QueryTypes} = require("sequelize");
const Sentry = require("@sentry/nextjs");

async function getOfferRaise(id) {
    return models.raises.findOne({
        where: {offerId: id},
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
        INSERT INTO public.participants_${offerId} ("address", "nftId", "amount", "acl", "hash", "createdAt", "updatedAt")
        VALUES ('${address}', ${tokenId}, ${amount}, ${acl}, '${hash}', '${date}', '${date}')
            on conflict("address", "hash") do
        update set amount=EXCLUDED.amount, "acl"=EXCLUDED."acl", "nftId"=EXCLUDED."nftId", "updatedAt"=EXCLUDED."updatedAt";
    `
    try {
        await db.transaction(async (t) => {

                const booked = await models.raises.increment({[variable]: amount}, {
                    where: {
                        [Op.and]: [
                            db.literal(sumFilter)
                        ]
                    }
                }, {transaction: t});

                if (!booked[0][1]) throw new Error("Not enough allocation");

                await db.query(participants, {
                    transaction: t,
                    type: QueryTypes.UPSERT,
                    model: models.participants,
                });

                return true;
            }
        );
        return true;


    } catch (error) {
        console.log("error",error)
        Sentry.captureException({location: "bookAllocation", error, data: {offerId, isSeparatePool, totalAllocation, address, hash, amount, acl, tokenId}});
        return false
    }
}

async function expireAllocation(offerId, address, hash) {
    const participants = `
            UPDATE public.participants_${offerId} 
            SET "isExpired"=true, "updatedAt"='${new Date().toISOString()}' 
            WHERE "address"='${address}' AND "hash" = '${hash}';
    `

    await db.query(participants, {
        model: models.participants,
    });
}


module.exports = {getOfferRaise, bookAllocation, expireAllocation}

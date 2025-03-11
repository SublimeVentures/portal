const db = require("../services/db/definitions/db.init");

const { defineParticipantModel } = require("../services/db/definitions/models/participant.model");

async function sumAmountForUserAndTenant(offerId, userId, tenantId) {
    const ParticipantModel = defineParticipantModel(db, offerId);

    try {
        const result = await ParticipantModel.findAll({
            attributes: ["amount", "isConfirmedInitial"],
            where: {
                userId,
                tenantId,
                isExpired: false,
            },
            raw: true,
        });

        let booked = 0;
        let invested = 0;
        let total = 0;

        result.forEach((item) => {
            if (item.isConfirmedInitial) {
                invested += item.amount;
            } else {
                booked += item.amount;
            }
            total += item.amount;
        });

        return {
            booked,
            invested,
            total,
        };
    } catch (error) {
        console.error("Error in sumAmountForUserAndTenant:", error);
        return {
            booked: 0,
            invested: 0,
            total: 0,
        };
    }
}

module.exports = { sumAmountForUserAndTenant };

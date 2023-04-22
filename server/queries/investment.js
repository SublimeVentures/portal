const Offer = require("../models/Offer.js");
const Investment = require("../models/investment.js");

async function getUserInvestment(owner, offerId) {
    return Investment.findOne({owner, offerId}, '-_id')
}

async function getUserInvestments(owner) {
    return Investment.find({owner}, '-_id')
}

async function getUserInvestmentsExpanded(owner) {
    return Investment.aggregate([
            {
                $match: {
                    owner: owner
                }
            },
            {
                $lookup: {
                    from: Offer.collection.name,
                    localField: "offerId",
                    foreignField: "id",
                    as: "offerDetails",
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                slug:1,
                                image:1,
                                name:1,
                                tge:1,
                                b_ppu:1,
                                t_unlock:1,
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: '$offerDetails' } },


        ]
    )
}


module.exports = {getUserInvestment, getUserInvestments, getUserInvestmentsExpanded}

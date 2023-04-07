const Offer = require("../models/offer.js");

 async function upsertOffer(data) {
    return Offer.findOneAndUpdate(
        {
            id: data.id
        }, {
            b_name:data.b_name,
            b_data: data.b_data,
            b_otc: data.b_otc,
            b_ppu: data.b_ppu,
            b_alloMin: data.b_alloMin,
            b_alloRaised: data.b_alloRaised,
            b_alloTotal: data.b_alloTotal,
            b_dopen: data.b_dopen,
            b_dclose: data.b_dclose,
            b_tax: data.b_tax,
            b_isMultiphase: data.b_isMultiphase,
            b_isPaused: data.b_isPaused,
            b_isSettled: data.b_isSettled,
            b_isRefund: data.b_isRefund,
        }, {upsert: true, new:true}
    );
}

 async function getOffersPublic() {
  return Offer.find({c_showPublic: true}, {b_name:1, d_image:1, d_type:1, _id:0})
}

module.exports = { upsertOffer, getOffersPublic }

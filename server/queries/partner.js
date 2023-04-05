import Partner from "../models/partner.js";


export async function getPartners() {
  return Partner.find({isVisible: true}, {createdAt:0, updatedAt:0, isVisible:0, _id:0})
}

const { getLatestNewsForPartner } = require("../queries/news.query");

async function partnerNews(req, res, user) {
    const { partnerId, tenantId } = user;

    const news = await getLatestNewsForPartner(partnerId, tenantId);

    return res.status(200).json(news);
}

module.exports = { partnerNews };

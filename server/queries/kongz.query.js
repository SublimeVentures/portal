const {models} = require('../services/db/definitions/db.init');
const {Op} = require("sequelize");
const logger = require("../../src/lib/logger");
const {serializeError} = require("serialize-error");
const {TENANT} = require("../../src/lib/tenantHelper");

async function getCyberKongzEnvs() {
        try {
            const result = await models.environment.findAll({
                attributes: ['name', 'value'],
                where: {
                    name: {
                        [Op.in]: ['stakeRequired', 'stakeMulti']
                    },
                    partnerId: TENANT.CyberKongz
                },
                raw: true
            });
            console.log("result",result)

            return result;
        } catch (error) {
            logger.error('QUERY :: [getNeoTokyoEnvs]', {error: serializeError(error)});
        }
        return []
}

module.exports = { getCyberKongzEnvs}

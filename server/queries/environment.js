// import Environment from "../models/environment.js";
const Environment = require("../models/environment.js");

async function upsertEnvironment(name, value) {
    return Environment.findOneAndUpdate(
        {
            name: name.toLowerCase()
        }, {
            value:value,
        }, {upsert: true}
    );
}

async function getEnvironment() {
    const env = await Environment.find({}, 'name value -_id')
    return Object.assign({}, ...(env.map(item => ({ [item.name]: item.value }) )));
}


module.exports = { getEnvironment, upsertEnvironment }

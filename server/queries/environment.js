import Environment from "../models/environment.js";

export async function upsertEnvironment(name, value) {
    return Environment.findOneAndUpdate(
        {
            name: name.toLowerCase()
        }, {
            value:value,
        }, {upsert: true}
    );
}

export async function getEnvironment() {
    const env = await Environment.find({}, 'name value -_id')
    return Object.assign({}, ...(env.map(item => ({ [item.name]: item.value }) )));
}

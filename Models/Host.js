module.exports = class Host {


    constructor(id, attributes) {
        this._id = id;
        this._attributes = attributes;
        delete this._attributes.created_at;
        delete this._attributes.updated_at;
        if (this._attributes.type_of === "akamai") {
            // Obfuscated Code. 
            // Please find the appropriate keys to remove by try n error or from the Reference Documentation
        }
    }

    getHost() {
        return {
            id: this._id,
            "data": {
                "attributes": this._attributes,
                "type": "hosts"
            }
        };

    }
    get id() {
        return this._id;
    }
    get attributes() {
        return Object.assign({}, this._attributes);
    }
}
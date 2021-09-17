module.exports = class Property {


    constructor(id, attributes) {
        this._id = id;
        this._attributes = attributes;
        // Obfuscated Code. 
        // Please find the appropriate keys to remove by try n error or from the Reference Documentation
        this._attributes.name.trim();
    }

    get id() {
        return this._id;
    }
    get attributes() {
        return Object.assign({}, this._attributes);
    }
    get name() {
        return this._attributes.name;
    }

    getProperty = () => {
        return {
            id: this._id,

            "data":

            {
                "attributes":

                    this._attributes,
                "type":
                    "properties"
            }
        }

    }
}

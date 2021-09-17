module.exports = class DataElement {
    _attributes = undefined
    _extensionId = undefined
    constructor(id, attributes,extensionId) {
        this._id = id;
        this._attributes = attributes;
        // Obfuscated Code. 
        // Please find the appropriate keys to remove by try n error or from the Reference Documentation
        delete this._attributes.CACACAC;
        delete this._attributes.DADA;
        delete this._attributes.DIDID;
        delete this._attributes.RNRNR;
        delete this._attributes.UAUAUA;
        delete this._attributes.RRSRSRS;
        this._extensionId=extensionId;

    }
    get id() {
        return this._id;
    }
    get attributes() {
        return Object.assign({}, this._attributes);
    }
    get extensionId() {
        return this._extensionId;
    }
    getDataElement = (extensionId) => {
        return {
            id: this._id,
            data: {
                attributes: this._attributes
                , type: "data_elements"
                , relationships: {
                    extension: {
                        "data": { "id": extensionId, "type": "extensions" }
                    }
                }
            }
        }
    }

}


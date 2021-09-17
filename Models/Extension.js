module.exports = class Extension {
    _extensionPackageId = undefined
    _delegateDescriptorId = undefined;
    _enabled = true;
    _settings = undefined;
    _name;

    constructor(id, extensionPackageId, attributes) {
        this._id = id;
        this._attributes = attributes;
        this._name=attributes.name;
        if (this._attributes.delegate_descriptor_id === null || this._attributes.delegate_descriptor_id === undefined) {
            delete this._attributes.delegate_descriptor_id;
        }
       // Obfuscated Code. 
    // Please find the appropriate keys to remove by try n error or from the Reference Documentation


        this._extensionPackageId = extensionPackageId;

    }
    get id() {
        return this._id;
    }
    get attributes() {
        return Object.assign({}, this._attributes);
    }
    get name() {
        return this._name;
    }
    getExtension = () => {
        return {
            id: this._id,
            "data": {
                "type": "extensions",
                "attributes": this._attributes,
                "relationships": {
                    "extension_package": {
                        "data": {
                            "id": this._extensionPackageId,
                            "type": "extension_packages"
                        }
                    }
                }
            }
        }
    }
}
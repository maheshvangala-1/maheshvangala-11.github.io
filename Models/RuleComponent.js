module.exports = class RuleComponent {
    _attributes = undefined
    constructor(id, attributes, ruleId, extensionId) {
        this._id = id;
        this._attributes = attributes;
        this._extensionId = extensionId;
        this._ruleId = ruleId;
        // Obfuscated Code. 
        // Please find the appropriate keys to remove by try n error or from the Reference Documentation

    }
    get id() {
        return this._id;
    }

    get ruleId() {
        return this._ruleId;
    }

    get extensionId() {
        return this._extensionId;
    }
    get attributes() {
        return Object.assign({}, this._attributes);
    }
    getRuleComponent = (extensionId, ruleId) => {
        return {
            id: this._id,
            "data": {
                "attributes": this._attributes,
                "relationships": {
                    "extension": {
                        "data": {
                            "id": extensionId,
                            "type": "extensions"
                        }
                    }, "rules": {
                        "data": [{
                            "id": ruleId,
                            "type": "rules"
                        }]
                    }
                },
                "type": "rule_components"
            }
        }


    }
}
module.exports = class Rule {
    _name = undefined;
    constructor(id, attributes) {
    this._id = id; this._attributes = Object.assign({}, { name: attributes.name, enabled: attributes.enabled });

    }
    getRule = () => {
        return {
            id: this._id,
            "data": {
                "attributes": this._attributes,
                "type": "rules"
            }
        };

    }
    get id() {
        return this._id;
    }
    get attributes() {
        return Object.assign({}, this._attributes);
    }
    getUpdatedRule = (newRuleId) => {
        return {
            "data": {
                "attributes": this._attributes,
                "type": "rules",
                id: newRuleId
            }
        };

    }
};



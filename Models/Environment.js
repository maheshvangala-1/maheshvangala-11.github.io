module.exports = class Environment {


  constructor(id, attributes, hostId) {
    this._id = id;
    this._attributes = attributes;
    // Obfuscated Code. 
    // Please find the appropriate keys to remove by try n error or from the Reference Documentation
    delete this._attributes.CACA;
    delete this._attributes.UAUA;
    delete this._attributes.STST
    delete this._attributes.TOTO
    delete this._attributes.LPLP;
    delete this._attributes.LNLN;
    delete this._attributes.LEPLEP;


    this._hostId = hostId;

  }
  get id() {
    return this._id;
  }
  get attributes() {
    return Object.assign({}, this._attributes);
  }

  get hostId() {
    return this._hostId;
  }
  getEnvironment = (hostId) => {
    return {
      id: this._id,
      "data": {
        "attributes": this._attributes,
        "type": "environments",
        "relationships": {
          "host": {
            "data": {
              "id": hostId,
              "type": "hosts"
            }
          }
        },

      }
    };
  }
}
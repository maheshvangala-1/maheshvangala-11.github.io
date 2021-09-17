var request = require("request");
var globalResponse = undefined;
var currentComponentType = undefined;
var dataStore = {};
var currentComponentType = "";
var manyResultsExpected = false;
var DataElement = require("./Models/DataElement");
var Property = require("./Models/Property");
var Rule = require("./Models/Rule");
var RuleComponent = require("./Models/RuleComponent");
var Extension = require("./Models/Extension");
var Environment = require("./Models/Environment");
var Host = require("./Models/Host");
// const  {delete}  = require("request");

var currentComponentId = "";

// console.log("HHHH");
function get(auth, payload) {
    return new Promise((resolve, reject) => {
         console.log("DHONI");
         console.log(payload);
        component1Type = payload.component1Type
        component1Id = payload.component1Id
        component2Type = payload.component2Type
        
        requestObject = getRequestObject({ method: "get", ...payload, ...auth });
        console.log(requestObject); 
        
        
        request(requestObject, async (err, res, body) => {
            try {
                // console.log(requestObject);
                
                var responseJSON = JSON.parse(body);
                console.log(responseJSON);
                if (responseJSON["errors"]) {
                
                    reject(responseJSON);
                } else {
                    var data = responseJSON.data;
                    console.log(data);

                     console.log("HIII");
                    
                     resolve(responseJSON.data)
                    // console.log(data[0].attributes);

                    
                    // myprop=new Property(data[0].id,data[0].attributes)

                    // console.log("SSSS");
                    // console.log(myprop.getProperty());
                    // console.log(data);
                    // Recursively call Launch APIs to get all the components and store it in local data storage. 
                    // Once all the components are fetched. return.
                }

            } catch (exception) {
                reject(body);
            }

        });
    })

}

const getRequestObject = (function () {

    return function (payload) {
        // console.log("DHONI");
        console.log(payload);
        console.log("KSKSKSK");
        var url = new URL("https://reactor.adobe.io");
        var component1Type = payload.component1Type ? "/" + payload.component1Type : "";
        var component1Id = payload.component1Id ? "/" + payload.component1Id : "";
        var component2Type = payload.component2Type ? "/" + payload.component2Type : "";
        var finalComponent = component2Type === "" ? component1Type : component2Type;
        currentComponentId = payload.component1Id;
        currentComponentType = finalComponent;
        // console.log("SHHHHHHHHHHHHHHH");
        // console.log(component1Type);
        // console.log(component1Id);
        // console.log(component2Type);
        // console.log(finalComponent);
        // console.log(currentComponentId);
        

        
        if (component2Type === "") {
            url.pathname = `${component1Type + component1Id}`;
        } else {
            url.pathname = `${component1Type + component1Id + component2Type}`;
        }
        console.log(url);
        manyResultsExpected = false;
        if (component1Id === "") {
            manyResultsExpected = true;
        } else if (component2Type !== "") { manyResultsExpected = true; }


        url.searchParams.set("page[size]", 100);
        if (payload.pageNumber) {
            url.searchParams.set("page[number]", payload.pageNumber);
        }

        return {
            url: url.href,
            method: payload.method,
            headers: {
                "accept": " application/vnd.api+json;revision=1",
                "content-type": " application/vnd.api+json",
                "authorization": "Bearer " + payload.accessToken,
                "x-api-key": payload.apiKey,
                "x-gw-ims-org-id": payload.ecOrgId
            }
        };

    }
})()


// Handles Get Calls Response.
var getResponseHandler = {

    "/companies": {
        handle: (data) => {
            if (manyResultsExpected) {
                temp = [];
                data.forEach(x => temp.push({ "id": x.id, "name": x.attributes.name }));
                return temp;
            }
            else {
                return { id: data.id, name: data.attributes.name }
            };
        }
    },
    "/properties": {
        handle: (data) => {
            if (manyResultsExpected) {
                temp = [];
                data.forEach(x => {
                    temp.push(new Property(x.id, x.attributes));
                });
                return temp;
            }
            else {
                x = data;
                return new Property(x.id, x.attributes);
            };
        }

    }
    ,
    "/rules": {
        handle: (data) => {
            if (manyResultsExpected) {
                temp = [];
                data.forEach(x => temp.push(new Rule(x.id, x.attributes)));
                return temp;
            }
            else {
                x = data;
                return new Rule(x.id, x.attributes)
            };
        }
    },
    "/rule_components": {
        handle: (data) => {
            if (manyResultsExpected) {
                temp = [];
                data.forEach(x => temp.push(new RuleComponent(x.id, x.attributes, currentComponentId, x.relationships.extension.data.id)));
                return temp;
            }
            else {
                x = data;
                return new RuleComponent(x.id, x.attributes, currentComponentId, x.relationships.extension.data.id);
            };
        }
    }, "/data_elements": {
        handle: (data) => {
            if (manyResultsExpected) {
                temp = [];
                data.forEach(x => temp.push(new DataElement(x.id, x.attributes, x.relationships.extension.data.id)));
                return temp;
            }
            else {
                x = data;
                return new DataElement(x.id, x.attributes, x.relationships.extension.data.id);
            };
        }
    }, "/extensions": {
        handle: (data) => {
            if (manyResultsExpected) {
                temp = [];
                data.forEach(x => {
                    // Handle new package id. Look for key "meta.upgrade_extension_package_id"
                    //  this allows extension auto upgrade when migrating property.
                    packageId = some_value // This should contain updated Extension package ID. 
                        temp.push(new Extension(x.id, packageId, x.attributes))
                });
                return temp;
            }
            else {
                x = data;
                // Handle new package id. Look for key "meta.upgrade_extension_package_id"
                //  this allows extension auto upgrade when migrating property.
                packageId = some_value // This should contain updated Extension package ID.    
                return new Extension(x.id, packageId, x.attributes)
            }
        }
    }, "/hosts": {
        handle: (data) => {
            if (manyResultsExpected) {
                temp = [];
                data.forEach(x => temp.push(new Host(x.id, x.attributes)));
                return temp;
            }
            else {
                return new Host(x.id, x.attributes)
            }
        }
    }, "/environments": {
        handle: (data) => {
            if (manyResultsExpected) {
                temp = [];
                data.forEach(x => temp.push(new Environment(x.id, x.attributes, x.relationships.host.data.id)));
                return temp;
            }
            else {
                return new Environment(x.id, x.attributes, x.relationships.host.data.id)
            }
        }
    }
};


// Posts component to Launch.
var post = function (auth, payload) {
    console.log("KKKKK");
    return new Promise((resolve, reject) => {
        component1Type = payload.component1Type
        component1Id = payload.component1Id
        component2Type = payload.component2Type
        console.log(payload);
        // console.log(component2Type);
        // console.log(component1Id);

        
        requestObject = postRequestObject({ method: "post", ...payload, ...auth });
        request(requestObject, (err, res, body) => {
            try {
                // console.log("+++++++++++++++++++++++++++++");
                // console.log("Error",err);
                // console.log("Res",res);
                // console.log("========================");
                var responseJSON = JSON.parse(body);
                console.log(responseJSON);
                // console.log(body);
                if (responseJSON["errors"]) {
                    reject(responseJSON);
                } else {
                    var data = responseJSON.data;
                    resolve(postResponseHandler[currentComponentType].handle(data));
                }
            } catch (exception) {
                reject(body);
            }
        });
    })

}

// Update an existing component.
var update = function (auth, payload) {
    return new Promise((resolve, reject) => {
        component1Type = payload.component1Type
        component1Id = payload.component1Id
        component2Type = payload.component2Type
        requestObject = updateRequestObject({ method: "patch", ...payload, ...auth });
        request(requestObject, (err, res, body) => {
            try {
                var responseJSON = JSON.parse(body);
                if (responseJSON["errors"]) {
                    reject(responseJSON);
                } else {
                    var data = responseJSON.data;
                    resolve(postResponseHandler[currentComponentType].handle(data));
                }

            } catch (exception) {
                reject(body);
            }

        });
    })

}
// Creates a post request object.
const postRequestObject = (function () {

    return function (payload) {
        var url = new URL("https://reactor.adobe.io");
        var component1Type = payload.component1Type ? "/" + payload.component1Type : "";
        var component1Id = payload.component1Id ? "/" + payload.component1Id : "";
        var component2Type = payload.component2Type ? "/" + payload.component2Type : "";
        var finalComponent = component2Type === "" ? component1Type : component2Type;
        currentComponentType = finalComponent;
        currentComponentId = payload.component1Id;
        
        if (component2Type === "") {
            url.pathname = `${component1Type + component1Id}`;
        } else {
            url.pathname = `${component1Type + component1Id + component2Type}`;
        }
        manyResultsExpected = false;
        if (component1Id === "") {
            manyResultsExpected = true;
        } else if (component2Type !== "") { manyResultsExpected = true; }
        
        console.log("LLLLLL");
        console.log(payload);
        payload.data.attributes.name="MAHESH PROPERTY"
        delete payload.data.id;
        delete payload.data.meta.rights
        delete payload.data.attributes.token
        delete payload.data.attributes.updated_at
        delete payload.data.attributes.enabled
        delete payload.data.attributes.created_at


        obj11={data:payload.data}

        console.log(url);
        return {
            url: url.href,
            method: payload.method,
            body: JSON.stringify(obj11),
            headers: {
                "accept": " application/vnd.api+json;revision=1",
                "content-type": " application/vnd.api+json",
                "authorization": payload.accessToken,
                "x-api-key": payload.apiKey,
                "x-gw-ims-org-id": payload.ecOrgId
            }
        };

    }
})()

// Creates a update request object
const updateRequestObject = (function () {

    return function (payload) {
        var url = new URL("https://reactor.adobe.io");
        var component1Type = payload.component1Type ? "/" + payload.component1Type : "";
        var component1Id = payload.component1Id ? "/" + payload.component1Id : "";
        var component2Type = payload.component2Type ? "/" + payload.component2Type : "";
        var finalComponent = component2Type === "" ? component1Type : component2Type;
        currentComponentType = finalComponent;
        currentComponentId = payload.component1Id;
        if (component2Type === "") {
            url.pathname = `${component1Type + component1Id}`;
        } else {
            url.pathname = `${component1Type + component1Id + component2Type}`;
        }
        manyResultsExpected = false;
        if (component1Id === "") {
            manyResultsExpected = true;
        } else if (component2Type !== "") { manyResultsExpected = true; }
        return {
            url: url.href,
            method: payload.method,
            body: JSON.stringify(payload.data),
            headers: {
                "accept": " application/vnd.api+json;revision=1",
                "content-type": " application/vnd.api+json",
                "authorization": payload.accessToken,
                "x-api-key": payload.apiKey,
                "x-gw-ims-org-id": payload.ecOrgId
            }
        };

    }
})()

var postResponseHandler = {


    "/properties": {
        handle: (data) => {
            return { id: data.id, name: data.attributes.name };
        }

    }
    ,
    "/rules": {
        handle: (data) => {
            return { id: data.id, name: data.attributes.name };
        }
    }, "/data_elements": {
        handle: (data) => {
            return { id: data.id, name: data.attributes.name };
        }
    }, "/rule_components": {
        handle: (data) => {
            return { id: data.id, name: data.attributes.name };
        }
    }, "/extensions": {
        handle: (data) => {
            return { id: data.id, name: data.attributes.name };
        }
    }, "/hosts": {
        handle: (data) => {
            return { id: data.id, name: data.attributes.name };
        }
    }, "/environments": {
        handle: (data) => {
            return { id: data.id, name: data.attributes.name };
        }
    }
};


module.exports.update = update;
module.exports.post = post;
module.exports.get = get;


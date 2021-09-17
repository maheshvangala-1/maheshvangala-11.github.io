
var { get: get, post: post } = require("./launch")
var logger = require("./app-utils/Logger");
var LaunchDump = require("./app-utils/LaunchDump")
var LookupManager = require("./app-utils/LookupManager")
var strings = require("./values/strings")
var fs = require("fs");


// get configuration from local path
function getConfiguration(path) {

    try {
        var config;
        if (path) {
            path += "configuration.json";
        } else {
            var path = "./confs/configuration.json"
        }
        config = fs.readFileSync(path);
        config = JSON.parse(config);
        // console.log(config);
        logger.log(logger.LogLevels.INFO, strings.CONFIG_LOADED +" "+path, config)
        // // console.log(logger);
        return config;
    }
    catch (exception) {
        // console.log("HIII");
        logger.log(logger.LogLevels.ERROR, strings.CONFIG_ERROR, exception);
        return undefined;
    }
}

// check for valid configuration
function validConfiguration(configuration) {
  
    if (configuration)
        if (configuration.sourceAuth && configuration.destinationAuth && configuration.propertyName) {
            //Validate Configuration
            return true
        }
        else {
            // Invalid Configuration
            return false
        }
}


// Get companies for a given credential.
function getCompanyId(auth) {
    
    
    return new Promise((resolve, reject) => {
        get(auth, { component1Type: "companies", component1Id: undefined, component2Type: undefined })
            .then((result) => {
                console.log(result);
            
                if (result.length == 1) {
                          
                    resolve({ componentType: "company", data: result });
                } else {
                    reject({ componentType: "company", error: "More than one companies received.", data: result });
                }
            })
            .catch(reject)


    });
}

// Gets Property.
function getProperty(auth, companyId, propertyName) {
    return new Promise((resolve, reject) => {
        get(auth, { component1Type: "companies", component1Id: companyId, component2Type: "properties" })
            .then((result) => {
                logger.log(logger.LogLevels.INFO, strings.COMPONENT_FETCH + "properties", result);
                result.forEach(x => {
                    LaunchDump.addProperty(x);
                });
                if (propertyName) {
                    let property = LaunchDump.getAllProperties().find((xx) => xx.attributes.name === propertyName);
                    if (property) {
                        logger.log(logger.LogLevels.INFO, strings.PROPERTY_FOUND, property);
                        resolve({ componentType: "property", data: [property] });
                    } else {
                        logger.log(logger.LogLevels.ERROR, strings.PROPERTY_NOT_FOUND, propertyName);
                        if (result && result.forEach) {
                            result = result.map(x => {
                                return x.name;
                            })
                        }
                        reject({ componentType: "property", error: strings.PROPERTY_NOT_FOUND, data: result });
                    }
                } else {
                    reject({ componentType: "property", error: "Please provide a Property Name", data: result });
                }
            })
            .catch(reject)

    });
}

// gets extension for a property Id
function getExtensions(auth, propertyId) {
    return new Promise((resolve, reject) => {
        
        get(auth, { component1Type: "properties", component1Id: propertyId, component2Type: "extensions" })
            .then((result) => {
            
                logger.log(logger.LogLevels.INFO, strings.COMPONENT_FETCH + "extensions", result);
                result.forEach(x => {
                    LaunchDump.addExtension(x);
                });
                resolve({ componentType: "extensions", data: result });
            })
            .catch(reject)

    });
}

function getHosts(auth, propertyId) {
    return new Promise((resolve, reject) => {
        get(auth, { component1Type: "properties", component1Id: propertyId, component2Type: "hosts" })
            .then((result) => {
                logger.log(logger.LogLevels.INFO, strings.COMPONENT_FETCH + "hosts", result);
                result.forEach(x => {
                    LaunchDump.addHost(x);
                });
                resolve({ componentType: "hosts", data: result });
            })
            .catch(reject)

    });
}

function getEnvironments(auth, propertyId) {
    return new Promise((resolve, reject) => {
        get(auth, { component1Type: "properties", component1Id: propertyId, component2Type: "environments" })
            .then((result) => {
                logger.log(logger.LogLevels.INFO, strings.COMPONENT_FETCH + "environments", result);
                result.forEach(x => {
                    LaunchDump.addEnvironment(x);
                });
                resolve({ componentType: "environments", data: result });
            })
            .catch(reject)

    });
}

function getDataElements(auth, propertyId) {
    return new Promise((resolve, reject) => {
        get(auth, { component1Type: "properties", component1Id: propertyId, component2Type: "data_elements" })
            .then((result) => {
                logger.log(logger.LogLevels.INFO, strings.COMPONENT_FETCH + "data_elements", result);
                result.forEach(x => {
                    LaunchDump.addDataElement(x);
                });
                resolve({ componentType: "data_elements", data: result });
            })
            .catch(reject)

    });
}

function getRules(auth, propertyId) {
    return new Promise((resolve, reject) => {
        get(auth, { component1Type: "properties", component1Id: propertyId, component2Type: "rules" })
            .then((result) => {
                logger.log(logger.LogLevels.INFO, strings.COMPONENT_FETCH + "rules", result);
                result.forEach(x => {
                    LaunchDump.addRule(x);
                });
                resolve({ componentType: "rules", data: result });
            })
            .catch(reject)

    });
}

function getRuleComponents(auth, ruleId) {
    return new Promise((resolve, reject) => {
        get(auth, { component1Type: "rules", component1Id: ruleId, component2Type: "rule_components" })

            .then((result) => {
                logger.log(logger.LogLevels.INFO, strings.COMPONENT_FETCH + "rule_components", result);
                result.forEach(x => {
                    LaunchDump.addRuleComponent(x);
                });
                resolve({ componentType: "rule_components", data: result });
            }).catch(reject)


    });
}


async function migrateLaunch(configuration) {
    // console.log(configuration);
    let { sourceAuth: sourceAuth, destinationAuth: destinationAuth, propertyName: propertyName } = configuration;
    sourceAuth.companyId = undefined;

    //Get Companies from Source
    let result = await getCompanyId(sourceAuth).catch(rejectionHandler);
    
    console.log(result);
    if (result && !result.error) {
        sourceAuth.companyId = result.data[0].id;
    }
    console.log("Fetched Company with ID:" + sourceAuth.companyId);

    //Get Property for  company
    sourceAuth.propertyId = undefined;
    result = await getProperty(sourceAuth, sourceAuth.companyId, propertyName).catch(rejectionHandler);
    if (result && !result.error && result.data && result.data.__proto__ === Array.prototype) {
        
    console.log("Property Success");
    console.log(result);
    sourceAuth.propertyId=result.data[0].id
        // Store Property in Local Dump. 
        // Use your own data structure. have fun 😁
    }
    console.log("HIIIIES");
    console.log(sourceAuth);
    result = undefined;


    //Get Extensions for a property
    result = await getExtensions(sourceAuth, sourceAuth.propertyId).catch(rejectionHandler);
    if (result && !result.error) {
        result.data.forEach((ele) => {

            // Store Extensions in Local Dump for the property id. 
            // Use your own data structure. have fun 😁
        });
    }
    console.log("Extension Success");
    result = undefined;



    //Get Hosts for a property
    result = await getHosts(sourceAuth, sourceAuth.propertyId).catch(rejectionHandler);
    if (result && !result.error) {
        result.data.forEach((ele) => {
            // Store Hosts in Local Dump for the property id. 
            // Use your own data structure. have fun 😁
        });
    }
    console.log("Hosts Success");
    result = undefined;


    //Get environments for a property
    result = await getEnvironments(sourceAuth, sourceAuth.propertyId).catch(rejectionHandler);
    if (result && !result.error) {
        result.data.forEach((ele) => {
            // Store Environments in Local Dump for the property id. 
            // Use your own data structure. have fun 😁
        });
    }
    console.log("Environment Success");
    result = undefined;


    //Get Data Elements for a property
    result = await getDataElements(sourceAuth, sourceAuth.propertyId).catch(rejectionHandler);
    if (result && !result.error) {
        result.data.forEach((ele) => {
            // Store Data Elements in Local Dump for the property id. 
            // Use your own data structure. have fun 😁
        });
    }
    console.log("Data Elements Success");
    result = undefined;


    //Get Rules for a property
    result = await getRules(sourceAuth, sourceAuth.propertyId).catch(rejectionHandler);
    if (result && !result.error) {
        result.data.forEach((ele) => {
            // Store Rules in Local Dump for the property id. 
            // Use your own data structure. have fun 😁
        });
    }
    console.log("Rules Success");
    result = undefined;


    //Get Rule Components for each rule.
    let rules = LaunchDump.getAllRules().map(x => x.id);
    for (let ruleId of rules) {
        result = await getRuleComponents(sourceAuth, ruleId).catch(rejectionHandler);
        if (result && !result.error) {
            result.data.forEach((ele) => {
                // Store Rule Components in Local Dump for the rule under given Property id. 
                // Use your own data structure. have fun 😁
            });
        }
    }
    result = undefined;
    rules = undefined;
    console.log("fetched property " + sourceAuth.propertyId);


    fs.writeFileSync(`./launch-dumps/launch-dump-${sourceAuth.propertyId}.json`, JSON.stringify(LaunchDump.getLaunchDump()));

    //Get Companies from destination
    result = await getCompanyId(destinationAuth).catch(rejectionHandler);
    if (result && !result.error) {
        console.log("----------------------");
        console.log(destinationAuth);
        console.log("-----------------------------");
        destinationAuth.companyId = result.data[0].id;
    }
    result = undefined;
    console.log("Fetched Destination Company with ID:" + destinationAuth.companyId);



    //Create property on Destination Launch
    let property = LaunchDump.getProperty(sourceAuth.propertyId);
    console.log("HIIIII");
    console.log(property);
    let oldPropertyId = property.id;
    console.log(oldPropertyId,property.attributes.name);

    // Check if the property is already migrated, if not migrate the property else return.
    if (/* Maintain a lookup which shows whether a component is migrated or not. Use the lookup here */true) {
        console.log("HHHHHH");
        console.log(destinationAuth);
        console.log(property);
        result = await createProperty(destinationAuth, property).catch(rejectionHandler)
        console.log(result);
        
        if (result && !result.error) {
            // Once the component is migrated, update lookup.
        }
        
        console.log("Created Destination Property :" + result.data.name);
    } 
    else {
        console.log("HIIII");
        destinationAuth.propertyId = LookupManager.getNewId("properties", oldPropertyId).newId;

    }
    result = undefined;
    property = undefined;
    oldPropertyId = undefined;


    //Get Extensions on newly created property
    result = await get(destinationAuth, { component1Type: "properties", component1Id: destinationAuth.propertyId, component2Type: "extensions" }).catch(rejectionHandler);
    result.forEach(x => {
        if (LookupManager.getOldId("extensions", x.name)) {
            let { oldId: oldExtensionId } = LookupManager.getOldId("extensions", x.name);
            if (oldExtensionId) {
                LookupManager.setNewId("extensions", oldExtensionId, x.id);
            }
        }

    })
    result = undefined;

    //create extensions on new property
    let extensions = LaunchDump.getAllExtensions();
    let extensionTester = new RegExp(/EX[a-zA-Z0-9]{32}/)
    for (let c of extensions) {
        if (LookupManager.getNewId("extensions", c.id).isMigrated) { continue; }
        var extension = c.getExtension();
        let oldExtensionId = extension.id;
        let { newId: newExtensionId } = some_value // get new extension id from extension dump
        if (extensionTester.test(newExtensionId)) { continue; }
        if (extension.data.attributes.settings) {
            // Use regex to update IMS org in JSON Configuration of the component.
        }
        result = await createExtension(destinationAuth, destinationAuth.propertyId, extension).catch(rejectionHandler);
        if (result && !result.error) {
            // Once the component is migrated, update lookup.

        }

    }
    result = undefined;
    extensions = undefined;
    extensionTester = undefined;


    // Create Data Element
    let dataElements = LaunchDump.getAllDataElements();
    for (var c of dataElements) {
        if (/* Maintain a lookup which shows whether a component is migrated or not. Use the lookup here */false) { continue; }
        let oldExtensionId = c.extensionId;
        let { newId: newExtensionId } = some_value // get new extension id from lookup 
        let dataElement = c.getDataElement(newExtensionId);
        let oldDataElementId = dataElement.id;
        result = await createDataElement(destinationAuth, destinationAuth.propertyId, dataElement).catch(rejectionHandler);
        if (result && !result.error) {
                       // Once the component is migrated, update lookup.


        }
    }
    result = undefined;
    dataElements = undefined;

    //Post Rules to new Property
    rules = LaunchDump.getAllRules();
    for (var c of rules) {
        if (/* Maintain a lookup which shows whether a component is migrated or not. Use the lookup here */false) { continue; }
        let oldRuleId = c.id;
        let rule = c.getRule();
        result = await createRule(destinationAuth, destinationAuth.propertyId, rule).catch(rejectionHandler);
        if (result && !result.error) {
            // Once the component is migrated, update lookup.

        }
    }
    result = undefined;
    rules = undefined;

    //Post Rule Components to new Property 
    let ruleComponents = LaunchDump.getAllRuleComponents();
    for (let c of ruleComponents) {
        if (/* Maintain a lookup which shows whether a component is migrated or not. Use the lookup here */false) { continue; }
        let oldRuleId = c.ruleId;
        let oldExtensionId = c.extensionId;
        let oldRuleComponentId = c.id;
        let { newId: newExtensionId } = some_value // get new extension id from lookup 
        let { newId: newRuleId } = some_value // get new rule id from lookup 
        let ruleComponent = c.getRuleComponent(newExtensionId, newRuleId);
        result = await createRuleComponent(destinationAuth, destinationAuth.propertyId, ruleComponent).catch(rejectionHandler);
        if (result && !result.error) {
            // Once the component is migrated, update lookup.

        }
    }
    result = undefined;
    ruleComponents = undefined;

    //Post Hosts to new Property
    let hosts = LaunchDump.getAllHosts();
    for (let c of hosts) {
        if (/* Maintain a lookup which shows whether a component is migrated or not. Use the lookup here */false) { continue; }
        let host = c.getHost();
        let oldHostId = c.id;
        result = await createHost(destinationAuth, destinationAuth.propertyId, host).catch(rejectionHandler);
        if (result && !result.error) {
            // Once the component is migrated, update lookup.

        }
    }
    result = undefined;
    hosts = undefined;

    //Post Environments to new Property
    let environments = LaunchDump.getAllEnvironments();
    for (let c of environments) {
        if (/* Maintain a lookup which shows whether a component is migrated or not. Use the lookup here */false) { continue; }
        let oldHostId = c.hostId;
        let oldEnvironmentId = c.id;
        let { newId: newHostId } = some_value // get new Host id from lookup 
        let environment = c.getEnvironment(newHostId);
        result = await createEnvironment(destinationAuth, destinationAuth.propertyId, environment).catch(rejectionHandler);
        if (result && !result.error) {
            // Once the component is migrated, update lookup.

        }
    }
    result = undefined;
    environments = undefined;

}

function createProperty(auth, property) {
    return new Promise((resolve, reject) => {
        console.log("DATA");
        console.log(property);
        post(auth, { component1Type: "companies", component1Id: auth.companyId, component2Type: "properties", data: property })
            .then((result) => {
                if (result.__proto__ === Object.prototype && result.id != undefined) {
                    logger.log(logger.LogLevels.INFO, strings.COMPONENT_CREATED + "property", result);
                    resolve({ componentType: "properties", data: result });
                } else {
                    logger.log(logger.LogLevels.ERROR, strings.COMPONENT_CREATE_FAIL + "property", { oldId: property.id, component: property });
                    reject({ componentType: "properties", error: strings.COMPONENT_CREATE_FAIL + "property", data: result });
                }
            }).catch(reject);

    })
}

function createExtension(auth, propertyId, extension) {
    return new Promise((resolve, reject) => {
        let oldExtensionId = extension.id;
        post(auth, { component1Type: "properties", component1Id: propertyId, component2Type: "extensions", data: extension })
            .then(result => {
                if (result.__proto__ === Object.prototype && result.id != undefined) {
                    logger.log(logger.LogLevels.INFO, strings.COMPONENT_CREATED + "extension", result);
                    resolve({ componentType: "extensions", data: result });
                } else {
                    logger.log(logger.LogLevels.ERROR, strings.COMPONENT_CREATE_FAIL + "extension", { oldId: oldExtensionId, component: extension });
                    reject({ componentType: "extensions", error: strings.COMPONENT_CREATE_FAIL + "extension", data: result });
                }

            })
            .catch(reject)


    })
}

function createDataElement(auth, propertyId, dataElement) {
    return new Promise((resolve, reject) => {
        let oldDataElementId = dataElement.id;
        post(auth, { component1Type: "properties", component1Id: propertyId, component2Type: "data_elements", data: dataElement })
            .then(result => {
                if (result.__proto__ === Object.prototype && result.id != undefined) {
                    logger.log(logger.LogLevels.INFO, strings.COMPONENT_CREATED + "data_elements", result);
                    resolve({ componentType: "data_elements", data: result });
                } else {
                    logger.log(logger.LogLevels.ERROR, strings.COMPONENT_CREATE_FAIL + "data_elements", { oldId: oldDataElementId, component: dataElement });
                    reject({ componentType: "data_elements", error: strings.COMPONENT_CREATE_FAIL + "data_elements", data: result });
                }
            })
            .catch(reject)
    })
}

function createRule(auth, propertyId, rule) {
    return new Promise((resolve, reject) => {
        let oldRuleId = rule.id;
        post(auth, { component1Type: "properties", component1Id: propertyId, component2Type: "rules", data: rule })
            .then(result => {
                if (result.__proto__ === Object.prototype && result.id != undefined) {
                    logger.log(logger.LogLevels.INFO, strings.COMPONENT_CREATED + "rules", result);
                    resolve({ componentType: "rules", data: result });
                } else {
                    logger.log(logger.LogLevels.ERROR, strings.COMPONENT_CREATE_FAIL + "rules", { oldId: oldRuleId, component: rule });
                    reject({ componentType: "rules", error: strings.COMPONENT_CREATE_FAIL + "rules", data: result });
                }
            })
            .catch(reject)
    })
}

function createRuleComponent(auth, propertyId, ruleComponent) {
    return new Promise((resolve, reject) => {
        let oldRuleComponentId = ruleComponent.id;
        post(auth, { component1Type: "properties", component1Id: propertyId, component2Type: "rule_components", data: ruleComponent })
            .then(result => {
                if (result.__proto__ === Object.prototype && result.id != undefined) {
                    logger.log(logger.LogLevels.INFO, strings.COMPONENT_CREATED + "rule_components", result);
                    resolve({ componentType: "rule_components", data: result });
                } else {
                    logger.log(logger.LogLevels.ERROR, strings.COMPONENT_CREATE_FAIL + "rule_components", { oldId: oldRuleComponentId, component: ruleComponent });
                    reject({ componentType: "rule_components", error: strings.COMPONENT_CREATE_FAIL + "rule_components", data: result });
                }
            })
            .catch(reject)
    })
}

function createHost(auth, propertyId, host) {
    return new Promise((resolve, reject) => {
        let oldHostId = host.id;
        post(auth, { component1Type: "properties", component1Id: propertyId, component2Type: "hosts", data: host })
            .then(result => {
                if (result.__proto__ === Object.prototype && result.id != undefined) {
                    logger.log(logger.LogLevels.INFO, strings.COMPONENT_CREATED + "hosts", result);
                    resolve({ componentType: "hosts", data: result });
                } else {
                    logger.log(logger.LogLevels.ERROR, strings.COMPONENT_CREATE_FAIL + "hosts", { oldId: oldHostId, component: host });
                    reject({ componentType: "hosts", error: strings.COMPONENT_CREATE_FAIL + "hosts", data: result });
                }
            })
            .catch(reject)
    })
}

function createEnvironment(auth, propertyId, environment) {
    return new Promise((resolve, reject) => {
        let oldEnvironmentId = environment.id;
        post(auth, { component1Type: "properties", component1Id: propertyId, component2Type: "environments", data: environment })
            .then(result => {
                if (result.__proto__ === Object.prototype && result.id != undefined) {
                    logger.log(logger.LogLevels.INFO, strings.COMPONENT_CREATED + "environments", result);
                    resolve({ componentType: "environments", data: result });
                } else {
                    logger.log(logger.LogLevels.ERROR, strings.COMPONENT_CREATE_FAIL + "environments", { oldId: oldEnvironmentId, component: environment });
                    reject({ componentType: "environments", error: strings.COMPONENT_CREATE_FAIL + "environments", data: result });
                }
            })
            .catch(reject)
    })
}


function rejectionHandler(error) { throw error }

if (validConfiguration(getConfiguration())) {
    console.log(getConfiguration());
    migrateLaunch(getConfiguration()).then(() => {
        console.log("MAAHA");
        logger.log(logger.LogLevels.INFO, strings.MIGRATION_COMPLETE, undefined);
        logger.log(logger.LogLevels.INFO, strings.LOG_SEPARATOR, undefined);
        console.log("migration process completed with no error.");
    }).catch(error => {
        logger.log(logger.LogLevels.ERROR, "Migration Failed", error);
        console.error("Migration Failed because of :" + JSON.stringify(error))
    })
}


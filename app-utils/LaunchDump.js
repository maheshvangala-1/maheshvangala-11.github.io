module.exports=(function () {
    var data = { properties: [], extensions: [], rules: [], ruleComponents: [], dataElements: [], hosts: [], environments: [] }
    var addProperty = (property) => {
        data.properties.push(property)
    }
    var getProperty = (propertyId) => {
        // console.log(propertyId);
        // console.log(data.properties);
        console.log("*****************************");
        console.log(data.properties.find((property)=>property.id===propertyId));
        return data.properties.find((property) => property.id === propertyId)
    }
    var getAllProperties = () => [...data.properties]

    var addExtension = (extension) => {
        data.extensions.push(extension)
    }
    var getExtension = (extensionId) => {
        return data.extensions.find((extension) => extension._id === extensionId).getExtension();
    }
    var getAllExtensions = () => [...data.extensions]

    var addDataElement = (dataElement) => {
        data.dataElements.push(dataElement);
    }
    var getDataElement = (dataElementId) => {
        return data.dataElement.find((dataElement) => dataElement._id === dataElementId)
    }
    var getAllDataElements = () => [...data.dataElements]
    var addRule = (rule) => {
        data.rules.push(rule)
    }
    var getRule = (ruleId) => {
        return data.rules.find((rule) => rule._id === ruleId);
    }
    var getAllRules = () => [...data.rules]
    var addRuleComponent = (ruleComponent) => {
        data.ruleComponents.push(ruleComponent)
    }
    var getRuleComponent = (ruleComponentId) => {
        return data.ruleComponents.find((ruleComponent) => ruleComponent._id === ruleComponentId)
    }
    var getAllRuleComponents = () => [...data.ruleComponents]
    var addHost = (host) => {
        data.hosts.push(host)
    }
    var getHost = (hostId) => {
        return data.hosts.find((host) => host._id === hostId)
    }
    var getAllHosts = () => [...data.hosts]
    var addEnvironment = (environment) => {
        data.environments.push(environment)
    }
    var getEnvironment = (environmentId) => {
        return data.environments.find((environment) => environment._id === environmentId)
    }
    var getAllEnvironments = () => [...data.environments]
    var getLaunchDump = () => { return { ...data } };

    return { getAllEnvironments, getEnvironment, addEnvironment, getHost, addHost, getAllHosts, getLaunchDump, addProperty, getProperty, getAllProperties, addExtension, getExtension, getAllExtensions, addDataElement, getDataElement, getAllDataElements, addRule, getRule, getAllRules, addRuleComponent, getRuleComponent, getAllRuleComponents }


})();
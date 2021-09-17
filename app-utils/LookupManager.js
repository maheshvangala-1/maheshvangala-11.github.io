var fs = require("fs")

// Lookup Manager 
// Maintain lookup here. 
module.exports = (function () {
    var migratedData = { properties: [], hosts: [], environments: [], data_elements: [], extensions: [], rules: [], rule_components: [] };
    var propertyId;

    // Add new migrated component.
    function add(data) {
        // Add new migrated compoennt to lookup
    }

    function getNewId(componentType, oldId) {
              // Returns new id for a given old id.

    }
    
    function setNewId(componentType, oldId, newId) {
        // Set new id in lookup
    }

    function getOldId(componentType, newId) {
        // Returns old id for a given new id.
    }

    function init(propId) {
        propertyId = propId
        try {
            var dd = fs.readFileSync(`./output/migrationlookup-${propertyId}.tsv`);
            // Load lookup from file here. 
            // This will help to maintain state accross multiple executions.
        } catch (exception) {
            console.log("migrationlogs not found. will start from the zero")
        }
    }




    return { getNewId, setNewId, getOldId, add, migratedData, init }


})()
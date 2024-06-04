/**
 * @NApiVersion 2.1
 *
 */

define([
    'N/log',
    '../data/tc_manpower_requirement_gateway',
    ], function(
    log,
    ManpowerRequirementGateway
) {

    function ManpowerRequirementHandler() {
        this.name = 'ManpowerRequirementHandler';
    }

    ManpowerRequirementHandler.prototype.getManpowerRequirementValuesByManpowerCodeId = function(manpowerCodeId) {
        var manpowerRequirementValues = _getManpowerRequirementValuesByManpowerCodes([manpowerCodeId]);

        return manpowerRequirementValues;
    }

    ManpowerRequirementHandler.prototype.setManpowerRequirementSublistValuesCurrentRecord = function(currentRecord, manpowerRequirementValues) {
        
        // Commented out. We want to maintain the existing manpower requirements if there is.
        // Needs to manually update the manpower requirement to remove the duplicates if there is any
        //_removeManpowerRequirementSublistValuesCurrentRecord(currentRecord);

        _setManpowerRequirementSublistValuesCurrentRecord(currentRecord, manpowerRequirementValues);
    }

    function _removeManpowerRequirementSublistValuesCurrentRecord(currentRecord){
        var lineCount = currentRecord.getLineCount({
            sublistId: 'recmachcustrecord_transactionmanpowerref'
        });

        for(var i = 0; i < lineCount; i++){
            currentRecord.removeLine({
                sublistId: 'recmachcustrecord_transactionmanpowerref',
                line: 0
            })
        };
    }

    function _setManpowerRequirementSublistValuesCurrentRecord(currentRecord, manpowerRequirementValues){
        // Adding new lines
        for(var i = 0; i < manpowerRequirementValues.length; i++){
            console.log('manpowerRequirementValues[i]: '+JSON.stringify(manpowerRequirementValues[i]));
            var fieldValueMap = manpowerRequirementValues[i];
            var fields = Object.keys(fieldValueMap)

            currentRecord.selectNewLine({
                sublistId: 'recmachcustrecord_transactionmanpowerref'
            });

            for(var k = 0; k < fields.length; k++){
                var field = fields[k];
                var value = fieldValueMap[field];

                if(value != null && value != undefined){
                    currentRecord.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_transactionmanpowerref',
                        fieldId: field,
                        value: value,
                        ignoreFieldChange: true
                    });
                }
            } 

            currentRecord.commitLine({
                sublistId: 'recmachcustrecord_transactionmanpowerref'
            }); 
        }
    }

    function _getManpowerRequirementValuesByManpowerCodes(manpowerCodeIds){
    	var manpowerRequirementValues = new ManpowerRequirementGateway().getManpowerRequirementValuesByManpowerCodes(manpowerCodeIds);

        for(var i = 0; i < manpowerRequirementValues.length; i++){
            manpowerRequirementValues[i].custrecord_manpowerrecipeparent = null;
        }
        
    	return manpowerRequirementValues;
    }

    
    return ManpowerRequirementHandler;

});

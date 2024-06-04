/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([
    'N/log',
    'N/ui/serverWidget'
 ], (
    log,
    serverWidget
) => {
    const beforeLoad = (scriptContext) => {
        const form = scriptContext.form;
        const newRecord = scriptContext.newRecord;
        
        try{
            log.error('beforeLoad', 'beforeLoad');
            hideCostingStructureC(form);
        }catch(e){
            log.error('beforeLoad error', e);
        } 
    }

    function hideCostingStructureC(form){
    	var field = form.getField({id: 'custrecord_costing_structure'});
    	field.updateDisplayType({
    		displayType: serverWidget.FieldDisplayType.HIDDEN
    	})
    }

    return {
        beforeLoad
    }

});

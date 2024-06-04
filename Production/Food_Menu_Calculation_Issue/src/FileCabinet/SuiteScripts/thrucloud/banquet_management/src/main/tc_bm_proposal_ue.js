/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([
    'N/log',
    'N/runtime',
    'N/ui/serverWidget',
    '../app/tc_banquet_type_handler',
    '../app/tc_manpower_requirement_handler'
 ], (
    log,
    runtime,
    serverWidget,
    BanquetTypeHandler,
    ManpowerRequirementHandler
) => {
    const beforeLoad = (scriptContext) => {
        const form = scriptContext.form;
        const newRecord = scriptContext.newRecord;
        
        try{
            log.error('beforeLoad', 'beforeLoad');
            if(scriptContext.type == scriptContext.UserEventType.CREATE 
                || scriptContext.type == scriptContext.UserEventType.EDIT){
                makeFoodMenuCostingStructureColumnRequired(form);
                makeManpowerDetailsBanquetTypeColumnDisabled(form);
            }
            
        }catch(e){
            log.error('beforeLoad error', e);
        } 
    }
    
    const beforeSubmit = (scriptContext) => {
        const form = scriptContext.form;
        const newRecord = scriptContext.newRecord;
        const oldRecord = scriptContext.oldRecord;
        log.error('beforeSubmit', 'beforeSubmit');

        try{
            new BanquetTypeHandler().set(newRecord, oldRecord);
        }catch(e){
            log.error('beforeSubmit | BanquetTypeHandler().set | error', e);
        } 

        log.error('beforeSubmit | Remaining usage', runtime.getCurrentScript().getRemainingUsage())
    }

    const afterSubmit = (scriptContext) => {
        const form = scriptContext.form;
        const newRecord = scriptContext.newRecord;
        
        try{
            log.error('afterSubmit', 'afterSubmit');
           
        }catch(e){
            log.error('afterSubmit error', e);
        } 
    }

    function makeFoodMenuCostingStructureColumnRequired(form){
        var sublist = form.getSublist({id: 'recmachcustrecord_transaction_fb_food'});
        if(!sublist) return;

        var field = sublist.getField({id: 'custrecord_costing_structure'});
        if(!field) return;

        field.isMandatory = true;
    }

    function makeManpowerDetailsBanquetTypeColumnDisabled(form){
        var sublist = form.getSublist({id: 'recmachcustrecord_manpower_related_transaction'});
        if(!sublist) return;

        var field = sublist.getField({id: 'custrecord_banquet_type_tran_manpower'});
        if(!field) return;

        field.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.DISABLED
        });

    }   

    return {
        beforeLoad, 
        beforeSubmit, 
        afterSubmit
    }

});

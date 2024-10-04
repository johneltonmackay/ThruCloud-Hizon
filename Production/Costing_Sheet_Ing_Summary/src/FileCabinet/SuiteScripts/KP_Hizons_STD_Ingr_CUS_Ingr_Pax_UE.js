/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/search','N/task','N/runtime', 'N/ui/message'], 
    function(record,search,task,runtime,message){
    
        /**
     * Function definition to be triggered before record is loaded.
     *a
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
        function beforeLoad_hizon_std_cus_ingr_pax(scriptContext){
            var currentRecord = scriptContext.newRecord;
            var form = scriptContext.form;
            var returnLog;
            if(scriptContext.type === scriptContext.UserEventType.VIEW){
                var taskId = currentRecord.getValue({
                    fieldId: 'custrecord_taskid'
                })

                var strStatus = currentRecord.getValue({
                    fieldId: 'custrecord_processing_status'
                })

                if (strStatus == 'FAILED'){
                    log.debug('status strStatus', strStatus)
                    if(currentRecord.type == 'customrecord_costing_sheet'){
                        var idvalue = record.submitFields({
                            type: 'customrecord_costing_sheet',
                            id: currentRecord.id,
                            values: {
                                custrecord_processing_status: 'COMPLETE',
                            },
                            options: {
                                enableSourcing: true,
                                ignoreMandatoryFields : true
                        }});
                        log.debug('status COMPLETE', idvalue)
                    }
                }
    
                form.clientScriptModulePath = 'SuiteScripts/KP_Hizons_Food_Menu_Costing_CS.js';

                var blnHeaderModified = currentRecord.getValue({
                    fieldId: 'custrecord_header_modified'
                })
    
                if(taskId && blnHeaderModified){
                    var myTaskStatus = task.checkStatus({
                        taskId: taskId
                    });

                    if (myTaskStatus.status != null){
                        log.debug('myTaskStatus',myTaskStatus)
                        log.debug('myTaskStatus.status',myTaskStatus.status)
        
                        form.addPageInitMessage({
                            type: message.Type.CONFIRMATION,
                             message: 'Updating Custom Ingredients: ' + myTaskStatus.status,
                             duration: 5000
                        });
        
                        if(myTaskStatus.status == 'COMPLETE'){
                            returnLog = 1;
                            if(currentRecord.type == 'customrecord_costing_sheet'){
                                try {
                                    var idvalue = record.submitFields({
                                        type: 'customrecord_costing_sheet',
                                        id: currentRecord.id,
                                        values: {
                                            custrecord_processing_status: myTaskStatus.status,
                                        },
                                        options: {
                                            enableSourcing: true,
                                            ignoreMandatoryFields : true
                                    }});       
                                } catch (error) {
                                    log.error('status COMPLETE', error.message)
                                }
                                log.debug('status COMPLETE', idvalue)
                            }
                        }
                        else if(myTaskStatus.status == 'FAILED'){
                            returnLog = 0;
                            if(currentRecord.type == 'customrecord_costing_sheet'){
                                var idvalue = record.submitFields({
                                    type: 'customrecord_costing_sheet',
                                    id: currentRecord.id,
                                    values: {
                                        custrecord_processing_status: 'COMPLETE',
                                    },
                                    options: {
                                        enableSourcing: true,
                                        ignoreMandatoryFields : true
                                }});
                                log.debug('status COMPLETE', idvalue)
                            }
                        }
                        else{
                            returnLog = 2;
                        }  
                    }
                }
            }
           
        }
        function afterSubmit_hizon_std_cus_ingr_pax(scriptContext){
            var currentRecord = scriptContext.newRecord;
            let recType = currentRecord.type
            let strId = currentRecord.id
            log.debug('runtime.executionContext',runtime.executionContext)
            log.debug('scriptContext',scriptContext)
            log.debug('currentRecord',currentRecord)
            log.debug('scriptContext.type',scriptContext.type)
            if(scriptContext.type === scriptContext.UserEventType.EDIT){
                if(runtime.executionContext == runtime.ContextType.USER_INTERFACE || runtime.executionContext == runtime.ContextType.USEREVENT){
    
                    let currentRecord = record.load({
                        type: recType,
                        id: strId,
                        isDynamic: true,
                    });
                    if (currentRecord){
                        var headerModif = currentRecord.getValue({
                            fieldId: 'custrecord_header_modified'
                        })
                        log.debug('headerModif',headerModif)
                        if(headerModif){
                            currentRecord.setValue({
                                fieldId: 'custrecord_processing_status',
                                value: 'In Progress'
                            })
                            var scriptTask = task.create({taskType: task.TaskType.MAP_REDUCE});
                            scriptTask.scriptId = 'customscript_cs_stdingr_cusingr_mr';
                            // scriptTask.deploymentId = 'customdeploy_cs_stdingr_cusingr_mr';
                            scriptTask.params = {
                                'custscript_idingr_record' : currentRecord.id,
                                'custscript_context_type': runtime.executionContext
                            };
                            log.debug('scriptTaskId',scriptTask.params)
                            var scriptTaskId = scriptTask.submit();
                            
                            log.debug('scriptTaskId',scriptTaskId)
            
                            currentRecord.setValue({
                                fieldId: 'custrecord_taskid',
                                value: scriptTaskId
                            })
                        }
    
                        var recordId = currentRecord.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
                        log.debug("recordId" + recType, recordId)
                    }
    
                    
                }
            }
            
        }
    
      
    
        return {
            beforeLoad: beforeLoad_hizon_std_cus_ingr_pax,
            afterSubmit: afterSubmit_hizon_std_cus_ingr_pax
    
        };
    
    });
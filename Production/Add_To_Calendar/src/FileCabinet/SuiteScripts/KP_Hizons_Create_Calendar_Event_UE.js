/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/runtime', 'N/search','N/url','N/format','N/task','N/error', 'N/ui/message'], 
    function(record, runtime, search, url, format, task, error, message){
    
        /**
     * Function definition to be triggered before record is loaded.
     *a
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
        function beforeLoad_hizon_cal_event(scriptContext) {
            log.debug('scriptContext', scriptContext)
            const newRecord = scriptContext.newRecord
            const objForm =  scriptContext.form;

            if(scriptContext.type === scriptContext.UserEventType.VIEW){
                let taskId = null
                log.debug('newRecord.type', newRecord.type)
                log.debug('objForm', objForm)
                if(newRecord.type == 'customrecord_costing_sheet'){
                    taskId = newRecord.getValue({
                        fieldId: 'custrecord_create_calendar_task_id'
                    })
                }

                if(taskId){
                    let myTaskStatus = task.checkStatus({
                        taskId: taskId
                    });
        
                    log.debug('myTaskStatus',myTaskStatus)
                    log.debug('myTaskStatus.status',myTaskStatus.status)
                    let stStatus = myTaskStatus.status
                    if (stStatus){
                        if (stStatus === 'PROCESSING'){
                            objForm.addPageInitMessage({
                                type: message.Type.CONFIRMATION,
                                message: 'Calendar Creation: ' + stStatus,
                                duration: 5000
                            });
                        } else if (stStatus === 'COMPLETE'){
                            objForm.addPageInitMessage({
                                type: message.Type.CONFIRMATION,
                                message: 'Calendar Creation: ' + stStatus,
                                duration: 5000
                            });
                            if(newRecord.type == 'customrecord_costing_sheet'){
                                var idvalue = record.submitFields({
                                    type: 'customrecord_costing_sheet',
                                    id: newRecord.id,
                                    values: {
                                        custrecord_processing_status: stStatus,
                                    },
                                    options: {
                                        enableSourcing: true,
                                        ignoreMandatoryFields : true
                                }});
                                log.debug('status COMPLETE', idvalue)
                            }
                        } else if (stStatus === 'PENDING'){
                            objForm.addPageInitMessage({
                                type: message.Type.CONFIRMATION,
                                message: 'Calendar Creation: ' + stStatus,
                                duration: 5000
                            });
                        } else {
                            objForm.addPageInitMessage({
                                type: message.Type.ERROR,
                                message: 'If the issue persists, feel free to try again or reach out to your administrator for assistance.',
                                duration: 5000
                            });
                            if(newRecord.type == 'customrecord_costing_sheet'){
                                var idvalue = record.submitFields({
                                    type: 'customrecord_costing_sheet',
                                    id: newRecord.id,
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
                    }
                }

            }
        }

        function afterSubmit_hizon_cal_event(scriptContext) {
    
            log.debug('script context', scriptContext);

            const newRecord = scriptContext.newRecord
            const objCurrentRecord = record.load({
                type: newRecord.type,
                id: newRecord.id,
                isDynamic: true
            })
            if(objCurrentRecord){
                var chargeto = objCurrentRecord.getValue({
                    fieldId: 'custrecord_charge_to'
                });
                if (chargeto == 4 || chargeto == 26){ // canteen or restaurant
                    if (chargeto == 26){
                        var statusValue = objCurrentRecord.getValue({
                            fieldId: 'custrecord_bqt_calendar_status'
                        });
                    } else {
                        var statusValue = objCurrentRecord.getValue({
                            fieldId: 'custrecord_status'
                        });
                    }
        
                    var subsValue = objCurrentRecord.getValue({
                        fieldId: 'custrecord_cs_subsidiary'
                    });
            
                    var isApproveBtnClicked = objCurrentRecord.getValue({
                        fieldId: 'custrecord_button_clicked'
                    });
            
                    log.debug('button click after submit', isApproveBtnClicked)
                    var calendarupdate = objCurrentRecord.getValue({
                        fieldId: 'custrecordcalender_update'
                    });
            
                    log.debug('custrecordcalender_update after submit', calendarupdate)
            
                    if(subsValue){
                        var parentSubs = search.lookupFields({
                            type: record.Type.SUBSIDIARY,
                            id: subsValue,
                            columns: ['parent']
                        })
                        if(subsValue == 3 || parentSubs.parent == 3 || subsValue == 4 || parentSubs.parent == 4 || subsValue == 6 || parentSubs.parent == 6){
                            var isSubFB = true;
                        }
                        else{
                            var isSubFB = false;
                        }
                    }
                    try {
                        if((scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT) && statusValue == 2 && isSubFB &&isApproveBtnClicked&&!calendarupdate){
                            var scriptTask = task.create({
                                taskType: task.TaskType.SCHEDULED_SCRIPT,
                                scriptId: 'customscripttc_subtab_food_menu_sch',
                                // deploymentId: 'customdeploytc_subtab_food_menu_sch',
                                params: {
                                    custscriptcosting_sheet: scriptContext.newRecord.id // Pass the record ID as a parameter
                                }
                            });
                            var scriptTaskId = scriptTask.submit();
                            log.debug('Scheduled Script aftersubmit submitted with ID: ',scriptTaskId);
                            if(scriptTaskId){
                                if(newRecord.type == 'customrecord_costing_sheet'){
                                    objCurrentRecord.setValue({
                                        fieldId: 'custrecord_create_calendar_task_id',
                                        value: scriptTaskId
                                    })
                                    objCurrentRecord.setValue({
                                        fieldId: 'custrecord_processing_status',
                                        value: 'In Progress'
                                    })
                                    var recordId = objCurrentRecord.save({
                                        enableSourcing: true,
                                        ignoreMandatoryFields: true
                                    });
                                    log.debug("recordId" + newRecord.type, recordId)
                                }
                            }
                        }
                    } catch(error) {
                        log.debug('error', error);
                        
                        var idvalue = record.submitFields({
                            type: 'customrecord_costing_sheet',
                            id: scriptContext.newRecord.id,
                            values: {
                                custrecorderror_occur: true,
                                custrecordscriptidvalue : scriptTaskId
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields : true
                        }});
                        log.debug('idvalue',idvalue)
                    }    
                }
            }
       }
    
        return {
           beforeLoad: beforeLoad_hizon_cal_event,
           afterSubmit: afterSubmit_hizon_cal_event
        };
    
    });
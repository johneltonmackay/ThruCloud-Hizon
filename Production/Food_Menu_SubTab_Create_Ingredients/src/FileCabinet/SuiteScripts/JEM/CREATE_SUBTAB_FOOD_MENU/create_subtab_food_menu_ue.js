/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/task', 'N/ui/message'],
    /**
 * @param{record} record
 * @param{task} task
 */
    (record, task, message) => {
        const beforeLoad = (scriptContext) => {
            log.debug('scriptContext', scriptContext)
            const newRecord = scriptContext.newRecord
            const objForm =  scriptContext.form;

            if(scriptContext.type === scriptContext.UserEventType.VIEW){
                let taskId = null
                log.debug('newRecord.type', newRecord.type)
                log.debug('objForm', objForm)
                if(newRecord.type == 'customrecord_costing_sheet'){
                    taskId = newRecord.getValue({
                        fieldId: 'custrecord_create_custom_ing_task_id'
                    })
                } else {
                    taskId = newRecord.getValue({
                        fieldId: 'custbody_task_id'
                    })
                }
                if(taskId){
                    let myTaskStatus = task.checkStatus({
                        taskId: taskId
                    });
        
                    log.debug('myTaskStatus',myTaskStatus)
                    log.debug('myTaskStatus.status',myTaskStatus.status)
                    let stStatus = myTaskStatus.status
                    if (stStatus === 'PROCESSING'){
                        objForm.addPageInitMessage({
                            type: message.Type.CONFIRMATION,
                            message: 'Custom Ingredients Creation: ' + stStatus,
                            duration: 5000
                        });
                    } else if (stStatus === 'COMPLETE'){
                        objForm.addPageInitMessage({
                            type: message.Type.CONFIRMATION,
                            message: 'Custom Ingredients Creation: ' + stStatus,
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
                            message: 'Custom Ingredients Creation: ' + stStatus,
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

        const afterSubmit = (scriptContext) => {
            log.debug('scriptContext', scriptContext)
            try {
                if (scriptContext.type === scriptContext.UserEventType.CREATE) {
                    let strOutlet = null
                    const newRecord = scriptContext.newRecord
                    const objCurrentRecord = record.load({
                        type: newRecord.type,
                        id: newRecord.id,
                        isDynamic: true
                    })
                    if(objCurrentRecord){
                        if(newRecord.type == 'customrecord_costing_sheet'){
                            strOutlet = objCurrentRecord.getValue({
                                fieldId: 'custrecord_tc_costingsheet_location',
                            })
                        } else {
                            strOutlet = objCurrentRecord.getValue({
                                fieldId: 'location',
                            })
                        }

                        let scriptTask = task.create({taskType: task.TaskType.MAP_REDUCE});
                        scriptTask.scriptId = 'customscript_create_subtab_food_menu_mr';
                        scriptTask.params = {
                            'custscript_recordId_param' : newRecord.id,
                            'custscript_recordType_param': newRecord.type,
                            'custscript_recordOutlet_param': strOutlet,
                        };
                        log.debug('scriptTask.params', scriptTask.params)
                        let scriptTaskId = scriptTask.submit();
                        
                        log.debug('scriptTaskId',scriptTaskId)
        
                        if(newRecord.type == 'customrecord_costing_sheet'){
                            objCurrentRecord.setValue({
                                fieldId: 'custrecord_create_custom_ing_task_id',
                                value: scriptTaskId
                            })
                            objCurrentRecord.setValue({
                                fieldId: 'custrecord_processing_status',
                                value: 'In Progress'
                            })
                        } else {
                            objCurrentRecord.setValue({
                                fieldId: 'custbody_task_id',
                                value: scriptTaskId
                            })
                        }

                        var recordId = objCurrentRecord.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
                        log.debug("recordId" + newRecord.type, recordId)
                    }   
                }
            } catch (error) {
                log.error('afterSubmit error', error.message)
            }
        }

        return {beforeLoad, afterSubmit}

    });

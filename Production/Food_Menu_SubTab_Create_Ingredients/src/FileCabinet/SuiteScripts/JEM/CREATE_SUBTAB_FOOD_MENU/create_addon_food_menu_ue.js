/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/task', 'N/ui/message', 'N/search'],
    /**
 * @param{record} record
 * @param{task} task
 */
    (record, task, message, search) => {
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
                            message: 'Add On Custom Ingredients Creation: ' + stStatus,
                            duration: 5000
                        });
                    } else if (stStatus === 'COMPLETE'){
                        objForm.addPageInitMessage({
                            type: message.Type.CONFIRMATION,
                            message: 'Add On Custom Ingredients Creation: ' + stStatus,
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
                            message: 'Add On Custom Ingredients Creation: ' + stStatus,
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
                if (scriptContext.type === scriptContext.UserEventType.EDIT) {
                    let strOutlet = null
                    let scriptTask = null
                    let arrFoodMenuId = []
                    let blnAddOn = false
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
                            blnAddOn = objCurrentRecord.getValue({
                                fieldId: 'custrecord_add_on_recipe_body_cs',
                            })
                        } else {
                            strOutlet = objCurrentRecord.getValue({
                                fieldId: 'location',
                            })
                            blnAddOn = objCurrentRecord.getValue({
                                fieldId: 'custbody_add_on_recipe_body',
                            })
                        }
                        if (blnAddOn){
                            arrFoodMenuId = searchFoodMenuId(newRecord.id, newRecord.type)

                            if (arrFoodMenuId.length > 0){
                                scriptTask = task.create({taskType: task.TaskType.MAP_REDUCE});
                                scriptTask.scriptId = 'customscript_create_subtab_food_menu_mr';
                                scriptTask.params = {
                                    'custscript_recordId_param' : arrFoodMenuId,
                                    'custscript_recordType_param': 'customrecord_food_menu_fb',
                                    'custscript_recordOutlet_param': strOutlet,
                                };
                            }
                            if (scriptTask){
                                log.debug('scriptTask.params', scriptTask.params)
                                let scriptTaskId = scriptTask.submit();
                                
                                log.debug('scriptTaskId',scriptTaskId)
        
                                if (scriptTaskId){
                                    if(newRecord.type == 'customrecord_costing_sheet'){
                                        objCurrentRecord.setValue({
                                            fieldId: 'custrecord_create_custom_ing_task_id',
                                            value: scriptTaskId
                                        })
                                        objCurrentRecord.setValue({
                                            fieldId: 'custrecord_processing_status',
                                            value: 'In Progress'
                                        })
                                        objCurrentRecord.setValue({
                                            fieldId: 'custrecord_add_on_recipe_body_cs',
                                            value: false
                                        })
                                    } else {
                                        objCurrentRecord.setValue({
                                            fieldId: 'custbody_task_id',
                                            value: scriptTaskId
                                        })
                                        objCurrentRecord.setValue({
                                            fieldId: 'custbody_add_on_recipe_body',
                                            value: false
                                        })
                                    }
                
                                    var recordId = objCurrentRecord.save({
                                        enableSourcing: true,
                                        ignoreMandatoryFields: true
                                    });
                                    log.debug("recordId" + newRecord.type, recordId)
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                log.error('afterSubmit error', error.message)
            }
        }

        // Private Function
        const searchFoodMenuId = (recId, recType) => {
            log.debug('searchFoodMenuId recId', recId)
            log.debug('searchFoodMenuId recType', recType)
            let arrFoodMenuId = [];
            let filters;
            try {

                if (recType == 'customrecord_costing_sheet') {
                    filters = [
                        ['custrecord_related_food_menu.internalid', 'anyof', '@NONE@'],
                        'AND',
                        ['custrecord_related_topsheet.internalid', 'anyof', recId],
                    ];
                } else {
                    filters = [
                        ['custrecord_related_food_menu.internalid', 'anyof', '@NONE@'],
                        'AND',
                        ['custrecord_transaction_fb_food.internalid', 'anyof', recId],
                    ];
                }
                
                let objItemSearch = search.create({
                    type: 'customrecord_food_menu_fb',
                    filters: filters,
                    columns: [
                        search.createColumn({ name: 'internalid' }),
                    ],
                });
                
                var searchResultCount = objItemSearch.runPaged().count;
                if (searchResultCount != 0) {
                    var pagedData = objItemSearch.runPaged({pageSize: 1000});
                    for (var i = 0; i < pagedData.pageRanges.length; i++) {
                        var currentPage = pagedData.fetch(i);
                        var pageData = currentPage.data;
                        if (pageData.length > 0) {
                            for (var pageResultIndex = 0; pageResultIndex < pageData.length; pageResultIndex++) {
                                var internalid = pageData[pageResultIndex].getValue({name: 'internalid'});
                                log.debug('searchFoodMenuId internalid', internalid)
                                if(!arrFoodMenuId.includes(internalid)){
                                    arrFoodMenuId.push(internalid);
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                log.error('searchFoodMenuId error', err.message);
            }
            log.debug(`searchFoodMenuId: arrFoodMenuId ${Object.keys(arrFoodMenuId).length}`, arrFoodMenuId);
            return arrFoodMenuId;
        }
        return {beforeLoad, afterSubmit}

    });

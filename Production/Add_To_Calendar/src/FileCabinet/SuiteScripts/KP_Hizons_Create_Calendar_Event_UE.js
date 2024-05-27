/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/runtime', 'N/search','N/url','N/format','N/task','N/error'], 
function(record, runtime, search, url, format, task, error){

    /**
 * Function definition to be triggered before record is loaded.
 *a
 * @param {Object} scriptContext
 * @param {Record} scriptContext.newRecord - New record
 * @param {string} scriptContext.type - Trigger type
 * @param {Form} scriptContext.form - Current form
 * @Since 2015.2
 */
    function beforeLoad_hizon_cal_event(scriptContext){
       //var currentForm = scriptContext.form
        try{ 
            if(scriptContext.type === scriptContext.UserEventType.VIEW){
             var currentRecord = scriptContext.newRecord;
             var myUser = runtime.getCurrentUser();
             var myCurrUser = myUser.id;
             var costId = currentRecord.id
             var form = scriptContext.form;
     
             //log.debug('myCurrUser',myCurrUser)
     
            
              
             var nextApprover = currentRecord.getValue({
                 fieldId: 'custrecord_next_approver'
             });
             
             var statusValue = currentRecord.getValue({
                 fieldId: 'custrecord_status'
             });
     
             var subsValue = currentRecord.getValue({
                 fieldId: 'custrecord_cs_subsidiary'
             });
     
             var startdate = currentRecord.getValue({
               fieldId: 'custrecord_event_date'
             })
     
              var enddate = currentRecord.getValue({
                fieldId: 'custrecord_fcs_enddate'
              })
     
              var outlet = currentRecord.getValue({
                fieldId: 'custrecord_tc_costingsheet_location'
              })
     
              var chargeto = currentRecord.getValue({
                fieldId: 'custrecord_charge_to'
              })
              if (chargeto == 4 || chargeto == 26){ // canteen or restaurant
                form.clientScriptModulePath = 'SuiteScripts/KP_Hizons_Create_Event_Utility.js';
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
                         
              //  if(nextApprover == myCurrUser && statusValue == 1 && isSubFB){
                  if(nextApprover == myCurrUser && statusValue == 1 && chargeto != '') {
                    /*var eventId = form.addButton({
                        id : 'custpage_approve_btn',
                        label : 'Approve Costing Sheet',
                        functionName : 'approveCosting(' + costId + ')'
                    });*/    
        
                }
        
               
               var scriptidvalue = currentRecord.getValue({
                   fieldId: 'custrecordscriptidvalue'
               });
              log.debug('scriptidvalue',scriptidvalue)
               
               // Set default value for a custom field on a custom record
              if(scriptidvalue){
                  var defaultValue = '';
        
                  var taskStatus = task.checkStatus({
                        taskId: scriptidvalue
                    });
                  log.debug('taskStatus',taskStatus);
                  
        
                    // Optionally, add logic that executes when the task is complete
                    if (taskStatus.status === 'COMPLETE') {
                        defaultValue='The Event Creation & Updation is completed'
                        
                    }
                    else if (taskStatus.status === 'PROCESSING') {
                        defaultValue='The Event Creation & Updation is still Running'
                        
                    }
                    else if (taskStatus.status === 'FAILED') {
                        defaultValue='The Event Creation & Updation is Failed'
                        
                    }
                    else if (taskStatus.status === 'PENDING') {
                        defaultValue='The Event Creation & Updation is Initiated'
                        
                    }
                    else{
                        defaultValue='The Event Creation & Updation is Not Initiated'
                    }
                    log.debug('defaultValue',defaultValue);
                    form.addField({
                        id: 'custpage_custom_field',
                        type: 'text',
                        label: defaultValue,
                        });
                  
                }
              }
            }
           
           } catch(e){
             log.debug('error',e);
           }
    }

    function beforeSubmit_hizon_cal_event(scriptContext){
        //var currentRecord = scriptContext.newRecord;
        //var form = scriptContext.form;
    }

    function afterSubmit_hizon_cal_event(scriptContext) {

      log.debug('script context', scriptContext);
        var currentRecord = scriptContext.newRecord;

        var chargeto = currentRecord.getValue({
            fieldId: 'custrecord_charge_to'
        });
        if (chargeto == 4 || chargeto == 26){ // canteen or restaurant
            if (chargeto == 26){
                var statusValue = currentRecord.getValue({
                    fieldId: 'custrecord_bqt_calendar_status'
                });
            } else {
                var statusValue = currentRecord.getValue({
                    fieldId: 'custrecord_status'
                });
            }


    
            var subsValue = currentRecord.getValue({
                fieldId: 'custrecord_cs_subsidiary'
            });
    
            var isApproveBtnClicked = currentRecord.getValue({
                fieldId: 'custrecord_button_clicked'
            });
    
          log.debug('button click after submit', isApproveBtnClicked)
          var calendarupdate = currentRecord.getValue({
                fieldId: 'custrecordcalender_update'
            });
    
          log.debug('custrecordcalender_update after submit', calendarupdate)
    
            if(subsValue){
                var parentSubs = search.lookupFields({
                    type: record.Type.SUBSIDIARY,
                    id: subsValue,
                    columns: ['parent']
                })
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
            }
          try {
            if((scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT) && statusValue == 2 && isSubFB &&isApproveBtnClicked&&!calendarupdate){
                var scriptTask = task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: 'customscripttc_subtab_food_menu_sch',
                    deploymentId: 'customdeploytc_subtab_food_menu_sch',
                    params: {
                        custscriptcosting_sheet: scriptContext.newRecord.id // Pass the record ID as a parameter
                    }
                });
                var scriptTaskId = scriptTask.submit();
                log.debug('Scheduled Script aftersubmit submitted with ID: ',scriptTaskId);
                if(scriptTaskId){
                    var idvalue = record.submitFields({
                          type: 'customrecord_costing_sheet',
                          id: scriptContext.newRecord.id,
                          values: {
                              custrecorderror_occur : false,
                              custrecordscriptidvalue : scriptTaskId
                          },
                          options: {
                              enableSourcing: false,
                              ignoreMandatoryFields : true
                          }});
                        log.debug('idvalue',idvalue)
                }
            }}
            catch(error) {
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

    return {
       beforeLoad: beforeLoad_hizon_cal_event,
       afterSubmit: afterSubmit_hizon_cal_event
    };

});
/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/runtime', 'N/search', 'N/record', 'N/url','N/format'],

    function(runtime, search, record, url, format) {
       
        /**
         * Definition of the Scheduled script trigger point.
         *
         * @param {Object} scriptContext
         * @param {string}  - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
         * @Since 2015.2
         */
        function execute(scriptContext) {
            try {
                const userObj = runtime.getCurrentUser();
                var intUserId = userObj.id;

                var scriptObj = runtime.getCurrentScript();
                var scriptParameter = scriptObj.getParameter({
                    name: 'custscriptcosting_sheet'
                });
                log.debug('Scheduled Script', 'Parameter Value: ' + scriptParameter);
                var id =scriptParameter;
                log.debug('scheduled triggered', id)
                var currentRecord = record.load({
                    type: 'customrecord_costing_sheet',
                    id : id
                })
                var chargeto = currentRecord.getValue({
                  fieldId: 'custrecord_charge_to'
                });
                if (chargeto == 26){
                  var statusValue = currentRecord.getValue({
                    fieldId: 'custrecord_bqt_calendar_status'
                  });
                } else {
                  var statusValue = currentRecord.getValue({
                    fieldId: 'custrecord_status'
                  });
                }
  
                log.debug('statusValue',statusValue)
                if(statusValue==2){
                      var id = record.submitFields({
                          type: 'customrecord_costing_sheet',
                          id: scriptParameter,
                          values: {
                              custrecord_status: 11,
                              custrecorderror_occur: false
                          },
                          options: {
                              enableSourcing: false,
                              ignoreMandatoryFields : true
                          }});
                      log.debug('id',id)
                }
                var subsValue = currentRecord.getValue({
                    fieldId: 'custrecord_cs_subsidiary'
                });
  
                var isApproveBtnClicked = currentRecord.getValue({
                    fieldId: 'custrecord_button_clicked'
                });
    
                log.debug('button click', isApproveBtnClicked)
    
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
                        });
                        log.debug('parentSubs.parent',parentSubs.parent)
                        if(subsValue == 3 || parentSubs.parent == 3 || subsValue == 4 || parentSubs.parent == 4 || subsValue == 6 || parentSubs.parent == 6){
                            var isSubFB = true;
                        }
                        else{
                            var isSubFB = false;
                        }
                    }
                }
    
                if( statusValue == 2 && isSubFB){
                  
                    var id = currentRecord.id;
                    
                    var eventNameCos = currentRecord.getValue({
                        fieldId : 'name'
                    })
            
                    var eventDateCos = currentRecord.getValue({
                        fieldId : 'custrecord_event_date'
                    })
            
                    var venue = currentRecord.getValue({
                        fieldId : 'custrecord_costing_sheet_venue'
                    })
  
                    if(venue) {
                      var venueCos = search.lookupFields({
                          type: 'customrecord_venue',
                          id: venue,
                          columns: ['name']
                      })
                    }
            
                    var serveTimeCos = currentRecord.getValue({
                        fieldId : 'custrecord_fcs_serving_time'
                    })
            
                    var dispatchTimeCos = currentRecord.getValue({
                        fieldId : 'custrecord_fcs_dispatch_time'
                    })
            
                    var startTimeCos = currentRecord.getValue({
                        fieldId : 'custrecord_event_start_time'
                    })
                    
                    var endTimeCos = currentRecord.getValue({
                        fieldId : 'custrecord_event_end_time'
                    })
                    
                    var classCos = currentRecord.getValue({
                        fieldId : 'custrecord_event_classification'
                    })
            
                    var chargeTo = currentRecord.getValue({
                        fieldId : 'custrecord_charge_to'
                    })
  
                    var isTopSheet = currentRecord.getValue({
                        fieldId : 'custrecord_related_topsheet_fcs'
                    })
  
                    var outletId = currentRecord.getValue({
                      fieldId: 'custrecord_tc_costingsheet_location'
                    })
  
                    var outlet = search.lookupFields({
                        type: search.Type.LOCATION,
                        id: outletId,
                        columns: ['custrecord_hz_outletmanager']
                    })
  
                    var outletManager = outlet.custrecord_hz_outletmanager[0].value;
  
                    log.debug('outlet manager', outletManager)
                    var updatedRecord = record.load({
                      type: 'customrecord_costing_sheet',
                      id: currentRecord.id
                    })
                    
                    if(chargeTo != 4){
                      var menuCnt = updatedRecord.getLineCount({sublistId: 'recmachcustrecord_related_topsheet'})
                      var foodcalendar = updatedRecord.getValue({
                        fieldId: 'custrecord_food_calendar'
                      })
                      
                      if(foodcalendar != '') {

                        for(var i = 0; i < menuCnt; i++) {
                          var menuId = updatedRecord.getSublistValue({
                              sublistId: 'recmachcustrecord_related_topsheet',
                              fieldId: 'id',
                              line: i
                          })        
                          log.debug('menu id', menuId)
  
                          var menuRecord = record.load({
                              type: 'customrecord_food_menu_fb',
                              id: menuId,
                              isDynamic: true
                          })
  
                          var menuCalendar = menuRecord.getValue({
                            fieldId: 'custrecord_food_calendar_menu'
                          })
  
                          if(menuCalendar == '') {
                            log.debug('menu calendar empty', menuCalendar)
                            menuRecord.setValue({
                              fieldId: 'custrecord_food_calendar_menu',
                              value: foodcalendar
                            })
  
                            menuRecord.save({
                                enableSourcing: true,
                                ignoreMandatoryFields : true
                            });
                          } 
                        }
                      }
                      else if (foodcalendar == null) {
                      
                        var eventRec = record.create({
                            type: record.Type.CALENDAR_EVENT
                        })
                        
                        eventRec.setValue({
                            fieldId: 'title',
                            value: eventNameCos
                        })
                
                        eventRec.setValue({
                            fieldId: 'startdate',
                            value: eventDateCos
                        })
                        if(venue) {
                          eventRec.setValue({
                              fieldId: 'location',
                              value: venueCos.name
                          })
                        }
                
                        eventRec.setValue({
                            fieldId: 'custevent_event_classification',
                            value: classCos
                        })
                
                        eventRec.setValue({
                            fieldId: 'custevent_event_serving_time',
                            value: serveTimeCos
                        })
                        eventRec.setValue({
                            fieldId: 'custevent_event_dispatch_time',
                            value: dispatchTimeCos
                        })
                
                        eventRec.setValue({
                            fieldId: 'starttime',
                            value: startTimeCos
                        })
                
                        eventRec.setValue({
                            fieldId: 'endtime',
                            value: endTimeCos
                        })
  
                        eventRec.setValue({
                            fieldId: 'remindertype',
                            value: 'EMAIL'
                        })
            
                        eventRec.setValue({
                            fieldId: 'reminderminutes',
                            value: 1440
                        })
  
                        eventRec.setValue({
                          fieldId: 'custevent_event_costing_sheet',
                          value: currRecObj.id
                        })
  
                        //09072023 JJBM: Added code for event attendees from outlet
                        var attendeeCount = eventRec.getLineCount({sublistId: 'attendee'})

                        if (intUserId != outletManager){
                            eventRec.setSublistValue({
                                sublistId: 'attendee',
                                fieldId: 'attendee',
                                line: attendeeCount,
                                value: outletManager
                              })
      
                              eventRec.setSublistValue({
                                sublistId: 'attendee',
                                fieldId: 'response',
                                line: attendeeCount,
                                value: 'NORESPONSE'
                              })
                        }
                        
                        var eventId = eventRec.save({
                            enableSourcing: true,
                            ignoreMandatoryFields : true
                        });
                        log.debug('eventid',eventId)

                        var costSheetRec = record.load({
                            type: 'customrecord_costing_sheet',
                            id : currentRecord.id
                        })
                
                        costSheetRec.setValue({
                            fieldId: 'custrecord_food_calendar',
                            value: eventId
                        })
  
                        costSheetRec.setValue({
                            fieldId: 'custrecord_button_clicked',
                            value: false
                        })
                
                        costSheetRec.save({
                            enableSourcing: true,
                            ignoreMandatoryFields : true
                        });
  
                        //09072023 JJBM: Added calendar event to food menu record
                        for(var i = 0; i < menuCnt; i++){
                          var menuId = updatedRecord.getSublistValue({
                              sublistId: 'recmachcustrecord_related_topsheet',
                              fieldId: 'id',
                              line: i
                          })
        
                          var menuRecord = record.load({
                              type: 'customrecord_food_menu_fb',
                              id: menuId,
                              isDynamic: true
                            })

                          menuRecord.setValue({
                            fieldId: 'custrecord_food_calendar_menu',
                            value: eventId
                          })

                          menuRecord.save({
                            enableSourcing: true,
                            ignoreMandatoryFields : true
                          });
                        }
                      }
                    }
                    else{
                        var menuCnt = updatedRecord.getLineCount({sublistId: 'recmachcustrecord_related_topsheet'})
                        
                        var menuData = new Array;
                        for(var x=0; x<menuCnt; x++){
                            var category = currentRecord.getSublistText({
                                sublistId: 'recmachcustrecord_related_topsheet',
                                fieldId: 'custrecord_category',
                                line: x
                            })
            
                            var date = currentRecord.getSublistValue({
                                sublistId: 'recmachcustrecord_related_topsheet',
                                fieldId: 'custrecord_fcs_date',
                                line: x
                            })
  
                           var menuId = updatedRecord.getSublistValue({
                                sublistId: 'recmachcustrecord_related_topsheet',
                                fieldId: 'id',
                                line: x
                            })
  
                           log.debug('menu id', menuId)
  
                           var calendarevent = search.lookupFields({
                              type: 'customrecord_food_menu_fb',
                              id: menuId,
                              columns: ['custrecord_food_calendar_menu']
                           })
                           log.debug('calendar event', calendarevent)
  
                           if(calendarevent.custrecord_food_calendar_menu[0] == null) {
                              log.debug('null')
                              calendarevent = null
                           } else {
                              log.debug('not null')
                              calendarevent = calendarevent.custrecord_food_calendar_menu[0].value
                           }
            
                           menuData.push({
                              'date': date,
                              'category': category,
                              'menuId': menuId,
                              'calendarevent': calendarevent
                          });
                        }
            
                        var groupedDate = {};
            
                        for (var i = 0; i < menuData.length; i++) {
                            var menuDate = menuData[i];
                            var date = menuDate.date;
                            //var category = menuDate.category;
                      
                            if (!groupedDate[date] ) {
                              groupedDate[date] = [];
                            }
                            /*if (!groupedDate[date][category]) {
                                groupedDate[date][category] = [];
                            }*/
                            
                            groupedDate[date].push(menuDate);
                        }
            
                        log.debug("Grouped Date:",groupedDate)
                        for (var date in groupedDate) {
                            var group1Date = groupedDate[date];
                            log.debug("objData Date:",group1Date)
                            var groupedCat = {};
                            for (var i = 0; i < group1Date.length; i++) {
                                var menuCat = group1Date[i];
                                var category = menuCat.category;
                          
                                if (!groupedCat[category] ) {
                                    groupedCat[category] = [];
                                }
                                /*if (!groupedDate[date][category]) {
                                    groupedDate[date][category] = [];
                                }*/
                                
                                groupedCat[category].push(menuCat);
                            }
                
                            log.debug("Grouped Category:",groupedCat)
                            for (var category in groupedCat) {
                                var group2Cat = groupedCat[category];
                                log.debug("objData Category:",group2Cat)
                                //for (var i = 0; i < group2Cat.length; i++) {
                              var calendarevent = ''
                              var calendarcount = 0;
  
                              for(var calCount = 0; calCount < group2Cat.length; calCount++) {
                                if(group2Cat[calCount].calendarevent != null) {
                                  calendarevent = group2Cat[calCount].calendarevent
                                  calendarcount = calendarcount + 1
                                }
                              }
  
                              if(calendarcount == 0) {
                                var dateOnly = format.format({
                                  value: group2Cat[0].date,
                                  type: format.Type.DATE
                                });
                                var dateObj = group2Cat[0].date;
                                var catObj = group2Cat[0].category;
                                log.debug("dateObj", dateObj)
                                log.debug("catObj", catObj)
                                var titleCanteen = eventNameCos+' '+dateOnly+' '+group2Cat[0].category;
                                log.debug("titleCanteen", titleCanteen)
                                //title.push(group1Date[i].date)
                              
                                var eventRec = record.create({
                                    type: record.Type.CALENDAR_EVENT
                                })
        
                                eventRec.setValue({
                                    fieldId: 'title',
                                    value: titleCanteen
                                })
                        
                                if(isTopSheet){
                                    eventRec.setValue({
                                        fieldId: 'startdate',
                                        value: dateObj
                                    })
                                }
                                else{
                                    eventRec.setValue({
                                        fieldId: 'startdate',
                                        value: eventDateCos
                                    })
                                }

                                if(venue) {
                                  eventRec.setValue({
                                      fieldId: 'location',
                                      value: venueCos
                                  })
                                }
                                eventRec.setValue({
                                    fieldId: 'custevent_event_classification',
                                    value: classCos
                                })
                        
                                eventRec.setValue({
                                    fieldId: 'custevent_event_serving_time',
                                    value: serveTimeCos
                                })
                                eventRec.setValue({
                                    fieldId: 'custevent_event_dispatch_time',
                                    value: dispatchTimeCos
                                })
                        
                                eventRec.setValue({
                                    fieldId: 'starttime',
                                    value: startTimeCos
                                })
                        
                                eventRec.setValue({
                                    fieldId: 'endtime',
                                    value: endTimeCos
                                })
        
                                eventRec.setValue({
                                    fieldId: 'custevent_event_costing_sheet',
                                    value: currentRecord.id
                                })

                                eventRec.setValue({
                                    fieldId: 'remindertype',
                                    value: 'EMAIL'
                                })
                    
                                eventRec.setValue({
                                    fieldId: 'reminderminutes',
                                    value: 1440
                                })

                                //event attendees from outlet
                        
                                var attendeeCount = eventRec.getLineCount({sublistId: 'attendee'})

                                if (intUserId != outletManager){
                                    eventRec.setSublistValue({
                                        sublistId: 'attendee',
                                        fieldId: 'attendee',
                                        line: attendeeCount,
                                        value: outletManager
                                    })
            
                                    eventRec.setSublistValue({
                                        sublistId: 'attendee',
                                        fieldId: 'response',
                                        line: attendeeCount,
                                        value: 'NORESPONSE'
                                    })
                                }

                                var eventId = eventRec.save({
                                    enableSourcing: true,
                                    ignoreMandatoryFields : true
                                });
                                log.debug('eventId',eventId)

                                for (var i = 0; i < group2Cat.length; i++) {
                                    var menuRecord = record.load({
                                      type: 'customrecord_food_menu_fb',
                                      id: group2Cat[i].menuId,
                                      isDynamic: true
                                    })
    
                                    menuRecord.setValue({
                                      fieldId: 'custrecord_food_calendar_menu',
                                      value: eventId
                                    })
      
                                    menuRecord.save({
                                        enableSourcing: true,
                                        ignoreMandatoryFields : true
                                    });
                                }
                              }
                              else if (calendarcount > 0) {
                                log.debug('calendar count > 0', calendarcount)
                                for (var i = 0; i < group2Cat.length; i++) {
  
                                  if(group2Cat[i].calendarevent == null) {
                                  var menuRecord = record.load({
                                      type: 'customrecord_food_menu_fb',
                                      id: group2Cat[i].menuId,
                                      isDynamic: true
                                  })
  
                                  menuRecord.setValue({
                                    fieldId: 'custrecord_food_calendar_menu',
                                    value: calendarevent
                                  })
    
                                  menuRecord.save({
                                    enableSourcing: true,
                                    ignoreMandatoryFields : true
                                  });
                                }
                              }
                            }
  
                                    /*var currRecObj = record.load({
                                        type: 'customrecord_costing_sheet',
                                        id : id
                                    })*/
                            
                                    //currRecObj.save();
                                //}
                            }
                        }
                    }
                  if(statusValue==2){
                    var saveid = record.submitFields({
                        type: 'customrecord_costing_sheet',
                        id: scriptParameter,
                        values: {
                            custrecord_status: 2,
                            custrecorderror_occur: false,
                            custrecordcalender_update: true
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields : true
                        }});
                    log.debug('saveid',saveid)
                  }
                }
                
                var scriptObj = runtime.getCurrentScript();
                var remainingUsage = runtime.getCurrentScript().getRemainingUsage();
                log.debug('Scheduled Script', 'Script Usage - Remaining: ' + remainingUsage );
             }
             catch(error) {
             log.debug('error', error);
              if(statusValue==2){
                    var saveid = record.submitFields({
                        type: 'customrecord_costing_sheet',
                        id: scriptParameter,
                        values: {
                            custrecord_status: 2,
                            custrecorderror_occur: true
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields : true
                        }});
                    log.debug('saveid after error',saveid)
              }
            }
           }
    
        return {
            execute: execute
        };
        
    });
    
/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/currentRecord', 'N/search', 'N/record', 'N/url','N/format'],

function(runtime, currentRecord, search, record, url, format) {
    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */

  var buttonClick = false
    function fieldChanged(scriptContext) {

    }
    function approveCosting(id) {

      try {
      log.debug('client script triggered', id)

        var currRecObj = record.load({
            type: 'customrecord_costing_sheet',
            id : id
        })
        var chargeTo = currRecObj.getValue({
            fieldId : 'custrecord_charge_to'
        })

        var eventNameCos = currRecObj.getValue({
            fieldId : 'name'
        })

        var eventDateCos = currRecObj.getValue({
            fieldId : 'custrecord_event_date'
        })

        var venueCos = currRecObj.getText({
            fieldId : 'custrecord_costing_sheet_venue'
        })

        var serveTimeCos = currRecObj.getValue({
            fieldId : 'custrecord_fcs_serving_time'
        })

        var dispatchTimeCos = currRecObj.getValue({
            fieldId : 'custrecord_fcs_dispatch_time'
        })

        var startTimeCos = currRecObj.getValue({
            fieldId : 'custrecord_event_start_time'
        })
        
        var endTimeCos = currRecObj.getValue({
            fieldId : 'custrecord_event_end_time'
        })
        
        var classCos = currRecObj.getValue({
            fieldId : 'custrecord_event_classification'
        })

        var isTopSheet = currRecObj.getValue({
            fieldId : 'custrecord_related_topsheet_fcs'
        })

      var outletId = currRecObj.getValue({
        fieldId: 'custrecord_tc_costingsheet_location'
      })

       var outlet = search.lookupFields({
                type: search.Type.LOCATION,
                id: outletId,
                columns: ['custrecord_hz_outletmanager']
            })

      var outletManager = outlet.custrecord_hz_outletmanager[0].value;

        if(chargeTo != 4){

          log.debug('charge to not 4', chargeTo);
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
            eventRec.setValue({
                fieldId: 'location',
                value: venueCos
            })
    
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
    
            var eventId = eventRec.save();
    
            currRecObj.setValue({
                fieldId: 'custrecord_button_clicked',
                value: true
            })

            currRecObj.setValue({
                fieldId: 'custrecord_status',
                value: 2
            })
    
            currRecObj.setValue({
                fieldId: 'custrecord_food_calendar',
                value: eventId
            })
    
            currRecObj.save();
          
//09072023 JJBM: Added calendar event to food menu record
            var menuCnt = currRecObj.getLineCount({sublistId: 'recmachcustrecord_related_topsheet'})
          log.debug('menu count', menuCnt)

          for(var i = 0; i < menuCnt; i++){
           
            var menuId = currRecObj.getSublistValue({
                        sublistId: 'recmachcustrecord_related_topsheet',
                        fieldId: 'id',
                        line: i
                    })

            log.debug('menu id', menuId)
            log.debug('event id', eventId)

            var menuRecord = record.load({
                           type: 'customrecord_food_menu_fb',
                           id: menuId,
                           isDynamic: true
                         })

                        menuRecord.setValue({
                          fieldId: 'custrecord_food_calendar_menu',
                          value: eventId
                        })

                        menuRecord.save();
          }

           location.reload();
        }
        else{
           log.debug('else', chargeTo);

            var menuCnt = currRecObj.getLineCount({sublistId: 'recmachcustrecord_related_topsheet'})
                
                var menuData = new Array;
                for(var x=0; x<menuCnt; x++){
                    var category = currRecObj.getSublistText({
                        sublistId: 'recmachcustrecord_related_topsheet',
                        fieldId: 'custrecord_category',
                        line: x
                    })
    
                    var date = currRecObj.getSublistValue({
                        sublistId: 'recmachcustrecord_related_topsheet',
                        fieldId: 'custrecord_fcs_date',
                        line: x
                    })

                  var menuId = currRecObj.getSublistValue({
                        sublistId: 'recmachcustrecord_related_topsheet',
                        fieldId: 'id',
                        line: x
                    })

                    menuData.push({
                        'date': date,
                        'category': category,
                        'menuId': menuId 
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
                            
                            eventRec.setValue({
                                fieldId: 'location',
                                value: venueCos
                            })
                    
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
                                value: currRecObj.id
                            })

                            eventRec.setValue({
                                fieldId: 'remindertype',
                                value: 'EMAIL'
                            })
    
                            eventRec.setValue({
                                fieldId: 'reminderminutes',
                                value: 1440
                            })

                      //09072023 JJBM: Added code for event attendees from outlet
                     var attendeeCount = eventRec.getLineCount({sublistId: 'attendee'})

                           
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

                    
                            var eventId = eventRec.save();

                      //09072023 JJBM: Added code for assigning calendar event on Food Menu   

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

                        menuRecord.save();
                      }              
        
                        //}
                    }
                }

            /*currRecObj.setValue({
                fieldId: 'custrecord_button_clicked',
                value: true
            })*/

            currRecObj.setValue({
                fieldId: 'custrecord_status',
                value: 2
            })

            currRecObj.save();
    
            location.reload();
        }

        buttonClick = true;
      }
      catch(error) {
        log.debug('error', error)
      }
     }
   
 
     return {
        approveCosting : approveCosting,
        fieldChanged: fieldChanged
        //saveRecord: saveRecord
        /*postSourcing: postSourcing,
        sublistChanged: sublistChanged,
        lineInit: lineInit,
        validateField: validateField,
        validateLine: validateLine,
        validateInsert: validateInsert,
        validateDelete: validateDelete
        saveRecord: saveRecord*/
    };
    
});
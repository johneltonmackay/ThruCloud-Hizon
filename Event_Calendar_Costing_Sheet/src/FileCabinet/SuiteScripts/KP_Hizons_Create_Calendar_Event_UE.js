/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/search', 'N/url', 'N/format'],
  function(record, runtime, search, url, format) {

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
      var ojbRecord = scriptContext.newRecord;
      let strQueryString = ojbRecord.getValue({
        fieldId: 'entryformquerystring',
      })
      let strBanquetType = ojbRecord.getValue({
        fieldId: 'custrecord_charge_to',
      })
      log.debug('beforeLoad: strBanquetType', strBanquetType)
      log.debug('beforeLoad: strQueryString', strQueryString)
      
        let targetKey
        let targetValue
        if (strQueryString){
          let arrQueryString = strQueryString.split('&');

          arrQueryString.forEach(item => {
            let keyValue = item.split('=');
            if (keyValue[0] === 'salesOrderId') {
                targetKey = 'salesorder';
                targetValue = keyValue[1];
            }
          })
    
          log.debug('beforeLoad: targetKey', targetKey)
          log.debug('beforeLoad: targetValue', targetValue)
          if (targetKey && targetValue) {
            try {
                var fieldLookUp = search.lookupFields({
                    type: search.Type.TRANSACTION,
                    id: targetValue,
                    columns: ['custbody_hz_dispatch_time', 'custbody_hz_servicetime', 'class']
                });
                log.debug("fieldLookUp", fieldLookUp);
                if (fieldLookUp) {
                    var startTimeString = fieldLookUp.custbody_hz_dispatch_time;
                    var endTimeString = fieldLookUp.custbody_hz_servicetime;
                    var strClass = fieldLookUp.class[0].value;
                    var startTime = startTimeString ? new Date(startTimeString) : null;
                    var endTime = endTimeString ? new Date(endTimeString) : null;
                }
                log.debug('beforeLoad: strClass', strClass);
                log.debug('beforeLoad: startTime', startTime);
                log.debug('beforeLoad: endTime', endTime);
                if (strClass == "3"){
                  if (startTime){
                    ojbRecord.setValue({
                      fieldId: 'custrecord_event_start_time',
                      value: startTime
                    })
                  }
  
                  if (endTime){
                    ojbRecord.setValue({
                      fieldId: 'custrecord_event_end_time',
                      value: endTime
                    })
                  }
                }
            } catch (e) {
                log.debug(e.message);
            }
          }
        }
      
      
    
    

      if (scriptContext.type === scriptContext.UserEventType.VIEW) {
        var currentRecord = scriptContext.newRecord;
        // var myUser = runtime.get();
        // var myCurrUser = myUser.id;
        // var costId = currentRecord.id
        var form = scriptContext.form;


        form.clientScriptModulePath = 'SuiteScripts/KP_Hizons_Create_Event_Utility.js';

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

        if (subsValue) {
          var parentSubs = search.lookupFields({
            type: record.Type.SUBSIDIARY,
            id: subsValue,
            columns: ['parent']
          })
          if (subsValue == 3 || parentSubs.parent == 3) {
            var isSubFB = true;
          } else {
            var isSubFB = false;
          }
        }

        //  if(nextApprover == myCurrUser && statusValue == 1 && isSubFB){
        // if (nextApprover == myCurrUser && statusValue == 1 && chargeto != '') {
        //   /*var eventId = form.addButton({‌
        //       id : 'custpage_approve_btn',
        //       label : 'Approve Costing Sheet',
        //       functionName : 'approveCosting(' + costId + ')'
        //   });*/

        // }

      }

    }

    function beforeSubmit_hizon_cal_event(scriptContext) {
      //var currentRecord = scriptContext.newRecord;
      //var form = scriptContext.form;
    }

    function afterSubmit_hizon_cal_event(scriptContext) {

      log.debug('script context', scriptContext);
      var currentRecord = scriptContext.newRecord;

      var statusValue = currentRecord.getValue({
        fieldId: 'custrecord_status'
      });

      var subsValue = currentRecord.getValue({
        fieldId: 'custrecord_cs_subsidiary'
      });

      var isApproveBtnClicked = currentRecord.getValue({
        fieldId: 'custrecord_button_clicked'
      });

      log.debug('button click', isApproveBtnClicked)

      if (subsValue) {
        var parentSubs = search.lookupFields({
          type: record.Type.SUBSIDIARY,
          id: subsValue,
          columns: ['parent']
        })
        if (subsValue) {
          var parentSubs = search.lookupFields({
            type: record.Type.SUBSIDIARY,
            id: subsValue,
            columns: ['parent']
          })
          if (subsValue == 3 || parentSubs.parent == 3) {
            var isSubFB = true;
          } else {
            var isSubFB = false;
          }
        }
      }
      log.debug('afterSubmit_hizon_cal_event: isSubFB', isSubFB)
      if ((scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT) && statusValue == 2 && isSubFB) {
        log.debug('UE type', scriptContext.type);
        var id = currentRecord.id;

        var eventNameCos = currentRecord.getValue({
          fieldId: 'name'
        })

        var eventDateCos = currentRecord.getValue({
          fieldId: 'custrecord_event_date'
        })

        var venue = currentRecord.getValue({
          fieldId: 'custrecord_costing_sheet_venue'
        })

        if (venue) {
          var venueCos = search.lookupFields({
            type: 'customrecord_venue',
            id: venue,
            columns: ['name']
          })
        }

        var serveTimeCos = currentRecord.getValue({
          fieldId: 'custrecord_fcs_serving_time'
        })

        var dispatchTimeCos = currentRecord.getValue({
          fieldId: 'custrecord_fcs_dispatch_time'
        })

        var startTimeCos = currentRecord.getValue({
          fieldId: 'custrecord_event_start_time'
        })

        var endTimeCos = currentRecord.getValue({
          fieldId: 'custrecord_event_end_time'
        })

        var classCos = currentRecord.getValue({
          fieldId: 'custrecord_event_classification'
        })

        var chargeTo = currentRecord.getValue({
          fieldId: 'custrecord_charge_to'
        })

        var isTopSheet = currentRecord.getValue({
          fieldId: 'custrecord_related_topsheet_fcs'
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

        log.debug('chargeTo', chargeTo)
        if (chargeTo != 4) {
          var menuCnt = updatedRecord.getLineCount({
            sublistId: 'recmachcustrecord_related_topsheet'
          })
          var foodcalendar = updatedRecord.getValue({
            fieldId: 'custrecord_food_calendar'
          })
          log.debug('foodcalendar', foodcalendar)
          if (foodcalendar) {
            log.debug('foodcalendar if', foodcalendar)
            for (var i = 0; i < menuCnt; i++) {

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

              if (menuCalendar == '') {
                log.debug('menu calendar empty', menuCalendar)
                menuRecord.setValue({
                  fieldId: 'custrecord_food_calendar_menu',
                  value: foodcalendar
                })

                menuRecord.save();
              }
            }
          } else {
            log.debug('foodcalendar if else', foodcalendar)
            log.debug('foodcalendar  if else', subsValue)
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
            if (venue) {
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
            });

            eventRec.setValue({
              fieldId: 'endtime',
              value: endTimeCos
            });

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
              value: currentRecord.id
            })

            let strVenue = currentRecord.getText({
                fieldId: 'custrecord_tc_costingsheet_location'
            })
            log.debug('beforeSubmit: strVenue', strVenue)
            let numLines = eventRec.getLineCount({
                sublistId: 'attendee'
            })
            log.debug('beforeSubmit: numLines', numLines)
            if (strVenue){
                let arrExistingAttendees = getExistingAttendees(currentRecord, numLines, runtime)
                let arrAttendees = searchGroup(strVenue, arrExistingAttendees, chargeTo)
                if (arrAttendees.length > 0){
                    try {
                        arrAttendees.forEach((data, index) => {
                            for (let key in data) {
                                if (data.hasOwnProperty(key)) {
                                    let value = data[key];
                                    eventRec.setSublistValue({
                                        sublistId: 'attendee',
                                        fieldId: key, 
                                        value: value,
                                        line: numLines + index,
                                    });
                                }
                            }
                        });
                    } catch (error) {
                        log.error('beforeSubmit error', error.message);
                    }
                }
            }
            
            let objValue = {
              attendee: outletManager, 
              custevent_event_costing_sheet: currentRecord.id,
              endtime: endTimeCos,
              starttime: startTimeCos,
              custevent_event_dispatch_time: dispatchTimeCos,
              custevent_event_serving_time: serveTimeCos,
              custevent_event_classification: classCos,
              location: venueCos.name,
              title: eventNameCos,
              startdate: eventDateCos
            }
            log.debug('foodcalendar null objValue', objValue)
            var eventId = eventRec.save();

            log.debug('foodcalendar null', eventId)

            var costSheetRec = record.load({
              type: 'customrecord_costing_sheet',
              id: currentRecord.id
            })

            costSheetRec.setValue({
              fieldId: 'custrecord_food_calendar',
              value: eventId
            })

            costSheetRec.setValue({
              fieldId: 'custrecord_button_clicked',
              value: false
            })

            costSheetRec.save();

            log.debug('foodcalendar test')

            //09072023 JJBM: Added calendar event to food menu record
            for (var i = 0; i < menuCnt; i++) {

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
                ignoreMandatoryFields: true
              });
            }
          }
        } else {
          var menuCnt = updatedRecord.getLineCount({
            sublistId: 'recmachcustrecord_related_topsheet'
          })
          log.debug('menuCnt', menuCnt)
          var menuData = new Array;
          for (var x = 0; x < menuCnt; x++) {
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

            if (calendarevent.custrecord_food_calendar_menu[0] == null) {
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
          log.debug('menuData', menuData)
          for (var i = 0; i < menuData.length; i++) {
            var menuDate = menuData[i];
            var date = menuDate.date;
            //var category = menuDate.category;

            if (!groupedDate[date]) {
              groupedDate[date] = [];
            }
            /*if (!groupedDate[date][category]) {
                groupedDate[date][category] = [];
            }*/

            groupedDate[date].push(menuDate);
          }

          log.debug("Grouped Date:", groupedDate)
          for (var date in groupedDate) {
            var group1Date = groupedDate[date];
            log.debug("objData Date:", group1Date)
            var groupedCat = {};
            for (var i = 0; i < group1Date.length; i++) {
              var menuCat = group1Date[i];
              var category = menuCat.category;

              if (!groupedCat[category]) {
                groupedCat[category] = [];
              }
              /*if (!groupedDate[date][category]) {
                  groupedDate[date][category] = [];
              }*/

              groupedCat[category].push(menuCat);
            }

            log.debug("Grouped Category:", groupedCat)
            for (var category in groupedCat) {
              var group2Cat = groupedCat[category];
              log.debug("objData Category:", group2Cat)
              //for (var i = 0; i < group2Cat.length; i++) {
              var calendarevent = ''
              var calendarcount = 0;

              for (var calCount = 0; calCount < group2Cat.length; calCount++) {
                if (group2Cat[calCount].calendarevent != null) {
                  calendarevent = group2Cat[calCount].calendarevent
                  calendarcount = calendarcount + 1
                }
              }
              log.debug("calendarcount:", calendarcount)
              if (calendarcount == 0) {
                var dateOnly = format.format({
                  value: group2Cat[0].date,
                  type: format.Type.DATE
                });
                var dateObj = group2Cat[0].date;
                var catObj = group2Cat[0].category;
                log.debug("dateObj", dateObj)
                log.debug("catObj", catObj)
                var titleCanteen = eventNameCos + ' ' + dateOnly + ' ' + group2Cat[0].category;
                log.debug("titleCanteen", titleCanteen)
                //title.push(group1Date[i].date)

                log.debug('foodcalendar else subsValue', subsValue)
                var eventRec = record.create({
                  type: record.Type.CALENDAR_EVENT
                })

                eventRec.setValue({
                  fieldId: 'title',
                  value: titleCanteen
                })

                if (isTopSheet) {
                  eventRec.setValue({
                    fieldId: 'startdate',
                    value: dateObj
                  })
                } else {
                  eventRec.setValue({
                    fieldId: 'startdate',
                    value: eventDateCos
                  })
                }

                if (venue) {
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

                let strVenue = currentRecord.getText({
                  fieldId: 'custrecord_tc_costingsheet_location'
                })
                log.debug('beforeSubmit: strVenue', strVenue)
                let numLines = eventRec.getLineCount({
                    sublistId: 'attendee'
                })
                log.debug('beforeSubmit: numLines', numLines)
                if (strVenue){
                    let arrExistingAttendees = getExistingAttendees(currentRecord, numLines, runtime)
                    let arrAttendees = searchGroup(strVenue, arrExistingAttendees, chargeTo)
                    if (arrAttendees.length > 0){
                        try {
                            arrAttendees.forEach((data, index) => {
                                for (let key in data) {
                                    if (data.hasOwnProperty(key)) {
                                        let value = data[key];
                                        eventRec.setSublistValue({
                                            sublistId: 'attendee',
                                            fieldId: key, 
                                            value: value,
                                            line: numLines + index,
                                        });
                                    }
                                }
                            });
                        } catch (error) {
                            log.error('beforeSubmit error', error.message);
                        }
                    }
                }


                var eventId = eventRec.save();
                log.debug('eventId', eventId)

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
              } else if (calendarcount > 0) {
                log.debug('calendar count > 0', calendarcount)
                for (var i = 0; i < group2Cat.length; i++) {

                  if (group2Cat[i].calendarevent == null) {
                    var menuRecord = record.load({
                      type: 'customrecord_food_menu_fb',
                      id: group2Cat[i].menuId,
                      isDynamic: true
                    })

                    menuRecord.setValue({
                      fieldId: 'custrecord_food_calendar_menu',
                      value: calendarevent
                    })

                    menuRecord.save();
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

      }

    }

        //private function
        const getExistingAttendees = (objCurrRec, numLines, runtime) => {
          const userObj = runtime.getCurrentUser();
          let intUserId = userObj.id
          let arrAttendees = []
          if (intUserId){
            arrAttendees.push(intUserId)
          } 
          log.debug('getExistingAttendees: arrAttendees', arrAttendees)
          return arrAttendees
      }

      const searchGroup = (strVenue, arrExistingAttendees, chargeTo) => {
          let arrAttendees = [];
          let strChargeTo = '';
          try {
              let objGroupSearch = search.create({
                  type: 'entitygroup',
                  filters: [
                      ['groupname', 'is', strVenue],
                    ],
                  columns: [
                      search.createColumn({ name: 'internalid', join: 'groupmember' }),
                  ],

              });
              var searchResultCount = objGroupSearch.runPaged().count;
              if (searchResultCount != 0) {
                  var pagedData = objGroupSearch.runPaged({pageSize: 1000});
                  for (var i = 0; i < pagedData.pageRanges.length; i++) {
                      var currentPage = pagedData.fetch(i);
                      var pageData = currentPage.data;
                      if (pageData.length > 0) {
                          for (var pageResultIndex = 0; pageResultIndex < pageData.length; pageResultIndex++) {
                              var intMemberId = pageData[pageResultIndex].getValue({ name: 'internalid', join: 'groupmember' });

                              // Check if memberId already exists in arrTransaction
                              var existingIndex = arrAttendees.findIndex(item => item.memberId === intMemberId);
                              if (existingIndex == -1) {
                                  // If doesn't exist, create a item
                                  if (chargeTo == 3){
                                    chargeTo = 'ACCEPTED';
                                  } else if (chargeTo == 4){
                                    chargeTo = 'NO RESPONSE';
                                  } else if (chargeTo == 26){
                                    chargeTo = 'TENTATIVE';
                                  }
                                  if (!arrExistingAttendees.includes(parseInt(intMemberId))){
                                      arrAttendees.push({
                                        attendee: intMemberId,
                                        response: chargeTo
                                      });
                                  }
                              }
                          }
                      }
                  }
              }
              log.debug(`searchGroup: arrAttendees ${Object.keys(arrAttendees).length}`, arrAttendees);
              return arrAttendees;
          } catch (err) {
              log.error('searchGroup error', err.message);
          }
      }
      
    return {
      beforeLoad: beforeLoad_hizon_cal_event,
      afterSubmit: afterSubmit_hizon_cal_event
    };

  });

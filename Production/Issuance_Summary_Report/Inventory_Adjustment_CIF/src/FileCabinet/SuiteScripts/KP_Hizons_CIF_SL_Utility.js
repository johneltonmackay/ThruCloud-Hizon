/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/ui/message','N/currentRecord', 'N/search', 'N/record','N/url', 'N/ui/dialog','N/format','N/https'],

function(runtime, message, currentRecord, search, record, url, dialog, format, https) {

    function pageInit_cif(scriptContext) {
        var currRecObj = currentRecord.get();
        var myUser = runtime.getCurrentUser();

        var  queryString = window.location.search;
        console.log('queryString',queryString);

        var urlParams = new URLSearchParams(queryString);
        var invAdjId = urlParams.get('invAdjId')
        if(invAdjId){
            
            var invAdjLink = 'https://8154337.app.netsuite.com/app/accounting/transactions/invadjst.nl?id='+invAdjId;
            var fieldLookUp = search.lookupFields({
                type: search.Type.INVENTORY_ADJUSTMENT,
                id: invAdjId,
                columns: ['tranid']
            });
            var linkText = fieldLookUp.tranid;
            //var str = '<ul><li><a href="'+invAdjLink+'" target="_blank"></a></li></ul>';
            var successBanner = message.create({
                type: message.Type.CONFIRMATION,
                title: 'Inventory Adjustment Generation Complete',
                message: 'The following Inventory Adjustment were created: <a href="' + invAdjLink + '" target="_blank">' + linkText + '</a>.</p>'
            });
            successBanner.show();
        }
        

        var fmListCount = currRecObj.getLineCount({
            sublistId: 'custpage_food_menu_list'
        });
        
        if(fmListCount>0){
            for(var i=0;i<fmListCount;i++){
                currRecObj.selectLine({sublistId: 'custpage_food_menu_list', line: i});

                var totalLine = currRecObj.getSublistField({
                    sublistId: 'custpage_food_menu_list',
                    fieldId: 'custpage_total_cost',
                    line: i
                });
                totalLine.isDisabled = true;
            }
        }
        
    }

    function fieldChanged_cif(scriptContext) {
        var currRecObj = currentRecord.get();
        var pageId

        if (scriptContext.fieldId == 'custpage_pageid'){
            pageId = currRecObj.getValue({
                  fieldId: 'custpage_pageid'
              });
  
            pageId = parseInt(pageId.split('_')[1]);
  
             currRecObj.setValue({
                  fieldId: 'custpage_form_pagefield',
                  value: pageId
              });
             
            var eventName = currRecObj.getValue({
                fieldId: 'custpage_form_eventname'
            });

            var dateFrom = currRecObj.getValue({
              fieldId: 'custpage_form_datefrom'
            });

            var dateTo = currRecObj.getValue({
              fieldId: 'custpage_form_dateto'
            });

            var chargeTo = currRecObj.getValue({
                fieldId: 'custpage_form_chargeto'
            });

            var outlet = currRecObj.getValue({
                fieldId: 'custpage_form_outlet'
            });

           
  
            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_inv_adjustment_cif',
                deploymentId: 'customdeploy_inv_adjustment_cif',
                params: {
                    page: pageId,
                    eventName : eventName,
                    dateFrom : dateFrom,
                    dateTo : dateTo,
                    chargeTo : chargeTo,
                    outlet : outlet
                }
            });
            window.location.href = suiteletURL
        }
        
        if (scriptContext.fieldId == 'custpage_qty_released'){
            var unitPrice =  currRecObj.getSublistValue({
                sublistId: 'custpage_food_menu_list',
                fieldId: 'custpage_unit_price',
                line: scriptContext.line
            });

            var qtyReleased =  currRecObj.getSublistValue({
                sublistId: 'custpage_food_menu_list',
                fieldId: 'custpage_qty_released',
                line: scriptContext.line
            });
    
            var totalCost = parseFloat(unitPrice) * parseFloat(qtyReleased);
            if(totalCost){
                totalCost = totalCost.toFixed(2);
            }
            else{
                totalCost = 0;
            }
            
            currRecObj.selectLine({sublistId: 'custpage_food_menu_list', line: scriptContext.line});
            currRecObj.setCurrentSublistValue({
                sublistId: 'custpage_food_menu_list',
                fieldId: 'custpage_total_cost',
                value: totalCost,
                forceSyncSourcing: true
            });
                
            currRecObj.commitLine({sublistId: 'custpage_food_menu_list'})
        }
    }


    function searchFM() {
      var currRecObj = currentRecord.get();
      var eventName = currRecObj.getValue({
          fieldId: 'custpage_form_eventname'
      });

      var dateFrom = currRecObj.getValue({
        fieldId: 'custpage_form_datefrom'
      });

      if(dateFrom){
        dateFrom = format.format({
            value: dateFrom,
            type: format.Type.DATE
        });
      }
      

      var dateTo = currRecObj.getValue({
        fieldId: 'custpage_form_dateto'
      });
      if(dateTo){
        dateTo = format.format({
            value: dateTo,
            type: format.Type.DATE
        });
      }

      var chargeTo = currRecObj.getValue({
          fieldId: 'custpage_form_chargeto'
      });

      var outlet = currRecObj.getValue({
          fieldId: 'custpage_form_outlet'
      });
      var events = eventName.toString();
      console.log('eventName',eventName)
      var suiteletURL = url.resolveScript({
          scriptId: 'customscript_inv_adjustment_cif',
          deploymentId: 'customdeploy_inv_adjustment_cif',
          params: {
              page: 0,
              eventName : events,
              dateFrom : dateFrom,
              dateTo : dateTo,
              chargeTo : chargeTo,
              outlet : outlet
          }
      });
      window.location.href = suiteletURL
    }

    function submitCIF() {
        var currRecObj = currentRecord.get();
        
        var applyIR = 0;
        var invTrue = [];
        var invIds = [];

        var eventName = currRecObj.getValue({
            fieldId: 'custpage_form_eventname'
        });

        var dateFrom = currRecObj.getValue({
          fieldId: 'custpage_form_datefrom'
        });

        if(dateFrom){
            dateFrom = format.format({
                value: dateFrom,
                type: format.Type.DATE
            });
        }

        console.log('dateFrom',dateFrom)

        var dateTo = currRecObj.getValue({
            fieldId: 'custpage_form_dateto'
          });
          
        if(dateTo){
            dateTo = format.format({
                value: dateTo,
                type: format.Type.DATE
            });
        }

        console.log('dateTo',dateTo)

        var chargeTo = currRecObj.getValue({
            fieldId: 'custpage_form_chargeto'
        });

        var outlet = currRecObj.getValue({
            fieldId: 'custpage_form_outlet'
        });

        if(eventName || dateFrom || dateTo || chargeTo || outlet){
            var irListCount = currRecObj.getLineCount({
                sublistId: 'custpage_food_menu_list'
            });
           // console.log('irListCount',irListCount)
           var iaObj = [];
            if(irListCount>0){
                for(var i=0;i<irListCount;i++){
                    //console.log('i',i)
                    let invAdjIdValidator = false
                    let qtyInvAdj = 0
                    var isApply = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_mark',
                        line: i
                    });
                    //console.log('isApply',isApply)
                    if(isApply){
                        var currentDate = new Date();
                    
                        applyIR = parseInt(applyIR) + 1;
                        

                        var locationField = record.load({
                            type: record.Type.LOCATION,
                            id: outlet
                        });
                        
                        var subsVal = locationField.getValue({
                            fieldId: 'subsidiary'
                        })

                        var item = currRecObj.getSublistValue({
                            sublistId: 'custpage_food_menu_list',
                            fieldId: 'custpage_item',
                            line: i
                        });
                        
                        var itemSearchColItemId = search.createColumn({ name: 'itemid', sort: search.Sort.ASC });
                        var itemSearchColDisplayName = search.createColumn({ name: 'displayname' });
                        var itemSearchColOutletAverageCost = search.createColumn({ name: 'locationaveragecost' });
                        var itemSearchColInventoryOutlet = search.createColumn({ name: 'inventorylocation' });
                        var itemSearchColOutletOnHand = search.createColumn({ name: 'locationquantityonhand' });
                        
                        var itemSearch = search.create({
                            type: 'item',
                            filters: [
                                ['type', 'anyof', 'InvtPart', 'Assembly'],
                                'AND',
                                ['inventorylocation', 'anyof', outlet],
                                'AND',
                                ['name', 'is', item],
                            ],
                            columns: [
                                itemSearchColItemId,
                                itemSearchColDisplayName,
                                itemSearchColOutletAverageCost,
                                itemSearchColInventoryOutlet,
                                itemSearchColOutletOnHand,
                            ],
                        });
                        
                        var outletOnHand;
                        var itemSearchPagedData = itemSearch.runPaged({ pageSize: 1000 });
                        for (var x = 0; x < itemSearchPagedData.pageRanges.length; x++) {
                            var itemSearchPage = itemSearchPagedData.fetch({ index: x });
                            itemSearchPage.data.forEach(function (result){
                                var itemId = result.getValue(itemSearchColItemId);
                                var displayName = result.getValue(itemSearchColDisplayName);
                                var outletAverageCost = result.getValue(itemSearchColOutletAverageCost);
                                var inventoryOutlet = result.getValue(itemSearchColInventoryOutlet);
                                outletOnHand = result.getValue(itemSearchColOutletOnHand);
                        
                                // ...
                            });
                        }

                        var qtyReleased = currRecObj.getSublistValue({
                            sublistId: 'custpage_food_menu_list',
                            fieldId: 'custpage_qty_released',
                            line: i
                        });

                        var qtyStock = currRecObj.getSublistValue({
                            sublistId: 'custpage_food_menu_list',
                            fieldId: 'custpage_qty_stock',
                            line: i
                        });

                        if(parseFloat(qtyReleased) >= parseFloat(outletOnHand)){
                            invAdjIdValidator = false
                            var posqtyReleased = outletOnHand
                            var negqtyReleased = -outletOnHand
                        }
                        else{
                            invAdjIdValidator = true
                            var posqtyReleased = qtyReleased
                            var negqtyReleased = -qtyReleased
                        }

                        if(!qtyReleased){
                            alert("Cannot Create an Inventory Adjustment without Quantity to be Released");
                            return false;
                        }
                        
                        var qtyRemainingNew = qtyStock - posqtyReleased;
                        var itemSearchColId = search.createColumn({ name: 'internalId'});
                        var itemSearch = search.create({
                            type: 'item',
                            filters: [
                            ['name', 'is', item],
                            ],
                            columns: [
                                itemSearchColId
                            ],
                        });

                        var searchResults = itemSearch.run().getRange({
                            start: 0,
                            end: 1 // Adjust the number of results you want to fetch
                        });

                        var itemSearchColId = searchResults[0].getValue(itemSearchColId);   

                        var ingrdtIDs = currRecObj.getSublistValue({
                            sublistId: 'custpage_food_menu_list',
                            fieldId: 'custpage_fm_id',
                            line: i
                        });

                        let ingrdtArray = JSON.parse(ingrdtIDs);
                        let ingLength = ingrdtArray.length; // Get the length of the parsed array

                        console.log('Ingredient length:', ingLength);
   

                        posqtyReleased = qtyReleased / ingLength

                        console.log('qtyReleased:', parseFloat(qtyReleased));
                        console.log('outletOnHand:', parseFloat(outletOnHand));
                        if (parseFloat(qtyReleased) <= parseFloat(outletOnHand)){
                            iaObj.push({
                                "itemId": itemSearchColId,
                                "qtyNeed" : qtyRemainingNew,
                                "qtypos": posqtyReleased,
                                "qty": negqtyReleased,
                                "ingrdtID": ingrdtIDs,
                                "isValid": invAdjIdValidator,
                                "qtyReleased": qtyReleased,
                                "outletOnHand": outletOnHand
                            })
                            console.log('iaObj', iaObj)
                        }
                    }
                }
                
                let arrInvAdjData = []
                let arrCusIngrdtData = []
                iaObj.forEach(data => {
                    let blnValidator = data.isValid
                    if(blnValidator){
                        arrInvAdjData.push(data)
                    } else {
                        arrCusIngrdtData.push(data)
                    }
                    
                });

                if (arrInvAdjData.length > 0){
                    var invAdjRec = record.create({
                        type: record.Type.INVENTORY_ADJUSTMENT,
                        isDynamic: true
                    });
    
                    invAdjRec.setValue({
                        fieldId : 'subsidiary',
                        value: subsVal
                    })
    
                    invAdjRec.setValue({
                        fieldId : 'adjlocation',
                        value: outlet
                    })
    
                    invAdjRec.setValue({
                        fieldId : 'account',
                        value: 214
                    })

                    invAdjRec.setValue({
                        fieldId : 'class',
                        value: chargeTo
                    })
    
                    invAdjRec.setValue({
                        fieldId : 'trandate',
                        value: currentDate
                    })

                    invAdjRec.setValue({
                        fieldId : 'custbody_atlas_inv_adj_reason',
                        value: 3
                    })
                    
                    if (arrInvAdjData.length > 0) {
                        arrInvAdjData.forEach((data, index) => {
                            invAdjRec.selectLine({
                                sublistId: 'inventory',
                                line: index
                            });
                    
                            invAdjRec.setCurrentSublistValue({
                                sublistId: 'inventory',
                                fieldId: 'item',
                                value: data.itemId
                            });
                    
                            invAdjRec.setCurrentSublistValue({
                                sublistId: 'inventory',
                                fieldId: 'location',
                                value: outlet
                            });
                    
                            invAdjRec.setCurrentSublistValue({
                                sublistId: 'inventory',
                                fieldId: 'adjustqtyby',
                                value: data.qty
                            });
                    
                            invAdjRec.commitLine({
                                sublistId: 'inventory'
                            });
                    
                            let arrIngdtIds = JSON.parse(data.ingrdtID);
                    
                            arrIngdtIds.forEach(id => {
                                let fieldLookUp = search.lookupFields({
                                    type: 'customrecord_custom_ingdt',
                                    id: id,
                                    columns: ['custrecord_qty_remaining', 'custrecord_qty_issued'],
                                });
                                log.debug("fieldLookUp",fieldLookUp)
                                let qtyRem = 0
                                if(fieldLookUp){
                                    qtyRem = fieldLookUp.custrecord_qty_remaining ? parseFloat(fieldLookUp.custrecord_qty_remaining) : 0;
                                    qtyIssued = fieldLookUp.custrecord_qty_issued ? parseFloat(fieldLookUp.custrecord_qty_issued) : 0;
                                }
                                let updatedQtyIssued = qtyIssued + data.qtypos
                                let updatedQtyRemaining = qtyRem - data.qtypos
                                var ingId = record.submitFields({
                                    type: 'customrecord_custom_ingdt',
                                    id: id,
                                    values: {
                                        custrecord_custom_ingdt_issued: true,
                                        custrecord_qty_issued: updatedQtyIssued.toFixed(2),
                                        custrecord_qty_remaining: updatedQtyRemaining.toFixed(2)
                                    }
                                });
                    
                                console.log('arrIngdtIds ingId', ingId);
                            });
                        });
                    }
                    
                    var invdAdjId = invAdjRec.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                    console.log('invdAdjId',invdAdjId)
                } else {
                    let alertMessage = `Please review the data, especially the QTY Issued and Location On Hand, and try again.`;
                
                    alert(alertMessage);
                    return false;
                }
            } 
        }    
        if(applyIR == 0){
            alert("Please Apply a Record to Submit")
            return false;
        }
        else{
            var events = eventName.toString();
            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_inv_adjustment_cif',
                deploymentId: 'customdeploy_inv_adjustment_cif',
                params: {
                    page: 0,
                    invAdjId : invdAdjId,
                    eventName : events,
                    dateFrom : dateFrom,
                    dateTo : dateTo,
                    chargeTo : chargeTo,
                    outlet : outlet
                }
            });
            window.location.href = suiteletURL
        }            
    }


   
  

    return {
        pageInit: pageInit_cif,
        fieldChanged: fieldChanged_cif,
        searchFM: searchFM,
        submitCIF: submitCIF
    };
    
});
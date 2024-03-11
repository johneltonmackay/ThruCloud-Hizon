/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/ui/message','N/currentRecord', 'N/search', 'N/record','N/url', 'N/ui/dialog','N/format','N/https'],

function(runtime, message, currentRecord, search, record, url, dialog, format, https) {
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
                id: 'invAdjId',
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
                /*currRecObj.setCurrentSublistValue({
                    sublistId: 'custpage_shipment_list',
                    fieldId: 'custpage_total',
                    value: 0,
                    forceSyncSourcing: true
                });
                
                currRecObj.commitLine({sublistId: 'custpage_shipment_list'})*/

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
        // if (scriptContext.fieldId == 'custpage_form_chargeto' || scriptContext.fieldId == 'custpage_form_datefrom' || scriptContext.fieldId == 'custpage_form_dateto'){        
        //     var dateFrom = currRecObj.getValue({
        //         fieldId: 'custpage_form_datefrom'
        //     });

        //     var dateTo = currRecObj.getValue({
        //         fieldId: 'custpage_form_dateto'
        //     });

        //     var dateFrom = currRecObj.getValue({
        //         fieldId: 'custpage_form_datefrom'
        //       });
        
        //       if(dateFrom){
        //         dateFrom = format.format({
        //             value: dateFrom,
        //             type: format.Type.DATE
        //         });
        //       }
              
        
        //       var dateTo = currRecObj.getValue({
        //         fieldId: 'custpage_form_dateto'
        //       });
        //       if(dateTo){
        //         dateTo = format.format({
        //             value: dateTo,
        //             type: format.Type.DATE
        //         });
        //       }

        //       console.log('dateFrom',dateFrom)
        //       console.log('dateTo',dateTo)
        //     var chargeTo = currRecObj.getValue({
        //         fieldId: 'custpage_form_chargeto'
        //     });

        //     var outlet = currRecObj.getValue({
        //         fieldId: 'custpage_form_outlet'
        //     });

        //       if(dateFrom && dateTo && chargeTo){
        //         var suiteletURL = url.resolveScript({
        //             scriptId: 'customscript_inv_adjustment_cif',
        //             deploymentId: 'customdeploy_inv_adjustment_cif',
        //             params: {
        //                 dateFrom : dateFrom,
        //                 dateTo : dateTo,
        //                 chargeTo : chargeTo,
        //                 outlet : outlet
        //             }
        //         });
        //         window.location.href = suiteletURL
        //       }
        // }
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

    
    /*function printData() {
        var currRecObj = currentRecord.get();
        var sublistHtml = '<table>';
            var pdfFile = [];
            var downloaded = 0;
        
            var irListCount = currRecObj.getLineCount({
                sublistId: 'custpage_food_menu_list'
            })
            
            if(irListCount>0){
                for(var i=0;i<irListCount;i++){
                    var columnOutlet = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_outlet',
                        line: i
                    });
                    var columnChargeTo = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_charge_to',
                        line: i
                    });
                    var columnItemClass = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_item_class',
                        line: i
                    });
                    var columnItem = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_item',
                        line: i
                    });
                    var columnQTYNeeded = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_qty_needed',
                        line: i
                    });
                    var columnStockUnit = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_stock_unit',
                        line: i
                    });

                    var columnQTYReleased = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_qty_released',
                        line: i
                    });

                    sublistHtml += '<tr><td>' + columnOutlet + '</td><td>' + columnChargeTo + '</td><td>' + columnItemClass + '</td><td>' + columnItem + '</td><td>' + columnQTYNeeded + '</td><td>' + columnStockUnit + '</td><td>' + columnQTYReleased + '</td></tr>';
                }
                sublistHtml += '</table>';

            }
            var suiteletURL = url.resolveScript({
                scriptId: 'customscript_cif_printout',
                deploymentId: 'customdeploy_cif_printout'
            });

            console.log('sublistHtml',sublistHtml)
        
            var response = https.post({
                url: suiteletURL,
                body: sublistHtml,
                headers: {
                    'Content-Type': 'text/xml'
                }
            });
    
            if (response.body) {
                // Assuming the response contains the PDF file]
                console.log(response.body)
                var pdfData = response.body;
    
                // Create a Blob from the PDF data
                var pdfBlob = new Blob([pdfData], { type: 'application/pdf' });
    
                // Create a temporary URL for the Blob
                var pdfURL = window.URL.createObjectURL(pdfBlob);
    
                // Create a link to trigger the download
                var downloadLink = document.createElement('a');
                downloadLink.href = pdfURL;
                downloadLink.download = 'GeneratedPDF.pdf';
                downloadLink.click();
            }

    }*/

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
                    var isApply = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_mark',
                        line: i
                    });
                    //console.log('isApply',isApply)
                    if(isApply){
                    var currentDate = new Date();
                    /*var dd = today.getDate();
                    var mm = today.getMonth()+1;
                    var yyyy = today.getFullYear();
                    today = mm+'/'+dd+'/'+yyyy; // change the format depending on the date format preferences set on your account
                     */
                    //console.log('today',today)  
                    //var currentDate = new Date(postDateRep)

                    //console.log('currentDate',currentDate)

                    applyIR = parseInt(applyIR) + 1;
                    /*var outlet = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_outlet_id',
                        line: i
                    });*/


                    var locationField = record.load({
                        type: record.Type.LOCATION,
                        id: outlet
                    });
                    
                    var subsVal = locationField.getValue({
                        fieldId: 'subsidiary'
                    })

                    /*var chargeTo = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_charge_to_id',
                        line: i
                    });*/

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
                    
                    // // Note: Search.run() is limited to 4,000 results
                    // itemSearch.run().each((result: search.Result): boolean => {
                    //     // ...
                    //
                    //     return true;
                    // });
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

                    if(qtyReleased >= outletOnHand){
                        var posqtyReleased = outletOnHand
                        var negqtyReleased = -outletOnHand
                    }
                    else{
                        var posqtyReleased = qtyReleased
                        var negqtyReleased = -qtyReleased
                    }

                    if(!qtyReleased){
                        alert("Cannot Create an Inventory Adjustment without Quantity to be Released");
                        return false;
                    }
                    
                    var qtyRemainingNew = qtyStock - posqtyReleased;
                    /*var item = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_item',
                        line: i
                    });

                    var itemArr = item.split(" ");*/

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

                    var fmID = currRecObj.getSublistValue({
                        sublistId: 'custpage_food_menu_list',
                        fieldId: 'custpage_fm_id',
                        line: i
                    });

                    iaObj.push({
                        "itemId": itemSearchColId,
                        "qtyNeed" : qtyRemainingNew,
                        "qtypos": posqtyReleased,
                        "qty": negqtyReleased,
                        "fmID": fmID
                    })

                    }
                }
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

                if(iaObj.length > 0){
                    for(var j=0;j<iaObj.length;j++){
                        invAdjRec.selectLine({
                            sublistId: 'inventory',
                            line: j
                        });
        
                        invAdjRec.setCurrentSublistValue({
                            sublistId: 'inventory',
                            fieldId: 'item',
                            value: iaObj[j].itemId
                        });
        
                        invAdjRec.setCurrentSublistValue({
                            sublistId: 'inventory',
                            fieldId: 'location',
                            value: outlet
                        });
                        
                        invAdjRec.setCurrentSublistValue({
                            sublistId: 'inventory',
                            fieldId: 'adjustqtyby',
                            value: iaObj[j].qty
                        });
                        
                        invAdjRec.commitLine({
                            sublistId: 'inventory'
                        });
                    }
                }
                var invdAdjId = invAdjRec.save();
                console.log('invdAdjId',invdAdjId)
                if(iaObj.length > 0){
                    for(var k=0;k<iaObj.length;k++){
                        var ingId = record.submitFields({
                            type: 'customrecord_custom_ingdt',
                            id: iaObj[k].fmID,
                            values: {
                                custrecord_custom_ingdt_issued: true,
                                custrecord_qty_issued : iaObj[k].qtypos,
                                custrecord_qty_remaining : iaObj[k].qtyNeed
                            }
                        });

                        console.log('ingId',ingId)
                    }
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

    function saveRecord_cif(){
        /*var currRecObj = currentRecord.get();

        var isPrinted = currRecObj.getValue({
            fieldId : 'custpage_form_printed'
        })

        if(!isPrinted){
            currRecObj.setValue({
                fieldId : 'custpage_form_printed',
                value : 1
            })
        }
        else{
            alert('This page has already Printed.');

            // Prevent the form submission
            return false;
        }*/
    }

   
  

    return {
        pageInit: pageInit_cif,
        fieldChanged: fieldChanged_cif,
        searchFM: searchFM,
        //printData : printData,
        /*postSourcing: postSourcing,
        sublistChanged: sublistChanged,
        lineInit: lineInit,
        validateField: validateField,
        validateLine: validateLine,
        validateInsert: validateInsert,
        validateDelete: validateDelete*/
        //saveRecord: saveRecord_cif,
        submitCIF: submitCIF
    };
    
});
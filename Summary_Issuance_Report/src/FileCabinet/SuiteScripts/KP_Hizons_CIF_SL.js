/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
var PAGE_SIZE = 50;
var CLIENT_SCRIPT_FILE_ID = 13686;

define(['N/record', 'N/search', 'N/runtime','N/ui/serverWidget','N/format', 'N/url', 'N/redirect','N/file', 'N/render', './summary_of_issuance _report/hcs_template'],
function(record, search, runtime, serverWidget, format, url, redirect, file, render,hcs_template) {
  
    function onRequest(context) {
      if (context.request.method === 'GET') {
        var myUser = runtime.getCurrentUser();

        log.debug('myUser',myUser)
         var form = serverWidget.createForm({
          title: 'Summary of Issuance Report'
        });

        form.clientScriptModulePath = 'SuiteScripts/KP_Hizons_CIF_SL_Utility.js';

         // Get parameters
         var pageId = parseInt(context.request.parameters.page);
         var invAdjId = context.request.parameters.invAdjId;
         var show = context.request.parameters.show;
         var eventname = context.request.parameters.eventName;
         var datefrom = context.request.parameters.dateFrom;
         var dateto = context.request.parameters.dateTo;
         var chargeto = context.request.parameters.chargeTo;
         var outlet = context.request.parameters.outlet;
        
        
        /*var isPrinted = form.addField({
            id: 'custpage_form_printed',
            type: serverWidget.FieldType.TEXT,
            label: 'Printed'
        });*/

        var chargeTof = form.addField({
            id: 'custpage_form_chargeto',
            type: serverWidget.FieldType.SELECT,
            label: 'Calendar Type'
            //source: 'classification'
        });

        chargeTof.addSelectOption({
            value : '@NONE@',
            text : ''
        });

        var classificationSearchColInternalId = search.createColumn({ name: 'internalid' });
        var classificationSearchColName = search.createColumn({ name: 'name', sort: search.Sort.ASC });

        var classificationSearch = search.create({
            type: 'classification',
            filters:  ['custrecord_chargeto_calendartype', 'is', 'T'],
            columns: [
                classificationSearchColInternalId,
                classificationSearchColName,
            ],
        });

        var classificationSearchPagedData = classificationSearch.runPaged({ pageSize: 1000 });
        for (var i = 0; i < classificationSearchPagedData.pageRanges.length; i++) {
            var classificationSearchPage = classificationSearchPagedData.fetch({ index: i });
            classificationSearchPage.data.forEach(function (result) {
                var internalId = result.getValue(classificationSearchColInternalId);
                var name = result.getValue(classificationSearchColName);

                // ...
                chargeTof.addSelectOption({
                    value : internalId,
                    text : name
                });
            });
        }

        var dateFromf = form.addField({
            id: 'custpage_form_datefrom',
            type: serverWidget.FieldType.DATE,
            label: 'Date From',
        });

        var dateTof = form.addField({
            id: 'custpage_form_dateto',
            type: serverWidget.FieldType.DATE,
            label: 'Date To',
        });
        
        

        if(datefrom && dateto && chargeto){
            log.debug('inside if',datefrom)
            log.debug('inside if',dateto)
            log.debug('inside if',chargeto)
            var eventNamef = form.addField({
                id: 'custpage_form_eventname',
                type: serverWidget.FieldType.MULTISELECT,
                label: 'Event Name'
                //source: 'customrecord_costing_sheet'
            });

            var customrecordCostingSheetSearchColInternalId = search.createColumn({ name: 'internalid' });
            var customrecordCostingSheetSearchColName = search.createColumn({ name: 'name'});
            
            
            var customrecordCostingSheetSearch = search.create({
                type: 'customrecord_costing_sheet',
                filters: [
                    ['custrecord_charge_to', 'anyof', chargeto],
                    'AND',
                    ['custrecord_event_date', 'within', datefrom, dateto],
                ],
                columns: [
                    customrecordCostingSheetSearchColName,
                    customrecordCostingSheetSearchColInternalId,
                ],
            });
            log.debug('customrecordCostingSheetSearch',customrecordCostingSheetSearch)
            var customrecordCostingSheetSearchPagedData = customrecordCostingSheetSearch.runPaged({ pageSize: 1000 });
            log.debug('customrecordCostingSheetSearchPagedData.pageRanges.length',customrecordCostingSheetSearchPagedData.pageRanges.length)
            for (var j = 0; j < customrecordCostingSheetSearchPagedData.pageRanges.length; j++) {
                var customrecordCostingSheetSearchPage = customrecordCostingSheetSearchPagedData.fetch({ index: j });
                customrecordCostingSheetSearchPage.data.forEach(function (result){
                    var internalId = result.getValue(customrecordCostingSheetSearchColInternalId);
                    var name = result.getValue(customrecordCostingSheetSearchColName);
                    log.debug('internalId',internalId)
                    log.debug('name',name)
                    eventNamef.addSelectOption({
                        value : internalId,
                        text : name
                    });
                    

                });
            }
        }
        else{
            var eventNamef = form.addField({
                id: 'custpage_form_eventname',
                type: serverWidget.FieldType.MULTISELECT,
                label: 'Event Name',
                source: 'customrecord_costing_sheet'
            });
        }

        var outletf = form.addField({
            id: 'custpage_form_outlet',
            type: serverWidget.FieldType.SELECT,
            label: 'Outlet'
            //source: 'location'
        });

        /*outletf.addSelectOption({
            value : '@NONE@',
            text : ''
        });*/
        let arrMultiLocation = []
        let arrOptions = []
        let objRecord = record.load({
            type: search.Type.EMPLOYEE,
            id: myUser.id,
            isDynamic: true,
        });
        log.debug("objRecord", objRecord)
        if (objRecord){
            var locIds = objRecord.getValue({
                fieldId: 'custentity_multiple_locations',
            });
            var locText = objRecord.getText({
                fieldId: 'custentity_multiple_locations',
            });
            let objOption = {
                value: locIds,
                text: locText
            }
            arrMultiLocation.push(objOption)
            log.debug('objRecord test',arrMultiLocation)
        }

        arrMultiLocation.forEach(data => {
            arrValues = data.value
            arrText = data.text
            for (x=0; x < arrValues.length; x++){
                let optValue = arrValues[x]
                let optText = arrText[x]
                arrOptions.push({
                    value: optValue,
                    text: optText
                })
            }
        });
        log.debug('objRecord arrOptions',arrOptions)

        // var empSrch = search.lookupFields({
        //     type: search.Type.EMPLOYEE,
        //     id: myUser.id,
        //     columns: 'custentity_multiple_locations'
        // });

        // log.debug('empSrch',empSrch)
        // log.debug('length',empSrch.custentity_multiple_locations.length)

        for(var e = 0; e < arrOptions.length; e++){
            outletf.addSelectOption({
                value : arrOptions[e].value,
                text : arrOptions[e].text
            });
        }

        form.addButton({
            id : 'custpage_refresh',
            label : 'Refresh',
            functionName : 'searchFM()'
        });
        
        form.addButton({
            id : 'custpage_search',
            label : 'Search',
            functionName : 'searchFM()'
        });eventname

        form.addButton({
            id : 'custpage_submit',
            label : 'Submit',
            functionName : 'submitCIF()'
        });


        log.debug('eventname',eventname)
        var  eventnameArr = [];
        if(eventname || datefrom || dateto || chargeto || outlet){
            // Create a sublist to display the search results
          if(eventname){
            eventnameArr = eventname.split(',')
          }
         
          var sublist = form.addSublist({
            id: 'custpage_food_menu_list',
            type: serverWidget.SublistType.LIST,
            label: 'Food Menu',
          });    
          
         sublist.addMarkAllButtons();
       
          // Add columns to the sublist
          var isMark = sublist.addField({
            id: 'custpage_mark',
            type: serverWidget.FieldType.CHECKBOX,
            label: 'APPLY',
          });

          var fmId = sublist.addField({
            id: 'custpage_fm_id',
            type: serverWidget.FieldType.TEXT,
            label: 'Id'
          });
          fmId.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });

          /*sublist.addField({
            id: 'custpage_outlet',
            type: serverWidget.FieldType.TEXT,
            label: 'Outlet'
          });

          var outletId = sublist.addField({
            id: 'custpage_outlet_id',
            type: serverWidget.FieldType.TEXT,
            label: 'Outlet'
          });

          outletId.updateDisplayType({‌
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });

          sublist.addField({
            id: 'custpage_charge_to',
            type: serverWidget.FieldType.TEXT,
            label: 'Charge To'
          });

          
          var chargeToId = sublist.addField({
            id: 'custpage_charge_to_id',
            type: serverWidget.FieldType.TEXT,
            label: 'Charge To'
          });

          chargeToId.updateDisplayType({‌
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });

          sublist.addField({
            id: 'custpage_item_class',
            type: serverWidget.FieldType.TEXT,
            label: 'Item Class'
          });*/

          //-----------added by pcl 3-6-2024-----------
          col = sublist.addField({
            id: 'custpage_item_internal',
            type: serverWidget.FieldType.SELECT,
            source : "item",
            label: 'Item Internalid'
          });
          col.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
          //-----------added by pcl 3-6-2024-----------

          sublist.addField({
            id: 'custpage_item',
            type: serverWidget.FieldType.TEXT,
            label: 'Item Code'
          });

          sublist.addField({
            id: 'custpage_item_description',
            type: serverWidget.FieldType.TEXT,
            label: 'Item Description'
          });

          sublist.addField({
            id: 'custpage_stock_unit',
            type: serverWidget.FieldType.TEXT,
            label: 'Stock Unit'
          });

          var unitId = sublist.addField({
            id: 'custpage_stock_unit_id',
            type: serverWidget.FieldType.TEXT,
            label: 'Unit of Measure'
          });
          unitId.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });

          sublist.addField({
            id: 'custpage_unit_price',
            type: serverWidget.FieldType.TEXT,
            label: 'Unit Price'
          });
          
          sublist.addField({
            id: 'custpage_qty_needed',
            type: serverWidget.FieldType.TEXT,
            label: 'QTY Needed'
          })

          var qtyReleased = sublist.addField({
            id: 'custpage_qty_released',
            type: serverWidget.FieldType.TEXT,
            label: 'QTY Issued'
          })

          qtyReleased.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.ENTRY
          });

          var totalCost = sublist.addField({
            id: 'custpage_total_cost',
            type: serverWidget.FieldType.TEXT,
            label: 'Total Cost'
          });

          totalCost.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.ENTRY
          });

          var qtyStock = sublist.addField({
            id: 'custpage_qty_stock',
            type: serverWidget.FieldType.TEXT,
            label: 'QTY Stock'
          });
          qtyStock.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });
          

          var retrieveSearch = runSearch(eventname, datefrom, dateto, chargeto, outlet, PAGE_SIZE);
          log.debug('retrieveSearch',retrieveSearch)
          var pageCount = Math.ceil(retrieveSearch.count / PAGE_SIZE);

            // Set pageId to correct value if out of index
            if (!pageId || pageId == '' || pageId < 0)
                pageId = 0;
            else if (pageId >= pageCount)
                pageId = pageCount - 1;

            // Add buttons to simulate Next & Previous
            /*if (pageId != 0) {‌
                form.addButton({‌
                    id : 'custpage_previous',
                    label : 'Previous',
                    functionName : 'getSuiteletPage(' + (pageId - 1) + ',' + partNo + ',' + unitModel + ',' + description +')'
                });
            }

            if (pageId != pageCount - 1) {‌
                form.addButton({‌
                    id : 'custpage_next',
                    label : 'Next',
                    functionName : 'getSuiteletPage(' + (pageId + 1) + ',' + partNo + ',' + unitModel + ',' + description +')'
                });
            }*/

           var pageField = form.addField({
                    id: 'custpage_form_pagefield',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Page Field'
            });
            pageField.updateDisplayType({displayType: 'HIDDEN'});
        

            // Add drop-down and options to navigate to specific page
            var selectOptions = form.addField({
                    id : 'custpage_pageid',
                    label : 'Page Index',
                    type : serverWidget.FieldType.SELECT
            });
 
            form.clientScriptModulePath = 'SuiteScripts/KP_Hizons_CIF_SL_Utility.js';

        
            for (i = 0; i < pageCount; i++) {
                if (i == pageId) {
                    selectOptions.addSelectOption({
                        value : 'pageid_' + i,
                        text : ((i * PAGE_SIZE) + 1) + ' - ' + ((i + 1) * PAGE_SIZE),
                        isSelected : true
                    });
                } else {
                    selectOptions.addSelectOption({
                        value : 'pageid_' + i,
                        text : ((i * PAGE_SIZE) + 1) + ' - ' + ((i + 1) * PAGE_SIZE)
                    });
                }
            }

            if(retrieveSearch.count > 0){
                log.debug('retrieveSearch.count',retrieveSearch.count)
                log.debug('pageId',pageId)
                // Get subset of data to be shown on page
                var searchResults = fetchSearchResult(retrieveSearch, pageId);

                // Set data returned to columns
                var j = 0;

                searchResults.forEach(function (result) {
                    
                    if(result.id){
                        sublist.setSublistValue({
                            id: 'custpage_fm_id',
                            line: j,
                            value: result.id
                        });

                        
                    }

                    /*if(result.outlet){
                        sublist.setSublistValue({
                            id: 'custpage_outlet',
                            line: j,
                            value: result.outlet
                        });

                        sublist.setSublistValue({
                            id: 'custpage_outlet_id',
                            line: j,
                            value: result.outletVal
                        });
                    }

                    if(result.chargeto){
                        sublist.setSublistValue({
                            id: 'custpage_charge_to',
                            line: j,
                            value: result.chargeto
                        });

                        sublist.setSublistValue({
                            id: 'custpage_charge_to_id',
                            line: j,
                            value: result.chargetoVal
                        });
                    }
                    
                    if(result.classification){
                        sublist.setSublistValue({
                            id: 'custpage_item_class',
                            line: j,
                            value: result.classification
                        });
                    }*/

                    if(result.item){
                        sublist.setSublistValue({
                            id: 'custpage_item',
                            line: j,
                            value: result.item
                        });
                    }

                    if (result.item_internalid){
                        //-----------added by pcl 3-6-2024-----------
                        sublist.setSublistValue({
                            id: 'custpage_item_internal',
                            line: j,
                            value: result.item_internalid
                        });
                        //-----------added by pcl 3-6-2024-----------
                    }

                    if(result.description){
                        sublist.setSublistValue({
                            id: 'custpage_item_description',
                            line: j,
                            value: result.description
                        });
                    }

                    let unitPriceValue = result.price ? result.price : 0;
                    let formattedPriceValue = unitPriceValue ? Number(unitPriceValue).toFixed(2) : 0;

                    sublist.setSublistValue({
                        id: 'custpage_unit_price',
                        line: j,
                        value: formattedPriceValue
                    });
                    

                    /*if(result.totalcost){
                        sublist.setSublistValue({
                            id: 'custpage_total_cost',
                            line: j,
                            value: result.totalcost
                        });
                    }*/
                    let qtyNeededValue = result.qtyNeeded ? result.qtyNeeded : 0;
                    let formattedQtyNeeded = qtyNeededValue ? Number(qtyNeededValue).toFixed(5) : 0;

                    sublist.setSublistValue({
                        id: 'custpage_qty_needed',
                        line: j,
                        value: formattedQtyNeeded
                    });
                        /*sublist.setSublistValue({
                         id: 'custpage_qty_released',
                            line: j,
                            value: result.qtyNeeded
                        });*/

                    if(result.unit){
                        sublist.setSublistValue({
                            id: 'custpage_stock_unit',
                            line: j,
                            value: result.unit
                        });
                        
                        /*sublist.setSublistValue({
                            id: 'custpage_stock_unit_id',
                            line: j,
                            value: result.unitVal
                        });*/

                    }
                    

                    if(result.qtyStock){
                        sublist.setSublistValue({
                            id: 'custpage_qty_stock',
                            line: j,
                            value: result.qtyStock
                        });
                        
                        /*sublist.setSublistValue({
                            id: 'custpage_stock_unit_id',
                            line: j,
                            value: result.unitVal
                        });*/

                    }
                   
                    j++
                });
            }
        }
           
            if (eventname) {
                eventNamef.defaultValue = eventnameArr;
            }
    
           if (datefrom) {
             dateFromf.defaultValue = datefrom;
            }

            if (dateto) {
                dateTof.defaultValue = dateto;
               }
           
            if (chargeto) {
                chargeTof.defaultValue = chargeto;
            }

            if (outlet) {
                outletf.defaultValue = outlet;
            }

            /*if(eventname || datefrom || dateto || chargeto || outlet){
                isPrinted.defaultValue = true;
            }*/

          var button = form.addSubmitButton({
	    		label : 'Submit for Printing'
	    	})

            context.response.writePage({
                pageObject: form
            });
        }
        else if (context.request.method === 'POST') {
            log.debug("Suitelet is posting.")

            context.request.parameters.custpage_form_printed = 1;

            var request_params = context.request.parameters;
            var sublistHtml = '<table>';
            var r1c1 = 'Item Code';
            var r1c2 = 'Item Description';
            var r1c3 = 'Unit of Measure';
            var r1c4 = 'Unit Price';
            var r1c5 = 'QTY Needed';
            var r1c6 = 'QTY ISSUED';
            var r1c7 = 'Total Cost';
            sublistHtml += '<tr><td>' + r1c1 + '</td><td>' + r1c2 + '</td><td>' + r1c3 + '</td><td>' + r1c4 + '</td><td>' + r1c5 + '</td><td>' + r1c6 + '</td><td>' + r1c7 + '</td></tr>';
                
            var pdfFile = [];
            var downloaded = 0;
        
            var irListCount = context.request.getLineCount({
                group: 'custpage_food_menu_list'
            })
            var items = [];
            var item_group = {};
            if(irListCount>0){
                for(var i=0;i<irListCount;i++){
                    /*var columnOutlet = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_outlet',
                        line: i
                    });
                    var columnChargeTo = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_charge_to',
                        line: i
                    });
                    var columnItemClass = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_item_class',
                        line: i
                    });*/

                    

                    var is_check = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_mark',
                        line: i
                    });

                    var item_internalid = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_item_internal',
                        line: i
                    });
                    var columnItem = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_item',
                        line: i
                    });

                    var columnItemDescription = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_item_description',
                        line: i
                    });

                    var columnStockUnit = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_stock_unit',
                        line: i
                    });

                    var columnUnitPrice = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_unit_price',
                        line: i
                    });

                    var columnQTYNeeded = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_qty_needed',
                        line: i
                    });

                    if(columnQTYNeeded == null){
                        columnQTYNeeded = ""
                    }
                    
                    var columnQTYReleased = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_qty_released',
                        line: i
                    });

                    var columnTotalCost = context.request.getSublistValue({
                        group: 'custpage_food_menu_list',
                        name: 'custpage_total_cost',
                        line: i
                    });

                    var fieldLookUp = search.lookupFields({
                        type: 'item',
                        id: item_internalid,
                        columns: ['custitem_item_class']
                    });


                    qty_arr = columnStockUnit.split('/');

                    

                    if(is_check == 'T'){
                        if(fieldLookUp){
                            if(item_group[fieldLookUp['custitem_item_class'][0].text] === undefined){
                                item_group[fieldLookUp['custitem_item_class'][0].text] = new Array();
                            }//end if
        
                            item_group[fieldLookUp['custitem_item_class'][0].text].push({
                                
                                "item" : columnItem,
                                "item_class" : fieldLookUp['custitem_item_class'][0].text,
                                "description" : columnItemDescription,
                                "qty" : columnStockUnit,
                                "qty_needed" : columnQTYNeeded
                                //"qty" : qty_arr[0] + (qty_arr.length >= 2? (' / '+qty_arr[1]): '')
                                
                            })
                        }//end if

                        items.push({
                            "item_internalid" : item_internalid,
                            "item" : columnItem,
                            "item_class_internalid" : fieldLookUp['custitem_item_class'][0].value,
                            "item_class" : fieldLookUp['custitem_item_class'][0].text,
                            "description" : columnItemDescription,
                            "qty" : columnStockUnit,
                            "qty_needed" : columnQTYNeeded
                            
                        });
                    }
                    
                    

                    

                    sublistHtml += '<tr><td>' + columnItem + '</td><td>' + columnItemDescription + '</td><td>' + columnStockUnit + '</td><td>' + columnUnitPrice + '</td><td>' + columnQTYNeeded + '</td><td>' + columnQTYReleased + '</td><td>' + columnTotalCost + '</td></tr>';
                }
                sublistHtml += '</table>';

                log.debug('items',JSON.stringify(item_group));
                
                var body = {};
                var header = {};
                
                body["calendar_type"] = request_params['inpt_custpage_form_chargeto'];
                body["from_date"] = hcs_template.dateformat_words(request_params['custpage_form_datefrom']);
                body["to_date"] = hcs_template.dateformat_words(request_params['custpage_form_dateto']);
                body["date_printed"] = hcs_template.dateformat_words(new Date());
                body.attributes = {
                    
                    "size" : "letter",
                    "margin-right" : "0.5in",
                    "margin-left" : "0.5in",
                    "margin-top" : "0.5in",
                    "padding" : "0",
                    "header" : "nlheader",
                    "footer-height" : "0.3in",
                    "footer" : "nlfooter"
                }

                body.items = item_group;

                /*var recsub;
					recsub 					= lib.loadRecord('subsidiary',subint,false);
				var logoid 					= lib.catchNull(recsub.getValue({fieldId : 'logo'}));
				img 						= "";
				if(logoid != ''){
					img 		= lib.escapeXML(file.load(logoid).url);
				}*/

                hcs_template.setHeader(header);
                hcs_template.setBody(body);

                var xml = hcs_template.get_template();

                context.response.renderPdf({xmlString: xml});
            
                /*pdfFile[0] = render.xmlToPdf({
                    xmlString: xml
                });

                log.debug('pdfFile',pdfFile[0])

                if (pdfFile[0]) {
                    context.response.setHeader({
                        name: 'Content-Type',
                        value: 'application/pdf'
                    })
                    
                    context.response.addHeader({
                        name: "Content-Disposition",
                        value: 'attachment; filename=Summary_of_Issuance_Report.pdf'
                    })
                    
                    context.response.write({output: pdfFile[0].getContents()})
                */
                    /*var eventName = context.request.parameters.custpage_form_eventname;   
                    var dateFrom = context.request.parameters.custpage_form_datefrom;
                    var dateTo = context.request.parameters.custpage_form_dateto;
                    var chargeTo = context.request.parameters.custpage_form_chargeto;
                    var outlet = context.request.parameters.custpage_form_outlet;
                    var suiteletURL = url.resolveScript({
                        scriptId: 'customscript_inv_adjustment_cif',
                        deploymentId: 'customdeploy_inv_adjustment_cif',
                        params: {
                            eventName : eventName,
                            dateFrom : dateFrom,
                            dateTo : dateTo,
                            chargeTo : chargeTo,
                            outlet : outlet
                        }
                    });
                    redirect.redirect({ url: suiteletURL });*/

                    /*pdfFile[0].folder = 1340;
                    var fileId = pdfFile[0].save();
                    log.debug('fileId',fileId)
                    var fileObj = file.load({
                        id: fileId
                    });
                    log.debug('fileObj',fileObj)
                    var fileName = 'Printed_List.pdf';

                    // Prompt user to download the generated PDF
                    fileObj.name = fileName;
                    /*dialog.alert({
                        title: 'Print List',
                        message: 'PDF Generated Successfully. Click OK to download the file.'
                    }).then(function () {
                        window.location.href = runtime.getCurrentScript().getParameter({
                            name: 'custscript_suitelet_url'
                        }) + '&file=' + fileId;
                    });*/
                //}


            }
        }

    }

    return {
        onRequest : onRequest
    };

    function runSearch(eventname, datefrom, dateto, chargeto, outlet, searchPageSize) {
        var myFilter = [];
        
        myFilter.push(search.createFilter({
            name: 'custrecord_status',
            join: 'custrecord_related_topsheet',
            operator: search.Operator.ANYOF,
            values: 2
        }));

        myFilter.push(search.createFilter({
            name: 'custrecord_qty_remaining',
            join: 'custrecord_related_food_menu',
            operator: search.Operator.NOTLESSTHANOREQUALTO,
            values: 0
        }));

        /*myFilter.push(search.createFilter({
            name: 'custrecord_ingdt_c',
            join: 'custrecord_related_food_menu',
            operator: search.Operator.NONEOF,
            values: '@NONE@'
        }));*/
        log.debug('eventname',eventname)
        log.debug('datefrom',datefrom)
        log.debug('dateto',dateto)
        log.debug('chargeto',chargeto)
        log.debug('outlet',outlet)
        if(eventname){
            myFilter.push(search.createFilter({
                name: 'custrecord_related_topsheet',
                operator: search.Operator.ANYOF,
                values: eventname
            }));
        }

        if(datefrom && dateto){
            myFilter.push(search.createFilter({
                name: 'custrecord_fcs_date',
                operator: search.Operator.WITHIN,
                values: [datefrom,dateto]
            }));
        }

        if(chargeto){
            myFilter.push(search.createFilter({
                name: 'custrecord_charge_to',
                join: 'custrecord_related_topsheet',
                operator: search.Operator.ANYOF,
                values: chargeto
            }));
        }

        if(outlet){
            myFilter.push(search.createFilter({
                name: 'custrecord_tc_costingsheet_location',
                join: 'custrecord_related_topsheet',
                operator: search.Operator.ANYOF,
                values: outlet
            }));
        }

        log.debug('myFilter',myFilter)
        var customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuID = search.createColumn({ name: 'internalid', join: 'CUSTRECORD_RELATED_FOOD_MENU', summary: search.Summary.GROUP});
        var customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuITEMCODE = search.createColumn({ name: 'custrecord_ingdt_c', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP, sort: search.Sort.ASC });
        var customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuITEMDESCRIPTION = search.createColumn({ name: 'custrecord_customrecipedescription', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP });
        var customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuUNITOFMEASURE = search.createColumn({ name: 'custrecord_uom_c_stock', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP });
        var customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuUnitPrice = search.createColumn({ name: 'custrecord_customunit', join: 'custrecord_related_food_menu', summary: search.Summary.MAX });
        var customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuQTYNEEDED = search.createColumn({ name: 'custrecord_qty_remaining', join: 'custrecord_related_food_menu', summary: search.Summary.SUM });
        var customrecordFoodMenuFbSearchColQTYISSUED = search.createColumn({ name: 'formulatext', summary: search.Summary.GROUP, formula: '\' \'' });
        var customrecordFoodMenuFbSearchColTOTALCOST = search.createColumn({ name: 'formulatext', summary: search.Summary.GROUP, formula: '\'QTY NEEDED*QTY ISSUED\'' });
        //var customrecord_food_menu_fbSearchColExternalId = search.createColumn({ name: 'formulatext', summary: search.Summary.GROUP, formula: '\' \'' });
        var customrecord_food_menu_fbSearch = search.create({
          type: 'customrecord_food_menu_fb',
          filters: myFilter,
          columns: [
            customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuID,
            customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuITEMCODE,
            customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuITEMDESCRIPTION,
            customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuUNITOFMEASURE,
            customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuUnitPrice,
            customrecordFoodMenuFbSearchColCustrecordRelatedFoodMenuQTYNEEDED,
            customrecordFoodMenuFbSearchColQTYISSUED,
            customrecordFoodMenuFbSearchColTOTALCOST,
            //customrecord_food_menu_fbSearchColExternalId,
          ],
        });

        log.debug('searchObj', JSON.stringify(customrecord_food_menu_fbSearch));

        return customrecord_food_menu_fbSearch.runPaged({
            pageSize : searchPageSize
        });
    }

    function fetchSearchResult(pagedData, pageIndex) {
        var fmResults = new Array();
        log.debug('pagedData',pagedData)
        log.debug('pageIndex',pageIndex)
        var searchPage = pagedData.fetch({
                index : 0
        });

        log.debug('fetchSearchResult')

        searchPage.data.forEach(function (result) {
            var internalId = result.id;
            var customrecord_food_menu_fbSearchColId = result.getValue({ name: 'internalid', join: 'CUSTRECORD_RELATED_FOOD_MENU', summary: search.Summary.GROUP });
            var custrecordRelatedFoodMenuITEMINTERNAL = result.getValue({ name: 'custrecord_ingdt_c', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP, sort: search.Sort.ASC }); //added by pcl 3-6-2024
            var custrecordRelatedFoodMenuITEMCODE = result.getText({ name: 'custrecord_ingdt_c', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP, sort: search.Sort.ASC });
            var custrecordRelatedFoodMenuITEMDESCRIPTION = result.getValue({ name: 'custrecord_customrecipedescription', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP });
            var custrecordRelatedFoodMenuUNITOFMEASURE = result.getValue({ name: 'custrecord_uom_c_stock', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP });
            var custrecordRelatedFoodMenuUNITOFMEASURESTR = result.getText({ name: 'custrecord_uom_c_stock', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP });
            var custrecordRelatedFoodMenuUnitPrice = result.getValue({ name: 'custrecord_customunit', join: 'custrecord_related_food_menu', summary: search.Summary.MAX });
            var custrecordRelatedFoodMenuQTYNEEDED = result.getValue({ name: 'custrecord_qty_remaining', join: 'custrecord_related_food_menu', summary: search.Summary.SUM });
            var qtyissued = result.getValue({ name: 'formulatext', summary: search.Summary.GROUP, formula: '\' \'' });
            //var customrecordFoodMenuFbSearchColQTYISSUED = result.getValue({ name: 'formulatext', summary: search.Summary.GROUP, formula: '\' \'' });
            //var totalcost = result.getValue({ name: 'formulatext', summary: search.Summary.GROUP, formula: '\'QTY NEEDED*QTY ISSUED\'' });

            /*var customrecord_food_menu_fbSearchColId = result.getValue({ name: 'internalid', join: 'CUSTRECORD_RELATED_FOOD_MENU', summary: search.Summary.GROUP });
        
            var customrecord_food_menu_fbSearchColOutletSTR = result.getText({ name: 'custrecord_tc_costingsheet_location', join: 'CUSTRECORD_RELATED_TOPSHEET', summary: search.Summary.GROUP, sort: search.Sort.ASC });
            var customrecord_food_menu_fbSearchColOutlet = result.getValue({ name: 'custrecord_tc_costingsheet_location', join: 'CUSTRECORD_RELATED_TOPSHEET', summary: search.Summary.GROUP, sort: search.Sort.ASC });
            var customrecord_food_menu_fbSearchColChargeToSTR = result.getText({ name: 'custrecord_charge_to', join: 'CUSTRECORD_RELATED_TOPSHEET', summary: search.Summary.GROUP });
            var customrecord_food_menu_fbSearchColChargeTo = result.getValue({ name: 'custrecord_charge_to', join: 'CUSTRECORD_RELATED_TOPSHEET', summary: search.Summary.GROUP });
            
            var customrecord_food_menu_fbSearchColItemClassification = result.getValue(search.createColumn({ name: 'formulatext', summary: search.Summary.GROUP, formula: '{custrecord_related_food_menu.custrecord_item_class}' }));
            var customrecord_food_menu_fbSearchColItem = result.getValue(search.createColumn({ name: 'formulatext', summary: search.Summary.GROUP, formula: '{custrecord_related_food_menu.custrecord_ingdt_c}|| \' \' ||{custrecord_related_food_menu.custrecord_customrecipedescription}' }));
            var customrecord_food_menu_fbSearchColTotalQtyNeeded = result.getValue({ name: 'custrecord_qty_c_stock', join: 'custrecord_related_food_menu', summary: search.Summary.SUM });
            var customrecord_food_menu_fbSearchColUomSTR = result.getText({ name: 'custrecord_uom_c_stock', join: 'CUSTRECORD_RELATED_FOOD_MENU', summary: search.Summary.GROUP });
            var customrecord_food_menu_fbSearchColUom = result.getValue({ name: 'custrecord_uom_c_stock', join: 'CUSTRECORD_RELATED_FOOD_MENU', summary: search.Summary.GROUP });
            
            var customrecord_food_menu_fbSearchColReleaseDate = result.getValue({ name: 'formuladate', summary: search.Summary.GROUP, formula: '{today}' });
            var customrecord_food_menu_fbSearchColQtyToBeReleased = result.getValue({ name: 'formulatext', summary: search.Summary.GROUP, formula: '\' \'' });*/
            //var customrecord_food_menu_fbSearchColExternalId = result.getValue({ name: 'formulatext', summary: search.Summary.GROUP, formula: '\' \'' });

            fmResults.push({
                "id": customrecord_food_menu_fbSearchColId,
                /*"outlet": customrecord_food_menu_fbSearchColOutletSTR,
                "outletVal": customrecord_food_menu_fbSearchColOutlet,
                "chargeto": customrecord_food_menu_fbSearchColChargeToSTR,
                "chargetoVal": customrecord_food_menu_fbSearchColChargeTo,
                "classification": customrecord_food_menu_fbSearchColItemClassification,*/
                "item_internalid" : custrecordRelatedFoodMenuITEMINTERNAL, //added by pcl 3-4-2024
                "item": custrecordRelatedFoodMenuITEMCODE,
                "description": custrecordRelatedFoodMenuITEMDESCRIPTION,
                "qtyNeeded": custrecordRelatedFoodMenuQTYNEEDED,
                "unit": custrecordRelatedFoodMenuUNITOFMEASURESTR,
                "price": custrecordRelatedFoodMenuUnitPrice,
                "qtyStock": qtyissued
                //"unitVal": customrecord_food_menu_fbSearchColUom,
                //"totalcost": totalcost
                //"qtyReleased": customrecord_food_menu_fbSearchColQtyToBeReleased,
                //"externalId": customrecord_food_menu_fbSearchColExternalId
            });
    
        })
        let consolidatedResults = consolidateData(fmResults)

        log.debug('fmResults',fmResults)
        return consolidatedResults;
            // Continue processing the next page of search results
    }

    function consolidateData(fmResults) {
        let consolidatedData = {};
    
        // Iterate through the original array
        fmResults.forEach((item) => {
            let key = item.item_internalid; // Using the item_internalid directly as the key
    
            let intQuantity = item.qtyNeeded ? parseFloat(item.qtyNeeded) : 0.00;
            let floatPrice = item.price ? parseFloat(item.price) : 0.00; // Parse price to float

    
            if (consolidatedData[key]) {
                // If the key already exists, update the values accordingly
                consolidatedData[key].qtyNeeded += parseFloat(intQuantity);
            } else {
                // If the key doesn't exist, add a new entry with the current item
                consolidatedData[key] = { ...item };
                consolidatedData[key].qtyNeeded = parseFloat(intQuantity);
                consolidatedData[key].price = floatPrice;
            }
        });
    
        // Convert consolidatedData object into an array
        let arrResults = Object.values(consolidatedData);
    
        // Log and return the results
        log.debug('consolidateData arrResults', arrResults);
        return arrResults;
    }
    
    
    
    
    
    

});
  
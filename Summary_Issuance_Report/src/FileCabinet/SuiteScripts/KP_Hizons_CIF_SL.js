/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
var PAGE_SIZE = 1000;
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
            let checkExisting = [] 
            var eventNamef = form.addField({
                id: 'custpage_form_eventname',
                type: serverWidget.FieldType.MULTISELECT,
                label: 'Event Name'
                //source: 'customrecord_costing_sheet'
            });

            var customrecordCostingSheetSearchColInternalId = search.createColumn({ name: 'internalid' });
            var customrecordCostingSheetSearchColName = search.createColumn({ name: 'custrecord_related_topsheet'});
            
            
            var customrecordCostingSheetSearch = search.create({
                type: 'customrecord_food_menu_fb',
                filters: [
                    ['custrecord_rel_top_sheet_charge_to', 'anyof', chargeto],
                    'AND',
                    ['custrecord_fcs_date', 'within', datefrom, dateto],
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
                    var RecName = result.getText(customrecordCostingSheetSearchColName);
                    // log.debug('internalId',internalId)
                    // log.debug('RecName',RecName)
                    if (!checkExisting.includes(RecName)){
                        checkExisting.push(RecName)
                        eventNamef.addSelectOption({
                            value : RecName,
                            text : RecName
                        });
                    }
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
            type: serverWidget.FieldType.TEXTAREA,
            label: 'Id'
          });
          fmId.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
          });
        
    
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

          var locOnhand = sublist.addField({
            id: 'custpage_loc_onhand',
            type: serverWidget.FieldType.TEXT,
            label: 'Location On Hand'
          });
         
          var retrieveSearch = runSearch(eventname, datefrom, dateto, chargeto, outlet, PAGE_SIZE);
          log.debug('retrieveSearch',retrieveSearch)
          var pageCount = Math.ceil(retrieveSearch.count / PAGE_SIZE);

            // Set pageId to correct value if out of index
            if (!pageId || pageId == '' || pageId < 0)
                pageId = 0;
            else if (pageId >= pageCount)
                pageId = pageCount - 1;

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
            selectOptions.updateDisplayType({displayType: serverWidget.FieldDisplayType.HIDDEN});
 
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
                log.debug('searchResults',searchResults)
                // Set data returned to columns
                var j = 0;

                searchResults.forEach(function (result) {
                    
                    if(result.id){
                        sublist.setSublistValue({
                            id: 'custpage_fm_id',
                            line: j,
                            value: JSON.stringify(result.customIngdtId)
                        });
                    }

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
                    

                    let qtyNeededValue = result.qtyNeeded ? result.qtyNeeded : 0;
                    let formattedQtyNeeded = qtyNeededValue ? Number(qtyNeededValue).toFixed(2) : 0;

                    sublist.setSublistValue({
                        id: 'custpage_qty_needed',
                        line: j,
                        value: formattedQtyNeeded
                    });

                    if(result.unit){
                        sublist.setSublistValue({
                            id: 'custpage_stock_unit',
                            line: j,
                            value: result.unit
                        });

                    }
                    

                    if(result.qtyStock){
                        sublist.setSublistValue({
                            id: 'custpage_qty_stock',
                            line: j,
                            value: result.qtyStock
                        });

                    }

                    sublist.setSublistValue({
                        id: 'custpage_loc_onhand',
                        line: j,
                        value: result.qtyOutletOnHand ? result.qtyOutletOnHand : 0
                    });
                   
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


            var button = form.addSubmitButton({
	    		label : 'Print'
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
                            }
        
                            item_group[fieldLookUp['custitem_item_class'][0].text].push({
                                
                                "item" : columnItem,
                                "item_class" : fieldLookUp['custitem_item_class'][0].text,
                                "description" : columnItemDescription,
                                "qty" : columnStockUnit,
                                "qty_needed" : columnQTYNeeded
                                
                                
                            })
                        }

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

                hcs_template.setHeader(header);
                hcs_template.setBody(body);

                var xml = hcs_template.get_template();

                context.response.renderPdf({xmlString: xml});

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
            operator: search.Operator.GREATERTHAN,
            values: 0.01
        }));

        myFilter.push(search.createFilter({
            name: 'custrecord_customingdt_commongk',
            join: 'custrecord_related_food_menu',
            operator: search.Operator.IS,
            values: false
        }));

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
        var customrecordFoodMenuFbSearchColOutlet = search.createColumn({ name: 'custrecord_fm_outlet', summary: search.Summary.GROUP });
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
            customrecordFoodMenuFbSearchColOutlet
          ],
        });

        log.debug('searchObj', JSON.stringify(customrecord_food_menu_fbSearch));

        return customrecord_food_menu_fbSearch.runPaged({
            pageSize : searchPageSize
        });
    }

    function fetchSearchResult(pagedData, pageIndex) {
        let arrConsolidatedResults = []
        var fmResults = new Array();
        log.debug('pagedData',pagedData)
        log.debug('pageIndex',pageIndex)
        var searchPage = pagedData.fetch({
                index : 0
        });

        log.debug('fetchSearchResult')

        searchPage.data.forEach(function (result) {
            var internalId = result.id;
            var customrecord_food_menu_outlet = result.getText({ name: 'custrecord_fm_outlet', summary: search.Summary.GROUP });
            var customrecord_food_menu_fbSearchColId = result.getValue({ name: 'internalid', join: 'CUSTRECORD_RELATED_FOOD_MENU', summary: search.Summary.GROUP });
            var custrecordRelatedFoodMenuITEMINTERNAL = result.getValue({ name: 'custrecord_ingdt_c', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP, sort: search.Sort.ASC }); //added by pcl 3-6-2024
            var custrecordRelatedFoodMenuITEMCODE = result.getText({ name: 'custrecord_ingdt_c', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP, sort: search.Sort.ASC });
            var custrecordRelatedFoodMenuITEMDESCRIPTION = result.getValue({ name: 'custrecord_customrecipedescription', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP });
            var custrecordRelatedFoodMenuUNITOFMEASURE = result.getValue({ name: 'custrecord_uom_c_stock', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP });
            var custrecordRelatedFoodMenuUNITOFMEASURESTR = result.getText({ name: 'custrecord_uom_c_stock', join: 'custrecord_related_food_menu', summary: search.Summary.GROUP });
            var custrecordRelatedFoodMenuUnitPrice = result.getValue({ name: 'custrecord_customunit', join: 'custrecord_related_food_menu', summary: search.Summary.MAX });
            var custrecordRelatedFoodMenuQTYNEEDED = result.getValue({ name: 'custrecord_qty_remaining', join: 'custrecord_related_food_menu', summary: search.Summary.SUM });
            // var qtyissued = result.getValue({ name: 'formulatext', summary: search.Summary.GROUP, formula: '\' \'' });
            var qtyissued = result.getValue({ name: 'custrecord_qty_issued', join: 'custrecord_related_food_menu', summary: search.Summary.SUM });
            
            fmResults.push({
                "id": customrecord_food_menu_fbSearchColId,
                "item": custrecordRelatedFoodMenuITEMCODE,
                "description": custrecordRelatedFoodMenuITEMDESCRIPTION,
                "qtyNeeded": custrecordRelatedFoodMenuQTYNEEDED,
                "unit": custrecordRelatedFoodMenuUNITOFMEASURESTR,
                "price": custrecordRelatedFoodMenuUnitPrice,
                "qtyStock": qtyissued,
                "outlet": customrecord_food_menu_outlet,
                "item_internalid" : custrecordRelatedFoodMenuITEMINTERNAL,
            }); 
                
        })
        let consolidatedResults = consolidateData(fmResults)
        return consolidatedResults;
    }

    function getLocQtyOnHand() {
        let arrLocationOnhand = []
        var itemSearchColItemId = search.createColumn({ name: 'itemid', sort: search.Sort.ASC });
        var itemSearchColDisplayName = search.createColumn({ name: 'displayname' });
        var itemSearchColOutletAverageCost = search.createColumn({ name: 'locationaveragecost' });
        var itemSearchColInventoryOutlet = search.createColumn({ name: 'inventorylocation' });
        var itemSearchColOutletOnHand = search.createColumn({ name: 'locationquantityonhand' });
        var itemSearch = search.create({
            type: 'item',
            filters: [
                ['type', 'anyof', 'InvtPart', 'Assembly'],
            ],
            columns: [
                itemSearchColItemId,
                itemSearchColDisplayName,
                itemSearchColOutletAverageCost,
                itemSearchColInventoryOutlet,
                itemSearchColOutletOnHand,
            ],
        });
        
        var itemSearchPagedData = itemSearch.runPaged({ pageSize: 1000 });
        for (var x = 0; x < itemSearchPagedData.pageRanges.length; x++) {
            var itemSearchPage = itemSearchPagedData.fetch({ index: x });
            itemSearchPage.data.forEach(function (result){
                arrLocationOnhand.push({
                    itemId: result.getValue(itemSearchColItemId),
                    displayName: result.getValue(itemSearchColDisplayName),
                    outletAverageCost: result.getValue(itemSearchColOutletAverageCost),
                    inventoryOutlet: result.getText(itemSearchColInventoryOutlet),
                    qtyOutletOnHand: result.getValue(itemSearchColOutletOnHand)
                })
            });
        }
        log.debug('arrLocationOnhand', arrLocationOnhand);
        return arrLocationOnhand
    }

    function consolidateData(arrConsolidatedResults) {
        let arrLocationOnhandData = getLocQtyOnHand()
        let consolidatedData = {};
    
        // Iterate through the original array
        arrConsolidatedResults.forEach((item) => {
            let key = item.item; // Using the item_internalid directly as the key
    
            let intQuantity = item.qtyNeeded ? parseFloat(item.qtyNeeded) : 0.00;
            let floatPrice = item.price ? parseFloat(item.price) : 0.00; // Parse price to float

    
            if (consolidatedData[key]) {
                // If the key already exists, update the values accordingly
                consolidatedData[key].qtyNeeded += parseFloat(intQuantity);
                consolidatedData[key].customIngdtId.push(item.id); 
            } else {
                // If the key doesn't exist, add a new entry with the current item
                consolidatedData[key] = {
                    ...item,
                    qtyNeeded: intQuantity,
                    price: floatPrice,
                    customIngdtId: [item.id] // Initialize with current id in an array
                };
            }
        });

        log.debug('consolidateData consolidatedData', consolidatedData);
        // Convert consolidatedData object into an array
        let arrResults = Object.values(consolidatedData);

        arrResults.forEach(result => {
            // Initialize a new property in the result object for the quantity
            result.qtyOutletOnHand = 0;
        
            // Find matching elements in arrLocationOnhandData
            arrLocationOnhandData.forEach(locationData => {
                if (locationData.itemId === result.item && locationData.inventoryOutlet === result.outlet) {
                    // Assuming you want to sum up all matching quantities
                    result.qtyOutletOnHand += parseFloat(locationData.qtyOutletOnHand);
                }
            });
        });
        
        log.debug('added qtyOutletOnHand arrResults', arrResults); // Now arrResults includes the qtyOutletOnHand for each item and outlet
        
    
        // Log and return the results
        log.debug('consolidateData arrResults', arrResults);
        return arrResults;
    }
    
    
    
    
    
    

});
  
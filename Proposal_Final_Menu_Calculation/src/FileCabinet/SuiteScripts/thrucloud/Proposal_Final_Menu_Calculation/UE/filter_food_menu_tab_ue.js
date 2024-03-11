/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 */
    (record, search) => {
        const ARR_ADDON_FIELDID = [
            'custbody_final_menu_addon_1',
            'custbody_final_menu_addon_2',
            'custbody_final_menu_addon_3',
            'custbody_final_menu_addon_4',
            'custbody_final_menu_addon_5',
            'custbody_final_menu_addon_6'
        ]

        const ARR_MENU_FIELDID = [
            'custrecord_food_menu_id',
            'custrecord_menu_class',
            'custrecord_fcs_cost_head',
            'custrecord_menu_cost',
        ]

        const beforeLoad = (scriptContext) => {
            var currentRecord = scriptContext.newRecord;
            let arrSelectedAddOn = []
            let arrAddOnResults = []
            let arrSelectedOption = []
            let arrOptionValue = []
            let strTranform = currentRecord.getValue({
                fieldId: 'transform'
            });
            log.debug('beforeLoad: strTranform', strTranform)

            let intCreatedFrom = currentRecord.getValue({
                fieldId: 'createdfrom'
            });
            log.debug('beforeLoad: intCreatedFrom', intCreatedFrom)

            if (strTranform == 'estimate' && intCreatedFrom){

                let arrCreatedFromData = loadCreatedFrom(intCreatedFrom)
                let arrSearchAddOn = searchSelectedAddOn()

                ARR_ADDON_FIELDID.forEach(fieldId => {
                    let fieldValue = currentRecord.getValue({
                        fieldId: fieldId
                    })
                    if (fieldValue){
                        arrSelectedAddOn.push(fieldValue)
                    }
                });
                log.debug('beforeLoad: arrSelectedAddOn', arrSelectedAddOn)

                arrSelectedAddOn.forEach(addon => {
                    let objResults = getCostingStructure(addon, arrSearchAddOn)
                    if (objResults){
                        arrAddOnResults.push(objResults)
                    }
                });
                log.debug('beforeLoad: arrAddOnResults', arrAddOnResults)

                let intBaseMenu = currentRecord.getValue({
                    fieldId: 'custbody_final_menu_base'
                });
                log.debug('beforeLoad: intBaseMenu', intBaseMenu)

                var numLines = currentRecord.getLineCount({
                    sublistId: 'recmachcustrecord_transaction_fb_food'
                });
                log.debug('beforeLoad: numLines', numLines)

                arrCreatedFromData.forEach((data, i) => {
                    Object.entries(data).forEach(([key, value]) => {
                        log.debug('beforeLoad: key', key);
                        log.debug('beforeLoad: value', value);
                        currentRecord.setSublistValue({
                            sublistId: 'recmachcustrecord_transaction_fb_food',
                            fieldId: key,
                            value: value,
                            line: i,
                        });
                    });
                });

                for (let i = numLines - 1; i >= 0; i--) {
                    let intCostingStructure = currentRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_transaction_fb_food',
                        fieldId: 'custrecord_costing_structure',
                        line: i,
                    });
                    log.debug('beforeLoad: intCostingStructure', intCostingStructure);
                
                    let intOptionType = currentRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_transaction_fb_food',
                        fieldId: 'custrecord_option',
                        line: i,
                    });
                    log.debug('beforeLoad: intOptionType', intOptionType);
                
                    if (intCostingStructure == 1) { // Base Menu
                        if (intOptionType != intBaseMenu) {
                            currentRecord.removeLine({
                                sublistId: 'recmachcustrecord_transaction_fb_food',
                                line: i,
                            });
                            log.debug('beforeLoad: if removed', i);
                        }
                    } else {
                        let shouldRemoveLine = true;
                        arrAddOnResults.forEach(data => {
                            let costStructure = data.costStructure;
                            let optionValue = data.optionValue;
                            if (costStructure == intCostingStructure && intOptionType == optionValue) {
                                shouldRemoveLine = false;
                            }
                        });
                        if (shouldRemoveLine) {
                            currentRecord.removeLine({
                                sublistId: 'recmachcustrecord_transaction_fb_food',
                                line: i,
                            });
                            log.debug('beforeLoad: else removed', i);
                        }
                    }
                }
                 
            }
            
        };
        
        // private function

        const searchSelectedAddOn = () => {
            let arrSearchResults = [];
            try {
                let objRecordSearch = search.create({
                    type: 'customrecord_final_menu_selection_add_on',
                    filters: [],
                    columns: [
                        search.createColumn({name: 'internalid'}),
                        search.createColumn({name: 'name'}),
                        search.createColumn({name: 'custrecord_costing_structure_menu'}),
                        search.createColumn({name: 'custrecord_option_value'}),
                    ],

                });
                var searchResultCount = objRecordSearch.runPaged().count;
                if (searchResultCount != 0) {
                    var pagedData = objRecordSearch.runPaged({pageSize: 1000});
                    for (var i = 0; i < pagedData.pageRanges.length; i++) {
                        var currentPage = pagedData.fetch(i);
                        var pageData = currentPage.data;
                        if (pageData.length > 0) {
                            for (var pageResultIndex = 0; pageResultIndex < pageData.length; pageResultIndex++) {
                                arrSearchResults.push({
                                    recId: pageData[pageResultIndex].getValue({name: 'internalid'}),
                                    recName: pageData[pageResultIndex].getValue({name: 'name'}),
                                    recStructure: pageData[pageResultIndex].getValue({name: 'custrecord_costing_structure_menu'}),
                                    recOptionValue: pageData[pageResultIndex].getValue({name: 'custrecord_option_value'}),
                                });
                            }
                        }
                    }
                }
                log.debug("getCostingStructure: arrSearchResults", arrSearchResults)
                return arrSearchResults;
            } catch (err) {
                log.error('getCostingStructure', err.message);
            }
        }

        const getCostingStructure = (parmAddOn, arrSearchAddOn) => {
            let objResults = {}
            arrSearchAddOn.forEach(item => {
                let strAddOnNameId = item.recId
                let strCostStructureId = item.recStructure
                let strOptionId = item.recOptionValue
                let strRecName = item.recName
                if (parmAddOn == strAddOnNameId){
                    objResults = {
                      name: strRecName,
                      costStructure: strCostStructureId,
                      optionValue: strOptionId
                    }
                }
            });
            log.debug('getCostingStructure: objResults', objResults);
            return objResults
        }

        const loadCreatedFrom = (intCreatedFrom) => {
            try {
                let arrCreatedFromData = []
                let objRecord = record.load({
                    type: 'estimate',
                    id: intCreatedFrom,
                    isDynamic: true,
                });
                log.debug("objRecord", objRecord)
                if (objRecord){
                    var numLines = objRecord.getLineCount({
                        sublistId: 'recmachcustrecord_transaction_fb_food'
                    });
                    for (var i = 0;  i < numLines; i++) {
                        let intFoodMenuId = objRecord.getSublistValue({
                            sublistId: 'recmachcustrecord_transaction_fb_food',
                            fieldId: 'custrecord_food_menu_id',
                            line: i
                        })

                        let intMenuClass = objRecord.getSublistValue({
                            sublistId: 'recmachcustrecord_transaction_fb_food',
                            fieldId: 'custrecord_menu_class',
                            line: i
                        })

                        let intCostHead = objRecord.getSublistValue({
                            sublistId: 'recmachcustrecord_transaction_fb_food',
                            fieldId: 'custrecord_fcs_cost_head',
                            line: i
                        })
                        
                        let intMenuCost = objRecord.getSublistValue({
                            sublistId: 'recmachcustrecord_transaction_fb_food',
                            fieldId: 'custrecord_menu_cost',
                            line: i
                        })
                        
                        let objData = {
                            custrecord_food_menu_id: intFoodMenuId,
                            custrecord_menu_class: intMenuClass,
                            custrecord_fcs_cost_head: intCostHead,
                            custrecord_menu_cost: intMenuCost
                        }
                        log.debug("loadCreatedFrom objData" + i, objData)

                        if (objData){
                            arrCreatedFromData.push(objData)
                        }
                    }
                }
                return arrCreatedFromData
            } catch (err) {
                log.error('loadCreatedFrom', err.message);
            }
            
        }

        return {beforeLoad}

    });

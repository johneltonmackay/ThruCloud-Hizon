/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 */
    (record, search) => {

        const afterSubmit = (scriptContext) => {
            log.debug("CONTEXT: ", scriptContext.type);
            if (scriptContext.type == 'create'){
                try {
                    const newRecord = scriptContext.newRecord;
                    let recType = newRecord.type
                    let strId = newRecord.id
                    const objRecord = record.load({
                            type: recType,
                            id: strId,
                            isDynamic: true,
                        });
                    log.debug("objRecord", objRecord)
                    if (objRecord){
                        let menuId = objRecord.getValue({
                            fieldId:'custrecord_fcs_menu'
                        })
                        log.debug("afterSubmit menuId", menuId)
    
                        if (menuId){
                            let arrCustomIngredients = getMainRecipe(menuId)
                            let arrCurrentCustomIng = getCurrentCustomIng(strId)
    
                            deleteCurrentIng(arrCurrentCustomIng)
    
                            arrCustomIngredients.forEach(data => {
                                log.debug("afterSubmit data", data)
                                objRecord.selectNewLine({
                                    sublistId:'recmachcustrecord_related_food_menu'
                                })
                                objRecord.setCurrentSublistValue({
                                    sublistId:'recmachcustrecord_related_food_menu',
                                    fieldId: 'custrecord_ingdt_c',
                                    value: data.recItemCode,
                                    ignoreFieldChange: true
                                })
                                objRecord.setCurrentSublistValue({
                                    sublistId:'recmachcustrecord_related_food_menu',
                                    fieldId: 'custrecord_qty_c',
                                    value: data.recQty,
                                    ignoreFieldChange: true
                                })
                                objRecord.setCurrentSublistValue({
                                    sublistId:'recmachcustrecord_related_food_menu',
                                    fieldId: 'custrecord_uom_c',
                                    value: data.recUom,
                                    ignoreFieldChange: true
                                })
                                objRecord.setCurrentSublistValue({
                                    sublistId:'recmachcustrecord_related_food_menu',
                                    fieldId: 'custrecord_customamount',
                                    value: data.recAmount,
                                    ignoreFieldChange: true
                                })
                                objRecord.setCurrentSublistValue({
                                    sublistId:'recmachcustrecord_related_food_menu',
                                    fieldId: 'custrecord_customunit',
                                    value: data.recUnitCost,
                                    ignoreFieldChange: true
                                })
                                objRecord.setCurrentSublistValue({
                                    sublistId:'recmachcustrecord_related_food_menu',
                                    fieldId: 'custrecord_g_kitchen_c',
                                    value: data.recCommonItem,
                                    ignoreFieldChange: true
                                })
                                objRecord.commitLine({
                                    sublistId: 'recmachcustrecord_related_food_menu'
                                })
                            });
                            let recordId = objRecord.save({
                                enableSourcing: true,
                                ignoreMandatoryFields: true
                            });
                            log.debug("recordId" + recType, recordId)
                            
    
                        }
    
                    }               
                } catch (err) {
                    log.error('afterSubmit', err.message);
                }
            }
        }

        

        //Private Function
        const deleteCurrentIng = (arrCurrentCustomIng) => {
            try {

                arrCurrentCustomIng.forEach(data => {
                    let id = data.internalid
                    deletedId = record.delete({
                        type: 'customrecord_custom_ingdt',
                        id: id,
                    });
                    log.debug('deleteCurrentIng recordId', deletedId)
                });

            } catch (err) {
                log.error('getCurrentCustomIng error', err.message);
            }
        }

        const getCurrentCustomIng = (menuId) => {
            let arrCustomIngredients = [];
            try {
                let objIngredientSearch = search.create({
                    type: 'customrecord_custom_ingdt',
                    filters: [
                        ['custrecord_related_food_menu', 'anyof', menuId],
                      ],
                    columns: [
                        search.createColumn({ name: 'internalid' }),
                        search.createColumn({ name: 'custrecord_ingdt_c' }),
                        search.createColumn({ name: 'custrecord_related_food_menu' }),
                    ],
    
                });
                var searchResultCount = objIngredientSearch.runPaged().count;
                if (searchResultCount != 0) {
                    var pagedData = objIngredientSearch.runPaged({pageSize: 1000});
                    for (var i = 0; i < pagedData.pageRanges.length; i++) {
                        var currentPage = pagedData.fetch(i);
                        var pageData = currentPage.data;
                        if (pageData.length > 0) {
                            for (var pageResultIndex = 0; pageResultIndex < pageData.length; pageResultIndex++) {
                                var recId = pageData[pageResultIndex].getValue({name: 'internalid'});
                                var recItemCode = pageData[pageResultIndex].getValue({name: 'custrecord_ingdt_c'});
                                var recRelatedFoodId = pageData[pageResultIndex].getValue({name: 'custrecord_related_food_menu'});

                                arrCustomIngredients.push({
                                    internalid: recId,
                                    itemcode: recItemCode,
                                    foodmenuid: recRelatedFoodId,
                                });
                                
                            }
                        }
                    }
                }
                log.debug(`getCurrentCustomIng: arrCustomIngredients ${Object.keys(arrCustomIngredients).length}`, arrCustomIngredients);
                return arrCustomIngredients;
            } catch (err) {
                log.error('getCurrentCustomIng error', err.message);
            }
        }
        const getMainRecipe = (menuId) => {
            let arrSubRecipe = []
            let arrRecipeLineData = []
            let arrSubRecipeLineData = []
            arrCustomIngredients = []
            var customrecord_food_recipesSearchObj = search.create({
                type: "customrecord_food_recipes",
                filters:
                [
                   ["internalid","anyof", menuId]
                ],
                columns:
                [
                    search.createColumn({ name: "custrecord_recipe_ingredients_itemcode", join: "CUSTRECORD_RECIPE_PARENT", label: "Item Code" }),
                    search.createColumn({ name: "custrecord_recipe_ingredients_quantity", join: "CUSTRECORD_RECIPE_PARENT", label: "Quantity" }),
                    search.createColumn({ name: "custrecord_unit_of_measure_ingredients", join: "CUSTRECORD_RECIPE_PARENT", label: "Unit of Measure (U/M)" }),
                    search.createColumn({ name: "custrecord_ingredients_unit_cost", join: "CUSTRECORD_RECIPE_PARENT", label: "Unit Cost" }),
                    search.createColumn({ name: "custrecord_ingredients_amount", join: "CUSTRECORD_RECIPE_PARENT", label: "Amount" }),
                    search.createColumn({ name: "custrecord_common_item", join: "CUSTRECORD_RECIPE_PARENT", label: "Common Item" }),
                    search.createColumn({ name: "custrecord_ingredients_claimer", join: "CUSTRECORD_RECIPE_PARENT", label: "Claimer" }),
                    search.createColumn({ name: "custrecord_foodrecipe_subrecipe", join: "CUSTRECORD_RECIPE_PARENT", label: "Sub-Recipe" })
                ]
                
             });
             
             var searchResultCount = customrecord_food_recipesSearchObj.runPaged().count;
             log.debug("customrecord_food_recipesSearchObj result count",searchResultCount);

             customrecord_food_recipesSearchObj.run().each(function(result){						
                 let objRecipeLineData = {
                    recItemCode: result.getValue({ name: "custrecord_recipe_ingredients_itemcode", join: "CUSTRECORD_RECIPE_PARENT" }),
                    recQty: result.getValue({ name: "custrecord_recipe_ingredients_quantity", join: "CUSTRECORD_RECIPE_PARENT" }),
                    recUom: result.getValue({ name: "custrecord_unit_of_measure_ingredients", join: "CUSTRECORD_RECIPE_PARENT" }),
                    recUnitCost: result.getValue({ name: "custrecord_ingredients_unit_cost", join: "CUSTRECORD_RECIPE_PARENT" }),
                    recAmount: result.getValue({ name: "custrecord_ingredients_amount", join: "CUSTRECORD_RECIPE_PARENT" }),
                    recCommonItem: result.getValue({ name: "custrecord_common_item", join: "CUSTRECORD_RECIPE_PARENT" }),
                    custrecord_foodrecipe_subrecipe: result.getValue({ name: "custrecord_foodrecipe_subrecipe", join: "CUSTRECORD_RECIPE_PARENT" })
                 }
                 let searchSubRecipe = result.getValue({
                     name: "custrecord_foodrecipe_subrecipe",
                     join: "CUSTRECORD_RECIPE_PARENT"
                 });
                 if (searchSubRecipe){
                     arrSubRecipeLineData.push(searchSubRecipe)
                 } else {
                     arrRecipeLineData.push(objRecipeLineData)
                 }
                 return true;
             });
             log.debug('arrRecipeLineData', arrRecipeLineData)
             log.debug('arrSubRecipeLineData', arrSubRecipeLineData)

             if (arrRecipeLineData.length > 0 ){
				arrCustomIngredients = [...arrRecipeLineData];
             }
          
             if (arrSubRecipeLineData.length > 0 ){
                arrSubRecipe = getSubRecipe(arrSubRecipeLineData)
				arrCustomIngredients = [...arrSubRecipe, ...arrRecipeLineData];
             }
            
            log.debug('getMainRecipe arrCustomIngredients', arrCustomIngredients)
            return arrCustomIngredients
        }

        const getSubRecipe = (arrSubRecipeLineData) => {
            let arrSubRecipe = [];
            try {
                let objRecipeSearch = search.create({
                    type: 'customrecord_food_recipe_lines',
                    filters: [
                        ['custrecord_recipe_parent.internalid', 'anyof', arrSubRecipeLineData],
                      ],
                    columns: [
                        search.createColumn({ name: 'internalid' }),
                        search.createColumn({ name: 'custrecord_recipe_ingredients_itemcode' }),
                        search.createColumn({ name: 'custrecord_foodrecipe_itemdesc' }),
                        search.createColumn({ name: 'custrecord_foodrecipe_subrecipe' }),
                        search.createColumn({ name: 'custrecord_recipe_ingredients_quantity' }),
                        search.createColumn({ name: 'custrecord_unit_of_measure_ingredients' }),
                        search.createColumn({ name: 'custrecord_ingredients_unit_cost' }),
                        search.createColumn({ name: 'custrecord_ingredients_amount' }),
                        search.createColumn({ name: 'custrecord_subrecipe_unitcost' }),
                        search.createColumn({ name: 'custrecord_common_item' }),
                        search.createColumn({ name: 'custrecord_ingdt_category' }),
                        search.createColumn({ name: 'custrecord_ingdt_nopax' }),
                        search.createColumn({ name: 'custrecord_recipe_parent' }),
                    ],
    
                });
                var searchResultCount = objRecipeSearch.runPaged().count;
                if (searchResultCount != 0) {
                    var pagedData = objRecipeSearch.runPaged({pageSize: 1000});
                    for (var i = 0; i < pagedData.pageRanges.length; i++) {
                        var currentPage = pagedData.fetch(i);
                        var pageData = currentPage.data;
                        if (pageData.length > 0) {
                            for (var pageResultIndex = 0; pageResultIndex < pageData.length; pageResultIndex++) {
                                var recId = pageData[pageResultIndex].getValue({name: 'internalid'});
                                var recItemCode = pageData[pageResultIndex].getValue({name: 'custrecord_recipe_ingredients_itemcode'});
                                var recItemDesc = pageData[pageResultIndex].getValue({name: 'custrecord_foodrecipe_itemdesc'});
                                var recSubRecipe = pageData[pageResultIndex].getValue({name: 'custrecord_foodrecipe_subrecipe'});
                                var recQty = pageData[pageResultIndex].getValue({name: 'custrecord_recipe_ingredients_quantity'});
                                var recUom = pageData[pageResultIndex].getValue({name: 'custrecord_unit_of_measure_ingredients'});
                                var recUnitCost = pageData[pageResultIndex].getValue({name: 'custrecord_ingredients_unit_cost'});
                                var recAmount = pageData[pageResultIndex].getValue({name: 'custrecord_ingredients_amount'});
                                var recSubUnitCost = pageData[pageResultIndex].getValue({name: 'custrecord_subrecipe_unitcost'});
                                var recCommonItem = pageData[pageResultIndex].getValue({name: 'custrecord_common_item'});
                                var recCatergory = pageData[pageResultIndex].getValue({name: 'custrecord_ingdt_category'});
                                var recNoPax = pageData[pageResultIndex].getValue({name: 'custrecord_ingdt_nopax'});
                                var recParentId = pageData[pageResultIndex].getValue({name: 'custrecord_recipe_parent'});
                                
                                // Check if recId already exists in arrSubRecipe
                                var existingIndex = arrSubRecipe.findIndex(item => item.recId === recId);
                                if (existingIndex == -1) {
                                    // If doesn't exist, create a new record
                                    arrSubRecipe.push({
                                        recId: recId,
                                        recItemCode: recItemCode,
                                        recItemDesc: recItemDesc,
                                        recSubRecipe: recSubRecipe,
                                        recQty: recQty,
                                        recUom: recUom,
                                        recUnitCost: recUnitCost,
                                        recAmount: recAmount,
                                        recSubUnitCost: recSubUnitCost,
                                        recCommonItem: recCommonItem,
                                        recCatergory: recCatergory,
                                        recNoPax: recNoPax,
                                        recParentId: recParentId,
                                    });
                                }
                            }
                        }
                    }
                }
                log.debug(`getSubRecipe: arrSubRecipe ${Object.keys(arrSubRecipe).length}`, arrSubRecipe);
                return arrSubRecipe;
            } catch (err) {
                log.error('getSubRecipe error', err.message);
            }
        }

        return {afterSubmit}

    });

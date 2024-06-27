/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/query','N/currentRecord', 'N/search', 'N/record', 'N/url'],

function(runtime, query,currentRecord, search, record, url) {
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

    function pageInit_std_ing_cus_ing_pax(scriptContext) {
        
    }


    function fieldChanged_std_ing_cus_ing_pax(scriptContext) {
        var currRecObj = currentRecord.get();
        //console.log(scriptContext)
        if (scriptContext.fieldId == 'custrecord_fcs_pax'){

            var costHead = currRecObj.getValue({
                fieldId : 'custrecord_fcs_cost_head',
            })

            var updatePax = currRecObj.getValue({
                fieldId : 'custrecord_fcs_pax'
            })

            var priceHead = currRecObj.getValue({
                fieldId : 'custrecord_fcs_price_head'
            })

            currRecObj.setValue({
                fieldId : 'custrecord_menu_cost',
                value : costHead * updatePax
            })
            
            currRecObj.setValue({
                fieldId: 'custrecord_fcs_percentage',
                value: priceHead ? (costHead / priceHead) * 100 : 0 
            });
            
            var outlet = currRecObj.getValue({
                fieldId : 'custrecord_fm_outlet'
            })

            console.log('updatePax',updatePax)

            var foodRecipe = currRecObj.getValue({
                fieldId : 'custrecord_fcs_menu'
            })
            console.log('foodRecipe',foodRecipe)

            if(!foodRecipe){
                alert('Please Enter Menu')
                return false;
            }

            var frField = search.lookupFields({
                type: 'customrecord_food_recipes',
                id: foodRecipe,
                columns: ['custrecord_recipe_no_of_pax']
            });

            var csRec = currRecObj.getValue({
                fieldId : 'custrecord_related_topsheet'
            })
            console.log('foodRecipe',foodRecipe)
            var outlet;
            if(csRec){
                var csField = search.lookupFields({
                    type: 'customrecord_costing_sheet',
                    id: csRec,
                    columns: ['custrecord_tc_costingsheet_location']
                });

                if(csField.custrecord_tc_costingsheet_location.length > 0){
                    outlet = csField.custrecord_tc_costingsheet_location[0].value;
                }
            }

            frFieldNoPax = frField.custrecord_recipe_no_of_pax
            console.log('outlet',outlet)
            console.log('frField',frField.custrecord_recipe_no_of_pax)

            let arrSubRecipeData = []

            let arrItemData = getItemData()

            let objRecipeData = getRecipe(foodRecipe, frFieldNoPax, updatePax)

            let arrMainRecipe = objRecipeData.mainRecipe
            let arrSubRecipe = objRecipeData.subRecipe

            if (arrSubRecipe.length > 0){
                for (var i = 0; i < arrSubRecipe.length; i++){
                    let subRecipeId = arrSubRecipe[i]
                    let objSubRecipeData = getRecipe(subRecipeId, frFieldNoPax, updatePax)
                    let arrSubRecipeDataResults = objSubRecipeData.mainRecipe
                    arrSubRecipeData = [...arrSubRecipeData, ...arrSubRecipeDataResults]
                }
            }

            let arrJoinRecipes = [...arrMainRecipe, ...arrSubRecipeData];
            if (arrJoinRecipes.length > 0) {
                log.debug('arrJoinRecipes', arrJoinRecipes);
                log.debug('arrJoinRecipes', outlet);
                arrJoinRecipes.forEach((recipe, index) => {
                    let itemId = recipe.itemId;
            
                    let arrFilteredItems = arrItemData.filter(item => item.outlet === outlet && item.internalid === itemId);
                    log.debug('arrFilteredItems', arrFilteredItems);
            
                    if (arrFilteredItems.length > 0) {
                        let aveCost = arrFilteredItems[0].aveCost;
                        let markUp = arrFilteredItems[0].markUp;
                        arrJoinRecipes[index].aveCost = aveCost;
                        arrJoinRecipes[index].markUp = markUp;
                    } else {
                        arrJoinRecipes[index].aveCost = 0;
                        arrJoinRecipes[index].markUp = 0;
                    }
                });
            } 


            let fiResults = arrJoinRecipes
            console.log('fiResults',fiResults)

            var cusIngLine = currRecObj.getLineCount({
                sublistId: 'recmachcustrecord_related_food_menu'
            });
    
            //console.log('cusIngLine',cusIngLine)
    
            if(cusIngLine > 0){
                for(var i = 0; i<cusIngLine;i++){
                    console.log('To Search',fiResults[i].itemCode + ' ' + fiResults[i].displayName)
                    var searchLine = currRecObj.findSublistLineWithValue({
                        sublistId: 'recmachcustrecord_related_food_menu',
                        fieldId: 'custrecord_ingdt_c_display',
                        value: fiResults[i].itemCode + ' ' + fiResults[i].displayName
                    });

                    console.log('searchLine',searchLine)

                    if(searchLine >= 0){
                        console.log('isnide If Search Line')
                        currRecObj.selectLine({
                            sublistId: 'recmachcustrecord_related_food_menu',
                            line: searchLine
                        });
                        currRecObj.setCurrentSublistValue({
                            sublistId: 'recmachcustrecord_related_food_menu',
                            fieldId: 'custrecord_qty_c',
                            value: fiResults[i].cusQuantity,
                            forceSyncSourcing: true
                        });

                        var fromUom = getUnitsTypeUom(fiResults[i].stockUnit);
                        var toUom = getUnitsTypeUom(fiResults[i].saleUnit);
                        if(fiResults[i].aveCost && fromUom.conversionrate && toUom.conversionrate){
                            var convertedCost = fiResults[i].aveCost / (parseFloat(fromUom.conversionrate) / parseFloat(toUom.conversionrate));
                        }
                        else{
                            var convertedCost = 0;
                        }
                        
                        currRecObj.setCurrentSublistValue({
                            sublistId: 'recmachcustrecord_related_food_menu',
                            fieldId: 'custrecord_customunit',
                            value: convertedCost,
                            forceSyncSourcing: true
                        });

                        var amountVal = parseFloat(fiResults[i].cusQuantity) * parseFloat(convertedCost)
                        if(amountVal){
                            amountVal = amountVal.toFixed(2);
                        }
                        
                        currRecObj.setCurrentSublistValue({
                            sublistId: 'recmachcustrecord_related_food_menu',
                            fieldId: 'custrecord_customamount',
                            value: amountVal,
                            forceSyncSourcing: true
                        });

                        currRecObj.setCurrentSublistValue({
                            sublistId: 'recmachcustrecord_related_food_menu',
                            fieldId: 'custrecord_custom_ingdt_category',
                            value: fiResults[i].category,
                            forceSyncSourcing: true
                        });
                        
                        currRecObj.commitLine({sublistId: 'recmachcustrecord_related_food_menu'})
                    }
                }
            }
        }
       
    }

        //PRIVATE FUNCTION

        function getRecipe(recipe, frFieldNoPax, updatePax) {
            let arrRecipeLineData = []
            let arrSubRecipeLineData = []
            let arrRecipe = [];
            try {
                let objRecipeSearch = search.create({
                    type: 'customrecord_food_recipe_lines',
                    filters: [
                        ['custrecord_recipe_parent.internalid', 'anyof', recipe],
                      ],
                    columns: [
                        search.createColumn({ name: 'custrecord_recipe_ingredients_itemcode' }),
                        search.createColumn({ name: 'displayname', join: 'CUSTRECORD_RECIPE_INGREDIENTS_ITEMCODE' }),
                        search.createColumn({ name: 'custrecord_recipeingredients_description' }),
                        search.createColumn({ name: 'custrecord_recipe_ingredients_quantity' }),
                        search.createColumn({ name: 'averagecost', join: 'custrecord_recipe_ingredients_itemcode' }),
                        search.createColumn({ name: 'stockunit', join: 'custrecord_recipe_ingredients_itemcode' }),
                        search.createColumn({ name: 'saleunit', join: 'custrecord_recipe_ingredients_itemcode' }),
                        search.createColumn({ name: 'custrecord_ingdt_category' }),
                        search.createColumn({ name: 'custrecord_foodrecipe_subrecipe' }),

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


                                var itemCode = pageData[pageResultIndex].getText({name: 'custrecord_recipe_ingredients_itemcode'});
                                var itemId = pageData[pageResultIndex].getValue({name: 'custrecord_recipe_ingredients_itemcode'});
                                var displayName = pageData[pageResultIndex].getValue({ name: 'displayname', join: 'CUSTRECORD_RECIPE_INGREDIENTS_ITEMCODE' });
                                var ingredientDescription = pageData[pageResultIndex].getValue({name: 'custrecord_recipeingredients_description'});
                                var quantity = pageData[pageResultIndex].getValue({name: 'custrecord_recipe_ingredients_quantity'});
                                var stockUnit = pageData[pageResultIndex].getValue({ name: 'stockunit', join: 'custrecord_recipe_ingredients_itemcode' });
                                var saleUnit = pageData[pageResultIndex].getValue({ name: 'saleunit', join: 'custrecord_recipe_ingredients_itemcode' });
                                var category = pageData[pageResultIndex].getValue({ name: 'custrecord_ingdt_category' });
                                var subRecipe = pageData[pageResultIndex].getValue({ name: 'custrecord_foodrecipe_subrecipe' });

                                var cusQuantity = (quantity / frFieldNoPax) * updatePax;


                                let objRecipeLineData = {
                                    "itemId": itemId,
                                    "itemCode": itemCode,
                                    "displayName": displayName,
                                    "ingredientDescription": ingredientDescription,
                                    "quantity": quantity,
                                    "cusQuantity" : cusQuantity,
                                    "stockUnit" : stockUnit,
                                    "saleUnit" : saleUnit,
                                    "category" : category,
                                }

                                if (subRecipe){
                                    arrSubRecipeLineData.push(subRecipe)
                                } else {
                                    arrRecipeLineData.push(objRecipeLineData)
                                }
                            }
                        }
                    }
                }
                let objRecipe = {
                    recipeId: recipe,
                    mainRecipe: arrRecipeLineData,
                    subRecipe: arrSubRecipeLineData
                }

                log.debug('getRecipe: objRecipe', objRecipe);
                return objRecipe;
            } catch (err) {
                log.error('getRecipe error', err.message);
            }
        }

        function getItemData() {
          
            let arrItemData = [];
            try {
                let objItemSearch = search.create({
                    type: 'item',
                    filters: [
                        ['type', 'anyof', 'InvtPart', 'Assembly'],
                      ],
                    columns: [
                        search.createColumn({ name: 'internalid' }),
                        search.createColumn({ name: 'itemid' }),
                        search.createColumn({ name: 'inventorylocation' }),
                        search.createColumn({ name: 'locationaveragecost' }),
                        search.createColumn({ name: 'custrecord_itemclass_markup', join: 'custitem_item_class'}),
                    ],
    
                });
                var searchResultCount = objItemSearch.runPaged().count;
                if (searchResultCount != 0) {
                    var pagedData = objItemSearch.runPaged({pageSize: 1000});
                    for (var i = 0; i < pagedData.pageRanges.length; i++) {
                        var currentPage = pagedData.fetch(i);
                        var pageData = currentPage.data;
                        if (pageData.length > 0) {
                            for (var pageResultIndex = 0; pageResultIndex < pageData.length; pageResultIndex++) {
                                var internalid = pageData[pageResultIndex].getValue({name: 'internalid'});
                                var itemCode = pageData[pageResultIndex].getValue({name: 'itemid'});
                                var outlet = pageData[pageResultIndex].getValue({name: 'inventorylocation'});
                                var aveCost = pageData[pageResultIndex].getValue({name: 'locationaveragecost'});
                                var markUp = pageData[pageResultIndex].getValue({ name: 'custrecord_itemclass_markup', join: 'custitem_item_class'});

                                arrItemData.push({
                                    internalid: internalid,
                                    itemCode: itemCode,
                                    outlet: outlet,
                                    aveCost: aveCost,
                                    markUp: markUp,
                                });

                            }
                        }
                    }
                }
                log.debug(`getItemData: arrItemData ${Object.keys(arrItemData).length}`, arrItemData);
                return arrItemData;
            } catch (err) {
                log.error('getItemData error', err.message);
            }
        }

        function getUnitsTypeUom(id){
    
            var results = query.runSuiteQL({query: "SELECT internalid, conversionrate FROM UnitsTypeUom WHERE internalid='"+id+"'"}).asMappedResults()[0];

            log.debug('getUnitsTypeUom results', results);

            return results;
        }


    return {
        fieldChanged: fieldChanged_std_ing_cus_ing_pax,
        getUnitsTypeUom: getUnitsTypeUom
        /*postSourcing: postSourcing,
        lineInit: lineInit,
        validateField: validateField,
        validateLine: validateLine,
        validateInsert: validateInsert,
        validateDelete: validateDelete
        saveRecord: saveRecord*/
    };
    
});
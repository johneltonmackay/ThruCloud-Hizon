/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/record', 'N/runtime', 'N/search', 'N/query'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (record, runtime, search, query) => {


        const getInputData = (inputContext) => {
            let script = runtime.getCurrentScript();
            let paramsId = script.getParameter({name: 'custscript_id_record'});
            let paramsRecType = script.getParameter({name: 'custscript_rec_type'});
            log.debug('paramsId', paramsId);
            log.debug('paramsRecType', paramsRecType);

            let recId = JSON.parse(paramsId);
            let recType = paramsRecType;
            var fmObj = [];

            const currentRecord = record.load({
                type: recType,
                id: recId,
                isDynamic: true,
            })
    
            log.debug('currentRecord', currentRecord);

            var outlet = currentRecord.getValue({
                fieldId : 'location' 
            })

            var sublistName = 'recmachcustrecord_transaction_fb_food';
                
            var foodMenuCnt = currentRecord.getLineCount({
                sublistId: sublistName
            });

            for(var k = 0; k<foodMenuCnt;k++){
                var idNo = currentRecord.getSublistValue({
                    sublistId: sublistName,
                    fieldId: 'id',
                    line: k
                });

                var updatePax = currentRecord.getSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custrecord_fcs_pax',
                    line: k
                });
                        
                var foodRecipe = currentRecord.getSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custrecord_fcs_menu',
                    line: k
                });

    
                if(!foodRecipe){
                    var errorMessage = "Validation failed in Food Menu. There Should be a Food Menu in the Sublist Line";
                    throw new Error(errorMessage);
                }
    
                var frField = search.lookupFields({
                    type: 'customrecord_food_recipes',
                    id: foodRecipe,
                    columns: ['custrecord_recipe_no_of_pax']
                });
    
                var isModified = currentRecord.getSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custrecord_fm_is_modified',
                    line: k
                });
                log.debug('isModified',isModified)

                var strMenuPrintOut = currentRecord.getSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custrecord_menu_desc_beo_printout_v2',
                    line: k
                });
                log.debug('strMenuPrintOut',strMenuPrintOut)

                
                fmObj.push({
                    "recId": recId,
                    "idNo" : idNo,
                    "outlet":outlet,
                    "updatePax": updatePax,
                    "foodRecipe": foodRecipe,
                    "frFieldNoPax": frField.custrecord_recipe_no_of_pax
                })
                log.debug('fmObj',fmObj)    
                

                currentRecord.selectLine({
                    sublistId: sublistName,
                    line: k
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custrecord_fm_is_modified',
                    value: false
                });

                currentRecord.setCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custrecord_menu_desc_beo_printout_v2',
                    value: strMenuPrintOut ? strMenuPrintOut : 'N/A'
                });

                currentRecord.commitLine({sublistId: sublistName})

            }

            var CSId = currentRecord.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
            
            log.debug('getInputData CSId',CSId)
               
            return fmObj;

        }

        const map = (mapContext) => {
            log.debug('map : mapContext', mapContext);
            let objMapValue = JSON.parse(mapContext.value)
            log.debug('map : objMapValue', objMapValue);
            mapContext.write({
                key : mapContext.key,
                value : mapContext.value
            });
        }

        const reduce = (reduceContext) => {
              log.debug('reduceContext.values 0', reduceContext.values[0])
              var hasError = 0;
  
              var parsedObject = JSON.parse(reduceContext.values[0]);
              var recId = parsedObject.recId
              var idNo = parsedObject.idNo;
              var outlet = parsedObject.outlet
              var updatePax = parsedObject.updatePax;
              var foodRecipe = parsedObject.foodRecipe;
              var frFieldNoPax = parsedObject.frFieldNoPax;
                  try{
                      var currRecObj = record.load({
                          type: 'customrecord_food_menu_fb',
                          id: idNo,
                          isDynamic: true,
                      });
      
                      currRecObj.setValue({
                          fieldId : 'custrecord_fcs_pax',
                          value : updatePax
                      })

                      let intMenuId = currRecObj.getValue({
                          fieldId : 'custrecord_fcs_menu',
                      })

                      let intCostHead = 0
                      fieldLookUp = search.lookupFields({
                        type: 'customrecord_food_recipes',
                        id: intMenuId,
                        columns: 'custrecord_food_recipe_cost_per_pax_stor'
                      });

                      log.debug("fieldLookUp",fieldLookUp)
                      if (fieldLookUp){
                        intCostHead = fieldLookUp.custrecord_food_recipe_cost_per_pax_stor;
                      }

                      currRecObj.setValue({
                        fieldId : 'custrecord_fcs_cost_head',
                        value : intCostHead
                      })

                      currRecObj.setValue({
                        fieldId : 'custrecord_food_menu_id',
                        value : idNo
                      })

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
                    
                      currRecObj.setValue({
                        fieldId : 'custrecord_menu_cost',
                        value : intCostHead * updatePax
                      })
          
                      let fiResults = arrJoinRecipes
                      log.debug('fiResults',fiResults)
              
                      if(fiResults.length > 0){
                          for(var i = 0; i<fiResults.length;i++){
                              //log.debug('To Search',fiResults[i].itemCode + ' ' + fiResults[i].displayName)
                              var searchLine = currRecObj.findSublistLineWithValue({
                                  sublistId: 'recmachcustrecord_related_food_menu',
                                  fieldId: 'custrecord_ingdt_c_display',
                                  value: fiResults[i].itemCode + ' ' + fiResults[i].displayName
                              });
          
                              log.debug('searchLine',searchLine)
          
                              if(searchLine >= 0){

                                  currRecObj.selectLine({
                                      sublistId: 'recmachcustrecord_related_food_menu',
                                      line: searchLine
                                  });

                                  currRecObj.setCurrentSublistValue({
                                      sublistId: 'recmachcustrecord_related_food_menu',
                                      fieldId: 'custrecord_qty_c',
                                      line: searchLine,
                                      value: fiResults[i].cusQuantity
                                  });
      
                                  var fromUom = getUnitsTypeUom(fiResults[i].stockUnit);
                                  var toUom = getUnitsTypeUom(fiResults[i].saleUnit);

                                  log.debug('fiResults[i].aveCost', fiResults[i].aveCost)
                                  log.debug('fromUom.conversionrate', fromUom.conversionrate)
                                  log.debug('toUom.conversionrate', toUom.conversionrate)

                                  if(fiResults[i].aveCost && fromUom.conversionrate && toUom.conversionrate){
                                      var convertedCost = fiResults[i].aveCost / (parseFloat(fromUom.conversionrate) / parseFloat(toUom.conversionrate));
                                  }
                                  else{
                                      var convertedCost = 0;
                                  }
      
                                  currRecObj.setCurrentSublistValue({
                                      sublistId: 'recmachcustrecord_related_food_menu',
                                      fieldId: 'custrecord_customunit',
                                      line: searchLine,
                                      value: convertedCost
                                  });
      
                                  var amountVal = parseFloat(fiResults[i].cusQuantity) * parseFloat(convertedCost)
                                  if(amountVal){
                                      amountVal = amountVal.toFixed(2);
                                  }
                      
                                  currRecObj.setCurrentSublistValue({
                                      sublistId: 'recmachcustrecord_related_food_menu',
                                      fieldId: 'custrecord_customamount',
                                      line: searchLine,
                                      value: amountVal
                                  });
      
                                  currRecObj.setCurrentSublistValue({
                                      sublistId: 'recmachcustrecord_related_food_menu',
                                      fieldId: 'custrecord_custom_ingdt_category',
                                      line: searchLine,
                                      value: fiResults[i].category
                                  });

                                  var objfromUom = getUnitsTypeUom(fiResults[i].saleUnit);
                                  var objtoPurchaseUom = getUnitsTypeUom(fiResults[i].saleUnit);
                                  var objtoStockUom = getUnitsTypeUom(fiResults[i].stockUnit);

                                  var convertedPurchaseQuantity = fiResults[i].cusQuantity * parseFloat(objfromUom.conversionrate) / parseFloat(objtoPurchaseUom.conversionrate);
                                  var convertedStockQuantity = fiResults[i].cusQuantity * parseFloat(objfromUom.conversionrate) / parseFloat(objtoStockUom.conversionrate);

                                  currRecObj.setCurrentSublistValue({
                                      sublistId: 'recmachcustrecord_related_food_menu',
                                      fieldId: 'custrecord_qty_c_purchase',
                                      line: searchLine,
                                      value: convertedPurchaseQuantity ? convertedPurchaseQuantity : 0
                                  });
                                  currRecObj.setCurrentSublistValue({
                                      sublistId: 'recmachcustrecord_related_food_menu',
                                      fieldId: 'custrecord_qty_c_stock',
                                      line: searchLine,
                                      value: convertedStockQuantity ? convertedStockQuantity : 0
                                  });

                                  currRecObj.setCurrentSublistValue({
                                      sublistId: 'recmachcustrecord_related_food_menu',
                                      fieldId: 'custrecord_qty_remaining',
                                      line: searchLine,
                                      value: convertedStockQuantity ? convertedStockQuantity : 0
                                  });

                                  currRecObj.setCurrentSublistValue({
                                      sublistId: 'recmachcustrecord_related_food_menu',
                                    fieldId: 'custrecord_uom_c_purchase',
                                    line: searchLine,
                                    value: fiResults[i].saleUnit ? fiResults[i].saleUnit : null
                                  });

                                  currRecObj.setCurrentSublistValue({
                                    sublistId: 'recmachcustrecord_related_food_menu',
                                    fieldId: 'custrecord_uom_c_stock',
                                    line: searchLine,
                                    value: fiResults[i].stockUnit ? fiResults[i].stockUnit : null
                                  });


                                  currRecObj.commitLine({ sublistId: 'recmachcustrecord_related_food_menu' });

                              }
                          }
                      }
                      var FMId = currRecObj.save({
                          enableSourcing: true,
                          ignoreMandatoryFields: true
                      });
                      log.debug('FMId',FMId)
                  }
                  catch (error) {
                      //log.debug('catch');
                      hasError = 1
                      log.error('Error:', error.message);
                      // You can also perform any necessary error handling or recovery steps here
                  }
        }

        
        const summarize = (summaryContext) => {

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


        return {getInputData, map, reduce, summarize}

    });

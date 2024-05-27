	/**
	 * @NApiVersion 2.x
	 * @NScriptType MapReduceScript
	 */

	 /*
	Author 	: Phoenix Langaman
	Date 	: 3/17/2022
	Name 	: royalty report
	ID 		: _itg_royaltyreport 

	Result is not balance because it is grouped per sub,day and item
	*/
	define(['N/search','N/record','N/query', 'N/file', 'N/email','N/runtime'],

		function (search,record,query, file, email,runtime) {

			var script = runtime.getCurrentScript();

            var paramsId = script.getParameter({name: 'custscript_idingr_record'});
            var paramsContextType = script.getParameter({name: 'custscript_context_type'});

			function getInputData() {

                log.audit('paramsId', paramsId);
                log.audit('paramsContextType', paramsContextType);
				var recId = paramsId;
                var fmObj = [];

                var currentRecord = record.load({
                    type: 'customrecord_costing_sheet',
                    id: recId,
                    isDynamic: true,
                })

                var outlet = currentRecord.getValue({
                    fieldId : 'custrecord_tc_costingsheet_location' 
                })
    
                var sublistName = 'recmachcustrecord_related_topsheet';
                    
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

                    if(isModified == true || paramsContextType == 'USEREVENT'){
                        fmObj.push({
                            "recId": recId,
                            "idNo" : idNo,
                            "outlet":outlet,
                            "updatePax": updatePax,
                            "foodRecipe": foodRecipe,
                            "frFieldNoPax": frField.custrecord_recipe_no_of_pax
                        })
                      log.debug('fmObj',fmObj)
                    }

                    currentRecord.selectLine({
                        sublistId: sublistName,
                        line: k
                    });

                    currentRecord.setCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: 'custrecord_fm_is_modified',
                        value: false
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

			function map(context) {
                context.write({
                    key : context.key,
                    value : context.value
                });
			}

			function reduce(context) {
                log.debug('Here', 'reduce')
               // log.debug('context.values', context.values)
               // log.debug('context.values.length', context.values.length)
                log.debug('context.values 0', context.values[0])
				var hasError = 0;

                var parsedObject = JSON.parse(context.values[0]);
                //for(var k = 0; k<parsedObject.length;k++){
                    var recId = parsedObject.recId
                    var idNo = parsedObject.idNo;
                    var outlet = parsedObject.outlet
                    var updatePax = parsedObject.updatePax;
                    var foodRecipe = parsedObject.foodRecipe;
                    var frFieldNoPax = parsedObject.frFieldNoPax;
                        try{
                            var currRecObj = record.load({
                                type: 'customrecord_food_menu_fb',
                                id: idNo
                                //isDynamic: true,
                            });
            
                            currRecObj.setValue({
                                fieldId : 'custrecord_fcs_pax',
                                value : updatePax
                            })
                
                            var fiResults = new Array();
                            var customrecord_food_recipe_linesSearchColItemCode = search.createColumn({ name: 'custrecord_recipe_ingredients_itemcode' });
                            var customrecord_food_recipe_linesSearchColDisplayName = search.createColumn({ name: 'displayname', join: 'CUSTRECORD_RECIPE_INGREDIENTS_ITEMCODE' });
                            var customrecord_food_recipe_linesSearchColIngredientDescription = search.createColumn({ name: 'custrecord_recipeingredients_description' });
                            var customrecord_food_recipe_linesSearchColQuantity = search.createColumn({ name: 'custrecord_recipe_ingredients_quantity' });
                            var customrecordFoodRecipeLinesSearchColCustrecordRecipeIngredientsItemcodeAverageCost = search.createColumn({ name: 'averagecost', join: 'custrecord_recipe_ingredients_itemcode' });
                            var customrecordFoodRecipeLinesSearchColCustrecordRecipeIngredientsItemcodePrimaryStockUnit = search.createColumn({ name: 'stockunit', join: 'custrecord_recipe_ingredients_itemcode' });
                            var customrecordFoodRecipeLinesSearchColCustrecordRecipeIngredientsItemcodePrimarySaleUnit = search.createColumn({ name: 'saleunit', join: 'custrecord_recipe_ingredients_itemcode' });
                            var customrecordFoodRecipeLinesSearchColIngredientCategory = search.createColumn({ name: 'custrecord_ingdt_category' });
                            var customrecord_food_recipe_linesSearch = search.create({
                            type: 'customrecord_food_recipe_lines',
                            filters: [
                                ['custrecord_recipe_parent', 'anyof', foodRecipe],
                            ],
                            columns: [
                                customrecord_food_recipe_linesSearchColItemCode,
                                customrecord_food_recipe_linesSearchColDisplayName,
                                customrecord_food_recipe_linesSearchColIngredientDescription,
                                customrecord_food_recipe_linesSearchColQuantity,
                                customrecordFoodRecipeLinesSearchColCustrecordRecipeIngredientsItemcodeAverageCost,
                                customrecordFoodRecipeLinesSearchColCustrecordRecipeIngredientsItemcodePrimaryStockUnit,
                                customrecordFoodRecipeLinesSearchColCustrecordRecipeIngredientsItemcodePrimarySaleUnit,
                                customrecordFoodRecipeLinesSearchColIngredientCategory
                            ],
                            });
                            var customrecord_food_recipe_linesSearchPagedData = customrecord_food_recipe_linesSearch.runPaged({ pageSize: 1000 });
                            for (var a = 0; a < customrecord_food_recipe_linesSearchPagedData.pageRanges.length; a++) {
                                var customrecord_food_recipe_linesSearchPage = customrecord_food_recipe_linesSearchPagedData.fetch({ index: a });
                                customrecord_food_recipe_linesSearchPage.data.forEach(function (result) {
                                    var itemCode = result.getText({ name: 'custrecord_recipe_ingredients_itemcode' });
                                    var itemId = result.getValue({ name: 'custrecord_recipe_ingredients_itemcode' });
                                    var displayName = result.getValue({ name: 'displayname', join: 'CUSTRECORD_RECIPE_INGREDIENTS_ITEMCODE' });
                                    var ingredientDescription = result.getValue({ name: 'custrecord_recipeingredients_description' });
                                    var quantity = result.getValue({ name: 'custrecord_recipe_ingredients_quantity' });
                                    var cusQuantity = (quantity / frFieldNoPax) * updatePax;
                                    var itemSearchColOutletAverageCost = search.createColumn({ name: 'locationaveragecost' });
                            
                                    var itemSearch = search.create({
                                        type: 'item',
                                        filters: [
                                            ['type', 'anyof', 'InvtPart', 'Assembly'],
                                            'AND',
                                            ['internalid', 'anyof', itemId],
                                            'AND',
                                            ['inventorylocation', 'anyof', outlet],
                                        ],
                                        columns: [
                                            itemSearchColOutletAverageCost,
                                        ],
                                    });
                                    var locAveCost;
                                    var searchResultsItem = itemSearch.run().getRange({
                                        start: 0,
                                        end: 1 // Adjust the number of results you want to fetch
                                    });
                                    if(searchResultsItem.length > 0){
                                        //for (var z = 0; z < searchResultsItem.length; z++) {
                                        locAveCost = searchResultsItem[0].getValue({ name: 'locationaveragecost' }); 
                                        //}
                                    }

                                    var custrecordRecipeIngredientsItemcodeAverageCost = locAveCost;
                                    var custrecordRecipeIngredientsItemcodePrimaryStockUnit = result.getValue({ name: 'stockunit', join: 'custrecord_recipe_ingredients_itemcode' });
                                    var custrecordRecipeIngredientsItemcodePrimarySaleUnit = result.getValue({ name: 'saleunit', join: 'custrecord_recipe_ingredients_itemcode' });
                                    var customrecordFoodRecipeLinesSearchColIngredientCategory = result.getValue({ name: 'custrecord_ingdt_category' });
                
                                    fiResults.push({
                                        "itemCode": itemCode,
                                        "displayName": displayName,
                                        "ingredientDescription": ingredientDescription,
                                        "quantity": quantity,
                                        "cusQuantity" : cusQuantity,
                                        "aveCost" : custrecordRecipeIngredientsItemcodeAverageCost,
                                        "stockUnit" : custrecordRecipeIngredientsItemcodePrimaryStockUnit,
                                        "saleUnit" : custrecordRecipeIngredientsItemcodePrimarySaleUnit,
                                        "category" : customrecordFoodRecipeLinesSearchColIngredientCategory
                                    })
                                });
            
                            }
                
                            //log.debug('cusIngLine',cusIngLine)
                    
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
                                        currRecObj.setSublistValue({
                                            sublistId: 'recmachcustrecord_related_food_menu',
                                            fieldId: 'custrecord_qty_c',
                                            line: searchLine,
                                            value: fiResults[i].cusQuantity
                                        });
            
                                        var fromUom = getUnitsTypeUom(fiResults[i].stockUnit);
                                        var toUom = getUnitsTypeUom(fiResults[i].saleUnit);
                                        log.debug('fiResults[i].aveCost',fiResults[i].aveCost)
                                        log.debug('fromUom.conversionrate',fromUom.conversionrate)
                                        log.debug('toUom.conversionrate',toUom.conversionrate)
                                        if(fiResults[i].aveCost && fromUom.conversionrate && toUom.conversionrate){
                                            var convertedCost = fiResults[i].aveCost / (parseFloat(fromUom.conversionrate) / parseFloat(toUom.conversionrate));
                                        }
                                        else{
                                            var convertedCost = 0;
                                        }
            
                                        currRecObj.setSublistValue({
                                            sublistId: 'recmachcustrecord_related_food_menu',
                                            fieldId: 'custrecord_customunit',
                                            line: searchLine,
                                            value: convertedCost
                                        });
            
                                        var amountVal = parseFloat(fiResults[i].cusQuantity) * parseFloat(convertedCost)
                                        if(amountVal){
                                            amountVal = amountVal.toFixed(2);
                                        }
                            
                                        currRecObj.setSublistValue({
                                            sublistId: 'recmachcustrecord_related_food_menu',
                                            fieldId: 'custrecord_customamount',
                                            line: searchLine,
                                            value: amountVal
                                        });
            
                                        currRecObj.setSublistValue({
                                            sublistId: 'recmachcustrecord_related_food_menu',
                                            fieldId: 'custrecord_custom_ingdt_category',
                                            line: searchLine,
                                            value: fiResults[i].category
                                        });

                                       
                                        var currentUom = currRecObj .getSublistValue({
                                            sublistId: 'recmachcustrecord_related_food_menu',
                                            fieldId: 'custrecord_uom_c',
                                            line: searchLine
                                        });
                        
                                        var uom_purchase = currRecObj.getSublistValue({
                                            sublistId: 'recmachcustrecord_related_food_menu',
                                            fieldId: 'custrecord_uom_c_purchase',
                                            line: searchLine
                                        });
                                        
                                        var uom_stock = currRecObj.getSublistValue({
                                            sublistId: 'recmachcustrecord_related_food_menu',
                                            fieldId: 'custrecord_uom_c_stock',
                                            line: searchLine
                                        });

                                        var convertedPurchaseQuantity = getConvertedQuantity(fiResults[i].cusQuantity, currentUom, uom_purchase);
                                        currRecObj.setSublistValue({
                                            sublistId: 'recmachcustrecord_related_food_menu',
                                            fieldId: 'custrecord_qty_c_purchase',
                                            line: searchLine,
                                            value: convertedPurchaseQuantity
                                        });
                                        var convertedStockQuantity = getConvertedQuantity(fiResults[i].cusQuantity, currentUom, uom_stock);
                                        currRecObj.setSublistValue({
                                            sublistId: 'recmachcustrecord_related_food_menu',
                                            fieldId: 'custrecord_qty_c_stock',
                                            line: searchLine,
                                            value: convertedStockQuantity
                                        });

                                        currRecObj.setSublistValue({
                                            sublistId: 'recmachcustrecord_related_food_menu',
                                            fieldId: 'custrecord_qty_remaining',
                                            line: searchLine,
                                            value: convertedStockQuantity
                                        });

                                        var qtyRem = currRecObj.getSublistValue({
                                            sublistId: 'recmachcustrecord_related_food_menu',
                                            fieldId: 'custrecord_qty_remaining',
                                            line: searchLine
                                        });

                                        log.debug('qtyRem',qtyRem)

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

			function summarize(summary) {
			
			}

            function getConvertedQuantity(quantity, uom, uom_target){
                if(!quantity || !uom || !uom_target) return null;
        
                var fromUom = getUnitsTypeUom(uom);
                var toUom = getUnitsTypeUom(uom_target);
                var convertedQuantity = quantity * parseFloat(fromUom.conversionrate) / parseFloat(toUom.conversionrate) 
        
                return convertedQuantity;
            }

            function getUnitsTypeUom(id){
                var out;
        
                var results = query.runSuiteQL({query: "SELECT internalid, conversionrate FROM UnitsTypeUom WHERE internalid='"+id+"'"}).asMappedResults()[0];

        
                return results;
            }

			return {
		
				getInputData: getInputData,
				map: map,
				reduce : reduce,
				summarize: summarize,
                getUnitsTypeUom: getUnitsTypeUom,
                getConvertedQuantity: getConvertedQuantity
			};

		});

		

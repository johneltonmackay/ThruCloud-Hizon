/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/record', 'N/search', 'N/runtime', 'N/query'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, runtime, query) => {

        const getInputData = (inputContext) => {
            let arrInputData = []
            try {
                const paramRecId = runtime.getCurrentScript().getParameter({name: 'custscript_recordId_param'})
                const paramRecType = runtime.getCurrentScript().getParameter({name: 'custscript_recordType_param'})
                const paramRecOutlet = runtime.getCurrentScript().getParameter({name: 'custscript_recordOutlet_param'})
                log.debug('getInputData: paramRecId', paramRecId);
                log.debug('getInputData: paramRecType', paramRecType);
                log.debug('getInputData: paramRecOutlet', paramRecOutlet);
                let arrFoodMenuData = getFoodMenuData(paramRecId, paramRecType)
                let objInput = {
                    'recordId': paramRecId,
                    'recordType': paramRecType,
                    'recordOutlet': paramRecOutlet,
                    'foodMenuData': arrFoodMenuData
                }
                arrInputData.push(objInput)
            } catch (error) {
                log.error('getInputData error', error.message)
            }
            return arrInputData
        }

        const map = (mapContext) => {
            // log.debug('map : mapContext', mapContext)
            mapContext.write({
                key: mapContext.key,
                value: JSON.parse(mapContext.value)
            })
        }

        const reduce = (reduceContext) => {
            let objReduceValues = JSON.parse(reduceContext.values)
            log.debug("reduce objReduceValues", objReduceValues)
            let strRecType = objReduceValues.recordType
            let strOutlet = objReduceValues.recordOutlet
            let arrFoodMenuData = objReduceValues.foodMenuData
            
            arrFoodMenuData.forEach(data => {
                let menuCost = data.menuCost
                let currentMenu = data.menu
                let frFieldNoPax = data.recipeNoPax
                let updatePax = data.noPax
                let lineId = data.internalid
                let parentOutlet = strOutlet
                log.debug('reduce data.internalid', data.internalid)
                try {
                    var recordId = record.submitFields({
                        type: 'customrecord_food_menu_fb',
                        id: data.internalid,
                        values: {
                            customrecord_food_menu_fb: data.internalid,
                            custrecord_fm_outlet: strOutlet,
                            // custrecord_menu_cost: menuCost / updatePax
                        },
                        options: {
                            enableSourcing: true,
                            ignoreMandatoryFields : true
                    }});

                    log.debug("recordId" + strRecType, recordId)
    
                    if (recordId){
                        createCustomIngredients(currentMenu, frFieldNoPax, updatePax, lineId, parentOutlet)
                    }
                } catch (error) {
                    log.error('reduce error', error.message)
                }

            });
        }

        const summarize = (summaryContext) => {

        }

        // Private Function

        const getFoodMenuData = (recId, recType) => {
            log.debug('getFoodMenuData recId', recId)
            log.debug('getFoodMenuData recType', recType)
            let arrFoodMenuData = [];
            let filters;
            try {

                if (recType == 'customrecord_costing_sheet') {
                    filters = [
                        ['custrecord_related_topsheet.internalid', 'anyof', JSON.parse(recId)],
                    ];
                } else if (recType == 'customrecord_food_menu_fb'){
                    filters = [
                        ['internalid', 'anyof', JSON.parse(recId)],
                    ];
                } else {
                    filters = [
                        ['custrecord_transaction_fb_food.internalid', 'anyof', JSON.parse(recId)],
                        'AND',
                        ['custrecord_transaction_fb_food.mainline', 'is', 'T']
                    ];
                }
                
                let objItemSearch = search.create({
                    type: 'customrecord_food_menu_fb',
                    filters: filters,
                    columns: [
                        search.createColumn({ name: 'internalid' }),
                        search.createColumn({ name: 'custrecord_fcs_menu' }),
                        search.createColumn({ name: 'custrecord_fcs_pax' }),
                        search.createColumn({ name: 'custrecord_fcs_cost_head' }),
                        search.createColumn({ name: 'custrecord_menu_cost' }),
                        search.createColumn({ name: 'custrecord_fcs_price_head' }),
                        search.createColumn({ name: 'custrecord_recipe_no_of_pax', join: 'custrecord_fcs_menu' })
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
                                var menu = pageData[pageResultIndex].getValue({name: 'custrecord_fcs_menu'});
                                var noPax = pageData[pageResultIndex].getValue({name: 'custrecord_fcs_pax'});
                                var costHead = pageData[pageResultIndex].getValue({name: 'custrecord_fcs_cost_head'});
                                var menuCost = pageData[pageResultIndex].getValue({ name: 'custrecord_menu_cost'});
                                var priceHead = pageData[pageResultIndex].getValue({ name: 'custrecord_fcs_price_head'});
                                var recipeNoPax = pageData[pageResultIndex].getValue({ name: 'custrecord_recipe_no_of_pax', join: 'custrecord_fcs_menu' });

                                // Check if recIFId already exists in arrTransaction
                                var existingIndex = arrFoodMenuData.findIndex(item => item.internalid === internalid);
                                if (existingIndex == -1) {
                                    arrFoodMenuData.push({
                                        internalid: internalid,
                                        menu: menu,
                                        noPax: noPax,
                                        costHead: costHead,
                                        menuCost: menuCost,
                                        priceHead: priceHead,
                                        recipeNoPax: recipeNoPax,
                                    });
                                }
                                

                            }
                        }
                    }
                }
            } catch (err) {
                log.error('getFoodMenuData error', err.message);
            }
            log.debug(`getFoodMenuData: arrFoodMenuData ${Object.keys(arrFoodMenuData).length}`, arrFoodMenuData);
            return arrFoodMenuData;
        }

		function createCustomIngredients(currentMenu, frFieldNoPax, updatePax, lineId, parentOutlet) {
			try {

				let arrSubRecipeData = []

				let arrItemData = getItemData()

				let objRecipeData = getRecipe(currentMenu, frFieldNoPax, updatePax)

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
					log.debug('parentOutlet', parentOutlet);
					arrJoinRecipes.forEach((recipe, index) => {
						let itemId = recipe.itemId;
				
						let arrFilteredItems = arrItemData.filter(item => item.outlet === parentOutlet && item.internalid === itemId);
						log.debug('arrFilteredItems', arrFilteredItems);
				
						if (arrFilteredItems.length > 0) {
							let aveCost = arrFilteredItems[0].aveCost;
							let markUp = arrFilteredItems[0].markUp;
                            let availableQty = arrFilteredItems[0].availableQty;
                            let itemClass = arrFilteredItems[0].itemClass;
                            let isPerishable = arrFilteredItems[0].isPerishable;
                            let isCommon = arrFilteredItems[0].isCommon;

							arrJoinRecipes[index].aveCost = aveCost;
							arrJoinRecipes[index].markUp = markUp;
                            arrJoinRecipes[index].availableQty = availableQty;
                            arrJoinRecipes[index].itemClass = itemClass;
                            arrJoinRecipes[index].menuId = currentMenu;
                            arrJoinRecipes[index].isPerishable = isPerishable;
                            arrJoinRecipes[index].isCommon = isCommon;
						} else {
							arrJoinRecipes[index].aveCost = 0;
							arrJoinRecipes[index].markUp = 0;
                            arrJoinRecipes[index].availableQty = 0;
                            arrJoinRecipes[index].itemClass = null;
                            arrJoinRecipes[index].menuId = null;
						}
					});
				} 

				arrJoinRecipes.forEach(data => {

					let convertedCost = 0
					let amountVal = 0

					let objSaleUnit = getUnitsTypeUom(data.saleUnit);
					let objStockUnit = getUnitsTypeUom(data.stockUnit);

					let objLog = {
						data: data,
						objStockUnitConversionrate: objStockUnit.conversionrate,
						objSaleUnitConversionrate: objSaleUnit.conversionrate
					}

					log.debug('createCustomIngredients objLog', objLog)

					if(data.aveCost && objStockUnit.conversionrate && objSaleUnit.conversionrate){
						convertedCost = data.aveCost / (parseFloat(objStockUnit.conversionrate) / parseFloat(objSaleUnit.conversionrate));
					}

					amountVal = parseFloat(data.cusQuantity) * parseFloat(convertedCost)

					if(amountVal){
						amountVal = amountVal.toFixed(2);
					}
					
					let objCustomIngredient = record.create({
						type: 'customrecord_custom_ingdt',
						isDynamic: true
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_related_food_menu',
						value: lineId,
						ignoreFieldChange: true
					});

					objCustomIngredient.setValue({
						fieldId: 'custrecord_hz_outlet',
						value: parentOutlet,
						ignoreFieldChange: true
					});

                    objCustomIngredient.setValue({
						fieldId: 'custrecord_hz_availableqty',
						value: data.availableQty,
						ignoreFieldChange: true
					});

                    objCustomIngredient.setValue({
						fieldId: 'custrecord_item_class',
						value: data.itemClass,
						ignoreFieldChange: true
					});

                    // objCustomIngredient.setValue({
					// 	fieldId: 'custrecord_menu_c',
					// 	value: data.menuId,
					// 	ignoreFieldChange: true
					// });

                    objCustomIngredient.setValue({
						fieldId: 'custrecord_customingdt_perishable',
						value: data.isPerishable ? data.isPerishable : false,
						ignoreFieldChange: true
					});

                    objCustomIngredient.setValue({
						fieldId: 'custrecord_customingdt_commongk', 
						value: data.isCommon ? data.isCommon : false ,
						ignoreFieldChange: true
					});
                    
					objCustomIngredient.setValue({
						fieldId: 'custrecord_ingdt_c',
						value: data.itemId,
						ignoreFieldChange: true
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_qty_c',
						value: data.cusQuantity,
						ignoreFieldChange: true
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_uom_c',
						value: data.uom,
						ignoreFieldChange: true
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_customamount', 
						value: amountVal,
						ignoreFieldChange: true
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_customunit',
						value: convertedCost,
						ignoreFieldChange: true
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_g_kitchen_c',
						value: data.commonItem ? data.commonItem : false,
						ignoreFieldChange: true
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_custom_ingdt_category',
						value: data.category,
						ignoreFieldChange: true
					});

                    objCustomIngredient.setValue({
						fieldId: 'custrecord_customrecipedescription',
						value: data.displayName,
						ignoreFieldChange: true
					});
			
					let convertedPurchaseQuantity = data.cusQuantity * parseFloat(objSaleUnit.conversionrate) / parseFloat(objSaleUnit.conversionrate);
					let convertedStockQuantity = data.cusQuantity * parseFloat(objSaleUnit.conversionrate) / parseFloat(objStockUnit.conversionrate);
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_qty_c_purchase',
						value: convertedPurchaseQuantity ? convertedPurchaseQuantity : 0
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_qty_c_stock',
						value: convertedStockQuantity ? convertedStockQuantity : 0
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_qty_remaining',
						value: convertedStockQuantity ? convertedStockQuantity : 0
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_uom_c_purchase',
						value: data.saleUnit ? data.saleUnit : null
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_uom_c_stock',
						value: data.stockUnit ? data.stockUnit : null
					});
			
					let recId = objCustomIngredient.save({
						enableSourcing: true,
						ignoreMandatoryFields: true
					});
			
					log.debug("recordId customrecord_custom_ingdt", recId);
				});
			} catch (error) {
				log.error('createCustomIngredients error', error.message)
			}
		}
		
        function getRecipe(recipe, frFieldNoPax, updatePax) {
            let arrRecipeLineData = []
            let arrSubRecipeLineData = []
            let arrRecipe = [];
            try {
                let objRecipeSearch = search.create({
                    type: 'customrecord_food_recipe_lines',
                    filters: [
                        ['custrecord_recipe_parent.internalid', 'anyof', recipe],
                        'AND',
                        ['custrecord_recipe_ingredients_itemcode.isinactive', 'is', 'F'],
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
						search.createColumn({ name: 'custrecord_ingredients_amount' }), // Start
						search.createColumn({ name: 'custrecord_common_item' }),
						search.createColumn({ name: 'custrecord_ingredients_unit_cost' }),
						search.createColumn({ name: 'custrecord_unit_of_measure_ingredients' }),
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

								var amount = pageData[pageResultIndex].getValue({ name: 'custrecord_ingredients_amount' });
								var commonItem = pageData[pageResultIndex].getValue({ name: 'custrecord_common_item' });
								var unitCost = pageData[pageResultIndex].getValue({ name: 'custrecord_ingredients_unit_cost' });
								var uom = pageData[pageResultIndex].getValue({ name: 'custrecord_unit_of_measure_ingredients' });

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
									"subRecipe" : subRecipe,
									"amount" : amount,
									"commonItem" : commonItem,
									"unitCost" : unitCost,
									"uom" : uom
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
                        search.createColumn({ name: 'locationquantityavailable' }),
                        search.createColumn({ name: 'internalid', join: 'custitem_item_class' }),
                        search.createColumn({ name: 'custitem_tc_perishableitem' }),
                        search.createColumn({ name: 'custitem_common_item' }),
                        
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
                                var availableQty = pageData[pageResultIndex].getValue({name: 'locationquantityavailable'});
                                var markUp = pageData[pageResultIndex].getValue({ name: 'custrecord_itemclass_markup', join: 'custitem_item_class'});
                                var itemClass = pageData[pageResultIndex].getValue({ name: 'internalid', join: 'custitem_item_class' });
                                var isPerishable = pageData[pageResultIndex].getValue({ name: 'custitem_tc_perishableitem' });
                                var isCommon = pageData[pageResultIndex].getValue({ name: 'custitem_common_item' });

                                arrItemData.push({
                                    internalid: internalid,
                                    itemCode: itemCode,
                                    outlet: outlet,
                                    aveCost: aveCost,
                                    markUp: markUp,
                                    availableQty: availableQty,
                                    itemClass: itemClass,
                                    isPerishable: isPerishable,
                                    isCommon: isCommon
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

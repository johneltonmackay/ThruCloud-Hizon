/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', '../SuiteScripts/customized_ingredient_handler.js', 'N/query'],

	function(record, search, CustomizedIngredientHandler, query) {


		function afterSubmit(scriptContext) {
			try {
				var recType = scriptContext.newRecord.type
				log.debug({
					title: 'Record type: ',
					details: recType
				});
				var recId = scriptContext.newRecord.id
				if (recType == 'customrecord760') {
					var recLine = scriptContext.newRecord.getLineCount({
						sublistId: 'recmachcustrecord_topsheet_menu'
					})

					log.debug({
						title: 'Line Count: ',
						details: recLine
					})

					var customrecord760SearchObj = search.create({
						type: "customrecord760",
						filters: [
							["internalid", "anyof", recId]
						],
						columns: [
							search.createColumn({
								name: "custrecord_fcs_menu",
								join: "CUSTRECORD_TOPSHEET_MENU",
								sort: search.Sort.ASC,
								label: "Menu"
							}),
							search.createColumn({
								name: "internalid",
								join: "CUSTRECORD_TOPSHEET_MENU",
								label: "Internal ID"
							}),
							search.createColumn({
								name: "custrecord_topsheet_menu",
								join: "CUSTRECORD_TOPSHEET_MENU",
								label: "Related Topsheet"
							})
						]
					});
					var searchResultCount = customrecord760SearchObj.runPaged().count;
					log.debug("customrecord760SearchObj result count", searchResultCount);
					if (recLine != 0) {
						customrecord760SearchObj.run().each(function(result) {
							var lineId = result.getValue({
								name: 'internalid',
								join: 'CUSTRECORD_TOPSHEET_MENU'
							})


							var rec = record.load({
								type: 'customrecord_food_menu_fb',
								id: lineId

							})

							var lineCount = rec.getLineCount({
								sublistId: 'recmachcustrecord_related_food_menu'
							})

							if (lineCount == 0) {
								var sublistId = 'recmachcustrecord_recipe_parent';

								var currentMenu = rec.getValue({
									fieldId: 'custrecord_fcs_menu'
								})

								log.debug({
									title: 'Current Menu: ',
									details: currentMenu
								})

								var recipe = record.load({
									type: 'customrecord_food_recipes',
									id: currentMenu,
									isDynamic: true
								})

								var sublists = recipe.getSublists({
									sublistId: sublistId
								});

								var currentRecipe = recipe.getLineCount({
									sublistId: sublistId
								})

								var ItemCode = 'custrecord_recipe_ingredients_itemcode';
								var Description = 'custrecord_recipeingredients_description';
								var Quantity = 'custrecord_recipe_ingredients_quantity';
								var UnitOfMeasure = 'custrecord_unit_of_measure_ingredients';
								var UnitCost = 'custrecord_ingredients_unit_cost';
								var Amount = 'custrecord_ingredients_amount';
								var Claimer = 'custrecord_ingredients_claimer';
								var CommonItem = 'custrecord_common_item';
								var IngredientCategory = 'custrecord_ingdt_category';

								var customIngredient = record.create({
									type: 'customrecord_custom_ingdt',
									isDynamic: true
								})

								for (var i = 0; i < currentRecipe; i++) {
									customIngredient.setValue({
										fieldId: 'custrecord_related_food_menu',
										value: lineId
									})

									var getItemCode = recipe.getSublistValue({
										sublistId: sublistId,
										fieldId: ItemCode,
										line: i
									});

									customIngredient.setValue({
										fieldId: 'custrecord_ingdt_c',
										value: getItemCode
									})

									var getDescription = recipe.getSublistValue({
										sublistId: sublistId,
										fieldId: Description,
										line: i
									});

									customIngredient.setValue({
										fieldId: 'custrecord_customrecipedescription',
										value: getDescription
									})

									var getQuantity = recipe.getSublistValue({
										sublistId: sublistId,
										fieldId: Quantity,
										line: i
									});

									customIngredient.setValue({
										fieldId: 'custrecord_qty_c',
										value: getQuantity
									})

									var getUnitOfMeasure = recipe.getSublistValue({
										sublistId: sublistId,
										fieldId: UnitOfMeasure,
										line: i
									});

									customIngredient.setValue({
										fieldId: 'custrecord_uom_c',
										value: getUnitOfMeasure
									})

									var getUnitCost = recipe.getSublistValue({
										sublistId: sublistId,
										fieldId: UnitCost,
										line: i
									});

									customIngredient.setValue({
										fieldId: 'custrecord_customunit',
										value: getUnitCost
									})

									var getAmount = recipe.getSublistValue({
										sublistId: sublistId,
										fieldId: Amount,
										line: i
									});

									customIngredient.setValue({
										fieldId: 'custrecord_customamount',
										value: getAmount
									});

									var createdIngredient = customIngredient.save();
									log.debug('Added new custom ingredient: ', 'ID: ' + createdIngredient)
								}


							}


							// .run().each has a limit of 4,000 results
							return true;
						});
					}

				} //end if recType = Topsheet

				if (recType == 'customrecord_costing_sheet') {
					log.debug({
						title: 'Enter',
						details: '-Entry-'
					})
					var recLine = scriptContext.newRecord.getLineCount({
						sublistId: 'recmachcustrecord_related_topsheet'
					})

					var handler = new CustomizedIngredientHandler()
					var parentOutlet = scriptContext.newRecord.getValue({
						fieldId: 'custrecord_tc_costingsheet_location'
					})

					log.debug({
						title: 'Line Count: ',
						details: recLine
					})
					var customrecord_costing_sheetSearchObj = search.create({
						type: "customrecord_costing_sheet",
						filters: [
							["internalid", "anyof", recId]
						],
						columns: [
							search.createColumn({
								name: "custrecord_fcs_menu",
								join: "CUSTRECORD_RELATED_TOPSHEET",
								label: "Menu"
							}),
							search.createColumn({
								name: "internalid",
								join: "CUSTRECORD_RELATED_TOPSHEET",
								label: "Internal ID"
							}),
							search.createColumn({
								name: "custrecord_related_topsheet",
								join: "CUSTRECORD_RELATED_TOPSHEET",
								label: "Related Food Costing Sheet"
							})
						]
					});
					var searchResultCount = customrecord_costing_sheetSearchObj.runPaged().count;
					log.debug("customrecord_costing_sheetSearchObj result count", searchResultCount);
					if (recLine != 0) {
						customrecord_costing_sheetSearchObj.run().each(function(result) {
							var lineId = result.getValue({
								name: 'internalid',
								join: 'CUSTRECORD_RELATED_TOPSHEET'
							})

							log.debug('topsheet/proposal id', lineId)

							var rec = record.load({
								type: 'customrecord_food_menu_fb',
								id: lineId

							})

							var lineCount = rec.getLineCount({
								sublistId: 'recmachcustrecord_related_food_menu'
							})

							rec.setValue({
								fieldId: 'custrecord_fm_outlet',
								value: parentOutlet
							})

							rec.setValue({
								fieldId: 'custrecord_food_menu_id',
								value: lineId
							});

							let updatePax = rec.getValue({
								fieldId: 'custrecord_fcs_pax',
							});

							
							if (lineCount == 0) {

								var currentMenu = rec.getValue({
									fieldId: 'custrecord_fcs_menu'
								})

								log.debug({
									title: 'Current Menu: ',
									details: currentMenu
								})

								let frField = search.lookupFields({
									type: 'customrecord_food_recipes',
									id: currentMenu,
									columns: ['custrecord_recipe_no_of_pax']
								});
								
								let frFieldNoPax = frField.custrecord_recipe_no_of_pax ? frField.custrecord_recipe_no_of_pax : 0

								createCustomIngredients(currentMenu, frFieldNoPax, updatePax, lineId, parentOutlet)

							}
							let recordId = rec.save({
                                enableSourcing: true,
                                ignoreMandatoryFields: true
                            });
                            log.debug("recordId" + recType, recordId)
							// .run().each has a limit of 4,000 results
							return true;
						});
					}
				}

				if (recType == 'estimate') {
					log.debug({
						title: 'Enter',
						details: '-Entry on estimate-'
					});

					var recLine = scriptContext.newRecord.getLineCount({
						sublistId: 'recmachcustrecord_transaction_fb_food'
					});

					var handler = new CustomizedIngredientHandler()
					var parentOutlet = scriptContext.newRecord.getValue({
						fieldId: 'custbody_outlet_proposal'
					})

					log.debug({
						title: 'Line Count: ',
						details: recLine
					});

					var estimateSearchObj = search.create({
						type: "estimate",
						filters: [
							["internalid", "anyof", recId]
						],
						columns: [
							search.createColumn({
								name: "custrecord_fcs_menu",
								join: "custrecord_transaction_fb_food",
								label: "Menu"
							}),
							search.createColumn({
								name: "internalid",
								join: "custrecord_transaction_fb_food",
								label: "Internal ID"
							}),
							search.createColumn({
								name: "custrecord_transaction_fb_food",
								join: "custrecord_transaction_fb_food",
								label: "Related Transaction"
							})
						]
					});
					var searchResultCount = estimateSearchObj.runPaged().count;
					log.debug("estimateSearchObj result count", searchResultCount);
					if (recLine != 0) {
						estimateSearchObj.run().each(function(result) {
							var lineId = result.getValue({
								name: 'internalid',
								join: 'custrecord_transaction_fb_food'
							});

							log.debug('Food Menu ID', lineId)

							var rec = record.load({
								type: 'customrecord_food_menu_fb',
								id: lineId
							});

							rec.setValue({
								fieldId: 'custrecord_fm_outlet',
								value: parentOutlet
							});

							rec.setValue({
								fieldId: 'custrecord_food_menu_id',
								value: lineId
							});

							let updatePax = rec.getValue({
								fieldId: 'custrecord_fcs_pax',
							});

							

							var lineCount = rec.getLineCount({
								sublistId: 'recmachcustrecord_related_food_menu'
							});

							///TODO: XXXXXX

							if (lineCount == 0) {

								var currentMenu = rec.getValue({
									fieldId: 'custrecord_fcs_menu'
								})

								log.debug({
									title: 'Current Menu: ',
									details: currentMenu
								})

								let frField = search.lookupFields({
									type: 'customrecord_food_recipes',
									id: currentMenu,
									columns: ['custrecord_recipe_no_of_pax']
								});
								
								let frFieldNoPax = frField.custrecord_recipe_no_of_pax ? frField.custrecord_recipe_no_of_pax : 0

								createCustomIngredients(currentMenu, frFieldNoPax, updatePax, lineId, parentOutlet)

							}

							let recordId = rec.save({
                                enableSourcing: true,
                                ignoreMandatoryFields: true
                            });
                            log.debug("recordId" + recType, recordId)
							// .run().each has a limit of 4,000 results
							return true;
						});
					}
				}

			} catch (e) {
				log.error({
					title: 'Error',
					details: e
				})
			}
		}

        //PRIVATE FUNCTION

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
							arrJoinRecipes[index].aveCost = aveCost;
							arrJoinRecipes[index].markUp = markUp;
						} else {
							arrJoinRecipes[index].aveCost = 0;
							arrJoinRecipes[index].markUp = 0;
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
						value: data.commonItem,
						ignoreFieldChange: true
					});
			
					objCustomIngredient.setValue({
						fieldId: 'custrecord_custom_ingdt_category',
						value: data.category,
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
			afterSubmit: afterSubmit
		};

	});
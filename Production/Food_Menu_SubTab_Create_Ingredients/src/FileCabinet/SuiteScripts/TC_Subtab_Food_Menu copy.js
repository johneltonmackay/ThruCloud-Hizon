/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', '../SuiteScripts/customized_ingredient_handler.js'],

	function(record, search, CustomizedIngredientHandler) {


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

									customIngredient.setValue({
										fieldId: 'custrecord_hz_outlet',
										value: parentOutlet
									})

									var getItemCode = recipe.getSublistValue({
										sublistId: sublistId,
										fieldId: ItemCode,
										line: i
									});

									var getCategory = recipe.getSublistValue({
										sublistId: sublistId,
										fieldId: IngredientCategory,
										line: i
									})

									customIngredient.setValue({
										fieldId: 'custrecord_custom_ingdt_category',
										value: getCategory
									})


									var itemSearchObj = search.create({
										type: "item",
										filters: [
											["internalid", "anyof", getItemCode]
										],
										columns: [
											search.createColumn({
												name: "type",
												label: "Type"
											}),
											search.createColumn({
												name: "internalid",
												label: "Internal ID"
											})
										]
									});
									var searchResultCount = itemSearchObj.runPaged().count;
									var itemType
									itemSearchObj.run().each(function(result) {
										itemType = result.getValue({
											name: 'type'
										})
										return true;
									});

									if (itemType != 'NonInvtPart') {
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
										})

										handler.setUnitCost(customIngredient)

										var createdIngredient = customIngredient.save();
										log.debug('Added new custom ingredient: ', 'ID: ' + createdIngredient)

									}
									if (itemType == 'NonInvtPart') {
										var getNonItemCode = recipe.getSublistValue({
											sublistId: sublistId,
											fieldId: ItemCode,
											line: i
										})

										log.debug({
											title: 'getNonItemCode',
											details: getNonItemCode
										})

										var arrSubRecipeId = getRecipeID(getNonItemCode)

										var subRecipeRec = record.load({
											type: 'customrecord_food_recipes',
											id: arrSubRecipeId
										})

										var subRecipeLineCount = subRecipeRec.getLineCount({
											sublistId: 'recmachcustrecord_recipe_parent'
										})

										for (var da = 0; da < subRecipeLineCount; da++) {
											customIngredient.setValue({
												fieldId: 'custrecord_related_food_menu',
												value: lineId
											})

											var getSubItemCode = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: ItemCode,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_ingdt_c',
												value: getSubItemCode
											})

											var getSubDescription = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: Description,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_customrecipedescription',
												value: getSubDescription
											})

											var getSubQuantity = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: Quantity,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_qty_c',
												value: getSubQuantity
											})

											var getSubUnitOfMeasure = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: UnitOfMeasure,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_uom_c',
												value: getSubUnitOfMeasure
											})

											var getSubUnitCost = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: UnitCost,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_customunit',
												value: getSubUnitCost
											})

											var getSubAmount = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: Amount,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_customamount',
												value: getSubAmount
											})

											handler.setUnitCost(customIngredient)

											var createdSubIngredient = customIngredient.save();
											log.debug({
												title: 'Added new custom ingredient: ID:',
												details: createdSubIngredient
											})
										}

									}
								}
							}
							rec.save();
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

							var lineCount = rec.getLineCount({
								sublistId: 'recmachcustrecord_related_food_menu'
							});

							rec.setValue({
								fieldId: 'custrecord_fm_outlet',
								value: parentOutlet
							});

							rec.setValue({
								fieldId: 'custrecord_food_menu_id',
								value: lineId
							});

							///TODO: XXXXXX

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

									customIngredient.setValue({
										fieldId: 'custrecord_hz_outlet',
										value: parentOutlet
									})

									var getItemCode = recipe.getSublistValue({
										sublistId: sublistId,
										fieldId: ItemCode,
										line: i
									});

									var getCategory = recipe.getSublistValue({
										sublistId: sublistId,
										fieldId: IngredientCategory,
										line: i
									})

									customIngredient.setValue({
										fieldId: 'custrecord_custom_ingdt_category',
										value: getCategory
									})


									var itemSearchObj = search.create({
										type: "item",
										filters: [
											["internalid", "anyof", getItemCode]
										],
										columns: [
											search.createColumn({
												name: "type",
												label: "Type"
											}),
											search.createColumn({
												name: "internalid",
												label: "Internal ID"
											})
										]
									});
									var searchResultCount = itemSearchObj.runPaged().count;
									var itemType
									itemSearchObj.run().each(function(result) {
										itemType = result.getValue({
											name: 'type'
										})
										return true;
									});
									log.debug('itemType', itemType)	
									if (itemType != 'NonInvtPart') {
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
										})

										handler.setUnitCost(customIngredient)

										var createdIngredient = customIngredient.save();
										log.debug('Added new custom ingredient: ', 'ID: ' + createdIngredient)

									}
									if (itemType == 'NonInvtPart') {
										var getNonItemCode = recipe.getSublistValue({
											sublistId: sublistId,
											fieldId: ItemCode,
											line: i
										})

										log.debug({
											title: 'getNonItemCode',
											details: getNonItemCode
										})

										var arrSubRecipeId = getRecipeID(getNonItemCode)

										var subRecipeRec = record.load({
											type: 'customrecord_food_recipes',
											id: arrSubRecipeId[0]
										})

										var subRecipeLineCount = subRecipeRec.getLineCount({
											sublistId: 'recmachcustrecord_recipe_parent'
										})

										for (var da = 0; da < subRecipeLineCount; da++) {
											customIngredient.setValue({
												fieldId: 'custrecord_related_food_menu',
												value: lineId
											})

											var getSubItemCode = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: ItemCode,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_ingdt_c',
												value: getSubItemCode
											})

											var getSubDescription = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: Description,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_customrecipedescription',
												value: getSubDescription
											})

											var getSubQuantity = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: Quantity,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_qty_c',
												value: getSubQuantity
											})

											var getSubUnitOfMeasure = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: UnitOfMeasure,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_uom_c',
												value: getSubUnitOfMeasure
											})

											var getSubUnitCost = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: UnitCost,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_customunit',
												value: getSubUnitCost
											})

											var getSubAmount = subRecipeRec.getSublistValue({
												sublistId: sublistId,
												fieldId: Amount,
												line: da
											});

											customIngredient.setValue({
												fieldId: 'custrecord_customamount',
												value: getSubAmount
											})

											handler.setUnitCost(customIngredient)

											var createdSubIngredient = customIngredient.save();
											log.debug({
												title: 'Added new custom ingredient: ID:',
												details: createdSubIngredient
											})
										}

									}
								}
							}
							rec.save();
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

		// Private Function

		function getRecipeID (params) {
			var arrSubRecipe = [];
            try {
                var objRecipeSearch = search.create({
                    type: 'customrecord_food_recipes',
                    filters: [
                        ['custrecord_recipeitemcode.internalid', 'anyof', params],
                      ],
                    columns: [
                        search.createColumn({ name: 'internalid' }),
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
                                // Check if recId already exists in arrSubRecipe
								arrSubRecipe.push(recId);	
                            }
                        }
                    }
                }
                return arrSubRecipe;
            } catch (err) {
                log.error('getSubRecipe error', err.message);
            }
		}

		return {
			afterSubmit: afterSubmit
		};

	});
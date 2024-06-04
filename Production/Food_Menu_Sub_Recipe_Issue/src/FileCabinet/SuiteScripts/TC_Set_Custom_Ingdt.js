/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/search', 'N/record'],

function(currentRecord, search, record) {
    
    function fieldChanged(scriptContext) {
		var fieldId = scriptContext.fieldId
		var currentRec = scriptContext.currentRecord
		let arrRecipeLineData = []
		let arrSubRecipeLineData = []
			if(fieldId=='custrecord_fcs_menu')
			{
				try{
				var menuId = currentRec.getValue({
					fieldId:'custrecord_fcs_menu'
				})
				log.debug({title: 'Menu:',details: menuId})
				if(menuId!=''){
					var checkList = currentRec.getLineCount({
						sublistId: 'recmachcustrecord_related_food_menu'
					})
					log.debug({title:'line ct',details:checkList})
					console.log({title:'checkList',checkList})
					if(checkList!=0){
						var count = checkList - 1
						for(var o=count; o>=0; o--){
							log.debug({title:'iterate',details:o})
							currentRec.removeLine({
								sublistId: 'recmachcustrecord_related_food_menu',
								line: o
							})
						}
					}
					else{	
						var customrecord_food_recipesSearchObj = search.create({
						   type: "customrecord_food_recipes",
						   filters:
						   [
							  ["internalid","anyof",menuId]
						   ],
						   columns:
						   [
							  search.createColumn({
								 name: "custrecord_recipe_ingredients_itemcode",
								 join: "CUSTRECORD_RECIPE_PARENT",
								 label: "Item Code"
							  }),
							  search.createColumn({
								 name: "custrecord_recipe_ingredients_quantity",
								 join: "CUSTRECORD_RECIPE_PARENT",
								 label: "Quantity"
							  }),
							  search.createColumn({
								 name: "custrecord_unit_of_measure_ingredients",
								 join: "CUSTRECORD_RECIPE_PARENT",
								 label: "Unit of Measure (U/M)"
							  }),
							  search.createColumn({
								 name: "custrecord_ingredients_unit_cost",
								 join: "CUSTRECORD_RECIPE_PARENT",
								 label: "Unit Cost"
							  }),
							  search.createColumn({
								 name: "custrecord_ingredients_amount",
								 join: "CUSTRECORD_RECIPE_PARENT",
								 label: "Amount"
							  }),
							  search.createColumn({
								 name: "custrecord_common_item",
								 join: "CUSTRECORD_RECIPE_PARENT",
								 label: "Common Item"
							  }),
							  search.createColumn({
								 name: "custrecord_ingredients_claimer",
								 join: "CUSTRECORD_RECIPE_PARENT",
								 label: "Claimer"
							  }),
							  search.createColumn({
								 name: "custrecord_foodrecipe_subrecipe",
								 join: "CUSTRECORD_RECIPE_PARENT",
								 label: "Sub-Recipe"
							  })
						   ]
						});
						
						var searchResultCount = customrecord_food_recipesSearchObj.runPaged().count;
						log.debug("customrecord_food_recipesSearchObj result count",searchResultCount);

						customrecord_food_recipesSearchObj.run().each(function(result){						
							let objRecipeLineData = {
								recItemCode: result.getValue({
									name: "custrecord_recipe_ingredients_itemcode",
									join: "CUSTRECORD_RECIPE_PARENT"
								}),
								recQty: result.getValue({
									name: "custrecord_recipe_ingredients_quantity",
									join: "CUSTRECORD_RECIPE_PARENT"
								}),
								recUom: result.getValue({
									name: "custrecord_unit_of_measure_ingredients",
									join: "CUSTRECORD_RECIPE_PARENT"
								}),
								recUnitCost: result.getValue({
									name: "custrecord_ingredients_unit_cost",
									join: "CUSTRECORD_RECIPE_PARENT"
								}),
								recAmount: result.getValue({
									name: "custrecord_ingredients_amount",
									join: "CUSTRECORD_RECIPE_PARENT"
								}),
								recCommonItem: result.getValue({
									name: "custrecord_common_item",
									join: "CUSTRECORD_RECIPE_PARENT"
								}),
								custrecord_foodrecipe_subrecipe: result.getValue({
									name: "custrecord_foodrecipe_subrecipe",
									join: "CUSTRECORD_RECIPE_PARENT"
								}),
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
						console.log('arrRecipeLineData', arrRecipeLineData)
						console.log('arrSubRecipeLineData', arrSubRecipeLineData)
					}
					if (arrSubRecipeLineData.length > 0){
						let arrSubRecipe = getSubRecipe(arrSubRecipeLineData)
						let arrCustomIngredients = [...arrSubRecipe, ...arrRecipeLineData];
						console.log('arrCustomIngredients', arrCustomIngredients)

						arrCustomIngredients.forEach(data => {
							currentRec.selectNewLine({
								sublistId:'recmachcustrecord_related_food_menu'
							})
							currentRec.setCurrentSublistValue({
								sublistId:'recmachcustrecord_related_food_menu',
								fieldId: 'custrecord_ingdt_c',
								value: data.recItemCode,
								ignoreFieldChange: true
							})
							currentRec.setCurrentSublistValue({
								sublistId:'recmachcustrecord_related_food_menu',
								fieldId: 'custrecord_qty_c',
								value: data.recQty,
								ignoreFieldChange: true
							})
							currentRec.setCurrentSublistValue({
								sublistId:'recmachcustrecord_related_food_menu',
								fieldId: 'custrecord_uom_c',
								value: data.recUom,
								ignoreFieldChange: true
							})
							currentRec.setCurrentSublistValue({
								sublistId:'recmachcustrecord_related_food_menu',
								fieldId: 'custrecord_customamount',
								value: data.recAmount,
								ignoreFieldChange: true
							})
							currentRec.setCurrentSublistValue({
								sublistId:'recmachcustrecord_related_food_menu',
								fieldId: 'custrecord_customunit',
								value: data.recUnitCost,
								ignoreFieldChange: true
							})
							currentRec.setCurrentSublistValue({
								sublistId:'recmachcustrecord_related_food_menu',
								fieldId: 'custrecord_g_kitchen_c',
								value: data.recCommonItem,
								ignoreFieldChange: true
							})
							currentRec.commitLine({
								sublistId: 'recmachcustrecord_related_food_menu'
							})
						});
					}
				}
			}catch(e){
				log.error({title:'Error',details:e})
			}
		}
    }

	// private

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
			log.debug(`getSubRecipe: arrTransaction ${Object.keys(arrSubRecipe).length}`, arrSubRecipe);
			return arrSubRecipe;
		} catch (err) {
			log.error('getSubRecipe error', err.message);
		}
	}
    return {
        fieldChanged: fieldChanged
    };
    
});

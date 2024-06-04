/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([
	'N/ui/dialog',
	'../common/tc_constants', 
	'../app/tc_proposed_price_calculator',
	'../app/tc_net_price_rate_update_handler',
	'../app/tc_manpower_requirement_handler'
], function(
	dialog,
	Constant, 
	ProposedPriceCalculator,
	NetPriceRateUpdateHandler,
	ManpowerRequirementHandler
) {

	function pageInit(scriptContext){
		var currentRec = scriptContext.currentRecord;
	}
	
	function fieldChanged(scriptContext) {
		var sublistId = scriptContext.sublistId;
		var fieldId = scriptContext.fieldId;
		var currentRec = scriptContext.currentRecord;

		//console.log('fieldId: '+fieldId);

		try {
			if(sublistId == 'recmachcustrecord_manpower_related_transaction'){
				setBanquetTypeField(currentRec);
			}

			calculateValuesOnNetPriceChange(fieldId, currentRec);
			calculateProposedPrice(fieldId, currentRec);
		} catch(e) {
			console.log('Banquet Management CS | fieldChanged | ERROR:'+e);
		}
	}

	/*
		If there are UI changes on the 
		net price rate fields
	*/
	function calculateValuesOnNetPriceChange(fieldId, currentRec){
		var netPriceRateUpdateHandler = new NetPriceRateUpdateHandler();
		netPriceRateUpdateHandler.updateRelatedFields({
			currentRec: currentRec,
			netPriceRateField: fieldId
		});
	}

	/*
		If there are UI changes on the 
		checkboxes (with service incentive, mobilization fee), 
		and adjusted price
	*/
	function calculateProposedPrice(fieldId, currentRec) {

		/* Banquet Type 1 */
		var fields_bqt1_option1_base = [
				Constant.fields.BanquetType_1.Option_1.ADJUSTED_PRICE,
				Constant.fields.BanquetType_1.Option_1.WITH_SERVICE_INCENTIVE,
				Constant.fields.BanquetType_1.Option_1.WITH_MOBILIZATION_FEE
			];
		var fields_bqt1_option1_addon = [
				Constant.fields.BanquetType_1.Option_1.ADD_ON_ADJUSTED_PRICE,
				Constant.fields.BanquetType_1.Option_1.ADD_ON_WITH_SERVICE_INCENTIVE,
				Constant.fields.BanquetType_1.Option_1.ADD_ON_WITH_MOBILIZATION_FEE
			];
		var fields_bqt1_option2_base = [
				Constant.fields.BanquetType_1.Option_2.ADJUSTED_PRICE,
				Constant.fields.BanquetType_1.Option_2.WITH_SERVICE_INCENTIVE,
				Constant.fields.BanquetType_1.Option_2.WITH_MOBILIZATION_FEE
			];
		var fields_bqt1_option2_addon = [
				Constant.fields.BanquetType_1.Option_2.ADD_ON_ADJUSTED_PRICE,
				Constant.fields.BanquetType_1.Option_2.ADD_ON_WITH_SERVICE_INCENTIVE,
				Constant.fields.BanquetType_1.Option_2.ADD_ON_WITH_MOBILIZATION_FEE
			];
		var fields_bqt1_option3_base = [
				Constant.fields.BanquetType_1.Option_3.ADJUSTED_PRICE,
				Constant.fields.BanquetType_1.Option_3.WITH_SERVICE_INCENTIVE,
				Constant.fields.BanquetType_1.Option_3.WITH_MOBILIZATION_FEE
			];
		var fields_bqt1_option3_addon = [
				Constant.fields.BanquetType_1.Option_3.ADD_ON_ADJUSTED_PRICE,
				Constant.fields.BanquetType_1.Option_3.ADD_ON_WITH_SERVICE_INCENTIVE,
				Constant.fields.BanquetType_1.Option_3.ADD_ON_WITH_MOBILIZATION_FEE
			];

		/* Banquet Type 2 */
		var fields_bqt2_option1_base = [
				Constant.fields.BanquetType_2.Option_1.ADJUSTED_PRICE
			];
		var fields_bqt2_option1_addon_with_mp = [
				Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_ADJUSTED_PRICE
			];
		var fields_bqt2_option1_addon_without_mp = [
				Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE
			];
		var fields_bqt2_option2_base = [
				Constant.fields.BanquetType_2.Option_2.ADJUSTED_PRICE
			];
		var fields_bqt2_option2_addon_with_mp = [
				Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_ADJUSTED_PRICE
			];
		var fields_bqt2_option2_addon_without_mp = [
				Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE
			];
		var fields_bqt2_option3_base = [
				Constant.fields.BanquetType_2.Option_3.ADJUSTED_PRICE
			];
		var fields_bqt2_option3_addon_with_mp = [
				Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_ADJUSTED_PRICE
			];
		var fields_bqt2_option3_addon_without_mp = [
				Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE
			];

		/* Banquet Type 3 */
		// Only the proposed price fields are editable

		/********************/
		var proPriceCalculator = new ProposedPriceCalculator();

		/* Banquet Type 1 - Option 1 */
		if(fields_bqt1_option1_base.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType1({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_1,
				costingStructure: 'base'
			});
		}
		if(fields_bqt1_option1_addon.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType1({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_1,
				costingStructure: 'addon'
			});
		}

		/* Banquet Type 1 - Option 2 */
		if(fields_bqt1_option2_base.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType1({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_2,
				costingStructure: 'base'
			});
		}
		if(fields_bqt1_option2_addon.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType1({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_2,
				costingStructure: 'addon'
			});
		}

		/* Banquet Type 1 - Option 3 */
		if(fields_bqt1_option3_base.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType1({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_3,
				costingStructure: 'base'
			});
		}
		if(fields_bqt1_option3_addon.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType1({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_3,
				costingStructure: 'addon'
			});
		}

		/* Banquet Type 2 - Option 1 */
		if(fields_bqt2_option1_base.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType2({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_1,
				costingStructure: 'base'
			});
		}
		if(fields_bqt2_option1_addon_with_mp.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType2({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_1,
				costingStructure: 'addon_with_mp'
			});
		}
		if(fields_bqt2_option1_addon_without_mp.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType2({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_1,
				costingStructure: 'addon_without_mp'
			});
		}

		/* Banquet Type 2 - Option 2 */
		if(fields_bqt2_option2_base.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType2({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_2,
				costingStructure: 'base'
			});
		}
		if(fields_bqt2_option2_addon_with_mp.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType2({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_2,
				costingStructure: 'addon_with_mp'
			});
		}
		if(fields_bqt2_option2_addon_without_mp.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType2({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_2,
				costingStructure: 'addon_without_mp'
			});
		}

		/* Banquet Type 2 - Option 3 */
		if(fields_bqt2_option3_base.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType2({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_3,
				costingStructure: 'base'
			});
		}
		if(fields_bqt2_option3_addon_with_mp.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType2({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_3,
				costingStructure: 'addon_with_mp'
			});
		}
		if(fields_bqt2_option3_addon_without_mp.indexOf(fieldId) != -1){
			proPriceCalculator.calculateProposedPriceForBanquetType2({
				currentRec: currentRec,
				option: Constant.foodOption.OPTION_3,
				costingStructure: 'addon_without_mp'
			});
		}

	}

	function sublistChanged(scriptContext) {
		var sublistId = scriptContext.sublistId;
		var currentRec = scriptContext.currentRecord;

		try {
			if (sublistId == 'recmachcustrecord_transactionmanpowerref') {
				updateManpowerTotalCost(currentRec);
			}

			if(sublistId == 'recmachcustrecord_manpower_related_transaction'){
				updateManpowerRequirementSublist(currentRec);
			}
		}catch(e){
			console.log(e);
		}
	}

	function validateLine(scriptContext){
		var sublistId = scriptContext.sublistId;
		var currentRec = scriptContext.currentRecord;

		console.log('sublistId: '+sublistId);
		try {
			if (sublistId == 'recmachcustrecord_transaction_fb_food') {
				var isValidFoodMenuCostingStructure = validateSelectedFoodMenuCostingStructure(currentRec);

				if(!isValidFoodMenuCostingStructure){
					dialog.alert({
					    title: 'Invalid Costing Structure',
					    message: 'The selected costing structure is not applicable to the Outlet/Banquet Type.'
					});
					//alert('The selected costing structure is applicable to the Outlet/Banquet Type.')
				}

				return isValidFoodMenuCostingStructure;

			} else if (sublistId == 'recmachcustrecord_transactionmanpowerref') {
				var isValidManpowerReqCostingStructure = validateSelectedManpowerReqCostingStructure(currentRec);

				if(!isValidManpowerReqCostingStructure){
					dialog.alert({
					    title: 'Invalid Costing Structure',
					    message: 'The selected costing structure is not applicable to the Outlet/Banquet Type.'
					});
					//alert('The selected costing structure is applicable to the Outlet/Banquet Type.')
				}

				return isValidManpowerReqCostingStructure;
			}
		}catch(e){
			console.log(e);
		}

		return true;
	}

	function validateSelectedManpowerReqCostingStructure(currentRec){
		var isValid = false;
		var banquetType = getBanquetType(currentRec);
		var costingStructures = [];

		var rowCostingStructure = currentRec.getCurrentSublistValue({
			sublistId: 'recmachcustrecord_transactionmanpowerref',
			fieldId: 'custrecord_mr_costing_structure'
		});

		console.log('rowCostingStructure: '+rowCostingStructure);

		if(!rowCostingStructure) return true;

		if (Constant.banquetType.BANQUET_TYPE_1 == banquetType) {
            costingStructures = Constant.banquetTypeManpowerReqCostingStructures.BANQUET_TYPE_1;
        } else if (Constant.banquetType.BANQUET_TYPE_2 == banquetType) {
            costingStructures = Constant.banquetTypeManpowerReqCostingStructures.BANQUET_TYPE_2;
        } else if (Constant.banquetType.BANQUET_TYPE_3 == banquetType) {
            costingStructures = Constant.banquetTypeManpowerReqCostingStructures.BANQUET_TYPE_3;
        }

        console.log('costingStructures: '+costingStructures);

        if(costingStructures.indexOf(parseInt(rowCostingStructure)) > -1){
        	isValid = true;
        }

		return isValid;
	}

	function validateSelectedFoodMenuCostingStructure(currentRec){
		var isValid = false;
		var banquetType = getBanquetType(currentRec);
		var costingStructures = [];
		
		var rowCostingStructure = currentRec.getCurrentSublistValue({
			sublistId: 'recmachcustrecord_transaction_fb_food',
			fieldId: 'custrecord_costing_structure'
		});

		console.log('XXXX rowCostingStructure: '+rowCostingStructure);

		if (Constant.banquetType.BANQUET_TYPE_1 == banquetType) {
            costingStructures = Constant.banquetTypeCostingStructures.BANQUET_TYPE_1;
        } else if (Constant.banquetType.BANQUET_TYPE_2 == banquetType) {
            costingStructures = Constant.banquetTypeCostingStructures.BANQUET_TYPE_2;
        } else if (Constant.banquetType.BANQUET_TYPE_3 == banquetType) {
            costingStructures = Constant.banquetTypeCostingStructures.BANQUET_TYPE_3;
        }

        console.log('XXXX costingStructures: '+costingStructures);

        if(costingStructures.indexOf(parseInt(rowCostingStructure)) > -1){
        	isValid = true;
        }

        return isValid;
	}

	function updateManpowerTotalCost(currentRec) {
		var totalManpowerCost = 0;
		var unitCost;
		var requiredQuantity;

		var manpowerReqLineCount = currentRec.getLineCount({
            sublistId: 'recmachcustrecord_transactionmanpowerref'
        });

        for(var i = 0; i < manpowerReqLineCount; i++){
        	unitCost = currentRec.getSublistValue({
        		sublistId: 'recmachcustrecord_transactionmanpowerref',
        		fieldId: 'custrecord_manpower_cost',
        		line: i
        	}) || 0;
        	requiredQuantity = currentRec.getSublistValue({
        		sublistId: 'recmachcustrecord_transactionmanpowerref',
        		fieldId: 'custrecord_manpower_requirement_qty',
        		line: i
        	}) || 0;
        	totalManpowerCost += (unitCost * requiredQuantity);
        }

        currentRec.setValue({
        	fieldId: 'custbody_manpowertotalcost',
        	value: totalManpowerCost
        });

        currentRec.setValue({
        	fieldId: 'custbody_manpower_total_cost_stored',
        	value: totalManpowerCost
        });
	}


	function getBanquetType(currentRec){
		var banquetType;
		var outlet = currentRec.getValue({fieldId: 'custbody_outlet_proposal'});
		const banquet_type_from_field = currentRec.getValue({fieldId: 'custbody_banquet_type_beo'});

		console.log('XXXX outlet: '+outlet);
		console.log('XXXX banquet_type_from_field: '+banquet_type_from_field);
		console.log('XXXX typeof banquet_type_from_field: '+typeof banquet_type_from_field);

		if(!outlet){
			return banquetType;
		}

		/*
		var BanquetType1_OutletGroup = Constant.outletGroup.BANQUET_TYPE_1;
		var BanquetType2_OutletGroup = Constant.outletGroup.BANQUET_TYPE_2;
		var BanquetType3_OutletGroup = Constant.outletGroup.BANQUET_TYPE_3;
		var banquetType;

		if (BanquetType1_OutletGroup.indexOf(parseInt(outlet)) > -1) {
			banquetType = Constant.foodMasterLevel.BANQUET_TYPE_1;
		} else if (BanquetType2_OutletGroup.indexOf(parseInt(outlet)) > -1) {
			banquetType = Constant.foodMasterLevel.BANQUET_TYPE_2;
		} else if (BanquetType3_OutletGroup.indexOf(parseInt(outlet)) > -1) {
			banquetType = Constant.foodMasterLevel.BANQUET_TYPE_3;
		}*/

		if (banquet_type_from_field == Constant.banquetTypeOnOutlet.BANQUET_TYPE_1) {
			banquetType = Constant.foodMasterLevel.BANQUET_TYPE_1;
		} else if (banquet_type_from_field == Constant.banquetTypeOnOutlet.BANQUET_TYPE_2) {
			banquetType = Constant.foodMasterLevel.BANQUET_TYPE_2;
		} else if (banquet_type_from_field == Constant.banquetTypeOnOutlet.BANQUET_TYPE_3) {
			banquetType = Constant.foodMasterLevel.BANQUET_TYPE_3;
		}

		console.log('XXXX banquetType: '+banquetType);

		return banquetType;
	}

	function updateManpowerRequirementSublist(currentRec){
		var manpowerRecipeId = currentRec.getCurrentSublistValue({
			sublistId: 'recmachcustrecord_manpower_related_transaction',
			fieldId:'custrecord_manpowercode'
		});
		const manpowerReqHandler = new ManpowerRequirementHandler();
		const manpowerRequirementValues = manpowerReqHandler.getManpowerRequirementValuesByManpowerCodeId(manpowerRecipeId);
		manpowerReqHandler.setManpowerRequirementSublistValuesCurrentRecord(currentRec, manpowerRequirementValues);
	}

	function setBanquetTypeField(currentRec){
		var banquetType = getBanquetType(currentRec);

		var manpowerBanquetType = currentRec.getCurrentSublistValue({
			sublistId: 'recmachcustrecord_manpower_related_transaction',
			fieldId:'custrecord_banquet_type_tran_manpower'
		});
		//console.log('manpowerBanquetType: '+manpowerBanquetType);
		if(manpowerBanquetType == banquetType){
			return;
		}
		
		currentRec.setCurrentSublistValue({
			sublistId: 'recmachcustrecord_manpower_related_transaction',
			fieldId: 'custrecord_banquet_type_tran_manpower',
			value: parseInt(banquetType),
			ignoreFieldChange: true
		});

	}

	return {
		pageInit: pageInit,
		fieldChanged: fieldChanged,
		sublistChanged: sublistChanged,
		validateLine: validateLine
	};
	
});

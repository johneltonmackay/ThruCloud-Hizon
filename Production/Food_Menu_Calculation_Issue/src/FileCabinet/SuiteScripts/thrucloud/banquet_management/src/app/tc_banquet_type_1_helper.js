/**
 * @NApiVersion 2.1
 *
 */

define([
    'N/log',
    '../common/tc_constants'
    ], function(
    log,
    Constant
) {

    var _newRecord;
    var _commonDelegate;

    function BanquetType_1_Helper(newRecord) {
        this.name = 'BanquetType_1_Helper';
    }

    // BASE MENU - GET ADJUSTED PRICE
    // TODO: getAddOnAdjustedPrice and getBaseAdjustedPrice can be replaced by AdjustedPrice 
    BanquetType_1_Helper.prototype.getBaseAdjustedPrice = function(_newRecord, foodOption) {
        var adjustedPrice;

        if (foodOption == Constant.foodOption.OPTION_1) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.ADJUSTED_PRICE
            });
        }

        return adjustedPrice;
    }

    // BASE MENU - INCLUDE SERVICE INCENTIVE
    BanquetType_1_Helper.prototype.includeServiceIncentive = function(_newRecord, foodOption) {
        var withServiceIncentive = false;

        if (foodOption == Constant.foodOption.OPTION_1) {
            withServiceIncentive = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.WITH_SERVICE_INCENTIVE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2) {
            withServiceIncentive = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.WITH_SERVICE_INCENTIVE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3) {
            withServiceIncentive = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.WITH_SERVICE_INCENTIVE
            });
        }

        return withServiceIncentive;
    }

    // BASE MENU - INCLUDE MOBILIZATION FEE
    BanquetType_1_Helper.prototype.includeMobilizationFee = function(_newRecord, foodOption) {
        var withMobilizationFee = false;

        if (foodOption == Constant.foodOption.OPTION_1) {
            withMobilizationFee = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.WITH_MOBILIZATION_FEE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2) {
            withMobilizationFee = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.WITH_MOBILIZATION_FEE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3) {
            withMobilizationFee = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.WITH_MOBILIZATION_FEE
            });
        }

        return withMobilizationFee;
    }

    // ADDON - GET ADJUSTED PRICE
    BanquetType_1_Helper.prototype.getAddOnAdjustedPrice = function(_newRecord, foodOption) {
        var adjustedPrice;

        if (foodOption == Constant.foodOption.OPTION_1) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.ADD_ON_ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.ADD_ON_ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.ADD_ON_ADJUSTED_PRICE
            });
        }

        return adjustedPrice;
    }

    // ADDON - INCLUDE SERVICE INCENTIVE
    BanquetType_1_Helper.prototype.includeAddOnServiceIncentive = function(_newRecord, foodOption) {
        var withServiceCharge = false;

        if (foodOption == Constant.foodOption.OPTION_1) {
            withServiceCharge = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.ADD_ON_WITH_SERVICE_INCENTIVE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2) {
            withServiceCharge = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.ADD_ON_WITH_SERVICE_INCENTIVE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3) {
            withServiceCharge = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.ADD_ON_WITH_SERVICE_INCENTIVE
            });
        }

        return withServiceCharge;
    }

    // ADDON MENU - INCLUDE MOBILIZATION FEE
    BanquetType_1_Helper.prototype.includeAddOnMobilizationFee = function(_newRecord, foodOption) {
        var withMobilizationFee = false;

        if (foodOption == Constant.foodOption.OPTION_1) {
            withMobilizationFee = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.ADD_ON_WITH_MOBILIZATION_FEE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2) {
            withMobilizationFee = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.ADD_ON_WITH_MOBILIZATION_FEE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3) {
            withMobilizationFee = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.ADD_ON_WITH_MOBILIZATION_FEE
            });
        }

        return withMobilizationFee;
    }

    BanquetType_1_Helper.prototype.adjustProposedPrice = function(params) {
    	var adjustedProposedPrice = 0;
        var wSvcIncentive = params.withServiceIncentive;
        var wMobilFee = params.withMobilizationFee;
        var initialPrice = params.initialPrice;

        var svcIncentive = (initialPrice/1.12) * 0.1;
        var mobilFee = ((initialPrice/1.12) * 0.1) * 1.12;

        log.error('adjustProposedPrice | svcIncentive', svcIncentive);
        log.error('adjustProposedPrice | mobilFee', mobilFee);

        // if w/ service incentive
        if((wSvcIncentive == true || wSvcIncentive == 'T') && (wMobilFee == false || wMobilFee == 'F')){
        	//adjustedProposedPrice = initialPrice + svcIncentive;
            adjustedProposedPrice = ((initialPrice/1.12) + svcIncentive) * 1.12;
        } else 

        // if w/ mobilization fee
        if((wSvcIncentive == false || wSvcIncentive == 'F') && (wMobilFee == true || wMobilFee == 'T')){
        	//adjustedProposedPrice = initialPrice + mobilFee;
            adjustedProposedPrice = ((initialPrice/1.12) + mobilFee) * 1.12;
        } else 

        // if w/ both
        if((wSvcIncentive == true || wSvcIncentive == 'T') && (wMobilFee == true || wMobilFee == 'T')){
        	//adjustedProposedPrice = initialPrice + svcIncentive + mobilFee;
            adjustedProposedPrice = ((initialPrice/1.12) + svcIncentive + mobilFee) * 1.12;
        } else {
            adjustedProposedPrice = initialPrice;
        }

        return adjustedProposedPrice;

    }

    BanquetType_1_Helper.prototype.getCalculatedPrice = function(_newRecord, foodOption, costingStructure) {
        var calculatedPrice;

        console.log('getCalculatedPrice | costingStructure: '+costingStructure);
        console.log('getCalculatedPrice | foodOption: '+foodOption);

        if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'base') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.CALC_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'addon') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.ADD_ON_CALC_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'base') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.CALC_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'addon') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.ADD_ON_CALC_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'base') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.CALC_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'addon') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.ADD_ON_CALC_PRICE
            });
        } 

        return calculatedPrice;
    }

    BanquetType_1_Helper.prototype.getAdjustedPrice = function(_newRecord, foodOption, costingStructure) {
        var adjustedPrice;

        if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'base') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'addon') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.ADD_ON_ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'base') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'addon') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.ADD_ON_ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'base') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'addon') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.ADD_ON_ADJUSTED_PRICE
            });
        } 

        return adjustedPrice;
    }

    BanquetType_1_Helper.prototype.setProposedPrice = function(rec, foodOption, costingStructure, proposedPrice) {

        if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'base') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.PROPOSED_PRICE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'addon') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_1.Option_1.ADD_ON_PROPOSED_PRICE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'base') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.PROPOSED_PRICE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'addon') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_1.Option_2.ADD_ON_PROPOSED_PRICE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'base') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.PROPOSED_PRICE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'addon') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_1.Option_3.ADD_ON_PROPOSED_PRICE,
                value: proposedPrice
            });
        } 
    }



    return BanquetType_1_Helper;

});

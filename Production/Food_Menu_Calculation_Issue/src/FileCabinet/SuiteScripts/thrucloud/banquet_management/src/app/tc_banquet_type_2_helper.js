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

    function BanquetType_2_Helper(newRecord) {
        this.name = 'BanquetType_2_Helper';
    }

    // BASE MENU - GET ADJUSTED PRICE
    BanquetType_2_Helper.prototype.getBaseAdjustedPrice = function(_newRecord, foodOption) {
        var adjustedPrice;

        if (foodOption == Constant.foodOption.OPTION_1) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADJUSTED_PRICE
            });
        }

        return adjustedPrice;
    }


    // ADDON WITH MANPOWER - GET ADJUSTED PRICE
    BanquetType_2_Helper.prototype.getAddOnWithManpowerAdjustedPrice = function(_newRecord, foodOption){
        var adjustedPrice;

        if (foodOption == Constant.foodOption.OPTION_1) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_ADJUSTED_PRICE
            });
        }

        return adjustedPrice;
    }

    // ADDON WITHOUT MANPOWER - GET ADJUSTED PRICE
    BanquetType_2_Helper.prototype.getAddOnWithoutManpowerAdjustedPrice = function(_newRecord, foodOption){
        var adjustedPrice;

        if (foodOption == Constant.foodOption.OPTION_1) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3) {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE
            });
        }

        return adjustedPrice;
    }

    BanquetType_2_Helper.prototype.getCalculatedPrice = function(_newRecord, foodOption, costingStructure) {
        var calculatedPrice;

        console.log('getCalculatedPrice | costingStructure: '+costingStructure);
        console.log('getCalculatedPrice | foodOption: '+foodOption);

        if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'base') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.CALC_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'addon_with_mp') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_CALC_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'addon_without_mp') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_CALC_PRICE
            });


        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'base') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.CALC_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'addon_with_mp') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_CALC_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'addon_without_mp') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_CALC_PRICE
            });


        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'base') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.CALC_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'addon_with_mp') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_CALC_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'addon_without_mp') {
            calculatedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_CALC_PRICE
            });
        } 

        return calculatedPrice;
    }

    BanquetType_2_Helper.prototype.getAdjustedPrice = function(_newRecord, foodOption, costingStructure) {
        var adjustedPrice;

        if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'base') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'addon_with_mp') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'addon_without_mp') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE
            });


        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'base') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'addon_with_mp') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'addon_without_mp') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE
            });


        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'base') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'addon_with_mp') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_ADJUSTED_PRICE
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'addon_without_mp') {
            adjustedPrice = _newRecord.getValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE
            });
        }

        return adjustedPrice;
    }

    BanquetType_2_Helper.prototype.setProposedPrice = function(rec, foodOption, costingStructure, proposedPrice) {

        if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'base') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.PROPOSED_PRICE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'addon_with_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_PROPOSED_PRICE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'addon_without_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_PROPOSED_PRICE,
                value: proposedPrice
            });


        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'base') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.PROPOSED_PRICE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'addon_with_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_PROPOSED_PRICE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'addon_without_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_PROPOSED_PRICE,
                value: proposedPrice
            });

            
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'base') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.PROPOSED_PRICE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'addon_with_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_PROPOSED_PRICE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'addon_without_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_PROPOSED_PRICE,
                value: proposedPrice
            });
        } 
    }

    BanquetType_2_Helper.prototype.setServiceCharge = function(rec, foodOption, costingStructure, proposedPrice) {

        if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'base') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.SERVICE_CHARGE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'addon_with_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_SERVICE_CHARGE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_1 && costingStructure == 'addon_without_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_SERVICE_CHARGE,
                value: proposedPrice
            });


        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'base') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.SERVICE_CHARGE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'addon_with_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_SERVICE_CHARGE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_2 && costingStructure == 'addon_without_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_SERVICE_CHARGE,
                value: proposedPrice
            });

            
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'base') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.SERVICE_CHARGE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'addon_with_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_SERVICE_CHARGE,
                value: proposedPrice
            });
        } else if (foodOption == Constant.foodOption.OPTION_3 && costingStructure == 'addon_without_mp') {
            rec.setValue({
                fieldId: Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_SERVICE_CHARGE,
                value: proposedPrice
            });
        } 
    }


    return BanquetType_2_Helper;

});

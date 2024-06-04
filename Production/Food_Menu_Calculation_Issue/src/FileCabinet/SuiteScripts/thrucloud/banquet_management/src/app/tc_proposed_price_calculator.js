/**
 * @NApiVersion 2.1
 *
 */

define([
    'N/log',
    '../common/tc_constants',
    '../app/tc_banquet_type_1_helper',
    '../app/tc_banquet_type_2_helper'
    ], function(
    log,
    Constant,
    BanquetType_1_Helper,
    BanquetType_2_Helper
) {

    var _helperType1;
    var _helperType2;

    function ProposedPriceCalculator() {
        this.name = 'ProposedPriceCalculator';
        _helperType1 = new BanquetType_1_Helper();
        _helperType2 = new BanquetType_2_Helper();
    }

    ProposedPriceCalculator.prototype.calculateProposedPriceForBanquetType1 = function(params) {
        var currentRec = params.currentRec;
        var option = params.option;
        var costingStructure = params.costingStructure;

        var calculatedPrice = _helperType1.getCalculatedPrice(currentRec, option, costingStructure);
        var adjustedPrice = _helperType1.getAdjustedPrice(currentRec, option, costingStructure);

        console.log('calculatedPrice: '+calculatedPrice);
        console.log('adjustedPrice: '+adjustedPrice);

        var proposedPrice = calculatedPrice;
        if (adjustedPrice) {
            proposedPrice = adjustedPrice;
        }

        var withServiceIncentive;
        var withMobilizationFee

        if(costingStructure == 'base'){
            withServiceIncentive = _helperType1.includeServiceIncentive(currentRec, option);
            withMobilizationFee = _helperType1.includeMobilizationFee(currentRec, option);
        }else if(costingStructure == 'addon'){
            withServiceIncentive = _helperType1.includeAddOnServiceIncentive(currentRec, option);
            withMobilizationFee = _helperType1.includeAddOnMobilizationFee(currentRec, option);
        }

        console.log('withServiceIncentive: '+withServiceIncentive);
        console.log('withMobilizationFee: '+withMobilizationFee);


        proposedPrice = _helperType1.adjustProposedPrice({
            withServiceIncentive: withServiceIncentive,
            withMobilizationFee: withMobilizationFee,
            initialPrice: proposedPrice
        });

        console.log('proposedPrice: '+proposedPrice);

        _helperType1.setProposedPrice(currentRec, option, costingStructure, proposedPrice);
    }

    ProposedPriceCalculator.prototype.calculateProposedPriceForBanquetType2 = function(params) {
        var currentRec = params.currentRec;
        var option = params.option;
        var costingStructure = params.costingStructure;

        var calculatedPrice = _helperType2.getCalculatedPrice(currentRec, option, costingStructure);
        var adjustedPrice = _helperType2.getAdjustedPrice(currentRec, option, costingStructure);

        console.log('calculatedPrice: '+calculatedPrice);
        console.log('adjustedPrice: '+adjustedPrice);

        var proposedPrice = calculatedPrice;
        if (adjustedPrice) {
            proposedPrice = adjustedPrice;
        }

        var serviceCharge = (proposedPrice/1.12) * 0.1;
        proposedPrice = proposedPrice + serviceCharge;

        _helperType2.setServiceCharge(currentRec, option, costingStructure, serviceCharge);
        _helperType2.setProposedPrice(currentRec, option, costingStructure, proposedPrice);
    }

    return ProposedPriceCalculator;

});

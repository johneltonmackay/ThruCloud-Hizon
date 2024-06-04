/**
 * @NApiVersion 2.1
 *
 */

define([
    'N/log',
    '../common/tc_constants',
    '../app/tc_banquet_type_1_helper',
    '../app/tc_banquet_type_common_delegate'
    ], function(
    log,
    Constant,
    BanquetType_1_Helper,
    BanquetType_Common_Delegate
) {

    var _newRecord;
    var _oldRecord;
    var _commonDelegate;
    var _helper;

    function BanquetType_1_Delegate(newRecord, oldRecord) {
        this.name = 'BanquetType_1_Delegate';
        _newRecord = newRecord;
        _oldRecord = oldRecord;
        _commonDelegate = new BanquetType_Common_Delegate();
        _helper = new BanquetType_1_Helper();
    }


    function calculateValuesPerFoodOption(params){
        var foodCostValues = params.foodCostValues;
        var floralCostValues = params.floralCostValues;
        var laborCostValues = params.laborCostValues;
        var foodOption = params.foodOption;
        var netPriceRateBase = params.netPriceRateBase ? params.netPriceRateBase/100 : 0; 
        var netPriceRateAddOn = params.netPriceRateAddOn? params.netPriceRateAddOn/100 : 0;

        var ret = {};
        var optionFoodCost = foodCostValues[foodOption];


        /* BASE */
        ret.foodCost = optionFoodCost? optionFoodCost[Constant.costingStructure.BASE_MENU] : 0;
        ret.productionAllowance = ret.foodCost * 0.05;
        ret.laborCost = laborCostValues['baseMenu'] || 0;
        ret.floralCost = floralCostValues;
        ret.floralCostMarkUp = ret.floralCost * 0.1;
        ret.cogs = ret.foodCost + ret.productionAllowance + ret.laborCost;
        ret.netPriceAmount = ret.cogs/netPriceRateBase;
        ret.netPriceWithFloral = ret.netPriceAmount + ret.floralCost + ret.floralCostMarkUp;
        ret.localTaxesAllowance = (ret.netPriceAmount + ret.floralCost + ret.floralCostMarkUp) * 0.02;
        ret.vat = (ret.netPriceWithFloral + ret.localTaxesAllowance) * Constant.VAT_RATE;
        ret.calculatedPrice = ret.netPriceWithFloral + ret.localTaxesAllowance + ret.vat;
        ret.proposedPrice = ret.calculatedPrice;
        ret.adjustedPrice = _helper.getBaseAdjustedPrice(_newRecord, foodOption);
        log.error('ret.adjustedPrice', ret.adjustedPrice);
        if (ret.adjustedPrice) {
            ret.proposedPrice = ret.adjustedPrice;
        }

        var withServiceIncentive = _helper.includeServiceIncentive(_newRecord, foodOption);
        var withMobilizationFee = _helper.includeMobilizationFee(_newRecord, foodOption);
        ret.proposedPrice = _helper.adjustProposedPrice({
            withServiceIncentive: withServiceIncentive,
            withMobilizationFee: withMobilizationFee,
            initialPrice: ret.proposedPrice
        });

        /* ADD-ON */
        ret.addOn_foodCost = optionFoodCost? optionFoodCost[Constant.costingStructure.T1_STATION_ADD_ON] : 0;
        ret.addOn_productionAllowance = ret.addOn_foodCost * 0.05;
        ret.addOn_cogs = ret.addOn_foodCost + ret.addOn_productionAllowance;
        ret.addOn_netPriceAmount = ret.addOn_cogs/netPriceRateAddOn;
        ret.addOn_localTaxesAllowance = ret.addOn_netPriceAmount * 0.02;
        ret.addOn_vat = (ret.addOn_netPriceAmount + ret.addOn_localTaxesAllowance) * Constant.VAT_RATE;
        ret.addOn_calculatedPrice = ret.addOn_netPriceAmount + ret.addOn_localTaxesAllowance + ret.addOn_vat;
        ret.addOn_proposedPrice = ret.addOn_calculatedPrice;
        ret.addOn_adjustedPrice = _helper.getAddOnAdjustedPrice(_newRecord, foodOption);
        log.error('ret.addOn_adjustedPrice', ret.addOn_adjustedPrice);
        if (ret.addOn_adjustedPrice) {
            ret.addOn_proposedPrice = ret.addOn_adjustedPrice;
        }

        var withAddOnServiceIncentive = _helper.includeAddOnServiceIncentive(_newRecord, foodOption);
        var withAddOnMobilizationFee = _helper.includeAddOnMobilizationFee(_newRecord, foodOption);
        ret.addOn_proposedPrice = _helper.adjustProposedPrice({
            withServiceIncentive: withAddOnServiceIncentive,
            withMobilizationFee: withAddOnMobilizationFee,
            initialPrice: ret.addOn_proposedPrice
        });

        return ret;

    }

    BanquetType_1_Delegate.prototype.set = function() {
        //var selectedOption = _newRecord.getValue({fieldId: 'custbody_tc_option_filter'});
        //log.error('BanquetType_1_Delegate.set | selectedOption', selectedOption);

        var foodCostValues = _commonDelegate.getFoodCost(_newRecord);
        var laborCostValues = _commonDelegate.getLaborCost(_newRecord);
        var floralCostValues = _commonDelegate.getFloralCost(_newRecord);

        var option_1_val = calculateValuesPerFoodOption({
            foodCostValues: foodCostValues, 
            floralCostValues: floralCostValues, 
            laborCostValues: laborCostValues, 
            foodOption: Constant.foodOption.OPTION_1,
            netPriceRateBase: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_1.Option_1.BASE_NET_PRICE_RATE}),
            netPriceRateAddOn: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_1.Option_1.ADD_ON_NET_PRICE_RATE})
        });
        var option_2_val = calculateValuesPerFoodOption({
            foodCostValues: foodCostValues, 
            floralCostValues: floralCostValues, 
            laborCostValues: laborCostValues, 
            foodOption: Constant.foodOption.OPTION_2,
            netPriceRateBase: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_1.Option_2.BASE_NET_PRICE_RATE}),
            netPriceRateAddOn: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_1.Option_2.ADD_ON_NET_PRICE_RATE})
        });
        var option_3_val = calculateValuesPerFoodOption({
            foodCostValues: foodCostValues, 
            floralCostValues: floralCostValues, 
            laborCostValues: laborCostValues, 
            foodOption: Constant.foodOption.OPTION_3,
            netPriceRateBase: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_1.Option_3.BASE_NET_PRICE_RATE}),
            netPriceRateAddOn: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_1.Option_3.ADD_ON_NET_PRICE_RATE})
        });
        
        var fieldValues = {};
        var Fields = Constant.fields.BanquetType_1;

        //if (selectedOption == Constant.foodOption.OPTION_1) {
            /* OPTION 1 */
            fieldValues[Fields.Option_1.FOOD_COST] =                option_1_val.foodCost; 
            fieldValues[Fields.Option_1.PRODUCTION_ALLOWANCE] =     option_1_val.productionAllowance;
            fieldValues[Fields.Option_1.LABOR_COST] =               option_1_val.laborCost;
            fieldValues[Fields.Option_1.FLORAL_COST] =              option_1_val.floralCost;
            fieldValues[Fields.Option_1.FLORAL_COST_MARKUP] =       option_1_val.floralCostMarkUp;
            fieldValues[Fields.Option_1.COGS] =                     option_1_val.cogs;
            fieldValues[Fields.Option_1.NET_PRICE_AMOUNT] =         option_1_val.netPriceAmount;
            fieldValues[Fields.Option_1.NET_PRICE_WITH_FLORAL] =    option_1_val.netPriceWithFloral;
            fieldValues[Fields.Option_1.LOCAL_TAX_ALLOWANCE] =      option_1_val.localTaxesAllowance;
            fieldValues[Fields.Option_1.VAT] =                      option_1_val.vat;
            fieldValues[Fields.Option_1.CALC_PRICE] =               option_1_val.calculatedPrice;
            fieldValues[Fields.Option_1.PROPOSED_PRICE] =           option_1_val.proposedPrice;
            
            fieldValues[Fields.Option_1.ADD_ON_FOOD_COST] =             option_1_val.addOn_foodCost;
            fieldValues[Fields.Option_1.ADD_ON_PRODUCTION_ALLOWANCE] =  option_1_val.addOn_productionAllowance;
            fieldValues[Fields.Option_1.ADD_ON_COGS] =                  option_1_val.addOn_cogs;
            fieldValues[Fields.Option_1.ADD_ON_NET_PRICE_AMOUNT] =      option_1_val.addOn_netPriceAmount;
            fieldValues[Fields.Option_1.ADD_ON_LOCAL_TAX_ALLOWANCE] =   option_1_val.addOn_localTaxesAllowance;
            fieldValues[Fields.Option_1.ADD_ON_VAT] =                   option_1_val.addOn_vat;
            fieldValues[Fields.Option_1.ADD_ON_CALC_PRICE] =            option_1_val.addOn_calculatedPrice;
            fieldValues[Fields.Option_1.ADD_ON_PROPOSED_PRICE] =        option_1_val.addOn_proposedPrice;

            log.error('option_1_val.proposedPrice', option_1_val.proposedPrice);
        
        //} else if (selectedOption == Constant.foodOption.OPTION_2) {
            
            /* OPTION 2 */
            fieldValues[Fields.Option_2.FOOD_COST] =                option_2_val.foodCost;
            fieldValues[Fields.Option_2.PRODUCTION_ALLOWANCE] =     option_2_val.productionAllowance;
            fieldValues[Fields.Option_2.LABOR_COST] =               option_2_val.laborCost;
            fieldValues[Fields.Option_2.FLORAL_COST] =              option_2_val.floralCost;
            fieldValues[Fields.Option_2.FLORAL_COST_MARKUP] =       option_2_val.floralCostMarkUp;
            fieldValues[Fields.Option_2.COGS] =                     option_2_val.cogs;
            fieldValues[Fields.Option_2.NET_PRICE_AMOUNT] =         option_2_val.netPriceAmount;
            fieldValues[Fields.Option_2.NET_PRICE_WITH_FLORAL] =    option_2_val.netPriceWithFloral;
            fieldValues[Fields.Option_2.LOCAL_TAX_ALLOWANCE] =      option_2_val.localTaxesAllowance;
            fieldValues[Fields.Option_2.VAT] =                      option_2_val.vat;
            fieldValues[Fields.Option_2.CALC_PRICE] =               option_2_val.calculatedPrice;
            fieldValues[Fields.Option_2.PROPOSED_PRICE] =           option_2_val.proposedPrice;
            
            fieldValues[Fields.Option_2.ADD_ON_FOOD_COST] =             option_2_val.addOn_foodCost;
            fieldValues[Fields.Option_2.ADD_ON_PRODUCTION_ALLOWANCE] =  option_2_val.addOn_productionAllowance;
            fieldValues[Fields.Option_2.ADD_ON_COGS] =                  option_2_val.addOn_cogs;
            fieldValues[Fields.Option_2.ADD_ON_NET_PRICE_AMOUNT] =      option_2_val.addOn_netPriceAmount;
            fieldValues[Fields.Option_2.ADD_ON_LOCAL_TAX_ALLOWANCE] =   option_2_val.addOn_localTaxesAllowance;
            fieldValues[Fields.Option_2.ADD_ON_VAT] =                   option_2_val.addOn_vat;
            fieldValues[Fields.Option_2.ADD_ON_CALC_PRICE] =            option_2_val.addOn_calculatedPrice;
            fieldValues[Fields.Option_2.ADD_ON_PROPOSED_PRICE] =        option_2_val.addOn_proposedPrice;

            log.error('option_2_val.proposedPrice', option_2_val.proposedPrice);

        //} else if (selectedOption == Constant.foodOption.OPTION_3) {

            /* OPTION 3 */
            fieldValues[Fields.Option_3.FOOD_COST] =                option_3_val.foodCost;
            fieldValues[Fields.Option_3.PRODUCTION_ALLOWANCE] =     option_3_val.productionAllowance;
            fieldValues[Fields.Option_3.LABOR_COST] =               option_3_val.laborCost;
            fieldValues[Fields.Option_3.FLORAL_COST] =              option_3_val.floralCost;
            fieldValues[Fields.Option_3.FLORAL_COST_MARKUP] =       option_3_val.floralCostMarkUp;
            fieldValues[Fields.Option_3.COGS] =                     option_3_val.cogs;
            fieldValues[Fields.Option_3.NET_PRICE_AMOUNT] =         option_3_val.netPriceAmount;
            fieldValues[Fields.Option_3.NET_PRICE_WITH_FLORAL] =    option_3_val.netPriceWithFloral;
            fieldValues[Fields.Option_3.LOCAL_TAX_ALLOWANCE] =      option_3_val.localTaxesAllowance;
            fieldValues[Fields.Option_3.VAT] =                      option_3_val.vat;
            fieldValues[Fields.Option_3.CALC_PRICE] =               option_3_val.calculatedPrice;
            fieldValues[Fields.Option_3.PROPOSED_PRICE] =           option_3_val.proposedPrice;

            fieldValues[Fields.Option_3.ADD_ON_FOOD_COST] =             option_3_val.addOn_foodCost;
            fieldValues[Fields.Option_3.ADD_ON_PRODUCTION_ALLOWANCE] =  option_3_val.addOn_productionAllowance;
            fieldValues[Fields.Option_3.ADD_ON_COGS] =                  option_3_val.addOn_cogs;
            fieldValues[Fields.Option_3.ADD_ON_NET_PRICE_AMOUNT] =      option_3_val.addOn_netPriceAmount;
            fieldValues[Fields.Option_3.ADD_ON_LOCAL_TAX_ALLOWANCE] =   option_3_val.addOn_localTaxesAllowance;
            fieldValues[Fields.Option_3.ADD_ON_VAT] =                   option_3_val.addOn_vat;
            fieldValues[Fields.Option_3.ADD_ON_CALC_PRICE] =            option_3_val.addOn_calculatedPrice;
            fieldValues[Fields.Option_3.ADD_ON_PROPOSED_PRICE] =        option_3_val.addOn_proposedPrice;

            log.error('option_3_val.proposedPrice', option_3_val.proposedPrice);
        //}

        _commonDelegate.setBanquetCommonFields(_newRecord, _oldRecord, fieldValues);
    }


    return BanquetType_1_Delegate;

});

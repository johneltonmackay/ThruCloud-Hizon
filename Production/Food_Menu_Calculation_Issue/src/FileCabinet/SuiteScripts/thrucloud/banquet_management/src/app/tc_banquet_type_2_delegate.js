/**
 * @NApiVersion 2.1
 *
 */

define([
    'N/log',
    '../common/tc_constants',
    '../app/tc_banquet_type_2_helper',
    '../app/tc_banquet_type_common_delegate'
    ], function(
    log,
    Constant,
    BanquetType_2_Helper,
    BanquetType_Common_Delegate
) {

    var _newRecord;
    var _oldRecord;
    var _commonDelegate;

    function BanquetType_2_Delegate(newRecord, oldRecord) {
        this.name = 'BanquetType_2_Delegate';
        _newRecord = newRecord;
        _oldRecord = oldRecord;
        _commonDelegate = new BanquetType_Common_Delegate();
        _helper = new BanquetType_2_Helper();
    }

    function calculateValuesPerFoodOption(params){
        var foodCostValues = params.foodCostValues;
        var floralCostValues = params.floralCostValues;
        var laborCostValues = params.laborCostValues;
        var foodOption = params.foodOption;
        var netPriceRateBase = params.netPriceRateBase ? params.netPriceRateBase/100 : 0; 
        var netPriceRateAddOnWithMp = params.netPriceRateAddOnWithMp? params.netPriceRateAddOnWithMp/100 : 0;  
        var netPriceRateAddOnWithoutMp = params.netPriceRateAddOnWithoutMp? params.netPriceRateAddOnWithoutMp/100 : 0;  

        var ret = {};
        var optionFoodCost = foodCostValues[foodOption];

        /* BASE */
        ret.foodCost = optionFoodCost? optionFoodCost[Constant.costingStructure.BASE_MENU] : 0;
        ret.productionAllowance = ret.foodCost * 0.05;
        ret.laborCost = laborCostValues['baseMenu'] || 0;
        ret.overTimeAllowance = ret.laborCost * 0.05;
        ret.floralCost = floralCostValues;
        ret.floralCostMarkUp = ret.floralCost * 0.1;
        ret.cogs = ret.foodCost 
                + ret.productionAllowance 
                + ret.laborCost 
                + ret.overTimeAllowance;
        ret.netPriceAmount = ret.cogs/netPriceRateBase;
        ret.netPriceWithFloral = ret.netPriceAmount + ret.floralCost + ret.floralCostMarkUp;
        ret.localTaxesAllowance = ret.netPriceWithFloral * 0.02;
        ret.vat = (ret.netPriceWithFloral + ret.localTaxesAllowance) * 0.12;
        
        ret.calculatedPrice = ret.netPriceAmount + ret.floralCost + ret.floralCostMarkUp + ret.localTaxesAllowance + ret.vat;
        ret.proposedPrice = ret.calculatedPrice;
        ret.adjustedPrice = _helper.getBaseAdjustedPrice(_newRecord, foodOption);
        if (ret.adjustedPrice) {
            ret.proposedPrice = ret.adjustedPrice;
        }
        ret.serviceCharge = (ret.proposedPrice/1.12) * 0.1;
        ret.proposedPrice = ret.proposedPrice + ret.serviceCharge;


        /* ADD-ON WITH MANPOWER */
        ret.addOn_with_mp_foodCost = optionFoodCost? optionFoodCost[Constant.costingStructure.STATION_ADD_ON_WITH_MANPOWER] : 0;
        ret.addOn_with_mp_productionAllowance = ret.addOn_with_mp_foodCost * 0.05;
        ret.addOn_with_mp_laborCost = laborCostValues['stationAddonWithManpower'] || 0;
        ret.addOn_with_mp_overTimeAllowance = ret.addOn_with_mp_laborCost * 0.05;
        ret.addOn_with_mp_cogs = ret.addOn_with_mp_foodCost 
                                + ret.addOn_with_mp_productionAllowance 
                                + ret.addOn_with_mp_laborCost 
                                + ret.addOn_with_mp_overTimeAllowance;
        ret.addOn_with_mp_netPriceAmount = ret.addOn_with_mp_cogs/netPriceRateAddOnWithMp;
        ret.addOn_with_mp_localTaxesAllowance = ret.addOn_with_mp_netPriceAmount * 0.02;
        ret.addOn_with_mp_vat = (ret.addOn_with_mp_netPriceAmount + ret.addOn_with_mp_localTaxesAllowance) * 0.12;
        ret.addOn_with_mp_calculatedPrice = ret.addOn_with_mp_netPriceAmount + ret.addOn_with_mp_localTaxesAllowance + ret.addOn_with_mp_vat;
        ret.addOn_with_mp_proposedPrice = ret.addOn_with_mp_calculatedPrice;
        ret.addOn_with_mp_adjustedPrice = _helper.getAddOnWithManpowerAdjustedPrice(_newRecord, foodOption);
        if(ret.addOn_with_mp_adjustedPrice){
            ret.addOn_with_mp_proposedPrice = ret.addOn_with_mp_adjustedPrice;
        }
        ret.addOn_with_mp_serviceCharge = (ret.addOn_with_mp_proposedPrice/1.12) * 0.1;
        ret.addOn_with_mp_proposedPrice = ret.addOn_with_mp_proposedPrice + ret.addOn_with_mp_serviceCharge;

        /* ADD-ON WITHOUT MANPOWER */
        ret.addOn_without_mp_foodCost = optionFoodCost? optionFoodCost[Constant.costingStructure.STATION_ADD_ON_WITHOUT_MANPOWER] : 0;
        ret.addOn_without_mp_productionAllowance = ret.addOn_without_mp_foodCost * 0.05;
        ret.addOn_without_mp_cogs = ret.addOn_without_mp_foodCost + ret.addOn_without_mp_productionAllowance;
        ret.addOn_without_mp_netPriceAmount = ret.addOn_without_mp_cogs/netPriceRateAddOnWithoutMp;
        ret.addOn_without_mp_localTaxesAllowance = ret.addOn_without_mp_netPriceAmount * 0.02;
        ret.addOn_without_mp_vat = (ret.addOn_without_mp_netPriceAmount + ret.addOn_without_mp_localTaxesAllowance) * 0.12; 
        ret.addOn_without_mp_calculatedPrice = ret.addOn_without_mp_netPriceAmount + ret.addOn_without_mp_localTaxesAllowance + ret.addOn_without_mp_vat;
        ret.addOn_without_mp_proposedPrice = ret.addOn_without_mp_calculatedPrice;
        ret.addOn_without_mp_adjustedPrice = _helper.getAddOnWithoutManpowerAdjustedPrice(_newRecord, foodOption);
        if(ret.addOn_without_mp_adjustedPrice){
            ret.addOn_without_mp_proposedPrice = ret.addOn_without_mp_adjustedPrice;
        }
        ret.addOn_without_mp_serviceCharge = (ret.addOn_without_mp_proposedPrice/1.12) * 0.1;
        ret.addOn_without_mp_proposedPrice = ret.addOn_without_mp_proposedPrice + ret.addOn_without_mp_serviceCharge;


        return ret;
    }

    BanquetType_2_Delegate.prototype.set = function() {
        //var selectedOption = _newRecord.getValue({fieldId: 'custbody_tc_option_filter'});
        var foodCostValues = _commonDelegate.getFoodCost(_newRecord);
        var laborCostValues = _commonDelegate.getLaborCost(_newRecord);
        var floralCostValues = _commonDelegate.getFloralCost(_newRecord);

        var option_1_val = calculateValuesPerFoodOption({
            foodCostValues: foodCostValues, 
            floralCostValues: floralCostValues, 
            laborCostValues: laborCostValues, 
            foodOption: Constant.foodOption.OPTION_1,
            netPriceRateBase: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_2.Option_1.BASE_NET_PRICE_RATE}),
            netPriceRateAddOnWithMp: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_2.Option_1.ADD_ON_WITH_MP_NET_PRICE_RATE}),
            netPriceRateAddOnWithoutMp: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_NET_PRICE_RATE})
        });
        var option_2_val = calculateValuesPerFoodOption({
            foodCostValues: foodCostValues, 
            floralCostValues: floralCostValues, 
            laborCostValues: laborCostValues, 
            foodOption: Constant.foodOption.OPTION_2,
            netPriceRateBase: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_2.Option_2.BASE_NET_PRICE_RATE}),
            netPriceRateAddOnWithMp: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_2.Option_2.ADD_ON_WITH_MP_NET_PRICE_RATE}),
            netPriceRateAddOnWithoutMp: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_NET_PRICE_RATE})
        });
        var option_3_val = calculateValuesPerFoodOption({
            foodCostValues: foodCostValues, 
            floralCostValues: floralCostValues, 
            laborCostValues: laborCostValues, 
            foodOption: Constant.foodOption.OPTION_3,
            netPriceRateBase: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_2.Option_3.BASE_NET_PRICE_RATE}),
            netPriceRateAddOnWithMp: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_2.Option_3.ADD_ON_WITH_MP_NET_PRICE_RATE}),
            netPriceRateAddOnWithoutMp: _newRecord.getValue({fieldId: Constant.netPriceRateFields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_NET_PRICE_RATE})
        });

        
        
        var fieldValues = {};
        var Fields = Constant.fields.BanquetType_2;

        //if (selectedOption == Constant.foodOption.OPTION_1) {
            /* OPTION 1 */
    		fieldValues[Fields.Option_1.FOOD_COST] =                option_1_val.foodCost;
            fieldValues[Fields.Option_1.PRODUCTION_ALLOWANCE] =     option_1_val.productionAllowance;
            fieldValues[Fields.Option_1.LABOR_COST] =               option_1_val.laborCost;
            fieldValues[Fields.Option_1.OVERTIME_ALLOWANCE] =       option_1_val.overTimeAllowance;
            fieldValues[Fields.Option_1.FLORAL_COST] =              option_1_val.floralCost;
            fieldValues[Fields.Option_1.FLORAL_COST_MARKUP] =       option_1_val.floralCostMarkUp;
            fieldValues[Fields.Option_1.COGS] =                     option_1_val.cogs;
            fieldValues[Fields.Option_1.NET_PRICE_AMOUNT] =         option_1_val.netPriceAmount;
            fieldValues[Fields.Option_1.NET_PRICE_WITH_FLORAL] =    option_1_val.netPriceWithFloral;
            fieldValues[Fields.Option_1.LOCAL_TAX_ALLOWANCE] =      option_1_val.localTaxesAllowance;
            fieldValues[Fields.Option_1.SERVICE_CHARGE] =           option_1_val.serviceCharge;
            fieldValues[Fields.Option_1.VAT] =                      option_1_val.vat;
            fieldValues[Fields.Option_1.CALC_PRICE] =               option_1_val.calculatedPrice;
            fieldValues[Fields.Option_1.ADJUSTED_PRICE] =           option_1_val.adjustedPrice;
            fieldValues[Fields.Option_1.PROPOSED_PRICE] =           option_1_val.proposedPrice;
        
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_FOOD_COST] =             option_1_val.addOn_with_mp_foodCost;
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE] =  option_1_val.addOn_with_mp_productionAllowance;
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_LABOR_COST] =            option_1_val.addOn_with_mp_laborCost;
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_OVERTIME_ALLOWANCE] =    option_1_val.addOn_with_mp_overTimeAllowance;
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_COGS] =                  option_1_val.addOn_with_mp_cogs;
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_NET_PRICE_AMOUNT] =      option_1_val.addOn_with_mp_netPriceAmount;
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE] =   option_1_val.addOn_with_mp_localTaxesAllowance;
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_SERVICE_CHARGE] =        option_1_val.addOn_with_mp_serviceCharge;
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_VAT] =                   option_1_val.addOn_with_mp_vat;
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_CALC_PRICE] =            option_1_val.addOn_with_mp_calculatedPrice;
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_ADJUSTED_PRICE] =        option_1_val.addOn_with_mp_adjustedPrice;
            fieldValues[Fields.Option_1.ADD_ON_WITH_MP_PROPOSED_PRICE] =        option_1_val.addOn_with_mp_proposedPrice;

            fieldValues[Fields.Option_1.ADD_ON_WITHOUT_MP_FOOD_COST] =              option_1_val.addOn_without_mp_foodCost;
            fieldValues[Fields.Option_1.ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE] =   option_1_val.addOn_without_mp_productionAllowance;
            fieldValues[Fields.Option_1.ADD_ON_WITHOUT_MP_COGS] =                   option_1_val.addOn_without_mp_cogs;
            fieldValues[Fields.Option_1.ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT] =       option_1_val.addOn_without_mp_netPriceAmount;
            fieldValues[Fields.Option_1.ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE] =    option_1_val.addOn_without_mp_localTaxesAllowance;
            fieldValues[Fields.Option_1.ADD_ON_WITHOUT_MP_SERVICE_CHARGE] =         option_1_val.addOn_without_mp_serviceCharge;
            fieldValues[Fields.Option_1.ADD_ON_WITHOUT_MP_VAT] =                    option_1_val.addOn_without_mp_vat;
            fieldValues[Fields.Option_1.ADD_ON_WITHOUT_MP_CALC_PRICE] =             option_1_val.addOn_without_mp_calculatedPrice;
            fieldValues[Fields.Option_1.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE] =         option_1_val.addOn_without_mp_adjustedPrice;
            fieldValues[Fields.Option_1.ADD_ON_WITHOUT_MP_PROPOSED_PRICE] =         option_1_val.addOn_without_mp_proposedPrice;

        //} else if (selectedOption == Constant.foodOption.OPTION_2) {

            /* OPTION 2 */
            fieldValues[Fields.Option_2.FOOD_COST] =                option_2_val.foodCost;
            fieldValues[Fields.Option_2.PRODUCTION_ALLOWANCE] =     option_2_val.productionAllowance;
            fieldValues[Fields.Option_2.LABOR_COST] =               option_2_val.laborCost;
            fieldValues[Fields.Option_2.OVERTIME_ALLOWANCE] =       option_2_val.overTimeAllowance;
            fieldValues[Fields.Option_2.FLORAL_COST] =              option_2_val.floralCost;
            fieldValues[Fields.Option_2.FLORAL_COST_MARKUP] =       option_2_val.floralCostMarkUp;
            fieldValues[Fields.Option_2.COGS] =                     option_2_val.cogs;
            fieldValues[Fields.Option_2.NET_PRICE_AMOUNT] =         option_2_val.netPriceAmount;
            fieldValues[Fields.Option_2.NET_PRICE_WITH_FLORAL] =    option_2_val.netPriceWithFloral;
            fieldValues[Fields.Option_2.LOCAL_TAX_ALLOWANCE] =      option_2_val.localTaxesAllowance;
            fieldValues[Fields.Option_2.SERVICE_CHARGE] =           option_2_val.serviceCharge;
            fieldValues[Fields.Option_2.VAT] =                      option_2_val.vat;
            fieldValues[Fields.Option_2.CALC_PRICE] =               option_2_val.calculatedPrice;
            fieldValues[Fields.Option_2.ADJUSTED_PRICE] =           option_2_val.adjustedPrice;
            fieldValues[Fields.Option_2.PROPOSED_PRICE] =           option_2_val.proposedPrice;

            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_FOOD_COST] =             option_2_val.addOn_with_mp_foodCost;
            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE] =  option_2_val.addOn_with_mp_productionAllowance;
            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_LABOR_COST] =            option_2_val.addOn_with_mp_laborCost;
            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_OVERTIME_ALLOWANCE] =    option_2_val.addOn_with_mp_overTimeAllowance;
            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_COGS] =                  option_2_val.addOn_with_mp_cogs;
            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_NET_PRICE_AMOUNT] =      option_2_val.addOn_with_mp_netPriceAmount;
            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE] =   option_2_val.addOn_with_mp_localTaxesAllowance;
            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_SERVICE_CHARGE] =        option_2_val.addOn_with_mp_serviceCharge;
            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_VAT] =                   option_2_val.addOn_with_mp_vat;
            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_CALC_PRICE] =            option_2_val.addOn_with_mp_calculatedPrice;
            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_ADJUSTED_PRICE] =        option_2_val.addOn_with_mp_adjustedPrice;
            fieldValues[Fields.Option_2.ADD_ON_WITH_MP_PROPOSED_PRICE] =        option_2_val.addOn_with_mp_proposedPrice;

            fieldValues[Fields.Option_2.ADD_ON_WITHOUT_MP_FOOD_COST] =              option_2_val.addOn_without_mp_foodCost;
            fieldValues[Fields.Option_2.ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE] =   option_2_val.addOn_without_mp_productionAllowance;
            fieldValues[Fields.Option_2.ADD_ON_WITHOUT_MP_COGS] =                   option_2_val.addOn_without_mp_cogs;
            fieldValues[Fields.Option_2.ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT] =       option_2_val.addOn_without_mp_netPriceAmount;
            fieldValues[Fields.Option_2.ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE] =    option_2_val.addOn_without_mp_localTaxesAllowance;
            fieldValues[Fields.Option_2.ADD_ON_WITHOUT_MP_SERVICE_CHARGE] =         option_2_val.addOn_without_mp_serviceCharge;
            fieldValues[Fields.Option_2.ADD_ON_WITHOUT_MP_VAT] =                    option_2_val.addOn_without_mp_vat;
            fieldValues[Fields.Option_2.ADD_ON_WITHOUT_MP_CALC_PRICE] =             option_2_val.addOn_without_mp_calculatedPrice;
            fieldValues[Fields.Option_2.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE] =         option_2_val.addOn_without_mp_adjustedPrice;
            fieldValues[Fields.Option_2.ADD_ON_WITHOUT_MP_PROPOSED_PRICE] =         option_2_val.addOn_without_mp_proposedPrice;

        //} else if (selectedOption == Constant.foodOption.OPTION_3) {

            /* OPTION 3 */
            fieldValues[Fields.Option_3.FOOD_COST] =                option_3_val.foodCost;
            fieldValues[Fields.Option_3.PRODUCTION_ALLOWANCE] =     option_3_val.productionAllowance;
            fieldValues[Fields.Option_3.LABOR_COST] =               option_3_val.laborCost;
            fieldValues[Fields.Option_3.OVERTIME_ALLOWANCE] =       option_3_val.overTimeAllowance;
            fieldValues[Fields.Option_3.FLORAL_COST] =              option_3_val.floralCost;
            fieldValues[Fields.Option_3.FLORAL_COST_MARKUP] =       option_3_val.floralCostMarkUp;
            fieldValues[Fields.Option_3.COGS] =                     option_3_val.cogs;
            fieldValues[Fields.Option_3.NET_PRICE_AMOUNT] =         option_3_val.netPriceAmount;
            fieldValues[Fields.Option_3.NET_PRICE_WITH_FLORAL] =    option_3_val.netPriceWithFloral;
            fieldValues[Fields.Option_3.LOCAL_TAX_ALLOWANCE] =      option_3_val.localTaxesAllowance;
            fieldValues[Fields.Option_3.SERVICE_CHARGE] =           option_3_val.serviceCharge;
            fieldValues[Fields.Option_3.VAT] =                      option_3_val.vat;
            fieldValues[Fields.Option_3.CALC_PRICE] =               option_3_val.calculatedPrice;
            fieldValues[Fields.Option_3.ADJUSTED_PRICE] =           option_3_val.adjustedPrice;
            fieldValues[Fields.Option_3.PROPOSED_PRICE] =           option_3_val.proposedPrice;

            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_FOOD_COST] =             option_3_val.addOn_with_mp_foodCost;
            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE] =  option_3_val.addOn_with_mp_productionAllowance;
            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_LABOR_COST] =            option_3_val.addOn_with_mp_laborCost;
            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_OVERTIME_ALLOWANCE] =    option_3_val.addOn_with_mp_overTimeAllowance;
            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_COGS] =                  option_3_val.addOn_with_mp_cogs;
            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_NET_PRICE_AMOUNT] =      option_3_val.addOn_with_mp_netPriceAmount;
            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE] =   option_3_val.addOn_with_mp_localTaxesAllowance;
            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_SERVICE_CHARGE] =        option_3_val.addOn_with_mp_serviceCharge;
            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_VAT] =                   option_3_val.addOn_with_mp_vat;
            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_CALC_PRICE] =            option_3_val.addOn_with_mp_calculatedPrice;
            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_ADJUSTED_PRICE] =        option_3_val.addOn_with_mp_adjustedPrice;
            fieldValues[Fields.Option_3.ADD_ON_WITH_MP_PROPOSED_PRICE] =        option_3_val.addOn_with_mp_proposedPrice;

            fieldValues[Fields.Option_3.ADD_ON_WITHOUT_MP_FOOD_COST] =              option_3_val.addOn_without_mp_foodCost;
            fieldValues[Fields.Option_3.ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE] =   option_3_val.addOn_without_mp_productionAllowance;
            fieldValues[Fields.Option_3.ADD_ON_WITHOUT_MP_COGS] =                   option_3_val.addOn_without_mp_cogs;
            fieldValues[Fields.Option_3.ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT] =       option_3_val.addOn_without_mp_netPriceAmount;
            fieldValues[Fields.Option_3.ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE] =    option_3_val.addOn_without_mp_localTaxesAllowance;
            fieldValues[Fields.Option_3.ADD_ON_WITHOUT_MP_SERVICE_CHARGE] =         option_3_val.addOn_without_mp_serviceCharge;
            fieldValues[Fields.Option_3.ADD_ON_WITHOUT_MP_VAT] =                    option_3_val.addOn_without_mp_vat;
            fieldValues[Fields.Option_3.ADD_ON_WITHOUT_MP_CALC_PRICE] =             option_3_val.addOn_without_mp_calculatedPrice;
            fieldValues[Fields.Option_3.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE] =         option_3_val.addOn_without_mp_adjustedPrice;
            fieldValues[Fields.Option_3.ADD_ON_WITHOUT_MP_PROPOSED_PRICE] =         option_3_val.addOn_without_mp_proposedPrice;
        //}

        _commonDelegate.setBanquetCommonFields(_newRecord, _oldRecord, fieldValues);
    }

    return BanquetType_2_Delegate;

});

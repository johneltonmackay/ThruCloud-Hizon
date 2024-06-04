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

/*
    This is a module used by CLIENT SCRIPT to
    to update dependent values when 
    Net Price Rate fields change.
*/

    function NetPriceRateUpdateHandler() {
        this.name = 'NetPriceRateUpdateHandler';
        _helperType1 = new BanquetType_1_Helper();
        _helperType2 = new BanquetType_2_Helper();
    }

    NetPriceRateUpdateHandler.prototype.updateRelatedFields = function(params) {
        var currentRec = params.currentRec;
        var netPriceRateField = params.netPriceRateField;

        switch(netPriceRateField) {
        	/* Banquet Type 1 > Option 1 > Base */
			case Constant.netPriceRateFields.BanquetType_1.Option_1.BASE_NET_PRICE_RATE:
				updateFields_BanquetType_1_Base({
					currentRec: currentRec,
					banquetFields: Constant.groupedFields.BanquetType_1.Option_1.BASE,
					netPriceRateField: netPriceRateField,
					foodOption: Constant.foodOption.OPTION_1
				});
				break;

            /* Banquet Type 1 > Option 1 > ADD ON T1 */
			case Constant.netPriceRateFields.BanquetType_1.Option_1.ADD_ON_NET_PRICE_RATE:
				updateFields_BanquetType_1_Add_On({
					currentRec: currentRec,
					banquetFields: Constant.groupedFields.BanquetType_1.Option_1.ADD_ON,
					netPriceRateField: netPriceRateField,
					foodOption: Constant.foodOption.OPTION_1
				});
				break;

            /* Banquet Type 1 > Option 2 > Base */
			case Constant.netPriceRateFields.BanquetType_1.Option_2.BASE_NET_PRICE_RATE:
				updateFields_BanquetType_1_Base({
					currentRec: currentRec,
					banquetFields: Constant.groupedFields.BanquetType_1.Option_2.BASE,
					netPriceRateField: netPriceRateField,
					foodOption: Constant.foodOption.OPTION_2
				});
				break;

            /* Banquet Type 1 > Option 2 > ADD ON T1 */
			case Constant.netPriceRateFields.BanquetType_1.Option_2.ADD_ON_NET_PRICE_RATE:
				updateFields_BanquetType_1_Add_On({
					currentRec: currentRec,
					banquetFields: Constant.groupedFields.BanquetType_1.Option_2.ADD_ON,
					netPriceRateField: netPriceRateField,
					foodOption: Constant.foodOption.OPTION_2
				});
				break;

            /* Banquet Type 1 > Option 3 > Base */
		 	case Constant.netPriceRateFields.BanquetType_1.Option_3.BASE_NET_PRICE_RATE:
				updateFields_BanquetType_1_Base({
					currentRec: currentRec,
					banquetFields: Constant.groupedFields.BanquetType_1.Option_3.BASE,
					netPriceRateField: netPriceRateField,
					foodOption: Constant.foodOption.OPTION_3
				});
				break;

            /* Banquet Type 1 > Option 3 > ADD ON T1 */
			case Constant.netPriceRateFields.BanquetType_1.Option_3.ADD_ON_NET_PRICE_RATE:
				updateFields_BanquetType_1_Add_On({
					currentRec: currentRec,
					banquetFields: Constant.groupedFields.BanquetType_1.Option_3.ADD_ON,
					netPriceRateField: netPriceRateField,
					foodOption: Constant.foodOption.OPTION_3
				});
				break;


            /* Banquet Type 2 > Option 1 > Base */
			case Constant.netPriceRateFields.BanquetType_2.Option_1.BASE_NET_PRICE_RATE:
				updateFields_BanquetType_2_Base({
					currentRec: currentRec,
					banquetFields: Constant.groupedFields.BanquetType_2.Option_1.BASE,
					netPriceRateField: netPriceRateField,
					foodOption: Constant.foodOption.OPTION_1
				});
				break;

            /* Banquet Type 2 > Option 1 > Add On WITH Mainpower */
			case Constant.netPriceRateFields.BanquetType_2.Option_1.ADD_ON_WITH_MP_NET_PRICE_RATE:
				updateFields_BanquetType_2_Add_On_With_MP({
					currentRec: currentRec,
					banquetFields: Constant.groupedFields.BanquetType_2.Option_1.ADD_ON_WITH_MP,
					netPriceRateField: netPriceRateField,
					foodOption: Constant.foodOption.OPTION_1
				});
				break;

            /* Banquet Type 2 > Option 1 > Add On WITHOUT Mainpower */
			case Constant.netPriceRateFields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_NET_PRICE_RATE:
				updateFields_BanquetType_2_Add_On_Without_MP({
					currentRec: currentRec,
					banquetFields: Constant.groupedFields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP,
					netPriceRateField: netPriceRateField,
					foodOption: Constant.foodOption.OPTION_1
				});
				break;

            /* Banquet Type 2 > Option 2 > Base */
            case Constant.netPriceRateFields.BanquetType_2.Option_2.BASE_NET_PRICE_RATE:
                updateFields_BanquetType_2_Base({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_2.Option_2.BASE,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_2
                });
                break;

            /* Banquet Type 2 > Option 2 > Add On WITH Mainpower */
            case Constant.netPriceRateFields.BanquetType_2.Option_2.ADD_ON_WITH_MP_NET_PRICE_RATE:
                updateFields_BanquetType_2_Add_On_With_MP({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_2.Option_2.ADD_ON_WITH_MP,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_2
                });
                break;

            /* Banquet Type 2 > Option 2 > Add On WITHOUT Mainpower */
            case Constant.netPriceRateFields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_NET_PRICE_RATE:
                updateFields_BanquetType_2_Add_On_Without_MP({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_2
                });
                break;

            /* Banquet Type 2 > Option 3 > Base */
            case Constant.netPriceRateFields.BanquetType_2.Option_3.BASE_NET_PRICE_RATE:
                updateFields_BanquetType_2_Base({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_2.Option_3.BASE,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_3
                });
                break;

            /* Banquet Type 2 > Option 3 > Add On WITH Mainpower */
            case Constant.netPriceRateFields.BanquetType_2.Option_3.ADD_ON_WITH_MP_NET_PRICE_RATE:
                updateFields_BanquetType_2_Add_On_With_MP({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_2.Option_3.ADD_ON_WITH_MP,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_3
                });
                break;

            /* Banquet Type 2 > Option 3 > Add On WITHOUT Mainpower */
            case Constant.netPriceRateFields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_NET_PRICE_RATE:
                updateFields_BanquetType_2_Add_On_Without_MP({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_3
                });
                break;


            /* Banquet Type 3 > Option 1 > Base */
            case Constant.netPriceRateFields.BanquetType_3.Option_1.BASE_NET_PRICE_RATE:
                updateFields_BanquetType_3_Base({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_3.Option_1.BASE,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_1
                });
                break;

            /* Banquet Type 3 > Option 1 > Add On WITH Mainpower */
            case Constant.netPriceRateFields.BanquetType_3.Option_1.ADD_ON_WITH_MP_NET_PRICE_RATE:
                updateFields_BanquetType_3_Add_On_With_MP({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_3.Option_1.ADD_ON_WITH_MP,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_1
                });
                break;

            /* Banquet Type 3 > Option 1 > Add On WITHOUT Mainpower */
            case Constant.netPriceRateFields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP_NET_PRICE_RATE:
                updateFields_BanquetType_3_Add_On_Without_MP({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_1
                });
                break;

            /* Banquet Type 3 > Option 2 > Base */
            case Constant.netPriceRateFields.BanquetType_3.Option_2.BASE_NET_PRICE_RATE:
                updateFields_BanquetType_3_Base({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_3.Option_2.BASE,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_2
                });
                break;

            /* Banquet Type 3 > Option 2 > Add On WITH Mainpower */
            case Constant.netPriceRateFields.BanquetType_3.Option_2.ADD_ON_WITH_MP_NET_PRICE_RATE:
                updateFields_BanquetType_3_Add_On_With_MP({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_3.Option_2.ADD_ON_WITH_MP,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_2
                });
                break;

            /* Banquet Type 3 > Option 2 > Add On WITHOUT Mainpower */
            case Constant.netPriceRateFields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP_NET_PRICE_RATE:
                updateFields_BanquetType_3_Add_On_Without_MP({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_2
                });
                break;

            /* Banquet Type 3 > Option 3 > Base */
            case Constant.netPriceRateFields.BanquetType_3.Option_3.BASE_NET_PRICE_RATE:
                updateFields_BanquetType_3_Base({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_3.Option_3.BASE,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_3
                });
                break;

            /* Banquet Type 3 > Option 3 > Add On WITH Mainpower */
            case Constant.netPriceRateFields.BanquetType_3.Option_3.ADD_ON_WITH_MP_NET_PRICE_RATE:
                updateFields_BanquetType_3_Add_On_With_MP({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_3.Option_3.ADD_ON_WITH_MP,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_3
                });
                break;

            /* Banquet Type 3 > Option 3 > Add On WITHOUT Mainpower */
            case Constant.netPriceRateFields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP_NET_PRICE_RATE:
                updateFields_BanquetType_3_Add_On_Without_MP({
                    currentRec: currentRec,
                    banquetFields: Constant.groupedFields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP,
                    netPriceRateField: netPriceRateField,
                    foodOption: Constant.foodOption.OPTION_3
                });
                break;
			
			default:
			
		}
    }

    /* Banquet Type 1 > Base */
    function updateFields_BanquetType_1_Base(params){
    	var currentRec = params.currentRec;
    	var banquetFields = params.banquetFields;
    	var netPriceRateField = params.netPriceRateField;
    	var foodOption = params.foodOption;

    	var cogs = currentRec.getValue({fieldId: banquetFields.COGS});
    	var floralCost = currentRec.getValue({fieldId: banquetFields.FLORAL_COST});
    	var floralCostMarkUp = currentRec.getValue({fieldId: banquetFields.FLORAL_COST_MARKUP});
    	var netPriceRate = currentRec.getValue({fieldId: netPriceRateField});
    	var netPriceRate = netPriceRate? netPriceRate/100 : 0;

    	var values = {};
    	values.netPriceAmount = cogs/netPriceRate;
        values.netPriceWithFloral = values.netPriceAmount + floralCost + floralCostMarkUp;
        values.localTaxesAllowance = (values.netPriceAmount + floralCost + floralCostMarkUp) * 0.02;
        values.vat = (values.netPriceWithFloral + values.localTaxesAllowance) * Constant.VAT_RATE;
        values.calculatedPrice = values.netPriceWithFloral + values.localTaxesAllowance + values.vat;
        values.proposedPrice = values.calculatedPrice;
        values.adjustedPrice = _helperType1.getBaseAdjustedPrice(currentRec, foodOption);
        if (values.adjustedPrice) {
            values.proposedPrice = values.adjustedPrice;
        }

        var withServiceIncentive = _helperType1.includeServiceIncentive(currentRec, foodOption);
        var withMobilizationFee = _helperType1.includeMobilizationFee(currentRec, foodOption);
        values.proposedPrice = _helperType1.adjustProposedPrice({
            withServiceIncentive: withServiceIncentive,
            withMobilizationFee: withMobilizationFee,
            initialPrice: values.proposedPrice
        });

        var fields = {};
        fields.netPriceAmount = banquetFields.NET_PRICE_AMOUNT;
        fields.netPriceWithFloral = banquetFields.NET_PRICE_WITH_FLORAL;
        fields.localTaxesAllowance = banquetFields.LOCAL_TAX_ALLOWANCE;
        fields.vat = banquetFields.VAT;
        fields.calculatedPrice = banquetFields.CALC_PRICE;
        fields.proposedPrice = banquetFields.PROPOSED_PRICE;
        fields.adjustedPrice = banquetFields.ADJUSTED_PRICE;

        setFieldValues(currentRec, fields, values);
    }

    /* Banquet Type 1 > Add On T1 */
    function updateFields_BanquetType_1_Add_On(params){
    	var currentRec = params.currentRec;
    	var banquetFields = params.banquetFields;
    	var netPriceRateField = params.netPriceRateField;
    	var foodOption = params.foodOption;

    	var cogs = currentRec.getValue({fieldId: banquetFields.COGS});
    	var netPriceRate = currentRec.getValue({fieldId: netPriceRateField});
    	var netPriceRate = netPriceRate? netPriceRate/100 : 0;

    	var values = {};
    	values.netPriceAmount = cogs/netPriceRate;
        values.localTaxesAllowance = values.netPriceAmount * 0.02;
        values.vat = (values.netPriceAmount + values.localTaxesAllowance) * Constant.VAT_RATE;
        values.calculatedPrice = values.netPriceAmount + values.localTaxesAllowance + values.vat;
        values.proposedPrice = values.calculatedPrice;
        values.adjustedPrice = _helperType1.getAddOnAdjustedPrice(currentRec, foodOption);
        if (values.adjustedPrice) {
            values.proposedPrice = values.adjustedPrice;
        }

        var withAddOnServiceIncentive = _helperType1.includeAddOnServiceIncentive(currentRec, foodOption);
        var withAddOnMobilizationFee = _helperType1.includeAddOnMobilizationFee(currentRec, foodOption);
        values.proposedPrice = _helperType1.adjustProposedPrice({
            withServiceIncentive: withAddOnServiceIncentive,
            withMobilizationFee: withAddOnMobilizationFee,
            initialPrice: values.proposedPrice
        });

        var fields = {};
        fields.netPriceAmount = banquetFields.NET_PRICE_AMOUNT;
        fields.localTaxesAllowance = banquetFields.LOCAL_TAX_ALLOWANCE;
        fields.vat = banquetFields.VAT;
        fields.calculatedPrice = banquetFields.CALC_PRICE;
        fields.proposedPrice = banquetFields.PROPOSED_PRICE;
        fields.adjustedPrice = banquetFields.ADJUSTED_PRICE;

        setFieldValues(currentRec, fields, values);
    }

    /* Banquet Type 2 > Base */
    function updateFields_BanquetType_2_Base(params){
    	var currentRec = params.currentRec;
    	var banquetFields = params.banquetFields;
    	var netPriceRateField = params.netPriceRateField;
    	var foodOption = params.foodOption;

    	var cogs = currentRec.getValue({fieldId: banquetFields.COGS});
    	var floralCost = currentRec.getValue({fieldId: banquetFields.FLORAL_COST});
    	var floralCostMarkUp = currentRec.getValue({fieldId: banquetFields.FLORAL_COST_MARKUP});
    	var netPriceRate = currentRec.getValue({fieldId: netPriceRateField});
    	var netPriceRate = netPriceRate? netPriceRate/100 : 0;

    	var values = {};
    	values.netPriceAmount = cogs/netPriceRate;
        values.netPriceWithFloral = values.netPriceAmount + floralCost + floralCostMarkUp;
        values.localTaxesAllowance = values.netPriceWithFloral * 0.02;
        values.vat = (values.netPriceWithFloral + values.localTaxesAllowance) * 0.12;
        
        values.calculatedPrice = values.netPriceAmount + floralCost + floralCostMarkUp + values.localTaxesAllowance + values.vat;
        values.proposedPrice = values.calculatedPrice;
        values.adjustedPrice = _helperType2.getBaseAdjustedPrice(currentRec, foodOption);
        if (values.adjustedPrice) {
            values.proposedPrice = values.adjustedPrice;
        }
        values.serviceCharge = (values.proposedPrice/1.12) * 0.1;
        values.proposedPrice = values.proposedPrice + values.serviceCharge;

        var fields = {};
        fields.netPriceAmount = banquetFields.NET_PRICE_AMOUNT;
        fields.netPriceWithFloral = banquetFields.NET_PRICE_WITH_FLORAL;
        fields.localTaxesAllowance = banquetFields.LOCAL_TAX_ALLOWANCE;
        fields.vat = banquetFields.VAT;
        fields.calculatedPrice = banquetFields.CALC_PRICE;
        fields.proposedPrice = banquetFields.PROPOSED_PRICE;
        fields.adjustedPrice = banquetFields.ADJUSTED_PRICE;

        setFieldValues(currentRec, fields, values);
    }

    /* Banquet Type 2 > Add On WITH Manpower */
    function updateFields_BanquetType_2_Add_On_With_MP(params){
    	var currentRec = params.currentRec;
    	var banquetFields = params.banquetFields;
    	var netPriceRateField = params.netPriceRateField;
    	var foodOption = params.foodOption;

    	var cogs = currentRec.getValue({fieldId: banquetFields.COGS});
    	var netPriceRate = currentRec.getValue({fieldId: netPriceRateField});
    	var netPriceRate = netPriceRate? netPriceRate/100 : 0;

    	var values = {};
    	values.netPriceAmount = cogs/netPriceRate;
        values.localTaxesAllowance = values.netPriceAmount * 0.02;
        values.vat = (values.netPriceAmount + values.localTaxesAllowance) * 1.12;
        values.calculatedPrice = values.netPriceAmount + values.localTaxesAllowance + values.vat;
        values.proposedPrice = values.calculatedPrice;
        values.adjustedPrice = _helperType2.getAddOnWithManpowerAdjustedPrice(currentRec, foodOption);
        if(values.adjustedPrice){
            values.proposedPrice = values.adjustedPrice;
        }
        values.serviceCharge = (values.proposedPrice/1.12) * 0.1;
        values.proposedPrice = values.proposedPrice + values.serviceCharge;

        var fields = {};
        fields.netPriceAmount = banquetFields.NET_PRICE_AMOUNT;
        fields.localTaxesAllowance = banquetFields.LOCAL_TAX_ALLOWANCE;
        fields.vat = banquetFields.VAT;
        fields.calculatedPrice = banquetFields.CALC_PRICE;
        fields.proposedPrice = banquetFields.PROPOSED_PRICE;
        fields.adjustedPrice = banquetFields.ADJUSTED_PRICE;

        setFieldValues(currentRec, fields, values);
    }

    /* Banquet Type 2 > Add On WITHOUT Manpower */
    function updateFields_BanquetType_2_Add_On_Without_MP(params){
    	var currentRec = params.currentRec;
    	var banquetFields = params.banquetFields;
    	var netPriceRateField = params.netPriceRateField;
    	var foodOption = params.foodOption;

    	var cogs = currentRec.getValue({fieldId: banquetFields.COGS});
    	var netPriceRate = currentRec.getValue({fieldId: netPriceRateField});
    	var netPriceRate = netPriceRate? netPriceRate/100 : 0;

    	var values = {};
    	values.netPriceAmount = cogs/netPriceRate;
    	values.localTaxesAllowance = values.netPriceAmount * 0.02;
        values.vat = (values.netPriceAmount + values.localTaxesAllowance) * 1.12; 
        values.calculatedPrice = values.netPriceAmount + values.localTaxesAllowance + values.vat;
        values.proposedPrice = values.calculatedPrice;
        values.adjustedPrice = _helperType2.getAddOnWithoutManpowerAdjustedPrice(currentRec, foodOption);
        if(values.adjustedPrice){
            values.proposedPrice = values.adjustedPrice;
        }
        values.serviceCharge = (values.proposedPrice/1.12) * 0.1;
        values.proposedPrice = values.proposedPrice + values.serviceCharge;

        var fields = {};
        fields.netPriceAmount = banquetFields.NET_PRICE_AMOUNT;
        fields.localTaxesAllowance = banquetFields.LOCAL_TAX_ALLOWANCE;
        fields.vat = banquetFields.VAT;
        fields.calculatedPrice = banquetFields.CALC_PRICE;
        fields.proposedPrice = banquetFields.PROPOSED_PRICE;
        fields.adjustedPrice = banquetFields.ADJUSTED_PRICE;

        setFieldValues(currentRec, fields, values);
    }

    /* Banquet Type 3 > Base */
    function updateFields_BanquetType_3_Base(params){
        var currentRec = params.currentRec;
        var banquetFields = params.banquetFields;
        var netPriceRateField = params.netPriceRateField;
        var foodOption = params.foodOption;

        var cogs = currentRec.getValue({fieldId: banquetFields.COGS});
        var floralCost = currentRec.getValue({fieldId: banquetFields.FLORAL_COST});
        var floralCostMarkUp = currentRec.getValue({fieldId: banquetFields.FLORAL_COST_MARKUP});
        var netPriceRate = currentRec.getValue({fieldId: netPriceRateField});
        var netPriceRate = netPriceRate? netPriceRate/100 : 0;

        var values = {};
        values.netPriceAmount = cogs/netPriceRate;
        values.netPriceWithFloral = values.netPriceAmount + floralCost + floralCostMarkUp;
        values.localTaxesAllowance = (values.netPriceAmount + floralCost + floralCostMarkUp) * 0.02;
        values.serviceIncentive = (values.netPriceAmount + floralCost + floralCostMarkUp + values.localTaxesAllowance) * 0.05;
        values.venueShare = (floralCost + floralCostMarkUp + values.serviceIncentive + values.localTaxesAllowance) * 0.2;
        values.vat = (values.netPriceAmount + floralCost + floralCostMarkUp + values.serviceIncentive + values.localTaxesAllowance + values.venueShare) * 0.12;
        values.calculatedPrice = values.netPriceAmount 
                                + floralCost 
                                + floralCostMarkUp 
                                + values.serviceIncentive 
                                + values.localTaxesAllowance 
                                + values.venueShare 
                                + values.vat; 
        values.proposedPrice = values.calculatedPrice;

        var fields = {};
        fields.netPriceAmount = banquetFields.NET_PRICE_AMOUNT;
        fields.netPriceWithFloral = banquetFields.NET_PRICE_WITH_FLORAL;
        fields.localTaxesAllowance = banquetFields.LOCAL_TAX_ALLOWANCE;
        fields.serviceIncentive = banquetFields.SERVICE_INCENTIVE;
        fields.venueShare = banquetFields.VENUE_SHARE;
        fields.vat = banquetFields.VAT;
        fields.calculatedPrice = banquetFields.CALC_PRICE;
        fields.proposedPrice = banquetFields.PROPOSED_PRICE;

        setFieldValues(currentRec, fields, values);
    }

    /* Banquet Type 3 > Add On WITH Manpower */
    function updateFields_BanquetType_3_Add_On_With_MP(params){
        var currentRec = params.currentRec;
        var banquetFields = params.banquetFields;
        var netPriceRateField = params.netPriceRateField;
        var foodOption = params.foodOption;

        var cogs = currentRec.getValue({fieldId: banquetFields.COGS});
        var netPriceRate = currentRec.getValue({fieldId: netPriceRateField});
        var netPriceRate = netPriceRate? netPriceRate/100 : 0;

        var values = {};
        values.netPriceAmount = cogs/netPriceRate;
        values.localTaxesAllowance = values.netPriceAmount * 0.02;
        values.serviceIncentive = (values.netPriceAmount + values.localTaxesAllowance) * 0.05;
        values.venueShare = (values.netPriceAmount 
                                        + values.localTaxesAllowance 
                                        + values.serviceIncentive) * 0.2;
        values.vat = (values.netPriceAmount 
                                + values.localTaxesAllowance 
                                + values.serviceIncentive 
                                + values.venueShare) * 0.12;
        values.calculatedPrice = values.netPriceAmount 
                                            + values.localTaxesAllowance 
                                            + values.serviceIncentive 
                                            + values.venueShare 
                                            + values.vat;
        values.proposedPrice = values.calculatedPrice;

        var fields = {};
        fields.netPriceAmount = banquetFields.NET_PRICE_AMOUNT;
        fields.localTaxesAllowance = banquetFields.LOCAL_TAX_ALLOWANCE;
        fields.serviceIncentive = banquetFields.SERVICE_INCENTIVE;
        fields.venueShare = banquetFields.VENUE_SHARE;
        fields.vat = banquetFields.VAT;
        fields.calculatedPrice = banquetFields.CALC_PRICE;
        fields.proposedPrice = banquetFields.PROPOSED_PRICE;

        setFieldValues(currentRec, fields, values);
    }

    /* Banquet Type 3 > Add On WITHOUT Manpower */
    function updateFields_BanquetType_3_Add_On_Without_MP(params){
        var currentRec = params.currentRec;
        var banquetFields = params.banquetFields;
        var netPriceRateField = params.netPriceRateField;
        var foodOption = params.foodOption;

        var cogs = currentRec.getValue({fieldId: banquetFields.COGS});
        var netPriceRate = currentRec.getValue({fieldId: netPriceRateField});
        var netPriceRate = netPriceRate? netPriceRate/100 : 0;

        var values = {};
        values.netPriceAmount = cogs/netPriceRate;
        values.localTaxesAllowance = values.netPriceAmount * 0.02;
        values.serviceIncentive = (values.netPriceAmount + values.localTaxesAllowance) * 0.05;
        values.venueShare = (values.netPriceAmount 
                                            + values.localTaxesAllowance 
                                            + values.serviceIncentive) * 0.2;
        values.vat = (values.netPriceAmount 
                                    + values.localTaxesAllowance 
                                    + values.serviceIncentive 
                                    + values.venueShare) * 0.12;
        values.calculatedPrice = values.netPriceAmount 
                                            + values.localTaxesAllowance
                                            + values.serviceIncentive 
                                            + values.venueShare 
                                            + values.vat;
        values.proposedPrice = values.calculatedPrice;

        var fields = {};
        fields.netPriceAmount = banquetFields.NET_PRICE_AMOUNT;
        fields.localTaxesAllowance = banquetFields.LOCAL_TAX_ALLOWANCE;
        fields.serviceIncentive = banquetFields.SERVICE_INCENTIVE;
        fields.venueShare = banquetFields.VENUE_SHARE;
        fields.vat = banquetFields.VAT;
        fields.calculatedPrice = banquetFields.CALC_PRICE;
        fields.proposedPrice = banquetFields.PROPOSED_PRICE;

        setFieldValues(currentRec, fields, values);
    }

    function setFieldValues(currentRec, fields, values){
    	var keys = Object.keys(fields);
    	for(var i = 0; i < keys.length; i++){
    		var key = keys[i];
    		console.log('field: '+fields[key]+' | value: '+values[key]);
    		currentRec.setValue({
    			fieldId: fields[key],
    			value: values[key]
    		});
    	}
    }
    
    return NetPriceRateUpdateHandler;

});

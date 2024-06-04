/**
 * @NApiVersion 2.1
 *
 */

define([
    'N/log',
    'N/record',
    'N/search',
    '../common/tc_constants'
    ], function(
    log,
    record,
    search,
    Constant
) {

    var _newRecord;
    function BanquetType_Common_Delegate(newRecord) {
        this.name = 'BanquetType_1_Delegate';
        _newRecord = newRecord;
    }
    
    BanquetType_Common_Delegate.prototype.setBanquetCommonFields = function(newRecord, oldRecord, fieldValues) {
        var fields = Object.keys(fieldValues);


        fields.forEach(function(field) {

            if(canOverrideFieldValue(newRecord, oldRecord, field, fieldValues[field])){
                newRecord.setValue({
                    fieldId: field,
                    value: fieldValues[field]
                });
            }
            
        })
    }


    function canOverrideFieldValue(newRecord, oldRecord, fieldId, updatedValue){
        var canOverride = true;

        var Type3_Fields = Constant.fields.BanquetType_3;
        var proposedPriceFields = [
            Type3_Fields.Option_1.PROPOSED_PRICE,
            Type3_Fields.Option_1.ADD_ON_WITH_MP_PROPOSED_PRICE,
            Type3_Fields.Option_1.ADD_ON_WITHOUT_MP_PROPOSED_PRICE,
            Type3_Fields.Option_2.PROPOSED_PRICE,
            Type3_Fields.Option_2.ADD_ON_WITH_MP_PROPOSED_PRICE,
            Type3_Fields.Option_2.ADD_ON_WITHOUT_MP_PROPOSED_PRICE,
            Type3_Fields.Option_3.PROPOSED_PRICE,
            Type3_Fields.Option_3.ADD_ON_WITH_MP_PROPOSED_PRICE,
            Type3_Fields.Option_3.ADD_ON_WITHOUT_MP_PROPOSED_PRICE
        ];

        var newFieldValue;
        var oldFieldValue;
        if(proposedPriceFields.indexOf(fieldId) > -1){
            log.error('------------------', '------------------');
            newRecProposedValue = newRecord.getValue({
                fieldId: fieldId
            });

            oldRecProposedValue = oldRecord.getValue({
                fieldId: fieldId
            });


            // If user manually update the proposed value fields
            if(newRecProposedValue && newRecProposedValue != oldRecProposedValue) {
                canOverride = false;
            }

            log.error('newRecProposedValue', newRecProposedValue);
            log.error('oldRecProposedValue', oldRecProposedValue);

            log.error('canOverride', canOverride);
        }
            

        return canOverride;
    }

    BanquetType_Common_Delegate.prototype.getFloralCost = function(newRecord) {
        // Floral costs shall be retrieved from Amenities rows

        var totalCost = 0;
        var rowTotalCost = 0;
        var rowCost = 0;
        var rowQuantity;
        var lineCount = newRecord.getLineCount({
            sublistId: 'recmachcustrecord_amenities_transaction'
        });

        var totalNumOfPax = newRecord.getValue({
            fieldId: 'custbody_hz_total_number_of_pax'
        });

        for(var i = 0; i < lineCount; i++) {
            var itemId = newRecord.getSublistValue({
                sublistId: 'recmachcustrecord_amenities_transaction',
                fieldId: 'custrecord_amenities_name',
                line: i
            });

            // There is need to have the dynamic record due to issue with setText/getText
            // Reference: https://stackoverflow.com/questions/73532694/netsuite-invalid-api-usage-you-must-use-getvalue-to-return-the-value-set-with-s
            // getSublistText is good for dynamic records. 
            // But we cant have the dynamic record on create
            /*var itemName = newRecord.getSublistText({
                sublistId: 'recmachcustrecord_amenities_transaction',
                fieldId: 'custrecord_amenities_name',
                line: i
            });*/

            if(!itemId) continue;

            var itemLookupValues = search.lookupFields({
                type:search.Type.ITEM,
                id: itemId,
                columns: ['displayname']
            });
            var itemName = itemLookupValues.displayname;

            if(isItemAPlaceholder(itemName)){
                rowCost = newRecord.getSublistValue({
                    sublistId: 'recmachcustrecord_amenities_transaction',
                    fieldId: 'custrecord_amenity_cost',
                    line: i
                });
                rowQuantity = newRecord.getSublistValue({
                    sublistId: 'recmachcustrecord_amenities_transaction',
                    fieldId: 'custrecord_amenity_qty',
                    line: i
                });
                rowTotalCost = rowCost * rowQuantity;
                totalCost += parseFloat(rowTotalCost);
            }

        }

        return totalCost/totalNumOfPax;
    }

    function isItemAPlaceholder(itemName){
        // floraItemNames.indexOf(itemName) > -1

        var floralItemMap = Constant.amenitiesPlaceholderFloralItems;
        var floraItemNames = Object.values(floralItemMap);

        for(var k = 0;  k < floraItemNames.length; k++){
            var placeHolderItem = floraItemNames[k];

            // We do this because 'AM-012 Floral Placeholder L1' should be equal to 'Floral Placeholder L1'
            if(itemName.includes(placeHolderItem)){
                return true;
            } 
        }
        return false;
    }


    BanquetType_Common_Delegate.prototype.getLaborCost = function(newRecord) {
        
        /* Initially, totalAmount is sourced from Manpower Requirement Sublist */
        /*var manpowerReqLineCount = newRecord.getLineCount({
            sublistId: 'recmachcustrecord_transactionmanpowerref'
        });
        for(var i = 0; i < manpowerReqLineCount; i++) {
            var rowTotalAmount = newRecord.getSublistValue({
                sublistId: 'recmachcustrecord_transactionmanpowerref',
                fieldId: 'custrecord_manpower_requirement_totalamt',
                line: i
            }) || 0;
            totalAmount += parseFloat(rowTotalAmount);
        }*/


        /*
        var totalAmount = newRecord.getValue({
            fieldId: 'custbody_manpower_total_cost_stored'
        });
        var totalQuantity = newRecord.getValue({
            fieldId: 'custbody_hz_total_number_of_pax'
        });
        var laborCost = totalAmount / totalQuantity;
        */


        
        var laborCostDetails = {
            'baseMenu': {
                'totalCost': 0,
                'totalNumOfReq': 0
            },
            'stationAddonWithManpower': {
                'totalCost': 0,
                'totalNumOfReq': 0
            }
        };

        var manpowerReqLineCount = newRecord.getLineCount({
            sublistId: 'recmachcustrecord_transactionmanpowerref'
        });
        var COST_STRUC_BASE = 1;
        var COST_STRUC_ADDON_W_MP = 2;

        var totalNumberOfPax = newRecord.getValue({
            fieldId: 'custbody_hz_total_number_of_pax'
        });

        for(var i = 0; i < manpowerReqLineCount; i++) {
            var unitCost = newRecord.getSublistValue({
                sublistId: 'recmachcustrecord_transactionmanpowerref',
                fieldId: 'custrecord_manpower_cost',
                line: i
            }) || 0;
            var numOfReq = newRecord.getSublistValue({
                sublistId: 'recmachcustrecord_transactionmanpowerref',
                fieldId: 'custrecord_manpower_requirement_qty',
                line: i
            }) || 0;

            var totalCost = parseFloat(unitCost) * parseFloat(numOfReq);

            var costingStructure = newRecord.getSublistValue({
                sublistId: 'recmachcustrecord_transactionmanpowerref',
                fieldId: 'custrecord_mr_costing_structure',
                line: i
            }) || 0;
            
            if(costingStructure == COST_STRUC_BASE){
                laborCostDetails['baseMenu']['totalCost'] += parseFloat(totalCost);
                laborCostDetails['baseMenu']['totalNumOfReq'] += parseFloat(numOfReq);
            }else if(costingStructure == COST_STRUC_ADDON_W_MP){
                laborCostDetails['stationAddonWithManpower']['totalCost'] += parseFloat(totalCost);
                laborCostDetails['stationAddonWithManpower']['totalNumOfReq'] += parseFloat(numOfReq);
            }
        }

        var laborCost = {};
        //laborCost['baseMenu'] = (laborCostDetails['baseMenu']['totalCost'] / laborCostDetails['baseMenu']['totalNumOfReq']) / parseFloat(totalNumberOfPax);
        //laborCost['stationAddonWithManpower'] = (laborCostDetails['stationAddonWithManpower']['totalCost'] / laborCostDetails['stationAddonWithManpower']['totalNumOfReq']) / parseFloat(totalNumberOfPax);

        laborCost['baseMenu'] = laborCostDetails['baseMenu']['totalCost'] / parseFloat(totalNumberOfPax);
        laborCost['stationAddonWithManpower'] = laborCostDetails['stationAddonWithManpower']['totalCost'] / parseFloat(totalNumberOfPax);

        log.error('getLaborCost | laborCost', JSON.stringify(laborCost));
        return laborCost;
    }

    BanquetType_Common_Delegate.prototype.getFoodCost = function(newRecord) {
        var totalCost = 0;
        var foodCost = {};

        var totalNumOfPax = newRecord.getValue({
            fieldId: 'custbody_hz_total_number_of_pax'
        });

        var lineCount = newRecord.getLineCount({
            sublistId: 'recmachcustrecord_transaction_fb_food'
        });
        
        var option;
        var costingStructure;
        var cost;
        for(var i = 0; i < lineCount; i++) {
            option = newRecord.getSublistValue({
                sublistId: 'recmachcustrecord_transaction_fb_food',
                fieldId: 'custrecord_option',
                line: i
            });

            costingStructure = newRecord.getSublistValue({
                sublistId: 'recmachcustrecord_transaction_fb_food',
                //fieldId: 'custrecord_service_style',
                fieldId: 'custrecord_costing_structure',
                line: i
            });
            cost = newRecord.getSublistValue({
                sublistId: 'recmachcustrecord_transaction_fb_food',
                // fieldId: 'custrecord_fcs_cost_head',
                fieldId: 'custrecord_menu_cost',
                line: i
            }) || 0;

            if (foodCost[option]) {
                if (foodCost[option][costingStructure]) {
                    foodCost[option][costingStructure] += cost;
                } else {
                    foodCost[option][costingStructure] = cost;
                }
            } else {
                foodCost[option] = {};
                foodCost[option][costingStructure] = cost;
            }
        }

        // Divide each cost by totalNumOfPax
        for (var optionKey in foodCost) {
            if (foodCost.hasOwnProperty(optionKey)) {
                for (var costingStructureKey in foodCost[optionKey]) {
                    if (foodCost[optionKey].hasOwnProperty(costingStructureKey)) {
                        foodCost[optionKey][costingStructureKey] /= totalNumOfPax;
                    }
                }
            }
        }

        log.error('BanquetType_Common_Delegate.getFoodCost | foodCost', JSON.stringify(foodCost));
        return foodCost;
    }

    return BanquetType_Common_Delegate;

});

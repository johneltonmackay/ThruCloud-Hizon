/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

define([], function(){;

    function validateLine(context) {   

      var sublist = context.sublistId
      var currentRecord = context.currentRecord
      var form = currentRecord.getValue({
        fieldId:'customform'
      })

      if(form == '242' && sublist == 'item') {
          var plannedQty = currentRecord.getCurrentSublistValue({
              sublistId: sublist,
              fieldId: 'custcol_so_plannedqty'
          })

          var adjustmentQty = currentRecord.getCurrentSublistValue({
            sublistId: sublist,  
            fieldId: 'custcol_so_adjqty'
          })

          var totalQty = Number(plannedQty) + Number(adjustmentQty)
          log.debug('total qty', totalQty)

          currentRecord.setCurrentSublistValue({
              sublistId: sublist,
              fieldId: 'quantity',
              value: totalQty
          })
      }

      return true
    }

    function fieldChanged(scriptContext) {
      let currentRecord = scriptContext.currentRecord;
      console.log('scriptContext.fieldId', scriptContext.fieldId)
      if (scriptContext.fieldId == 'custrecord_amenity_cost') {
          let objParam = {
              fieldId: 'custrecord_amenity_cost',
              totalFieldId: 'custrecord_am_total_cost'
          }
          calculateTotalCost(objParam, currentRecord);
      }
      
      if (scriptContext.fieldId == 'custrecord_amenities_srp') {
          let objParam = {
              fieldId: 'custrecord_amenities_srp',
              totalFieldId: 'custrecord_total_gross_amount'
          }
          calculateTotalCost(objParam, currentRecord);
      }

      if (scriptContext.fieldId == 'custrecord_amenity_qty') {
        updateTotalCost(currentRecord)
      }
      
    }
    
    const updateTotalCost = (currentRecord) => {
        let intTotalCost = 0
        let intTotalGross = 0
        let intQty = parseFloat(currentRecord.getCurrentSublistValue({
            sublistId: 'recmachcustrecord_amenities_transaction',
            fieldId: 'custrecord_amenity_qty'
        }));
        
        let intPurchasePrice = parseFloat(currentRecord.getCurrentSublistValue({
            sublistId: 'recmachcustrecord_amenities_transaction',
            fieldId: 'custrecord_amenity_cost'
        }));
        let intGrossPrice = parseFloat(currentRecord.getCurrentSublistValue({
            sublistId: 'recmachcustrecord_amenities_transaction',
            fieldId: 'custrecord_amenities_srp'
        }));

       
       if (!isNaN(intQty) && !isNaN(intPurchasePrice)) {
            intTotalCost = intQty * intPurchasePrice
       }
       currentRecord.setCurrentSublistValue({
        sublistId: 'recmachcustrecord_amenities_transaction',
        fieldId: 'custrecord_am_total_cost',
        value: intTotalCost
       });

       if (!isNaN(intQty) && !isNaN(intGrossPrice)) {
            intTotalGross = intQty * intGrossPrice
       }
       currentRecord.setCurrentSublistValue({
        sublistId: 'recmachcustrecord_amenities_transaction',
        fieldId: 'custrecord_total_gross_amount',
        value: intTotalGross
       });
    
     
    }

    const calculateTotalCost = (objParam, currentRecord) => {
        let totalCost = 0
        let fieldValue = parseFloat(currentRecord.getCurrentSublistValue({
            sublistId: 'recmachcustrecord_amenities_transaction',
            fieldId: objParam.fieldId
        }));
        console.log('calculateTotalCost: fieldValue', fieldValue);

        let intQty = parseFloat(currentRecord.getCurrentSublistValue({
            sublistId: 'recmachcustrecord_amenities_transaction',
            fieldId: 'custrecord_amenity_qty'
        }));
        console.log('intQty', intQty);

        // Only update total cost amount if intQty and fieldValue are truthy
        if (!isNaN(fieldValue) && !isNaN(intQty)){
            totalCost = fieldValue * intQty;
            console.log('totalCost', totalCost);
        }
        currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_amenities_transaction',
            fieldId: objParam.totalFieldId,
            value: totalCost
        });
    }


    return{
        validateLine: validateLine,
        fieldChanged: fieldChanged
    }
 
});
/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {

        const afterSubmit = (scriptContext) => {
            if (scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.COPY) {
                let intQtyStock = 0
                let intQtyIssued = 0
                let intQtyRemaining = 0
                let newRecord = scriptContext.newRecord;
                let recType = newRecord.type
                let strId = newRecord.id
                let objRecord = record.load({
                    type: recType,
                    id: strId,
                    isDynamic: true,
                });
                log.debug("objRecord", objRecord)
                if (objRecord){
                    
                    let intRelatedFoodCosting = objRecord.getValue({
                        fieldId: 'custrecord_fcs_c',
                    })
                    log.debug('afterSubmit intRelatedFoodCosting', intRelatedFoodCosting)

                    if (!intRelatedFoodCosting){
                        intQtyStock = objRecord.getValue({
                            fieldId: 'custrecord_qty_c_stock',
                        })
                        log.debug('afterSubmit intQtyStock', intQtyStock)

                        intQtyIssued = objRecord.getValue({
                            fieldId: 'custrecord_qty_issued',
                        })
                        log.debug('afterSubmit intQtyIssued', intQtyIssued)

                        intQtyRemaining = parseFloat(intQtyStock) - parseFloat(intQtyIssued)

                        objRecord.setValue({
                            fieldId: 'custrecord_qty_remaining',
                            value: parseFloat(intQtyRemaining).toFixed(2),
                        })

                        let recId = objRecord.save({
                            ignoreMandatoryFields: true,
                            enableSourcing: true,
                        })
                        log.debug('afterSubmit recId Updated', recId)
                    }

                }
            }

        }

        return {afterSubmit}

    });

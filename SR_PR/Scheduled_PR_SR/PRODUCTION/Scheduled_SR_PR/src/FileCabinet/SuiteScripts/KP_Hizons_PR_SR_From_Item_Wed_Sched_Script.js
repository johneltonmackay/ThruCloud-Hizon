/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/query', 'N/file', 'N/email'], function(search, record, query, file, email) {

    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(scriptContext) {
        log.debug('Scheduled Script', 'Scheduled Script Executed');
        var baseURL = 'https://8154337.app.netsuite.com/app';
        var searchResult = [];

        const inventoryitemSearchColName = search.createColumn({ name: 'itemid', sort: search.Sort.ASC });
        const inventoryitemSearchColDisplayName = search.createColumn({ name: 'displayname' });
        const inventoryitemSearchColType = search.createColumn({ name: 'type' });
        const inventoryitemSearchColPerishableItem = search.createColumn({ name: 'custitem_tc_perishableitem' });
        const inventoryitemSearchColParLevel = search.createColumn({ name: 'custrecord_parlevel', join: 'CUSTRECORD_ITEM_LOCATION' });
        const inventoryitemSearchColCriticalLevel = search.createColumn({ name: 'custrecord_criticallevel', join: 'CUSTRECORD_ITEM_LOCATION' });
        const inventoryitemSearchColInventoryLocation = search.createColumn({ name: 'inventorylocation' });
        const inventoryitemSearchColLocationOnHand = search.createColumn({ name: 'locationquantityonhand' });
        const inventoryitemSearchColReorderLevel = search.createColumn({ name: 'custrecord_reorderlevel', join: 'CUSTRECORD_ITEM_LOCATION' });

        const mySearchObj = search.create({
            type: 'inventoryitem',
            filters: [
                ['type', 'anyof', 'InvtPart'],
                'AND',
                [
                    ['formulanumeric: case when {custrecord_item_location.custrecord_criticallevel} > {locationquantityonhand} then 1 else 0 end', 'equalto', '1'],
                    'OR',
                    ['locationquantityonhand', 'isempty', ''],
                ],
                'AND',
                ['formulanumeric: case when {inventorylocation}={custrecord_item_location.custrecord_itemdetails_location} then 1 else 0 end', 'equalto', '1'],
                'AND',
                ['custrecord_item_location.custrecord_criticallevel', 'greaterthan', '0'],
                'AND',
                ['custrecord_item_location.custrecord_parlevel', 'greaterthan', '0'],
                'AND',
                ['custrecord_item_location.custrecord_reorderlevel', 'greaterthan', '0'],
            ],
            columns: [
                inventoryitemSearchColName,
                inventoryitemSearchColDisplayName,
                inventoryitemSearchColType,
                inventoryitemSearchColPerishableItem,
                inventoryitemSearchColParLevel,
                inventoryitemSearchColCriticalLevel,
                inventoryitemSearchColInventoryLocation,
                inventoryitemSearchColLocationOnHand,
                inventoryitemSearchColReorderLevel,
            ],
        });

        var myResultSet = mySearchObj.run();
        myResultSet.each(myIterator);
        
        // Iterator function to process search results
        function myIterator(resultObj) {
            try {
                // Retrieve values from result object with error handling
                var itemId = resultObj.id;
                var itemName = resultObj.getValue({ name: 'displayname' }) || '';
                var itemType = resultObj.getValue({ name: 'type' }) || '';
                var isPerish = resultObj.getValue({ name: 'custitem_tc_perishableitem' }) || false;
                var itemLoc = resultObj.getValue({ name: 'inventorylocation' });
                var itemPar = resultObj.getValue({ name: 'custrecord_parlevel', join: 'CUSTRECORD_ITEM_LOCATION' }) || 0;
                var criticalLev = resultObj.getValue({ name: 'custrecord_criticallevel', join: 'CUSTRECORD_ITEM_LOCATION' }) || 0;
                var qtyOnHand = resultObj.getValue({ name: 'locationquantityonhand' }) || 0;
                var reorderLev = resultObj.getValue({ name: 'custrecord_reorderlevel', join: 'CUSTRECORD_ITEM_LOCATION' }) || 0;
        
                // Create item object
                var item = {
                    id: itemId,
                    name: itemName,
                    type: itemType,
                    loc: itemLoc,
                    perish: isPerish,
                    par: itemPar,
                    crit: criticalLev,
                    qty: qtyOnHand,
                    reorder: reorderLev
                };
                
                // Check if the location already exists in searchResult
                var existingLocationIndex = searchResult.findIndex(result => result.location === itemLoc);
                
                if (existingLocationIndex !== -1) {
                    // If location exists, push the item into the existing array for that location
                    searchResult[existingLocationIndex].data.push(item);
                } else {
                    // If location doesn't exist, create a new entry for that location
                    searchResult.push({
                        location: itemLoc,
                        data: [item]
                    });
                }
                
                return true;
            } catch (e) {
                log.error('Error in myIterator', e.message);
                return false;
            }
        }

        let arritemIds = []
        searchResult.forEach(item => {
            try {
                log.debug('item', item);

                let strLocation = item.location
                let arrData = item.data
    
                var objItemPR = query.runSuiteQL({ query: "SELECT subsidiary, id FROM location WHERE id='" + strLocation + "'" }).asMappedResults()[0];
                log.debug('objItemPR.subsidiary', objItemPR ? objItemPR.subsidiary : 'No subsidiary found');
    
                if (!objItemPR) {
                    log.error('Undefined Subsidiary', 'No subsidiary found for location: ' + strLocation);
                    return; // Skip this location
                }
    
                var prRecord = record.create({
                    type: record.Type.PURCHASE_REQUISITION,
                    isDynamic: true
                });
    
                prRecord.setValue({
                    fieldId: 'subsidiary',
                    value: objItemPR.subsidiary
                });
    
                prRecord.setValue({
                    fieldId: 'location',
                    value: strLocation
                });

                arrData.forEach(item => {
                    arritemIds.push(item.id)
                });
        
                let arrItemMarkUp = getItemMarkUp(arritemIds, strLocation)
                log.debug('createPurchaseRequisition arrItemMarkUp', arrItemMarkUp)
        
    
                arrData.forEach(data => {
                    if (data.loc == '3') { // F&B Commissary location

                        let itemRateObj = arrItemMarkUp.find(item => item.itemId === data.id);
                        let itemRate = itemRateObj ? itemRateObj.aveCost : 0;
                        
                        prRecord.selectNewLine({
                            sublistId: 'item'
                        });
            
                        prRecord.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            value: data.id
                        });
        
                        prRecord.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantity',
                            value: data.reorder
                        });

                        prRecord.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            value: itemRate
                        });
    
                        prRecord.commitLine({
                            sublistId: 'item'
                        });
        
                        var prId = prRecord.save();
                        log.debug('Purchase Requisition', 'Record Id: ' + prId + ' has been saved');
                    }
                });
            } catch (error) {
                log.error('Error in searchResult', e.message);
            }


        });

    }

    // Function to get Item Mark Up
    function getItemMarkUp(arritemIds, strLocation) {
        log.debug('arritemIds', arritemIds)
        let markupValue = 0
        var itemSearch = search.create({
            type: 'item',
            filters: [
                { name: 'internalid', operator: search.Operator.ANYOF, values: arritemIds },
                { name: 'inventorylocation', operator: search.Operator.ANYOF, values: strLocation }
            ],
            columns: [
                { name: 'internalid' },
                { name: 'displayname' },
                { name: 'inventorylocation' },
                { name: 'locationaveragecost' },
                { name: 'custitem_item_class' }
            ]
        });
        let arrItemMarkUp = []
        var myResultSet = itemSearch.run();
        myResultSet.each(function(resultObj) {
            var itemId = resultObj.getValue({ name: 'internalid' });
            var itemName = resultObj.getValue({ name: 'displayname' });
            var itemLocation = resultObj.getValue({ name: 'inventorylocation' });
            var aveCost = resultObj.getValue({ name: 'locationaveragecost' });
            var classItem = resultObj.getValue({ name: 'custitem_item_class' });

            if (classItem) {
                var classRec = search.lookupFields({
                    type: 'customrecord_item_classification',
                    id: classItem,
                    columns: ['custrecord_itemclass_markup']
                });

                if (classRec.custrecord_itemclass_markup && aveCost) {
                    var muPercent = ((parseInt(classRec.custrecord_itemclass_markup.replace('%', ''), 10)) + 100) / 100;
                    markupValue = aveCost * muPercent;

                } 
            } 

            let objItemMarkUp = {
                item: itemName,
                itemId: itemId,
                location: itemLocation,
                aveCost: aveCost,
                classItem: classItem,
                markup: markupValue ? markupValue : 0,
                markpercent: muPercent ? muPercent : 0
            }

            arrItemMarkUp.push(objItemMarkUp)

            return true;
        });

        return arrItemMarkUp
    }

    return {
        execute: execute
    };

});

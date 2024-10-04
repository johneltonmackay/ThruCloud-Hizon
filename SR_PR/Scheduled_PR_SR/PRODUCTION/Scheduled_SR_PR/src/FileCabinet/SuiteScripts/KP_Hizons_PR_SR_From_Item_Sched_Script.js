/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/record', 'N/query', 'N/file', 'N/email'],
    function(search, record, query, file, email) {
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
    
            // Define search columns
            const inventoryitemSearchColName = search.createColumn({ name: 'itemid', sort: search.Sort.ASC });
            const inventoryitemSearchColDisplayName = search.createColumn({ name: 'displayname' });
            const inventoryitemSearchColType = search.createColumn({ name: 'type' });
            const inventoryitemSearchColPerishableItem = search.createColumn({ name: 'custitem_tc_perishableitem' });
            const inventoryitemSearchColParLevel = search.createColumn({ name: 'custrecord_parlevel', join: 'CUSTRECORD_ITEM_LOCATION' });
            const inventoryitemSearchColCriticalLevel = search.createColumn({ name: 'custrecord_criticallevel', join: 'CUSTRECORD_ITEM_LOCATION' });
            const inventoryitemSearchColInventoryLocation = search.createColumn({ name: 'inventorylocation' });
            const inventoryitemSearchColLocationOnHand = search.createColumn({ name: 'locationquantityonhand' });
            const inventoryitemSearchColReorderLevel = search.createColumn({ name: 'custrecord_reorderlevel', join: 'CUSTRECORD_ITEM_LOCATION' });
            const inventoryitemSearchColReorderLevelPurchaseUnit = search.createColumn({ name: 'custrecord_reorderlevel_purchunit', join: 'CUSTRECORD_ITEM_LOCATION' });
            //const inventoryitemSearchColUnits = search.createColumn({ name: 'custrecord_stock_unit', join: 'CUSTRECORD_ITEM_LOCATION' });
            const inventoryitemSearchColUnits = search.createColumn({ name: 'stockunit' });
            
            // Create search object
            const mySearchObj = search.create({
                type: 'inventoryitem',
                filters: [
                    ['type', 'anyof', 'InvtPart'],
                    'AND',
                    ['isinactive', 'is', 'F'],
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
                    inventoryitemSearchColReorderLevelPurchaseUnit,
                    inventoryitemSearchColUnits,
                ],
            });
    
            // Run search and iterate over results
            var myResultSet = mySearchObj.run();
            myResultSet.each(function(resultObj) {
                try {
                    var itemId = resultObj.id;
                    var itemName = resultObj.getValue({ name: 'displayname' });
                    var itemType = resultObj.getValue({ name: 'type' });
                    var isPerish = resultObj.getValue({ name: 'custitem_tc_perishableitem' });
                    var itemLoc = resultObj.getValue({ name: 'inventorylocation' });
                    var itemPar = resultObj.getValue({ name: 'custrecord_parlevel', join: 'CUSTRECORD_ITEM_LOCATION' });
                    var criticalLev = resultObj.getValue({ name: 'custrecord_criticallevel', join: 'CUSTRECORD_ITEM_LOCATION' });
                    var qtyOnHand = resultObj.getValue({ name: 'locationquantityonhand' });
                    var reorderLev = resultObj.getValue({ name: 'custrecord_reorderlevel', join: 'CUSTRECORD_ITEM_LOCATION' });
                    var reorderLevPurchUnit = resultObj.getValue({ name: 'custrecord_reorderlevel_purchunit', join: 'CUSTRECORD_ITEM_LOCATION' });
                    //var stockunit = resultObj.getValue({ name: 'custrecord_stock_unit', join: 'CUSTRECORD_ITEM_LOCATION' });
                    var stockunit = resultObj.getValue({ name: 'stockunit'});        
    
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
                        reorder: reorderLev,
                        reorderPurch: reorderLevPurchUnit,
                        stockunit: stockunit
                    };
                    
                    // Check if the location already exists in searchResult
                    var existingLocationIndex = searchResult.findIndex(result => result.location === itemLoc);
                    
                    if (existingLocationIndex !== -1) {
                        // If location exists, push the item into the appropriate array (perishable or nonperishable)
                        if (isPerish) {
                            searchResult[existingLocationIndex].perishable.push(item);
                        } else {
                            searchResult[existingLocationIndex].nonperishable.push(item);
                        }
                    } else {
                        // If location doesn't exist, create a new entry for that location
                        searchResult.push({
                            location: itemLoc,
                            perishable: isPerish ? [item] : [],
                            nonperishable: isPerish ? [] : [item],
                        });
                    }
                    
                    return true;
    
                } catch (e) {
                    log.error('Error in myIterator', e.message);
                    return false;
                }
            });
    
            log.debug('searchResult', searchResult);
    
    
            searchResult.forEach(item => {
                try {
                    log.debug('item', item);
    
                    let strLocation = item.location
                    let arrPerishable = item.perishable
                    let arrNonPerishable = item.nonperishable
    
                    var objItemLocation = query.runSuiteQL({
                        query: "SELECT subsidiary, id FROM location WHERE id='" + strLocation + "'"
                    }).asMappedResults()[0];
    
                    let intSubsidiary = objItemLocation.subsidiary
    
                    if (strLocation != '3' && intSubsidiary == 3){ // not F&B Commissary and F&B Solutions
                        if (arrPerishable.length > 0) {
                            createPurchaseRequisition(arrPerishable, intSubsidiary);
                        }
    
                        if (arrNonPerishable.length > 0) {
                            createStockRequisition(arrNonPerishable, intSubsidiary);
                        }
                    }
    
                    if (strLocation != '3' && intSubsidiary != 3){ // not F&B Commissary and not F&B Solutions
                        if (arrPerishable.length > 0) {
                            createPurchaseRequisition(arrPerishable, intSubsidiary);
                        }
                        if (arrNonPerishable.length > 0) {
                            createIntercompanyRequisition(arrNonPerishable, intSubsidiary);
                        }
                    }
    
                } catch (error) {
                    log.error('Error in searchResult', error.message);
                }
            });
    
        }
    
        // Function to create Purchase Requisition
        function createPurchaseRequisition(item, intSubsidiary) {
    
            let strLocation = item[0].loc
            let arrData = item
            let arritemIds = []
            
            var prRecord = record.create({
                type: record.Type.PURCHASE_REQUISITION,
                isDynamic: true
            });
    
            prRecord.setValue({
                fieldId: 'subsidiary',
                value: intSubsidiary
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
                    value: data.reorderPurch
                });
    
                prRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    value: itemRate
                });
    
                prRecord.commitLine({
                    sublistId: 'item'
                });
    
            });
    
            var prId = prRecord.save();
            log.debug('Purchase Requisition', 'Record Id: ' + prId + ' has been saved');   
        }
    
        function createStockRequisition(item, intSubsidiary) {
    
            let strLocation = item[0].loc
            let arrData = item
            let arritemIds = []
    
            var srRecord = record.create({
                type: record.Type.TRANSFER_ORDER,
                isDynamic: true
            });
    
            srRecord.setValue({
                fieldId: 'subsidiary',
                value: intSubsidiary
            });
    
            srRecord.setValue({
                fieldId: 'location',
                value: 3 // always F&B Commissary
            });
    
            srRecord.setValue({
                fieldId: 'transferlocation',
                value: strLocation
            });
    
            arrData.forEach(item => {
                arritemIds.push(item.id)
            });
    
            let arrItemMarkUp = getItemMarkUp(arritemIds, strLocation)
            log.debug('createStockRequisition arrItemMarkUp', arrItemMarkUp)
            
            arrData.forEach(data => {
    
                let itemRateObj = arrItemMarkUp.find(item => item.itemId === data.id);
                let itemRate = itemRateObj ? itemRateObj.markup : 0;
    
                srRecord.selectNewLine({
                    sublistId: 'item'
                });
    
                srRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: data.id
                });
    
                srRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'units', 
                    value: data.stockunit
                });
    
                srRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: data.reorder
                });
    
                srRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    value: itemRate
                });
    
                srRecord.commitLine({
                    sublistId: 'item'
                });
    
            });
    
            var srId = srRecord.save();
            log.debug('Stock Requisition', 'Record Id: ' + srId + ' has been saved');   
        }
    
        function createIntercompanyRequisition(item, intSubsidiary) {
    
            let strLocation = item[0].loc
            let arrData = item
            let arritemIds = []
            
            var icRecord = record.create({
                type: record.Type.INTER_COMPANY_TRANSFER_ORDER,
                isDynamic: true
            });
            
            icRecord.setValue({
                fieldId: 'tosubsidiary',
                value: intSubsidiary
            });
    
            icRecord.setValue({
                fieldId: 'subsidiary',
                value: 3 // always Hizon's F&B Solutions
            });
    
            icRecord.setValue({
                fieldId: 'location',
                value: 3 // always F&B Commissary
            });
    
            icRecord.setValue({
                fieldId: 'transferlocation',
                value: strLocation
            });
    
            arrData.forEach(item => {
                arritemIds.push(item.id)
            });
    
            let arrItemMarkUp = getItemMarkUp(arritemIds, strLocation)
            log.debug('createIntercompanyRequisition arrItemMarkUp', arrItemMarkUp)
    
            arrData.forEach(data => {
    
                let itemRateObj = arrItemMarkUp.find(item => item.itemId === data.id);
                let itemRate = itemRateObj ? itemRateObj.markup : 0;
    
                icRecord.selectNewLine({
                    sublistId: 'item'
                });
    
                icRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: data.id
                });
    
                icRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'units', 
                    value: data.stockunit
                });
    
                icRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: data.reorder
                });
    
                icRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    value: itemRate
                });
    
                icRecord.commitLine({
                    sublistId: 'item'
                });
    
            });
    
            var icId = icRecord.save();
            log.debug('Intercompany Stock Requisition', 'Record Id: ' + icId + ' has been saved'); 
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
    
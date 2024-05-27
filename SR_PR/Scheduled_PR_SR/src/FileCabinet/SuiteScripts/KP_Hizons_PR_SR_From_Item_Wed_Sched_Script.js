/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/search','N/record','N/query', 'N/file', 'N/email'],

function(search,record,query, file, email) {
   
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
        var searchResult = new Array();

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
           ['formulanumeric: case when {custrecord_item_location.custrecord_criticallevel} >  {locationquantityonhand} then 1 else 0 end', 'equalto', '1'],
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
   
       //should have same value pairs from the columns -> to getValue
       function myIterator(resultObj) {
           //get values
           var itemId =  resultObj.id

           var itemName = resultObj.getValue({
              name: 'displayname'
           });

           var itemType = resultObj.getValue({
               name: 'type'
           });

           var isPerish =  resultObj.getValue({
               name: 'custitem_tc_perishableitem'
           });

           var itemLoc = resultObj.getValue({
              name: 'inventorylocation'
           });

           var itemPar = resultObj.getValue({
               name: 'custrecord_parlevel',
               join : 'CUSTRECORD_ITEM_LOCATION'
           });

           var criticalLev = resultObj.getValue({
               name: 'custrecord_criticallevel',
               join : 'CUSTRECORD_ITEM_LOCATION'
           });

           var qtyOnHand = resultObj.getValue({
               name: 'locationquantityonhand'
           });

           var reorderLev =  resultObj.getValue({
               name: 'custrecord_reorderlevel',
               join : 'CUSTRECORD_ITEM_LOCATION'
           });
          
           searchResult.push({
           "id": itemId,
           "name": itemName,
           "type": itemType,
           "perish": isPerish,
           "loc": itemLoc,
           "par": itemPar,
           "crit": criticalLev,
           "qty": qtyOnHand,
           "reorder": reorderLev
          });

          return true;
       }
       log.debug('searchResult',searchResult)
       log.debug('searchResult', searchResult);

       // Initialize an object to store consolidated data
       var consolidatedRecords = {};
       
       // Iterate through search results to consolidate data by location
       for (var i = 0; i < searchResult.length; i++) {
           if (searchResult[i].perish === true || searchResult[i].loc === 3) {
               var objItemPR = query.runSuiteQL({
                   query: "SELECT subsidiary, id FROM location WHERE id='" + searchResult[i].loc + "'"
               }).asMappedResults()[0];
       
               var locationId = searchResult[i].loc;
       
               // If the location doesn't exist in the consolidated records, create a new entry
               if (!consolidatedRecords[locationId]) {
                   consolidatedRecords[locationId] = {
                       subsidiary: objItemPR.subsidiary,
                       department: 25,
                       class: 3,
                       location: searchResult[i].loc,
                       items: []
                   };
               }
       
               // Push item data to the items array for the corresponding location
               consolidatedRecords[locationId].items.push({
                   item: searchResult[i].id,
                   quantity: searchResult[i].reorder
               });
           }
       }
       
       // Create PR records for each consolidated location
       for (var locationId in consolidatedRecords) {
           var locationData = consolidatedRecords[locationId];
       
           var prRecord = record.create({
               type: record.Type.PURCHASE_REQUISITION
           });
       
           prRecord.setValue({
               fieldId: 'subsidiary',
               value: locationData.subsidiary
           });
       
           prRecord.setValue({
               fieldId: 'department',
               value: locationData.department
           });
       
           prRecord.setValue({
               fieldId: 'class',
               value: locationData.class
           });
       
           prRecord.setValue({
               fieldId: 'location',
               value: locationData.location
           });
       
           // Add items to PR sublist
           locationData.items.forEach(function(item, index) {
               prRecord.setSublistValue({
                   sublistId: 'item',
                   fieldId: 'item',
                   line: index,
                   value: item.item
               });
       
               prRecord.setSublistValue({
                   sublistId: 'item',
                   fieldId: 'quantity',
                   line: index,
                   value: item.quantity
               });
           });
       
           var prId = prRecord.save();
           log.debug('Purchase Requisition', 'Record Id: ' + prId + ' has been saved');
       
           var records = {
               transaction: prId
           };
           var body = 'A Purchase Requisition has been made by a scheduled script, Purchase Requisition Record Id: ' + prId;
           var recordLink = baseURL + '/accounting/transactions/purchreq.nl?id=' + prId;
       
        //    email.send({
        //        author: 45,
        //        recipients: 'kim@thrucloudsolutions.com',
        //        subject: 'Purchase Requisition has been Created',
        //        body: body + ' ' + recordLink,
        //        relatedRecords: records
        //    });
       }
       
   }

    return {
        execute: execute
    };
    
});

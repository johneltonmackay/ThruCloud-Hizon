/**
 * @NApiVersion 2.x
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
       for(var i = 0; i<searchResult.length; i++){
           if(searchResult[i].perish == true && searchResult[i].loc != 3){    //is Perishable or NOT F&B Commisary location
               var prRecord = record.create({
                   type: record.Type.PURCHASE_REQUISITION
               });

               var objItemPR = query.runSuiteQL({query: "SELECT subsidiary, id FROM location WHERE id='"+searchResult[i].loc+"'"}).asMappedResults()[0];
               
               prRecord.setValue({
                   fieldId: 'subsidiary',
                   value: objItemPR.subsidiary
               })

               prRecord.setValue({
                   fieldId: 'department',
                   value: 25
               })

               prRecord.setValue({
                   fieldId: 'class',
                   value: 3
               })

               prRecord.setValue({
                   fieldId: 'location',
                   value: searchResult[i].loc
               })

               prRecord.setSublistValue({
                   sublistId: 'item',
                   fieldId: 'item',
                   line: 0,
                   value: searchResult[i].id
               });

               prRecord.setSublistValue({
                   sublistId: 'item',
                   fieldId: 'quantity',
                   line: 0,
                   value: searchResult[i].reorder
               });

               prRecord.setSublistValue({
                   sublistId: 'item',
                   fieldId: 'department',
                   line: 0,
                   value: 25
               });

               var prId = prRecord.save();
               log.debug('Purchase Requistion', 'Record Id: ' +prId+ ' has been saved')

               var records = {transaction : prId}
               var body = 'A Purchase Requisition has been made by a scheduled script, Purchase Requisition Record Id: '+prId; 
               var recordLink = baseURL + '/accounting/transactions/purchreq.nl?id=' + prId;

            //    email.send({
            //        author: 45,
            //        recipients: ['ellen@thrucloudsolutions.com','angie@thrucloudsolutions.com'],
            //        subject: 'Purchase Requisition has been Created',
            //        body: body + ' ' + recordLink,
            //        relatedRecords: records
            //    });
           }
           else{
            var objItemTOLoc = query.runSuiteQL({query: "SELECT subsidiary, id FROM location WHERE id='"+searchResult[i].loc+"'"}).asMappedResults()[0];
            var objItemFromLoc = query.runSuiteQL({query: "SELECT subsidiary, id FROM location WHERE id='"+searchResult[i].loc+"'"}).asMappedResults()[0];
           
               if(objItemTOLoc.subsidiary != objItemFromLoc.subsidiary && searchResult[i].loc != 3){   //not Perishable and Intercompany location
                   var icSrRecord = record.create({
                       type: record.Type.INTER_COMPANY_TRANSFER_ORDER
                   });
               
                   
                   icSrRecord.setValue({
                       fieldId: 'tosubsidiary',
                       value: objItemTOLoc.subsidiary
                   })
               
                   icSrRecord.setValue({
                       fieldId: 'subsidiary',
                       value: 3
                   })

                   icSrRecord.setValue({
                       fieldId: 'transferlocation',
                       value: searchResult[i].loc
                   })

                   icSrRecord.setValue({
                       fieldId: 'location',
                       value: 3
                   })

                   icSrRecord.setSublistValue({
                       sublistId: 'item',
                       fieldId: 'item',
                       line: 0,
                       value: searchResult[i].id
                   });

                   icSrRecord.setSublistValue({
                       sublistId: 'item',
                       fieldId: 'department',
                       line: 0,
                       value: 25
                   });

                   icSrRecord.setSublistValue({
                       sublistId: 'item',
                       fieldId: 'class',
                       line: 0,
                       value: 3
                   })
   
                   icSrRecord.setSublistValue({
                       sublistId: 'item',
                       fieldId: 'quantity',
                       line: 0,
                       value: searchResult[i].reorder
                   });

                   //Setting of Mark Up

                   var itemSearchColInventoryLocation = search.createColumn({ name: 'inventorylocation' });
                   var itemSearchColLocationAverageCost = search.createColumn({ name: 'locationaveragecost' });
                   var itemSearchColItemClass = search.createColumn({ name: 'custitem_item_class' });
   
                   var itemSearchFilterInternalId = search.createFilter({
                       name : 'internalid',
                       operator: search.Operator.ANYOF,
                       values: searchResult[i].id
                   })
                   var itemSearchFilterLocation = search.createFilter({
                       name : 'inventorylocation',
                       operator: search.Operator.ANYOF,
                       values: 3
                   })
   
                   var itemSearch = search.create({
                       type: 'item',
                       filters: [
                           itemSearchFilterInternalId,
                           itemSearchFilterLocation
                       ],
                       columns: [
                           itemSearchColInventoryLocation,
                           itemSearchColLocationAverageCost,
                           itemSearchColItemClass
                       ],
                   });
                   var myResultSet = itemSearch.run();
                   myResultSet.each(myIterator);
                       
                   //should have same value pairs from the columns -> to getValue
                   function myIterator(resultObj) {
                       //get values
                       var id = resultObj.id;
                       var location = resultObj.getValue({
                           name: 'inventorylocation'
                       });
                       var aveCost = resultObj.getValue({
                           name: 'locationaveragecost'
                       });
                       var classItem = resultObj.getValue({
                           name: 'custitem_item_class'
                       });
                         
                       if(classItem){
                           var classRec = search.lookupFields({
                               type: 'customrecord_item_classification',
                               id: classItem,
                               columns: ['custrecord_itemclass_markup']
                           });
       
                           if(classRec.custrecord_itemclass_markup && aveCost){
                               var muPercent = ((parseInt(classRec.custrecord_itemclass_markup.replace('%', ''), 10))+100)/100;
                               var markupValue = aveCost * muPercent;
                               
                               icSrRecord.setSublistValue({
                                   sublistId: 'item',
                                   fieldId: 'rate',
                                   line: 0,
                                   value: markupValue
                               })
                           }
                           else{
                               icSrRecord.setSublistValue({
                                   sublistId: 'item',
                                   fieldId: 'rate',
                                   line: 0,
                                   value: 0
                               })
                           }
                       }
                       else{
                           icSrRecord.setSublistValue({
                               sublistId: 'item',
                               fieldId: 'rate',
                               line: 0,
                               value: 0
                           })
                       }
                       
                       return true;
                   }
   
                   var icSrId = icSrRecord.save();
                   log.debug('InterCompany Transfer Order', 'Record Id: ' +icSrId+ ' has been saved')
                   var records = {transaction : icSrId}
                   var body = 'A InterCompany Transfer Order has been made by a scheduled script, InterCompany Transfer Order Record Id: '+icSrId;
                   var recordLink = baseURL + '/accounting/transactions/trnfrord.nl?id=' + icSrId;

                //    email.send({
                //        author: 45,
                //        recipients: ['ellen@thrucloudsolutions.com','angie@thrucloudsolutions.com'],
                //        subject: 'InterCompany Transfer Order has been Created',
                //        body: body + ' ' + recordLink,
                //        relatedRecords: records
                //    });
   
               }
               else if(objItemTOLoc.subsidiary == objItemFromLoc.subsidiary && searchResult[i].loc != 3){                                                                           //not Perishable and not Intercompany location
                   var srRecord = record.create({
                       type: record.Type.TRANSFER_ORDER
                   });
                 
                   srRecord.setValue({
                       fieldId: 'subsidiary',
                       value: objItemTOLoc.subsidiary
                   })
               
                   srRecord.setValue({
                       fieldId: 'transferlocation',
                       value: searchResult[i].loc
                   })

                   srRecord.setValue({
                       fieldId: 'location',
                       value: 3
                   })

                   srRecord.setSublistValue({
                       sublistId: 'item',
                       fieldId: 'item',
                       line: 0,
                       value: searchResult[i].id
                   });

                   srRecord.setSublistValue({
                       sublistId: 'item',
                       fieldId: 'department',
                       line: 0,
                       value: 25
                   });

                   srRecord.setSublistValue({
                       sublistId: 'item',
                       fieldId: 'class',
                       line: 0,
                       value: 3
                   })
   
                   srRecord.setSublistValue({
                       sublistId: 'item',
                       fieldId: 'quantity',
                       line: 0,
                       value: searchResult[i].reorder
                   });

                   //Setting of Mark Up

                   var itemSearchColInventoryLocation = search.createColumn({ name: 'inventorylocation' });
                   var itemSearchColLocationAverageCost = search.createColumn({ name: 'locationaveragecost' });
                   var itemSearchColItemClass = search.createColumn({ name: 'custitem_item_class' });
   
                   var itemSearchFilterInternalId = search.createFilter({
                       name : 'internalid',
                       operator: search.Operator.ANYOF,
                       values: searchResult[i].id
                   })
                   var itemSearchFilterLocation = search.createFilter({
                       name : 'inventorylocation',
                       operator: search.Operator.ANYOF,
                       values: 3
                   })
   
                   var itemSearch = search.create({
                       type: 'item',
                       filters: [
                           itemSearchFilterInternalId,
                           itemSearchFilterLocation
                       ],
                       columns: [
                           itemSearchColInventoryLocation,
                           itemSearchColLocationAverageCost,
                           itemSearchColItemClass
                       ],
                   });
                   var myResultSet = itemSearch.run();
                   myResultSet.each(myIterator);
                       
                   //should have same value pairs from the columns -> to getValue
                   function myIterator(resultObj) {
                       //get values
                       var id = resultObj.id;
                       var location = resultObj.getValue({
                           name: 'inventorylocation'
                       });
                       var aveCost = resultObj.getValue({
                           name: 'locationaveragecost'
                       });
                       var classItem = resultObj.getValue({
                           name: 'custitem_item_class'
                       });
                           
                       if(classItem){
                           var classRec = search.lookupFields({
                               type: 'customrecord_item_classification',
                               id: classItem,
                               columns: ['custrecord_itemclass_markup']
                           });
       
                           if(classRec.custrecord_itemclass_markup && aveCost){
                               var muPercent = ((parseInt(classRec.custrecord_itemclass_markup.replace('%', ''), 10))+100)/100;
                               var markupValue = aveCost * muPercent;
                               
                               srRecord.setSublistValue({
                                   sublistId: 'item',
                                   fieldId: 'rate',
                                   line: 0,
                                   value: markupValue
                               })
                           }
                           else{
                               srRecord.setSublistValue({
                                   sublistId: 'item',
                                   fieldId: 'rate',
                                   line: 0,
                                   value: 0
                               })
                           }
                       }
                       else{
                           srRecord.setSublistValue({
                               sublistId: 'item',
                               fieldId: 'rate',
                               line: 0,
                               value: 0
                           })
                       }
                       return true;
                   }
   
                   var srId = srRecord.save();
                   log.debug('Transfer Order', 'Record Id: ' +srId+ ' has been saved')
                   var records = {transaction : srId}
                   var body = 'A Transfer Order has been made by a scheduled script, Transfer Order Record Id: '+srId;
                   var recordLink = baseURL + '/accounting/transactions/trnfrord.nl?id=' + srId;

                //    email.send({
                //        author: 45,
                //        recipients: ['ellen@thrucloudsolutions.com','angie@thrucloudsolutions.com'],
                //        subject: 'Transfer Order has been Created',
                //        body: body + ' ' + recordLink,
                //        relatedRecords: records
                //    });
               }
               
           }
       }
   }

    return {
        execute: execute
    };
    
});

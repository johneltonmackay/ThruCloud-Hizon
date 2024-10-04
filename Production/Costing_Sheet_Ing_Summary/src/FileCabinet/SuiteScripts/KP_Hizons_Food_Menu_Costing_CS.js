/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/runtime','N/currentRecord', 'N/search', 'N/record', 'N/url'],

function(runtime, currentRecord, search, record, url) {
    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */

    function pageInit_food_menu_costing(scriptContext) {
                  
    }

    function checkStatus(checklog) {
        var currRecObj = currentRecord.get();

        console.log('currRecObj',currRecObj)
        console.log('checklog',checklog)
    
        if(checklog){
          console.log('checklog if',checklog)
            if(checklog == 1){
                alert('The Record has been Successfully Saved from Previous Saving')
            }
            else if(checklog == 0){
                alert('The Record Failed to Saved fully from Previous Saving')
                
            }
            else if(checklog == 2){ 
                alert('The Record is currently still In-Progress')
            }
        }

        var output = url.resolveRecord({
            recordType: 'customrecord_costing_sheet',
            recordId: currRecObj.id,
            isEditMode: false
        });
        console.log('output',output)
        window.location.href = output;
    }


    function fieldChanged_food_menu_costing(scriptContext) {
        var currRecObj = currentRecord.get();
        console.log(scriptContext)
        if (
            scriptContext.fieldId == 'custrecord_fcs_pax' ||
            scriptContext.fieldId == 'custrecord_fcs_price_head' ||
            scriptContext.fieldId == 'custrecord_menu_cost'
        ) {
            var menuCostTotal = 0;
            var menuCost = 0;
            var menuCostAdden = 0;
            var totalRev = 0;
            var totalRevAdden = 0;
            var paxTotal = 0;
            var headPriceTotal = 0;

            currRecObj.setValue({
                fieldId : 'custrecord_header_modified',
                value : true
            })

            var budget = currRecObj.getValue({
                fieldId : 'custrecord_budget'
            })

            var chargeTo = currRecObj.getValue({
                fieldId : 'custrecord_charge_to'
            })

            if(!budget){
                if(chargeTo == 4){
                    alert('Please Enter Budget')
                    return false;
                }
            }
            var fmLine = currRecObj.getLineCount({
                sublistId: 'recmachcustrecord_related_topsheet'
            });
    
            console.log('fmLine',fmLine)
    
            if(fmLine > 0){
                for(var i = 0; i<fmLine;i++){
                    console.log('fmLine',i)
                    if(i == scriptContext.line){
                        var fmRec = currRecObj.getCurrentSublistValue({
                            sublistId: 'recmachcustrecord_related_topsheet',
                            fieldId: 'id'
                        });

                        var menuCostLine = currRecObj.getCurrentSublistValue({
                            sublistId: 'recmachcustrecord_related_topsheet',
                            fieldId: 'custrecord_menu_cost'
                        });

                        var paxLine = currRecObj.getCurrentSublistValue({
                            sublistId: 'recmachcustrecord_related_topsheet',
                            fieldId: 'custrecord_fcs_pax'
                        });
    
                        var headPriceLine = currRecObj.getCurrentSublistValue({
                            sublistId: 'recmachcustrecord_related_topsheet',
                            fieldId: 'custrecord_fcs_price_head'
                        });

                        var costHead = currRecObj.getCurrentSublistValue({
                            sublistId: 'recmachcustrecord_related_topsheet',
                            fieldId: 'custrecord_fcs_cost_head'
                        });
                        console.log('menuCostLine',menuCostLine)
                        if(menuCostLine == null){
                            menuCostAdden = menuCostLine;
                        }
                        else{
                            menuCostAdden = 0;
                        }
                       
                        
                        //menuCostAdden = menuCost;
                        console.log('menuCostAdden',menuCostAdden)
                        totalRevAdden = headPriceLine * paxLine;

                        currRecObj.setCurrentSublistValue({
                            sublistId: 'recmachcustrecord_related_topsheet',
                            fieldId: 'custrecord_menu_cost',
                            value: menuCostAdden,
                            ignoreFieldChange: true,
                            forceSyncSourcing: true
                        });
                    }
                    else{
                        var menuCostLine = currRecObj.getSublistValue({
                            sublistId: 'recmachcustrecord_related_topsheet',
                            fieldId: 'custrecord_menu_cost',
                            line: i
                        });
                        if(menuCostLine){
                            menuCostAdden = menuCostLine;
                        }
                        else{
                            menuCostAdden = 0;
                        }

                        var paxLine = currRecObj.getSublistValue({
                            sublistId: 'recmachcustrecord_related_topsheet',
                            fieldId: 'custrecord_fcs_pax',
                            line: i
                        });
            
                        var headPriceLine = currRecObj.getSublistValue({
                            sublistId: 'recmachcustrecord_related_topsheet',
                            fieldId: 'custrecord_fcs_price_head',
                            line: i
                        });

                        
                        console.log('headPriceLine',headPriceLine)
                        console.log('paxLine',paxLine)
                        totalRevAdden = headPriceLine * paxLine;
                    }
                    
                    console.log('menuCostLine',menuCostLine)
                    

                    menuCostTotal = parseFloat(menuCostTotal) + parseFloat(menuCostAdden);
                    //enuCostTotal = menuCostTotal.toFixed(2)

                    console.log('menuCostTotal',menuCostTotal)

                    paxTotal = paxTotal + paxLine;
        
                    console.log('paxTotal',paxTotal)
    
                    headPriceTotal = headPriceTotal + headPriceLine;
        
                    console.log('headPriceTotal',headPriceTotal)

                    totalRev = totalRev + totalRevAdden;

                    console.log('totalRevAdden',totalRevAdden)
                    console.log('totalRev',totalRev)

                    currRecObj.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_related_topsheet',
                        fieldId: 'custrecord_fm_is_modified',
                        value: true,
                        ignoreFieldChange: true,
                        forceSyncSourcing: true
                    });
                }
            }
            else{
                var menuCostLine = currRecObj.getCurrentSublistValue({
                    sublistId: 'recmachcustrecord_related_topsheet',
                    fieldId: 'custrecord_menu_cost'
                });


                if(menuCostLine){
                    menuCostAdden = menuCostLine;
                }
                else{
                    menuCostAdden = 0;
                }

                var paxLine = currRecObj.getCurrentSublistValue({
                    sublistId: 'recmachcustrecord_related_topsheet',
                    fieldId: 'custrecord_fcs_pax'
                });

                var headPriceLine = currRecObj.getCurrentSublistValue({
                    sublistId: 'recmachcustrecord_related_topsheet',
                    fieldId: 'custrecord_fcs_price_head'
                });
              
                menuCostTotal = parseFloat(menuCostTotal) + parseFloat(menuCostAdden);
                //menuCostTotal = menuCostTotal.toFixed(2)
                totalRevAdden = headPriceLine * paxLine;
                totalRev = totalRev + totalRevAdden;
                console.log('menuCostTotal',menuCostTotal)
                console.log('headPriceLine',headPriceLine)
                console.log('paxLine',paxLine)
                console.log('totalRevAdden',totalRevAdden)
                console.log('totalRev',totalRev)

                if(paxLine)paxTotal = paxTotal + paxLine;
        
                console.log('paxTotal',paxTotal)

                if(headPriceLine)headPriceTotal = headPriceTotal + headPriceLine;
        
                console.log('headPriceTotal',headPriceTotal)

                currRecObj.setCurrentSublistValue({
                    sublistId: 'recmachcustrecord_related_topsheet',
                    fieldId: 'custrecord_fm_is_modified',
                    value: true,
                    ignoreFieldChange: true,
                    forceSyncSourcing: true
                });
            }
    
            if(chargeTo == 4){
    
                var budOverCost = budget - menuCostTotal;

                currRecObj.setValue({
                    fieldId: 'custrecord_total_food_cost_stored',
                    value: menuCostTotal
                })

                currRecObj.setValue({
                    fieldId: 'custrecord_total_revenue_stored',
                    value: totalRev
                })

                currRecObj.setValue({
                    fieldId: 'custrecord_budget_over_cost',
                    value: budOverCost
                })
            }
            
    
        }
       
    }

    function sublistChanged_food_menu_costing(scriptContext) {
        var currentRecord = scriptContext.currentRecord;
        var sublistName = scriptContext.sublistId;
        var op = scriptContext.operation;

    }

    return {
        checkStatus: checkStatus,
        pageInit: pageInit_food_menu_costing,
        fieldChanged: fieldChanged_food_menu_costing,
        sublistChanged: sublistChanged_food_menu_costing,
        /*postSourcing: postSourcing,
        lineInit: lineInit,
        validateField: validateField,
        validateLine: validateLine,
        validateInsert: validateInsert,
        validateDelete: validateDelete
        saveRecord: saveRecord*/
    };
    
});
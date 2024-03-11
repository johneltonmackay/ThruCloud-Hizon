/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([
    'N/query',
    'N/search',
    '../Library/hcs_lib_mapping'

],
(query, search, mapping) => {
    
    const beforeLoad = (scriptContext) => {
        const recNewRecord = scriptContext.newRecord;
        const strRecordType = recNewRecord.type;
        log.error('strRecordType', strRecordType);
        const objForm = scriptContext.form;
        const strSuiteLetConverter = '/app/site/hosting/scriptlet.nl?script=customscript_hcs_costingsheetconverte_sl&deploy=customdeploy_hcs_costingsheetconverte_sl'

        const strStatus = recNewRecord.getValue({fieldId: 'custrecord_status'})
        const intSubsidiary = recNewRecord.getValue({fieldId: 'custrecord_cs_subsidiary'})
        log.audit('fields', {
            status: strStatus,
            subsidiary: intSubsidiary
        })
        var res = query.runSuiteQL({
            query: `
                select * from transaction where custbody_related_costing_sheet = ${recNewRecord.id} AND recordtype = 'salesorder';
            `
        }).asMappedResults()
        
        var hasTransaction = res.length > 0? true: false


        var requisitionRes = query.runSuiteQL({
            query: `
                Select id, recordtype from transaction where custbody_related_costing_sheet = ${recNewRecord.id} AND recordtype = 'purchaserequisition'
            `
        }).asMappedResults();
        var hasRequisition = requisitionRes.length > 0? true: false;

        var transferOrderRes = query.runSuiteQL({
            query: `
                Select id, recordtype from transaction where custbody_related_costing_sheet = ${recNewRecord.id} AND recordtype = 'transferorder'
            `
        }).asMappedResults();
        var hasTransferOrder = transferOrderRes.length > 0? true: false;

        var isIngSum = recNewRecord.getValue({ fieldId: 'custrecord_ingdt_summary_generated'});
		var chargeTo = recNewRecord.getValue({ fieldId: 'custrecord_charge_to'});
		
       if(scriptContext.type === scriptContext.UserEventType.EDIT || scriptContext.type === scriptContext.UserEventType.VIEW){
			var soId = recNewRecord.getValue({ fieldId: 'custrecord_transaction_fcs'});
			var soText = recNewRecord.getText({ fieldId: 'custrecord_transaction_fcs'});
			var eventDate = recNewRecord.getText({ fieldId: 'custrecord_event_date'});
			log.debug('soText', soText)
            log.debug('soId', soId)
		  
			var soStrArr = soText.split(' ');
			var soFields;
			if((soStrArr[0] == 'Sales' && soStrArr[1] == 'Order') || soStrArr[0] == 'Proposal'){
				 if(soStrArr[0] == 'Sales'){
                   soFields = search.lookupFields({
					  type: search.Type.SALES_ORDER,
					  id: soId,
					  columns: ['custbody_beo_type', 'custbody_hz_total_number_of_pax']
				   });
                 }
                 else if(soStrArr[0] == 'Proposal'){
                    soFields = search.lookupFields({
					  type: search.Type.ESTIMATE,
					  id: soId,
					  columns: ['custbody_beo_type', 'custbody_hz_total_number_of_pax']
				   });
                 }

				var beoType;
				var noPax = 0;
              log.debug('soFields.length', soFields.length)
              log.debug('soFields', soFields)
              log.debug('soFields.custbody_beo_type', soFields.custbody_beo_type)
              log.debug('soFields.custbody_hz_total_number_of_pax', soFields.custbody_hz_total_number_of_pax)
			  if(soFields){
				   if(soFields.custbody_beo_type.length > 0){
					  beoType = soFields.custbody_beo_type[0].value;
				   } 

				   if(soFields.custbody_hz_total_number_of_pax.length > 0){
					  noPax = soFields.custbody_hz_total_number_of_pax;
				   } 
			  }

			  var soShowBtn = false;

			  if((beoType == 1 && noPax > 50) || beoType == 2){
				soShowBtn = true;
			  }
              log.debug('beoType',beoType)
              log.debug('noPax',noPax)
			  log.debug('XXX soShowBtn',soShowBtn)

			  var currentDate = new Date();
			  currentDate.setHours(0, 0, 0, 0); // Set time to midnight
              log.debug('currentDate',currentDate)
			  // Set the target date (01/11/2024)
			  var targetDate = new Date(eventDate);
			  targetDate.setHours(0, 0, 0, 0); // Set time to midnight
              log.debug('targetDate',targetDate)
			  // Calculate the difference in milliseconds
			  var difference = targetDate.getTime() - currentDate.getTime();
              log.debug('difference',difference)
			  // Convert the difference from milliseconds to days
			  var differenceInDays = difference / (1000 * 3600 * 24);
			  var eventDateShowBtn = false;
			  var loc;
			  
			  if (differenceInDays <= 2 && noPax < 50) {
				 eventDateShowBtn = false;
			  }
			  else if (differenceInDays <= 2 && noPax > 50) {
				loc = 3;
                eventDateShowBtn = true;
			  } 
              else if (differenceInDays > 2 && noPax > 50) {
                eventDateShowBtn = true;
			  } 
              else if (differenceInDays > 2 && noPax < 50) {
                eventDateShowBtn = true;
			  } 
			}
		}

		log.debug('isIngSum',isIngSum)
		log.debug('chargeTo',chargeTo)
        log.debug('hasRequisition',hasRequisition)
        log.debug('strStatus',strStatus);
      log.debug('eventDateShowBtn',eventDateShowBtn);
       log.debug('hasTransferOrder',hasTransferOrder);

        try{
            switch(strRecordType) {
                case 'customrecord_costing_sheet': {
                  

                    if(strStatus == mapping.GLOBAL.status.approved) {
                          if(chargeTo != 3){
                            if(hasRequisition === false && isIngSum){
                                objForm.addButton({
                                    id: 'custpage_btn_createpr',
                                    label: 'Create PR',
                                    functionName: `
                                        window.open('${strSuiteLetConverter}&action=createPurchaseRequest&costingSheet=${recNewRecord.id}&subsidiary=${intSubsidiary}', '_self')
                                    `
                                })
							}
                          }
                          else{
                            if(hasRequisition === false && isIngSum && soShowBtn && eventDateShowBtn){
                                objForm.addButton({
                                    id: 'custpage_btn_createpr',
                                    label: 'Create PR',
                                    functionName: `
                                        window.open('${strSuiteLetConverter}&action=createPurchaseRequest&costingSheet=${recNewRecord.id}&subsidiary=${intSubsidiary}', '_self')
                                    `
                                })
							}
                          }

                            //var chargeTo = recNewRecord.getValue({ fieldId: 'custrecord_charge_to'});
                            
                            if(hasTransaction === false /*&& chargeTo === '1'*/){
                                if(isIngSum && chargeTo == 4){
								objForm.addButton({
                                    id: 'custpage_btn_createso',
                                    label: 'Create SO',
                                    functionName: `
                                        window.open('${strSuiteLetConverter}&action=createSalesOrder&costingSheet=${recNewRecord.id}', '_self')
                                    `
                                })
								}
                            }
                            if(chargeTo != 3){
                              if(hasTransferOrder === false && isIngSum){
                                let blnValidator = hideSRButton(scriptContext)
                                    if (blnValidator){ 
                                        objForm.addButton({
                                            id: 'custpage_btn_createsr',
                                            label: 'Create SR',
                                            functionName: `
                                                window.open('${strSuiteLetConverter}&action=createStockRequisition&costingSheet=${recNewRecord.id}', '_self')
                                            `
                                        });
                                    }
								}    
                            }
                            else{
                              if(hasTransferOrder === false && isIngSum && soShowBtn && eventDateShowBtn){
                                let blnValidator = hideSRButton(scriptContext)
                                    if (blnValidator){
                                        objForm.addButton({
                                            id: 'custpage_btn_createsr',
                                            label: 'Create SR',
                                            functionName: `
                                                window.open('${strSuiteLetConverter}&action=createStockRequisition&costingSheet=${recNewRecord.id}', '_self')
                                            `
                                        });
                                    }
								}    
                            }
                            
                            
                        // }
                      
                    }

                  
                if(intSubsidiary != '3') {

                    /*objForm.addButton({
                        id: 'custpage_btn_createia',
                        label: 'Create IA',
                        functionName: `
                            window.open('${strSuiteLetConverter}&action=createInventoryAdjustment&costingSheet=${recNewRecord.id}', '_self')
                        `
                    })*/
               }

                    break
                }
                case 'opportunity': {
                    objForm.addButton({
                        id: 'custpage_btn_createopp',
                        label: 'Create Costing Sheet',
                        functionName: `
                            window.open('${strSuiteLetConverter}&action=createCostingSheetFromOpportunity&opportunity=${recNewRecord.id}', '_self')
                        `
                    })
                }
                
                
            }
        }catch(objError) {
            log.error('ue error catched', objError)
        }
        
    }

    //private function
    const hideSRButton = (scriptContext) => {
        let blnValidator = true
        const recNewRecord = scriptContext.newRecord;
        const strRecordType = recNewRecord.type;
        log.debug('hideSRButton strRecordType', strRecordType);

        if (strRecordType == 'customrecord_costing_sheet'){
            let intLocation = recNewRecord.getValue({
                fieldId: 'custrecord_tc_costingsheet_location'
            })
            log.debug('hideSRButton intLocation', intLocation);

            let intBanquetType = recNewRecord.getValue({
                fieldId: 'custrecord_trans_banquet_type'
            })
            log.debug('hideSRButton intBanquetType', intBanquetType);

            if (intLocation == 3 && intBanquetType == 'Banquet Type 2'){
                log.debug('hideSRButton test');
                blnValidator = false
            }
        }

        return blnValidator
    }


    return {beforeLoad}

});

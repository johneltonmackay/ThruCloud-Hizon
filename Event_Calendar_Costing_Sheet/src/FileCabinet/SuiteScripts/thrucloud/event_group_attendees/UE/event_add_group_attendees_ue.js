/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 */
    (record, search) => {
        
        const beforeSubmit = (scriptContext) => {
            log.debug('beforeSubmit: scriptContext', JSON.stringify(scriptContext))
            const objCurrRec = scriptContext.newRecord
            if (objCurrRec){
                let strVenue = objCurrRec.getValue({
                    fieldId: 'location'
                })
                log.debug('beforeSubmit: strVenue', strVenue)
        
                if (strVenue){
                    let numLines = objCurrRec.getLineCount({
                        sublistId: 'attendee'
                    })
                    log.debug('beforeSubmit: numLines', numLines)
                    let arrExistingAttendees = getExistingAttendees(objCurrRec, numLines)
                    let arrAttendees = searchGroup(strVenue, arrExistingAttendees)
                    if (arrAttendees.length > 0){
                        try {
                            arrAttendees.forEach((data, index) => {
                                for (let key in data) {
                                    if (data.hasOwnProperty(key)) {
                                        let value = data[key];
                                        objCurrRec.setSublistValue({
                                            sublistId: 'attendee',
                                            fieldId: key, 
                                            value: value,
                                            line: numLines + index,
                                        });
                                    }
                                }
                            });
                        } catch (error) {
                            log.error('beforeSubmit error', error.message);
                        }
                    }
                }
            }
        }
        const afterSubmit = (scriptContext) => {
            log.debug('afterSubmit: scriptContext', JSON.stringify(scriptContext))
        }

        //private function
        const getExistingAttendees = (objCurrRec, numLines) => {
            let arrAttendees = []
            for (let i = 0; i < numLines; i++) {
                let intAttendee = objCurrRec.getSublistValue({
                    sublistId: 'attendee',
                    fieldId: 'attendee',
                    line: i
                })
                if (intAttendee){
                    arrAttendees.push(intAttendee)
                }
            } 
            log.debug('getExistingAttendees: arrAttendees', arrAttendees)
            return arrAttendees
        }

        const searchGroup = (strVenue, arrExistingAttendees) => {
            let arrAttendees = [];
            try {
                let objGroupSearch = search.create({
                    type: 'entitygroup',
                    filters: [
                        ['groupname', 'is', strVenue],
                        'AND',
                        ['groupmember.internalid', 'noneof', arrExistingAttendees],
                      ],
                    columns: [
                        search.createColumn({name: 'groupname'}),
                        search.createColumn({ name: 'internalid', join: 'groupmember' }),
                    ],

                });
                var searchResultCount = objGroupSearch.runPaged().count;
                if (searchResultCount != 0) {
                    var pagedData = objGroupSearch.runPaged({pageSize: 1000});
                    for (var i = 0; i < pagedData.pageRanges.length; i++) {
                        var currentPage = pagedData.fetch(i);
                        var pageData = currentPage.data;
                        if (pageData.length > 0) {
                            for (var pageResultIndex = 0; pageResultIndex < pageData.length; pageResultIndex++) {
                                var intMemberId = pageData[pageResultIndex].getValue({ name: 'internalid', join: 'groupmember' });

                                // Check if memberId already exists in arrTransaction
                                var existingIndex = arrAttendees.findIndex(item => item.memberId === intMemberId);
                                if (existingIndex == -1) {
                                    // If doesn't exist, create a item
                                    arrAttendees.push({
                                        attendee: intMemberId,
                                        response: 'ACCEPTED'
                                    });
                                }
                            }
                        }
                    }
                }
                log.debug(`searchGroup: arrAttendees ${Object.keys(arrAttendees).length}`, arrAttendees);
                return arrAttendees;
            } catch (err) {
                log.error('searchGroup error', err.message);
            }
        }

        return {beforeSubmit, afterSubmit}

    });

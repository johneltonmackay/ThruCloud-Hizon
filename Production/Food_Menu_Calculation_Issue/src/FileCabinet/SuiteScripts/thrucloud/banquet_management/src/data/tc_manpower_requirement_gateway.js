/**
 * @NApiVersion 2.1
 *
 */

define([
    'N/log',
    'N/query',
    'N/record'
    ], function(
    log,
    query,
    record
) {

    function ManpowerRequirementGateway() {
        this.name = 'ManpowerRequirementGateway';
    }

    ManpowerRequirementGateway.prototype.getManpowerRequirementValuesByManpowerCodes = function(manpowerCodeIds){
        var manpowerRequirementValues = [];

        var statement = `
            SELECT 
                custrecord_manpower_requirement_rank,
                custrecord_manpowerreqt_itemname,
                custrecord_manpower_basic_pay,
                custrecord_manpower_requirement_agency,
                custrecord_manpower_requirement_qty,
                custrecord_manpower_requirement_cost,
                custrecord_manpower_requirement_totalamt,
                custrecord_manpowerrecipeparent,
                custrecord_manpower_cost
            FROM 
                customrecord_manpower_requirement_costin
            WHERE
                custrecord_manpowerrecipeparent IN (${manpowerCodeIds})
        `;

        log.error('ManpowerRequirementGateway | statement', statement);

        var recordList = query.runSuiteQL({
                query: statement,
                params: []
            })
            .asMappedResults();
        return recordList;
    }




    return ManpowerRequirementGateway;

});

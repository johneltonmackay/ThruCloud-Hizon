/**
 * @NApiVersion 2.1
 *
 */

define([
    'N/log',
    '../common/tc_constants',
    '../app/tc_banquet_type_1_delegate',
    '../app/tc_banquet_type_2_delegate',
    '../app/tc_banquet_type_3_delegate'
    ], function(
    log,
    Constant,
    BanquetType_1_Delegate,
    BanquetType_2_Delegate,
    BanquetType_3_Delegate
) {

    function BanquetTypeHandler() {
        this.name = 'BanquetTypeHandler';
    }

    BanquetTypeHandler.prototype.set = function(newRecord, oldRecord) {
        const outlet = newRecord.getValue({
            fieldId: 'custbody_outlet_proposal'
        });

        const banquet_type_from_field = newRecord.getValue({
            fieldId: 'custbody_banquet_type_beo'
        });

        log.error('outlet', outlet);
        log.error('banquet_type_from_field', banquet_type_from_field);
        var intendedBanquetType = banquet_type_from_field;

        /*
        var intendedBanquetType;
        if (Constant.outletGroup.BANQUET_TYPE_1.indexOf(parseInt(outlet)) != -1) {
            intendedBanquetType = BANQUET_TYPE_1;
        } else if (Constant.outletGroup.BANQUET_TYPE_2.indexOf(parseInt(outlet)) != -1) {
            intendedBanquetType = BANQUET_TYPE_2;
        } else if (Constant.outletGroup.BANQUET_TYPE_3.indexOf(parseInt(outlet)) != -1) {
            intendedBanquetType = BANQUET_TYPE_3;
        }*/

        deleteBanguetValues(newRecord, intendedBanquetType);

        /*
        if (intendedBanquetType == BANQUET_TYPE_1) {
            log.error('Executing setBanquetType 1', 'setBanquetType 1');
            setBanquetTypeValue(new BanquetType_1_Delegate(newRecord));

        } else if (intendedBanquetType == BANQUET_TYPE_2) {
            log.error('Executing setBanquetType 2', 'setBanquetType 2');
            setBanquetTypeValue(new BanquetType_2_Delegate(newRecord));

        } else if (intendedBanquetType == BANQUET_TYPE_3) {
            log.error('Executing setBanquetType 3', 'setBanquetType 3');
            setBanquetTypeValue(new BanquetType_3_Delegate(newRecord));
        }
        */

        if (intendedBanquetType == Constant.banquetTypeOnOutlet.BANQUET_TYPE_1) {
            log.error('Executing setBanquetType 1', 'setBanquetType 1');
            setBanquetTypeValue(new BanquetType_1_Delegate(newRecord, oldRecord));

        } else if (intendedBanquetType == Constant.banquetTypeOnOutlet.BANQUET_TYPE_2) {
            log.error('Executing setBanquetType 2', 'setBanquetType 2');
            setBanquetTypeValue(new BanquetType_2_Delegate(newRecord, oldRecord));

        } else if (intendedBanquetType == Constant.banquetTypeOnOutlet.BANQUET_TYPE_3) {
            log.error('Executing setBanquetType 3', 'setBanquetType 3');
            setBanquetTypeValue(new BanquetType_3_Delegate(newRecord, oldRecord));
        }
    }

    function setBanquetTypeValue(delegate) {
        delegate.set()
    }

    function deleteBanguetValues(newRecord, intendedBanquetType){
        // The selected banquet type field valuestype is not unset.
        // The selected banquet type field values will be overriden

        var b_fields = [];
        if (intendedBanquetType == Constant.banquetTypeOnOutlet.BANQUET_TYPE_1) {
            b_fields.push(Constant.fields.BanquetType_2);
            b_fields.push(Constant.fields.BanquetType_3);

        } else if (intendedBanquetType == Constant.banquetTypeOnOutlet.BANQUET_TYPE_2) {
            b_fields.push(Constant.fields.BanquetType_1);
            b_fields.push(Constant.fields.BanquetType_3);

        } else if (intendedBanquetType == Constant.banquetTypeOnOutlet.BANQUET_TYPE_3) {
            b_fields.push(Constant.fields.BanquetType_1);
            b_fields.push(Constant.fields.BanquetType_2);
        }

        for(var i = 0; i < b_fields.length; i++){
            var options = b_fields[i];
            var option1Fields = options.Option_1;
            var option2Fields = options.Option_2;
            var option3Fields = options.Option_3;

            unsetFields(newRecord, option1Fields);
            unsetFields(newRecord, option2Fields);
            unsetFields(newRecord, option3Fields);
        }
    }

    function unsetFields(newRecord, optionFields){
        var fields = Object.values(optionFields);
        var fieldObj;
        for(var f = 0; f < fields.length; f++){
            //if(isFieldForSetting(fields[f])){
                fieldObj = newRecord.getField({fieldId: fields[f]});

                if(fieldObj.type === 'checkbox'){
                    newRecord.setValue({
                        fieldId: fields[f],
                        value: false
                    });
                } else {
                    newRecord.setValue({
                        fieldId: fields[f],
                        value: null
                    });
                }
            //}
        }
    }

    function isFieldForSetting(field){
        return [
            /* Type 1 */
            Constant.fields.BanquetType_1.Option_1.ADJUSTED_PRICE,
            Constant.fields.BanquetType_1.Option_1.WITH_SERVICE_INCENTIVE,
            Constant.fields.BanquetType_1.Option_1.WITH_MOBILIZATION_FEE,
            Constant.fields.BanquetType_1.Option_1.PROPOSED_PRICE,
            Constant.fields.BanquetType_1.Option_1.ADD_ON_ADJUSTED_PRICE,
            Constant.fields.BanquetType_1.Option_1.ADD_ON_WITH_SERVICE_INCENTIVE,
            Constant.fields.BanquetType_1.Option_1.ADD_ON_WITH_MOBILIZATION_FEE,
            Constant.fields.BanquetType_1.Option_1.ADD_ON_PROPOSED_PRICE,
            
            Constant.fields.BanquetType_1.Option_2.ADJUSTED_PRICE,
            Constant.fields.BanquetType_1.Option_2.WITH_SERVICE_INCENTIVE,
            Constant.fields.BanquetType_1.Option_2.WITH_MOBILIZATION_FEE,
            Constant.fields.BanquetType_1.Option_2.PROPOSED_PRICE,
            Constant.fields.BanquetType_1.Option_2.ADD_ON_ADJUSTED_PRICE,
            Constant.fields.BanquetType_1.Option_2.ADD_ON_WITH_SERVICE_INCENTIVE,
            Constant.fields.BanquetType_1.Option_2.ADD_ON_WITH_MOBILIZATION_FEE,
            Constant.fields.BanquetType_1.Option_2.ADD_ON_PROPOSED_PRICE,
            
            Constant.fields.BanquetType_1.Option_3.ADJUSTED_PRICE,
            Constant.fields.BanquetType_1.Option_3.WITH_SERVICE_INCENTIVE,
            Constant.fields.BanquetType_1.Option_3.WITH_MOBILIZATION_FEE,
            Constant.fields.BanquetType_1.Option_3.PROPOSED_PRICE,
            Constant.fields.BanquetType_1.Option_3.ADD_ON_ADJUSTED_PRICE,
            Constant.fields.BanquetType_1.Option_3.ADD_ON_WITH_SERVICE_INCENTIVE,
            Constant.fields.BanquetType_1.Option_3.ADD_ON_WITH_MOBILIZATION_FEE,
            Constant.fields.BanquetType_1.Option_3.ADD_ON_PROPOSED_PRICE,

            /* Type 2 */
            Constant.fields.BanquetType_2.Option_1.ADJUSTED_PRICE,
            Constant.fields.BanquetType_2.Option_1.PROPOSED_PRICE,
            Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_ADJUSTED_PRICE,
            Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_PROPOSED_PRICE,
            Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE,
            Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_PROPOSED_PRICE,

            Constant.fields.BanquetType_2.Option_2.ADJUSTED_PRICE,
            Constant.fields.BanquetType_2.Option_2.PROPOSED_PRICE,
            Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_ADJUSTED_PRICE,
            Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_PROPOSED_PRICE,
            Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE,
            Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_PROPOSED_PRICE,

            Constant.fields.BanquetType_2.Option_3.ADJUSTED_PRICE,
            Constant.fields.BanquetType_2.Option_3.PROPOSED_PRICE,
            Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_ADJUSTED_PRICE,
            Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_PROPOSED_PRICE,
            Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE,
            Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_PROPOSED_PRICE,

            /* Type 3 */
            Constant.fields.BanquetType_2.Option_1.PROPOSED_PRICE,
            Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_PROPOSED_PRICE,
            Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_PROPOSED_PRICE

        ].indexOf(field) == -1
    }

    return BanquetTypeHandler;

});

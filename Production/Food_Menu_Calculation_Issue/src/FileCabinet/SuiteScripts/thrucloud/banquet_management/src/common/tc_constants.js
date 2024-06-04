/**
 * @NApiVersion 2.1
 *
 */

define([], function() {

    function Constant() {
        this.name = 'Constant';
    }

    const OUTLET_BSP_MANILA = 6;
    const OUTLET_BSP_QC = 18;
    const OUTLET_BDO = 7;
    const OUTLET_COMMISSARY = 3;
    const OUTLET_MPC = 17;

    const COSTING_STRUCTURE_BASE_MENU = 1;
    const COSTING_STRUCTURE_T1_STATION_ADD_ON = 3;
    const COSTING_STRUCTURE_STATION_ADD_ON_WITHOUT_MANPOWER = 2;
    const COSTING_STRUCTURE_STATION_ADD_ON_WITH_MANPOWER = 4;

    /* This is based on Costing Strucutre - Manpower R custom list (customlist_mp_costing_structure) */
    const MANPOWER_REQ_COSTING_STRUCTURE_BASE_MENU = 1;
    const MANPOWER_REQ_COSTING_STRUCTURE_STATION_ADD_ON_WITH_MANPOWER = 2;
    const MANPOWER_REQ_COSTING_STRUCTURE_FOOD_TASTING = 3;

    const BANQUET_TYPE_1 = 6;
    const BANQUET_TYPE_2 = 7;
    const BANQUET_TYPE_3 = 8;


    // For deletion: Constant.outletGroup
    Constant.outletGroup = {
        BANQUET_TYPE_1: [
            OUTLET_BSP_MANILA,
            OUTLET_BSP_QC,
            OUTLET_BDO
        ],
        BANQUET_TYPE_2: [
            OUTLET_COMMISSARY
        ],
        BANQUET_TYPE_3: [
            OUTLET_MPC
        ]
    };

    Constant.banquetTypeCostingStructures = {
        BANQUET_TYPE_1: [
            COSTING_STRUCTURE_BASE_MENU,
            COSTING_STRUCTURE_T1_STATION_ADD_ON
        ],
        BANQUET_TYPE_2: [
            COSTING_STRUCTURE_BASE_MENU,
            COSTING_STRUCTURE_STATION_ADD_ON_WITHOUT_MANPOWER,
            COSTING_STRUCTURE_STATION_ADD_ON_WITH_MANPOWER
        ],
        BANQUET_TYPE_3: [
            COSTING_STRUCTURE_BASE_MENU,
            COSTING_STRUCTURE_STATION_ADD_ON_WITHOUT_MANPOWER,
            COSTING_STRUCTURE_STATION_ADD_ON_WITH_MANPOWER
        ]
    };

    Constant.banquetTypeManpowerReqCostingStructures = {
        BANQUET_TYPE_1: [
            MANPOWER_REQ_COSTING_STRUCTURE_BASE_MENU,
            MANPOWER_REQ_COSTING_STRUCTURE_FOOD_TASTING
        ],
        BANQUET_TYPE_2: [
            MANPOWER_REQ_COSTING_STRUCTURE_BASE_MENU,
            MANPOWER_REQ_COSTING_STRUCTURE_STATION_ADD_ON_WITH_MANPOWER,
            MANPOWER_REQ_COSTING_STRUCTURE_FOOD_TASTING
        ],
        BANQUET_TYPE_3: [
            MANPOWER_REQ_COSTING_STRUCTURE_BASE_MENU,
            MANPOWER_REQ_COSTING_STRUCTURE_STATION_ADD_ON_WITH_MANPOWER,
            MANPOWER_REQ_COSTING_STRUCTURE_FOOD_TASTING
        ]
    };

    Constant.banquetType = {
        BANQUET_TYPE_1: BANQUET_TYPE_1,
        BANQUET_TYPE_2: BANQUET_TYPE_2,
        BANQUET_TYPE_3: BANQUET_TYPE_3
    }

    Constant.banquetTypeOnOutlet = {
        BANQUET_TYPE_1: 1,
        BANQUET_TYPE_2: 2,
        BANQUET_TYPE_3: 3,
        NA: 4
    }

    Constant.amenitiesPlaceholderFloralItems = {
        FLORAL_BASE: 'Floral Placeholder Basic',
        FLORAL_L1: 'Floral Placeholder L1',
        FLORAL_L2: 'Floral Placeholder L2',
        FLORAL_L3: 'Floral Placeholder L3',
    }

    Constant.serviceType = {
        BASE_MENU: 20,
        T1_STATION_ADD_ON: 21,
        STATION_ADD_ON_WITH_MANPOWER: 22,
        STATION_ADD_ON_WITHOUT_MANPOWER: 23
    };

    Constant.costingStructure = {
        BASE_MENU: COSTING_STRUCTURE_BASE_MENU,
        T1_STATION_ADD_ON: COSTING_STRUCTURE_T1_STATION_ADD_ON,
        STATION_ADD_ON_WITHOUT_MANPOWER: COSTING_STRUCTURE_STATION_ADD_ON_WITHOUT_MANPOWER,
        STATION_ADD_ON_WITH_MANPOWER: COSTING_STRUCTURE_STATION_ADD_ON_WITH_MANPOWER
    };

    Constant.foodOption = {
        OPTION_1: 1,
        OPTION_2: 2,
        OPTION_3: 3,
        OPTION_NA: 4
    };

    Constant.foodMasterLevel = {
        L1: 1,
        L2: 2,
        L3: 3,
        L4: 4,
        L5: 5,
        BANQUET_TYPE_1: BANQUET_TYPE_1,
        BANQUET_TYPE_2: BANQUET_TYPE_2,
        BANQUET_TYPE_3: BANQUET_TYPE_3
    };



    Constant.PRODUCTION_ALLOWANCE_RATE = 0.05;
    Constant.FLORAL_MARKUP = 0.1;
    Constant.VAT_RATE = 0.12;

    Constant.netPriceRateFields = {
        BanquetType_1: {
            Option_1: {
                BASE_NET_PRICE_RATE: 'custbody_net_price_percent_bnqt_type1',
                ADD_ON_NET_PRICE_RATE: 'custbody_netprice_40'
            },
            Option_2: {
                BASE_NET_PRICE_RATE: 'custbody_net_price_percent_bnqt_t1_o2',
                ADD_ON_NET_PRICE_RATE: 'custbody_netprice_40_bt1_o2'
            },
            Option_3: {
                BASE_NET_PRICE_RATE: 'custbody_net_price_percent_bnqt_t1_o3',
                ADD_ON_NET_PRICE_RATE: 'custbody_netprice_40_bt1_o3'
            }
        },
        BanquetType_2: {
            Option_1: {
                BASE_NET_PRICE_RATE: 'custbody_netpricepercent_bt2',
                ADD_ON_WITH_MP_NET_PRICE_RATE: 'custbody_netprice_bswm_2',
                ADD_ON_WITHOUT_MP_NET_PRICE_RATE: 'custbody_netpricebbswomanpower2'
            },
            Option_2: {
                BASE_NET_PRICE_RATE: 'custbody_netpricepercent_bt2_o2',
                ADD_ON_WITH_MP_NET_PRICE_RATE: 'custbody_netprice_bswm_b2_o2',
                ADD_ON_WITHOUT_MP_NET_PRICE_RATE: 'custbody_netprice_station_womp_b2_o2'
            },
            Option_3: {
                BASE_NET_PRICE_RATE: 'custbody_netpricepercent_bt2_o3',
                ADD_ON_WITH_MP_NET_PRICE_RATE: 'custbody_netprice_bswm_b2_o3',
                ADD_ON_WITHOUT_MP_NET_PRICE_RATE: 'custbody_netprice_station_womp_b2_o3'
            }
        },
        BanquetType_3: {
            Option_1: {
                BASE_NET_PRICE_RATE: 'custbody_netprice_base_bt3_o1',
                ADD_ON_WITH_MP_NET_PRICE_RATE: 'custbody_netprice_bswm',
                ADD_ON_WITHOUT_MP_NET_PRICE_RATE: 'custbody_netpricepercent_bbswoman3'
            },
            Option_2: {
                BASE_NET_PRICE_RATE: 'custbody_netprice_base_bt3_o2',
                ADD_ON_WITH_MP_NET_PRICE_RATE: 'custbody_netprice_w_mp_bt3_o2',
                ADD_ON_WITHOUT_MP_NET_PRICE_RATE: 'custbody_netpricepercent_wo_mp_bt3_o2'
            },
            Option_3: {
                BASE_NET_PRICE_RATE: 'custbody_netprice_base_bt3_o3',
                ADD_ON_WITH_MP_NET_PRICE_RATE: 'custbody_netprice_w_mp_bt3_o3',
                ADD_ON_WITHOUT_MP_NET_PRICE_RATE: 'custbody_netpricepercent_wo_mp_bt3_o3'
            }
        }
    }

    // There fields doest not have Net Price Rate fields
    // Net Price Rate fields are not being set with values via automation
    // Net Price Rate fields are set manually by the user in the UI
    Constant.fields = {
        BanquetType_1: {
            Option_1: {
                FOOD_COST: 'custbody_bnqt_food_cost_type_1',
                PRODUCTION_ALLOWANCE: 'custbody_prod_allowance_bnqt_type_1',
                LABOR_COST: 'custbody_labor_cost_banquet_type_1',
                FLORAL_COST: 'custbody_floral_cost_bnqt_type_1',
                FLORAL_COST_MARKUP: 'custbody_floral_cost_markup_bnqt_type1',
                COGS: 'custbody_cost_bnqt_type_1',
                NET_PRICE_AMOUNT: 'custbody_netpricebasetype1',
                NET_PRICE_WITH_FLORAL: 'custbody_price_with_floral_bnqt_type1',
                LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_allwnce_bnqttype1',
                VAT: 'custbody_vat_bnqttype1',
                CALC_PRICE: 'custbody_srp_bnqt_type1',
                ADJUSTED_PRICE: 'custbody_adj_price_bt1_o1',
                WITH_SERVICE_INCENTIVE: 'custbody_w_sc_bt1_o1',
                WITH_MOBILIZATION_FEE: 'custbody_mobi_fee_bt1_o1',
                PROPOSED_PRICE: 'custbody_final_price_bt1_o1',
                
                ADD_ON_FOOD_COST: 'custbody_food_bev_add_on',
                ADD_ON_PRODUCTION_ALLOWANCE: 'custbody_prod_allowance_fnb_addon_t1',
                ADD_ON_COGS: 'custbody_cogs_add_on',
                ADD_ON_NET_PRICE_AMOUNT: 'custbody_netprice_bnqt_fnb_addon',
                ADD_ON_LOCAL_TAX_ALLOWANCE: 'custbody_localtaxallowance_addon',
                ADD_ON_VAT: 'custbody_addvat_addon',
                ADD_ON_CALC_PRICE: 'custbody_srp_addon',
                ADD_ON_ADJUSTED_PRICE: 'custbody_adj_price_addon_bt1_o1',
                ADD_ON_WITH_SERVICE_INCENTIVE: 'custbody_w_sc_addon_bt1_o1',
                ADD_ON_WITH_MOBILIZATION_FEE: 'custbody_mobi_fee_bt1_o1_t1',
                ADD_ON_PROPOSED_PRICE: 'custbody_final_price_addon_bt1_o1'
            },
            Option_2: {
                FOOD_COST: 'custbody_bnqt_food_cost_type_opt2',
                PRODUCTION_ALLOWANCE: 'custbody_prod_allowance_bnqt_type_1_o2',
                LABOR_COST: 'custbody_labor_cost_banquet_type_1_o2',
                FLORAL_COST: 'custbody_floral_cost_bnqt_type_1_o2',
                FLORAL_COST_MARKUP: 'custbody_floral_cost_markup_bnqt_t1_o2',
                COGS: 'custbody_cost_bnqt_type_1_o2',
                NET_PRICE_AMOUNT: 'custbody_netpricebasetype1_o2',
                NET_PRICE_WITH_FLORAL: 'custbody_price_with_floral_bnqt_t1_o2',
                LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_allwnce_bqt_t1_o2',
                VAT: 'custbody_vat_bnqttype1_o2',
                CALC_PRICE: 'custbody_srp_bnqt_type1_o2',
                ADJUSTED_PRICE: 'custbody_adj_price_bt1_o2',
                WITH_SERVICE_INCENTIVE: 'custbody_w_sc_bt1_o2',
                WITH_MOBILIZATION_FEE: 'custbody_mobi_fee_bt1_o2',
                PROPOSED_PRICE: 'custbody_final_price_bt1_o2',
                
                ADD_ON_FOOD_COST: 'custbody_food_bev_add_on_bt1_o2',
                ADD_ON_PRODUCTION_ALLOWANCE: 'custbody_prod_allowance_addon_bt1_o2',
                ADD_ON_COGS: 'custbody_cogs_add_on_bt1_o2',
                ADD_ON_NET_PRICE_AMOUNT: 'custbody_netprice_bqt_fnb_addon_bt1_o2',
                ADD_ON_LOCAL_TAX_ALLOWANCE: 'custbody_localtaxallowance_addon_b1_o2',
                ADD_ON_VAT: 'custbody_addvat_addon_b1_o2',
                ADD_ON_CALC_PRICE: 'custbody_srp_addon_b1_o2',
                ADD_ON_ADJUSTED_PRICE: 'custbody_adj_price_addon_bt1_o2',
                ADD_ON_WITH_SERVICE_INCENTIVE: 'custbody_w_sc_addon_bt1_o2',
                ADD_ON_WITH_MOBILIZATION_FEE: 'custbody_mobi_fee_bt1_o2_t1',
                ADD_ON_PROPOSED_PRICE: 'custbody_final_price_addon_bt1_o2'

            },
            Option_3: {
                FOOD_COST: 'custbody_bnqt_food_cost_type_opt3',
                PRODUCTION_ALLOWANCE: 'custbody_prod_allowance_bnqt_type_1_o3',
                LABOR_COST: 'custbody_labor_cost_banquet_type_1_o3',
                FLORAL_COST: 'custbody_floral_cost_bnqt_type_1_o3',
                FLORAL_COST_MARKUP: 'custbody_floral_cost_markup_bnqt_t1_o3',
                COGS: 'custbody_cost_bnqt_type_1_o3',
                NET_PRICE_AMOUNT: 'custbody_netpricebasetype1_o3',
                NET_PRICE_WITH_FLORAL: 'custbody_price_with_floral_bnqt_t1_o3',
                LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_allwnce_bqt_t1_o3',
                VAT: 'custbody_vat_bnqttype1_o3',
                CALC_PRICE: 'custbody_srp_bnqt_type1_o3',
                ADJUSTED_PRICE: 'custbody_adj_price_bt1_o3',
                WITH_SERVICE_INCENTIVE: 'custbody_w_sc_bt1_o3',
                WITH_MOBILIZATION_FEE: 'custbody_mobi_fee_bt1_o3',
                PROPOSED_PRICE: 'custbody_final_price_bt1_o3',
                
                ADD_ON_FOOD_COST: 'custbody_food_bev_add_on_bt1_o3',
                ADD_ON_PRODUCTION_ALLOWANCE: 'custbody_prod_allowance_addon_bt1_o3',
                ADD_ON_COGS: 'custbody_cogs_add_on_bt1_o3',
                ADD_ON_NET_PRICE_AMOUNT: 'custbody_netprice_bqt_fnb_addon_bt1_o3',
                ADD_ON_LOCAL_TAX_ALLOWANCE: 'custbody_localtaxallowance_addon_b1_o3',
                ADD_ON_VAT: 'custbody_addvat_addon_b1_o3',
                ADD_ON_CALC_PRICE: 'custbody_srp_addon_b1_o3',
                ADD_ON_ADJUSTED_PRICE: 'custbody_adj_price_addon_bt1_o3',
                ADD_ON_WITH_SERVICE_INCENTIVE: 'custbody_w_sc_addon_bt1_o3',
                ADD_ON_WITH_MOBILIZATION_FEE: 'custbody_mobi_fee_bt1_o3_t1',
                ADD_ON_PROPOSED_PRICE: 'custbody_final_price_addon_bt1_o3'
            }
        },
        BanquetType_2: {
            Option_1: {
                FOOD_COST: 'custbody_food_cost_basetype2',
                PRODUCTION_ALLOWANCE: 'custbody_prod_allowance_type2',
                LABOR_COST: 'custbody_labor_cost_base_type2',
                OVERTIME_ALLOWANCE: 'custbody_ot_allowance_base_type2',
                FLORAL_COST: 'custbody_floralcost_base_type2',
                FLORAL_COST_MARKUP: 'custbody_floral_mark_up_basetype2',
                COGS: 'custbody_cogs_base_type2',
                NET_PRICE_AMOUNT: 'custbody_netprice_base2',
                NET_PRICE_WITH_FLORAL: 'custbody_netpricewithfloral_type2',
                LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t2_o1_base',
                CALC_PRICE: 'custbody_srp_base_type_2',
                ADJUSTED_PRICE: 'custbody_adj_price_bt2_o1',
                VAT: 'custbody_vat_12_basetype2',
                SERVICE_CHARGE: 'custbody_servicecharge_basetype2',                
                PROPOSED_PRICE: 'custbody_final_price_bt2_o1',
                
                ADD_ON_WITH_MP_FOOD_COST: 'custbody_foodcost_bnqt_station_mp_2',
                ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE: 'custbody_prod_allow_station_w_mp_b2_o1',
                ADD_ON_WITH_MP_LABOR_COST: 'custbody_laborcost_bnqtstationwithmp_2',
                ADD_ON_WITH_MP_OVERTIME_ALLOWANCE: 'custbody_overtimeallowance_station_mp2', 
                ADD_ON_WITH_MP_COGS: 'custbody_cogs_stationmanpower_type2',
                ADD_ON_WITH_MP_NET_PRICE_AMOUNT: 'custbody_netprice_stationwithmanpower2',
                ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t2_o1_wmp',
                ADD_ON_WITH_MP_CALC_PRICE: 'custbody_srp_station_with_manpower',
                ADD_ON_WITH_MP_ADJUSTED_PRICE: 'custbody_adj_price_mp_bt2_o1',
                ADD_ON_WITH_MP_VAT: 'custbody_vat_stationwithmanpower2',
                ADD_ON_WITH_MP_SERVICE_CHARGE: 'custbody_servicecharge',
                ADD_ON_WITH_MP_PROPOSED_PRICE: 'custbody_final_price_mp_bt2_o1',

                ADD_ON_WITHOUT_MP_FOOD_COST: 'custbody_foodcost_stationwithoutmpw_2',
                ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE: 'custbody_prod_allowance_station_wo_mp2', 
                ADD_ON_WITHOUT_MP_COGS: 'custbody_cogs_station_wo_manpower2',
                ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT: 'custbody_netprice_station_wo_manpower2',
                ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t2_o1_womp',
                ADD_ON_WITHOUT_MP_CALC_PRICE: 'custbody_srp_stationwomanpower_2',
                ADD_ON_WITHOUT_MP_ADJUSTED_PRICE: 'custbody_adj_price_wo_mp_bt2_o1',
                ADD_ON_WITHOUT_MP_VAT: 'custbody_vat_stationwomanpower_2',
                ADD_ON_WITHOUT_MP_SERVICE_CHARGE: 'custbody_sc_station_wo_manpower2',
                ADD_ON_WITHOUT_MP_PROPOSED_PRICE: 'custbody_final_price_wo_mp_bt2_o1'
            },
            Option_2: {
                FOOD_COST: 'custbody_food_cost_bt2_o2',
                PRODUCTION_ALLOWANCE: 'custbody_prod_allowance_bt2_o2',
                LABOR_COST: 'custbody_labor_cost_base_bt2_o2',
                OVERTIME_ALLOWANCE: 'custbody_ot_allowance_base_bt2_o2',
                FLORAL_COST: 'custbody_floralcost_base_bt2_o2',
                FLORAL_COST_MARKUP: 'custbody_floral_mark_up_base_bt2_o2',
                COGS: 'custbody_cogs_base_bt2_o2',
                NET_PRICE_AMOUNT: 'custbody_netprice_base_bt2_o2',
                NET_PRICE_WITH_FLORAL: 'custbody_netpricewithfloral_base_b2_o2',
                LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t2_o2_base',
                CALC_PRICE: 'custbody_srp_base_bt2_o2',
                ADJUSTED_PRICE: 'custbody_adj_price_bt2_o2',
                VAT: 'custbody_vat_12_base_bt2_o2',
                SERVICE_CHARGE: 'custbody_servicecharge_base_bt2_o2',
                PROPOSED_PRICE: 'custbody_final_price_bt2_o2',

                ADD_ON_WITH_MP_FOOD_COST: 'custbody_foodcost_bqt_station_mp_b2_o2',
                ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE: 'custbody_prod_allow_station_w_mp_b2_o2',
                ADD_ON_WITH_MP_LABOR_COST: 'custbody_laborcst_bqt_station_mp_b2_o2',
                ADD_ON_WITH_MP_OVERTIME_ALLOWANCE: 'custbody_otallowance_station_mp_b2_o2', 
                ADD_ON_WITH_MP_COGS: 'custbody_cogs_stationmanpower_b2_o2',
                ADD_ON_WITH_MP_NET_PRICE_AMOUNT: 'custbody_netprice_station_mp_b2_o2',
                ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t2_o2_wmp',
                ADD_ON_WITH_MP_CALC_PRICE: 'custbody_srp_station_mp_b2_o2',
                ADD_ON_WITH_MP_ADJUSTED_PRICE: 'custbody_adj_price_mp_bt2_o2',
                ADD_ON_WITH_MP_VAT: 'custbody_vat_station_mp_b2_o2',
                ADD_ON_WITH_MP_SERVICE_CHARGE: 'custbody_servicecharge_bt2_o2',
                ADD_ON_WITH_MP_PROPOSED_PRICE: 'custbody_final_price_mp_bt2_o2',

                ADD_ON_WITHOUT_MP_FOOD_COST: 'custbody_foodcost_station_womp_b2_o2',
                ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE: 'custbody_prod_allow_station_womp_b2_o2', 
                ADD_ON_WITHOUT_MP_COGS: 'custbody_cogs_station_wo_mp_b2_o2',
                ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT: 'custbody_netprice_station_wo_mp_b2_o2',
                ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t2_o2_womp',
                ADD_ON_WITHOUT_MP_CALC_PRICE: 'custbody_srp_station_wo_mp_b2_o2',
                ADD_ON_WITHOUT_MP_ADJUSTED_PRICE: 'custbody_adj_price_wo_mp_bt2_o2',
                ADD_ON_WITHOUT_MP_VAT: 'custbody_vat_station_wo_mp_b2_o2',
                ADD_ON_WITHOUT_MP_SERVICE_CHARGE: 'custbody_sc_station_wo_mp_b2_o2',
                ADD_ON_WITHOUT_MP_PROPOSED_PRICE: 'custbody_final_price_wo_mp_bt2_o2'
            },
            Option_3: {
                FOOD_COST: 'custbody_food_cost_bt2_o3',
                PRODUCTION_ALLOWANCE: 'custbody_prod_allowance_bt2_o3',
                LABOR_COST: 'custbody_labor_cost_base_bt2_o3',
                OVERTIME_ALLOWANCE: 'custbody_ot_allowance_base_bt2_o3',
                FLORAL_COST: 'custbody_floralcost_base_bt2_o3',
                FLORAL_COST_MARKUP: 'custbody_floral_mark_up_base_bt2_o3',
                COGS: 'custbody_cogs_base_bt2_o3',
                NET_PRICE_AMOUNT: 'custbody_netprice_base_bt2_o3',
                NET_PRICE_WITH_FLORAL: 'custbody_netpricewithfloral_base_b2_o3',
                LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t2_o3_base',
                CALC_PRICE: 'custbody_srp_base_bt2_o3',
                ADJUSTED_PRICE: 'custbody_adj_price_bt2_o3',
                VAT: 'custbody_vat_12_base_bt2_o3',
                SERVICE_CHARGE: 'custbody_servicecharge_base_bt2_o3',
                PROPOSED_PRICE: 'custbody_final_price_bt2_o3',

                ADD_ON_WITH_MP_FOOD_COST: 'custbody_foodcost_bqt_station_mp_b2_o3',
                ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE: 'custbody_prod_allow_station_w_mp_b2_o3',
                ADD_ON_WITH_MP_LABOR_COST: 'custbody_laborcst_bqt_station_mp_b2_o3',
                ADD_ON_WITH_MP_OVERTIME_ALLOWANCE: 'custbody_otallowance_station_mp_b2_o3', 
                ADD_ON_WITH_MP_COGS: 'custbody_cogs_stationmanpower_b2_o3',
                ADD_ON_WITH_MP_NET_PRICE_AMOUNT: 'custbody_netprice_station_mp_b2_o3',
                ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t2_o3_wmp',
                ADD_ON_WITH_MP_CALC_PRICE: 'custbody_srp_station_mp_b2_o3',
                ADD_ON_WITH_MP_ADJUSTED_PRICE: 'custbody_adj_price_mp_bt2_o3',
                ADD_ON_WITH_MP_VAT: 'custbody_vat_station_mp_b2_o3',
                ADD_ON_WITH_MP_SERVICE_CHARGE: 'custbody_servicecharge_bt2_o3',
                ADD_ON_WITH_MP_PROPOSED_PRICE: 'custbody_final_price_mp_bt2_o3',

                ADD_ON_WITHOUT_MP_FOOD_COST: 'custbody_foodcost_station_womp_b2_o3',
                ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE: 'custbody_prod_allow_station_womp_b2_o3', 
                ADD_ON_WITHOUT_MP_COGS: 'custbody_cogs_station_wo_mp_b2_o3',
                ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT: 'custbody_netprice_station_wo_mp_b2_o3',
                ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t2_o3_womp',
                ADD_ON_WITHOUT_MP_CALC_PRICE: 'custbody_srp_station_wo_mp_b2_o3',
                ADD_ON_WITHOUT_MP_ADJUSTED_PRICE: 'custbody_adj_price_wo_mp_bt2_o3',
                ADD_ON_WITHOUT_MP_VAT: 'custbody_vat_station_wo_mp_b2_o3',
                ADD_ON_WITHOUT_MP_SERVICE_CHARGE: 'custbody_sc_station_wo_mp_b2_o3',
                ADD_ON_WITHOUT_MP_PROPOSED_PRICE: 'custbody_final_price_wo_mp_bt2_o3'
            }
        }, 
        BanquetType_3: {
            Option_1: {
                FOOD_COST: 'custbody_food_cost_base_b3_o1',
                PRODUCTION_ALLOWANCE: 'custbody_prodallowance_bt3',
                LABOR_COST: 'custbody_laborcost_bt3',
                OVERTIME_ALLOWANCE: 'custbody_ot_allowance_base_type3',
                FLORAL_COST: 'custbody_floralcost_base_type3',
                FLORAL_COST_MARKUP: 'custbody_floralmarkup_base_type3',
                COGS: 'custbody_cogs_base_type3',
                NET_PRICE_AMOUNT: 'custbody_net_price_bnqtbasetype3',
                NET_PRICE_WITH_FLORAL: 'custbody_netprice_with_floral_bt3',
                LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t3_o1_base',
                SERVICE_INCENTIVE: 'custbody_servicecharge_bt3',
                VENUE_SHARE: 'custbody_venueshare_bt3',
                VAT: 'custbody_vat_bt3',
                CALC_PRICE: 'custbody_srp_bt3',
                PROPOSED_PRICE: 'custbody_proposed_price_bt3_o1_base',

                ADD_ON_WITH_MP_FOOD_COST: 'custbody_foodcost_bnqtstationwithmpw3',
                ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE: 'custbody_prodallowance_bnqt_stat_3',
                ADD_ON_WITH_MP_LABOR_COST: 'custbody_laborcost_bswm_3',
                ADD_ON_WITH_MP_OVERTIME_ALLOWANCE: 'custbody_ot_allowance_bnqstatman_type3', 
                ADD_ON_WITH_MP_COGS: 'custbody_cogs_bswm_3',
                ADD_ON_WITH_MP_NET_PRICE_AMOUNT: 'custbody_netprice42_bnqtstatman3',
                ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t3_o1_wmp',
                ADD_ON_WITH_MP_SERVICE_INCENTIVE: 'custbody_servicecharge_bswm_3',
                ADD_ON_WITH_MP_VENUE_SHARE: 'custbody_venueshare_bswm_3',
                ADD_ON_WITH_MP_VAT: 'custbody_vat_bswm_3',
                ADD_ON_WITH_MP_CALC_PRICE: 'custbody_srp_bswm3',
                ADD_ON_WITH_MP_PROPOSED_PRICE: 'custbody_proposed_price_bt3_o1_wmp',

                ADD_ON_WITHOUT_MP_FOOD_COST: 'custbody_foodcost_bnqtbevwomanpower',
                ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE: 'custbody_prodallowance_bbevwomanpower3',
                ADD_ON_WITHOUT_MP_COGS: 'custbody_cogsbbevstatwomanpower',
                ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT: 'custbody_netpricebbevstatwomanpower3',
                ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t3_o1_womp',
                ADD_ON_WITHOUT_MP_SERVICE_INCENTIVE: 'custbody_servicecharge_bbevstat_wo_3',
                ADD_ON_WITHOUT_MP_VENUE_SHARE: 'custbody_venueshare_bbswom',
                ADD_ON_WITHOUT_MP_VAT: 'custbody_vat_bbswomanpower3',
                ADD_ON_WITHOUT_MP_CALC_PRICE: 'custbody_srp_bbswomanpower3',
                ADD_ON_WITHOUT_MP_PROPOSED_PRICE: 'custbody_proposed_price_bt3_o1_womp'

            },
            Option_2: {
                FOOD_COST: 'custbody_food_cost_base_b3_o2',
                PRODUCTION_ALLOWANCE: 'custbody_prodallowance_base_bt3_o2',
                LABOR_COST: 'custbody_laborcost_base_bt3_o2',
                OVERTIME_ALLOWANCE: 'custbody_ot_allowance_base_bt3_o2',
                FLORAL_COST: 'custbody_floralcost_base_bt3_o2',
                FLORAL_COST_MARKUP: 'custbody_floralmarkup_base_bt3_o2',
                COGS: 'custbody_cogs_base_bt3_o2',
                NET_PRICE_AMOUNT: 'custbody_net_price_base_bt3_o2',
                NET_PRICE_WITH_FLORAL: 'custbody_netprice_with_floral_bt3_o2',
                LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t3_o2_base',
                SERVICE_INCENTIVE: 'custbody_servicecharge_base_bt3_o2',
                VENUE_SHARE: 'custbody_venueshare_base_bt3_o2',
                VAT: 'custbody_vat_base_bt3_o2',
                CALC_PRICE: 'custbody_srp_base_bt3_o2',
                PROPOSED_PRICE: 'custbody_proposed_price_bt3_o2_base',

                ADD_ON_WITH_MP_FOOD_COST: 'custbody_foodcost_w_mp_bt3_o2',
                ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE: 'custbody_prodallowance_w_mp_bt3_o2',
                ADD_ON_WITH_MP_LABOR_COST: 'custbody_laborcost_w_mp_bt3_o2',
                ADD_ON_WITH_MP_OVERTIME_ALLOWANCE: 'custbody_ot_allowance_w_mp_bt3_o2', 
                ADD_ON_WITH_MP_COGS: 'custbody_cogs_w_mp_bt3_o2',
                ADD_ON_WITH_MP_NET_PRICE_AMOUNT: 'custbody_netprice42_w_mp_bt3_o2',
                ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t3_o2_wmp',
                ADD_ON_WITH_MP_SERVICE_INCENTIVE: 'custbody_servicecharge_w_mp_bt3_o2',
                ADD_ON_WITH_MP_VENUE_SHARE: 'custbody_venueshare_w_mp_bt3_o2',
                ADD_ON_WITH_MP_VAT: 'custbody_vat_w_mp_bt3_o2',
                ADD_ON_WITH_MP_CALC_PRICE: 'custbody_srp_w_mp_bt3_o2',
                ADD_ON_WITH_MP_PROPOSED_PRICE: 'custbody_proposed_price_bt3_o2_wmp',

                ADD_ON_WITHOUT_MP_FOOD_COST: 'custbody_foodcost_wo_mp_bt3_o2',
                ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE: 'custbody_prodallowance_wo_mp_bt3_o2',
                ADD_ON_WITHOUT_MP_COGS: 'custbody_cogs_wo_mp_bt3_o2',
                ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT: 'custbody_netprice_wo_mp_bt3_o2',
                ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t3_o2_womp',
                ADD_ON_WITHOUT_MP_SERVICE_INCENTIVE: 'custbody_servicecharge_wo_mp_bt3_o2',
                ADD_ON_WITHOUT_MP_VENUE_SHARE: 'custbody_venueshare_wo_mp_bt3_o2',
                ADD_ON_WITHOUT_MP_VAT: 'custbody_vat_wo_mp_bt3_o2',
                ADD_ON_WITHOUT_MP_CALC_PRICE: 'custbody_srp_wo_mp_bt3_o2',
                ADD_ON_WITHOUT_MP_PROPOSED_PRICE: 'custbody_proposed_price_bt3_o2_womp'
            },
            Option_3: {
                FOOD_COST: 'custbody_food_cost_base_b3_o3',
                PRODUCTION_ALLOWANCE: 'custbody_prodallowance_base_bt3_o3',
                LABOR_COST: 'custbody_laborcost_base_bt3_o3',
                OVERTIME_ALLOWANCE: 'custbody_ot_allowance_base_bt3_o3',
                FLORAL_COST: 'custbody_floralcost_base_bt3_o3',
                FLORAL_COST_MARKUP: 'custbody_floralmarkup_base_bt3_o3',
                COGS: 'custbody_cogs_base_bt3_o3',
                NET_PRICE_AMOUNT: 'custbody_net_price_base_bt3_o3',
                NET_PRICE_WITH_FLORAL: 'custbody_netprice_with_floral_bt3_o3',
                LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t3_o3_base',
                SERVICE_INCENTIVE: 'custbody_servicecharge_base_bt3_o3',
                VENUE_SHARE: 'custbody_venueshare_base_bt3_o3',
                VAT: 'custbody_vat_base_bt3_o3',
                CALC_PRICE: 'custbody_srp_base_bt3_o3',
                PROPOSED_PRICE: 'custbody_proposed_price_bt3_o3_base',

                ADD_ON_WITH_MP_FOOD_COST: 'custbody_foodcost_w_mp_bt3_o3',
                ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE: 'custbody_prodallowance_w_mp_bt3_o3',
                ADD_ON_WITH_MP_LABOR_COST: 'custbody_laborcost_w_mp_bt3_o3',
                ADD_ON_WITH_MP_OVERTIME_ALLOWANCE: 'custbody_ot_allowance_w_mp_bt3_o3', 
                ADD_ON_WITH_MP_COGS: 'custbody_cogs_w_mp_bt3_o3',
                ADD_ON_WITH_MP_NET_PRICE_AMOUNT: 'custbody_netprice42_w_mp_bt3_o3',
                ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t3_o3_wmp',
                ADD_ON_WITH_MP_SERVICE_INCENTIVE: 'custbody_servicecharge_w_mp_bt3_o3',
                ADD_ON_WITH_MP_VENUE_SHARE: 'custbody_venueshare_w_mp_bt3_o3',
                ADD_ON_WITH_MP_VAT: 'custbody_vat_w_mp_bt3_o3',
                ADD_ON_WITH_MP_CALC_PRICE: 'custbody_srp_w_mp_bt3_o3',
                ADD_ON_WITH_MP_PROPOSED_PRICE: 'custbody_proposed_price_bt3_o3_wmp',

                ADD_ON_WITHOUT_MP_FOOD_COST: 'custbody_foodcost_wo_mp_bt3_o3',
                ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE: 'custbody_prodallowance_wo_mp_bt3_o3',
                ADD_ON_WITHOUT_MP_COGS: 'custbody_cogs_wo_mp_bt3_o3',
                ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT: 'custbody_netprice_wo_mp_bt3_o3',
                ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE: 'custbody_local_taxes_bt_t3_o3_womp',
                ADD_ON_WITHOUT_MP_SERVICE_INCENTIVE: 'custbody_servicecharge_wo_mp_bt3_o3',
                ADD_ON_WITHOUT_MP_VENUE_SHARE: 'custbody_venueshare_wo_mp_bt3_o3',
                ADD_ON_WITHOUT_MP_VAT: 'custbody_vat_wo_mp_bt3_o3',
                ADD_ON_WITHOUT_MP_CALC_PRICE: 'custbody_srp_wo_mp_bt3_o3',
                ADD_ON_WITHOUT_MP_PROPOSED_PRICE: 'custbody_proposed_price_bt3_o3_womp'
            }
        }
    }

    Constant.groupedFields = {
        BanquetType_1: {
            Option_1: {
                BASE: {
                    FOOD_COST:              Constant.fields.BanquetType_1.Option_1.FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_1.Option_1.PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_1.Option_1.LABOR_COST,
                    FLORAL_COST:            Constant.fields.BanquetType_1.Option_1.FLORAL_COST,
                    FLORAL_COST_MARKUP:     Constant.fields.BanquetType_1.Option_1.FLORAL_COST_MARKUP,
                    COGS:                   Constant.fields.BanquetType_1.Option_1.COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_1.Option_1.NET_PRICE_AMOUNT,
                    NET_PRICE_WITH_FLORAL:  Constant.fields.BanquetType_1.Option_1.NET_PRICE_WITH_FLORAL,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_1.Option_1.LOCAL_TAX_ALLOWANCE,
                    VAT:                    Constant.fields.BanquetType_1.Option_1.VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_1.Option_1.CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_1.Option_1.ADJUSTED_PRICE,
                    WITH_SERVICE_INCENTIVE: Constant.fields.BanquetType_1.Option_1.WITH_SERVICE_INCENTIVE,
                    WITH_MOBILIZATION_FEE:  Constant.fields.BanquetType_1.Option_1.WITH_MOBILIZATION_FEE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_1.Option_1.PROPOSED_PRICE
                },
                ADD_ON: {
                    FOOD_COST:              Constant.fields.BanquetType_1.Option_1.ADD_ON_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_1.Option_1.ADD_ON_PRODUCTION_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_1.Option_1.ADD_ON_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_1.Option_1.ADD_ON_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_1.Option_1.ADD_ON_LOCAL_TAX_ALLOWANCE,
                    VAT:                    Constant.fields.BanquetType_1.Option_1.ADD_ON_VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_1.Option_1.ADD_ON_CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_1.Option_1.ADD_ON_ADJUSTED_PRICE,
                    WITH_SERVICE_INCENTIVE: Constant.fields.BanquetType_1.Option_1.ADD_ON_WITH_SERVICE_INCENTIVE,
                    WITH_MOBILIZATION_FEE:  Constant.fields.BanquetType_1.Option_1.ADD_ON_WITH_MOBILIZATION_FEE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_1.Option_1.ADD_ON_PROPOSED_PRICE
                }
            },
            Option_2: {
                BASE: {
                    FOOD_COST:              Constant.fields.BanquetType_1.Option_2.FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_1.Option_2.PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_1.Option_2.LABOR_COST,
                    FLORAL_COST:            Constant.fields.BanquetType_1.Option_2.FLORAL_COST,
                    FLORAL_COST_MARKUP:     Constant.fields.BanquetType_1.Option_2.FLORAL_COST_MARKUP,
                    COGS:                   Constant.fields.BanquetType_1.Option_2.COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_1.Option_2.NET_PRICE_AMOUNT,
                    NET_PRICE_WITH_FLORAL:  Constant.fields.BanquetType_1.Option_2.NET_PRICE_WITH_FLORAL,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_1.Option_2.LOCAL_TAX_ALLOWANCE,
                    VAT:                    Constant.fields.BanquetType_1.Option_2.VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_1.Option_2.CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_1.Option_2.ADJUSTED_PRICE,
                    WITH_SERVICE_INCENTIVE: Constant.fields.BanquetType_1.Option_2.WITH_SERVICE_INCENTIVE,
                    WITH_MOBILIZATION_FEE:  Constant.fields.BanquetType_1.Option_2.WITH_MOBILIZATION_FEE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_1.Option_2.PROPOSED_PRICE
                },
                ADD_ON: {
                    FOOD_COST:              Constant.fields.BanquetType_1.Option_2.ADD_ON_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_1.Option_2.ADD_ON_PRODUCTION_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_1.Option_2.ADD_ON_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_1.Option_2.ADD_ON_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_1.Option_2.ADD_ON_LOCAL_TAX_ALLOWANCE,
                    VAT:                    Constant.fields.BanquetType_1.Option_2.ADD_ON_VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_1.Option_2.ADD_ON_CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_1.Option_2.ADD_ON_ADJUSTED_PRICE,
                    WITH_SERVICE_INCENTIVE: Constant.fields.BanquetType_1.Option_2.ADD_ON_WITH_SERVICE_INCENTIVE,
                    WITH_MOBILIZATION_FEE:  Constant.fields.BanquetType_1.Option_2.ADD_ON_WITH_MOBILIZATION_FEE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_1.Option_2.ADD_ON_PROPOSED_PRICE
                }
            },
            Option_3: {
                BASE: {
                    FOOD_COST:              Constant.fields.BanquetType_1.Option_3.FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_1.Option_3.PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_1.Option_3.LABOR_COST,
                    FLORAL_COST:            Constant.fields.BanquetType_1.Option_3.FLORAL_COST,
                    FLORAL_COST_MARKUP:     Constant.fields.BanquetType_1.Option_3.FLORAL_COST_MARKUP,
                    COGS:                   Constant.fields.BanquetType_1.Option_3.COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_1.Option_3.NET_PRICE_AMOUNT,
                    NET_PRICE_WITH_FLORAL:  Constant.fields.BanquetType_1.Option_3.NET_PRICE_WITH_FLORAL,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_1.Option_3.LOCAL_TAX_ALLOWANCE,
                    VAT:                    Constant.fields.BanquetType_1.Option_3.VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_1.Option_3.CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_1.Option_3.ADJUSTED_PRICE,
                    WITH_SERVICE_INCENTIVE: Constant.fields.BanquetType_1.Option_3.WITH_SERVICE_INCENTIVE,
                    WITH_MOBILIZATION_FEE:  Constant.fields.BanquetType_1.Option_3.WITH_MOBILIZATION_FEE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_1.Option_3.PROPOSED_PRICE
                },
                ADD_ON: {
                    FOOD_COST:              Constant.fields.BanquetType_1.Option_3.ADD_ON_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_1.Option_3.ADD_ON_PRODUCTION_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_1.Option_3.ADD_ON_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_1.Option_3.ADD_ON_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_1.Option_3.ADD_ON_LOCAL_TAX_ALLOWANCE,
                    VAT:                    Constant.fields.BanquetType_1.Option_3.ADD_ON_VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_1.Option_3.ADD_ON_CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_1.Option_3.ADD_ON_ADJUSTED_PRICE,
                    WITH_SERVICE_INCENTIVE: Constant.fields.BanquetType_1.Option_3.ADD_ON_WITH_SERVICE_INCENTIVE,
                    WITH_MOBILIZATION_FEE:  Constant.fields.BanquetType_1.Option_3.ADD_ON_WITH_MOBILIZATION_FEE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_1.Option_3.ADD_ON_PROPOSED_PRICE
                }
            }
        },
        BanquetType_2: {
            Option_1: {
                BASE: {
                    FOOD_COST:              Constant.fields.BanquetType_2.Option_1.FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_2.Option_1.PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_2.Option_1.LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_2.Option_1.OVERTIME_ALLOWANCE,
                    FLORAL_COST:            Constant.fields.BanquetType_2.Option_1.FLORAL_COST,
                    FLORAL_COST_MARKUP:     Constant.fields.BanquetType_2.Option_1.FLORAL_COST_MARKUP,
                    COGS:                   Constant.fields.BanquetType_2.Option_1.COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_2.Option_1.NET_PRICE_AMOUNT,
                    NET_PRICE_WITH_FLORAL:  Constant.fields.BanquetType_2.Option_1.NET_PRICE_WITH_FLORAL,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_2.Option_1.LOCAL_TAX_ALLOWANCE,
                    CALC_PRICE:             Constant.fields.BanquetType_2.Option_1.CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_2.Option_1.ADJUSTED_PRICE,
                    VAT:                    Constant.fields.BanquetType_2.Option_1.VAT,
                    SERVICE_CHARGE:         Constant.fields.BanquetType_2.Option_1.SERVICE_CHARGE,              
                    PROPOSED_PRICE:         Constant.fields.BanquetType_2.Option_1.PROPOSED_PRICE,
                },
                ADD_ON_WITH_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_OVERTIME_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE,
                    CALC_PRICE:             Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_ADJUSTED_PRICE,
                    VAT:                    Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_VAT,
                    SERVICE_CHARGE:         Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_SERVICE_CHARGE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_2.Option_1.ADD_ON_WITH_MP_PROPOSED_PRICE,
                },
                ADD_ON_WITHOUT_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE,
                    CALC_PRICE:             Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE,
                    VAT:                    Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_VAT,
                    SERVICE_CHARGE:         Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_SERVICE_CHARGE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_2.Option_1.ADD_ON_WITHOUT_MP_PROPOSED_PRICE
                }
            },
            Option_2: {
                BASE: {
                    FOOD_COST:              Constant.fields.BanquetType_2.Option_2.FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_2.Option_2.PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_2.Option_2.LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_2.Option_2.OVERTIME_ALLOWANCE,
                    FLORAL_COST:            Constant.fields.BanquetType_2.Option_2.FLORAL_COST,
                    FLORAL_COST_MARKUP:     Constant.fields.BanquetType_2.Option_2.FLORAL_COST_MARKUP,
                    COGS:                   Constant.fields.BanquetType_2.Option_2.COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_2.Option_2.NET_PRICE_AMOUNT,
                    NET_PRICE_WITH_FLORAL:  Constant.fields.BanquetType_2.Option_2.NET_PRICE_WITH_FLORAL,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_2.Option_2.LOCAL_TAX_ALLOWANCE,
                    CALC_PRICE:             Constant.fields.BanquetType_2.Option_2.CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_2.Option_2.ADJUSTED_PRICE,
                    VAT:                    Constant.fields.BanquetType_2.Option_2.VAT,
                    SERVICE_CHARGE:         Constant.fields.BanquetType_2.Option_2.SERVICE_CHARGE,              
                    PROPOSED_PRICE:         Constant.fields.BanquetType_2.Option_2.PROPOSED_PRICE,
                },
                ADD_ON_WITH_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_OVERTIME_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE,
                    CALC_PRICE:             Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_ADJUSTED_PRICE,
                    VAT:                    Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_VAT,
                    SERVICE_CHARGE:         Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_SERVICE_CHARGE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_2.Option_2.ADD_ON_WITH_MP_PROPOSED_PRICE,
                },
                ADD_ON_WITHOUT_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE,
                    CALC_PRICE:             Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE,
                    VAT:                    Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_VAT,
                    SERVICE_CHARGE:         Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_SERVICE_CHARGE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_2.Option_2.ADD_ON_WITHOUT_MP_PROPOSED_PRICE
                }
            },
            Option_3: {
                BASE: {
                    FOOD_COST:              Constant.fields.BanquetType_2.Option_3.FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_2.Option_3.PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_2.Option_3.LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_2.Option_3.OVERTIME_ALLOWANCE,
                    FLORAL_COST:            Constant.fields.BanquetType_2.Option_3.FLORAL_COST,
                    FLORAL_COST_MARKUP:     Constant.fields.BanquetType_2.Option_3.FLORAL_COST_MARKUP,
                    COGS:                   Constant.fields.BanquetType_2.Option_3.COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_2.Option_3.NET_PRICE_AMOUNT,
                    NET_PRICE_WITH_FLORAL:  Constant.fields.BanquetType_2.Option_3.NET_PRICE_WITH_FLORAL,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_2.Option_3.LOCAL_TAX_ALLOWANCE,
                    CALC_PRICE:             Constant.fields.BanquetType_2.Option_3.CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_2.Option_3.ADJUSTED_PRICE,
                    VAT:                    Constant.fields.BanquetType_2.Option_3.VAT,
                    SERVICE_CHARGE:         Constant.fields.BanquetType_2.Option_3.SERVICE_CHARGE,              
                    PROPOSED_PRICE:         Constant.fields.BanquetType_2.Option_3.PROPOSED_PRICE,
                },
                ADD_ON_WITH_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_OVERTIME_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE,
                    CALC_PRICE:             Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_ADJUSTED_PRICE,
                    VAT:                    Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_VAT,
                    SERVICE_CHARGE:         Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_SERVICE_CHARGE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_2.Option_3.ADD_ON_WITH_MP_PROPOSED_PRICE,
                },
                ADD_ON_WITHOUT_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE,
                    CALC_PRICE:             Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_CALC_PRICE,
                    ADJUSTED_PRICE:         Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_ADJUSTED_PRICE,
                    VAT:                    Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_VAT,
                    SERVICE_CHARGE:         Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_SERVICE_CHARGE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_2.Option_3.ADD_ON_WITHOUT_MP_PROPOSED_PRICE
                }
            }
        },
        BanquetType_3: {
            Option_1: {
                BASE: {
                    FOOD_COST:              Constant.fields.BanquetType_3.Option_1.FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_3.Option_1.PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_3.Option_1.LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_3.Option_1.OVERTIME_ALLOWANCE,
                    FLORAL_COST:            Constant.fields.BanquetType_3.Option_1.FLORAL_COST,
                    FLORAL_COST_MARKUP:     Constant.fields.BanquetType_3.Option_1.FLORAL_COST_MARKUP,
                    COGS:                   Constant.fields.BanquetType_3.Option_1.COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_3.Option_1.NET_PRICE_AMOUNT,
                    NET_PRICE_WITH_FLORAL:  Constant.fields.BanquetType_3.Option_1.NET_PRICE_WITH_FLORAL,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_3.Option_1.LOCAL_TAX_ALLOWANCE,
                    SERVICE_INCENTIVE:      Constant.fields.BanquetType_3.Option_1.SERVICE_INCENTIVE,
                    VENUE_SHARE:            Constant.fields.BanquetType_3.Option_1.VENUE_SHARE,
                    VAT:                    Constant.fields.BanquetType_3.Option_1.VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_3.Option_1.CALC_PRICE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_3.Option_1.PROPOSED_PRICE
                },
                ADD_ON_WITH_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_OVERTIME_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE,
                    SERVICE_INCENTIVE:      Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_SERVICE_INCENTIVE,
                    VENUE_SHARE:            Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_VENUE_SHARE,
                    VAT:                    Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_CALC_PRICE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_3.Option_1.ADD_ON_WITH_MP_PROPOSED_PRICE
                },
                ADD_ON_WITHOUT_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE,
                    SERVICE_INCENTIVE:      Constant.fields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP_SERVICE_INCENTIVE,
                    VENUE_SHARE:            Constant.fields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP_VENUE_SHARE,
                    VAT:                    Constant.fields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP_VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP_CALC_PRICE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_3.Option_1.ADD_ON_WITHOUT_MP_PROPOSED_PRICE
                }
            },
            Option_2: {
                BASE: {
                    FOOD_COST:              Constant.fields.BanquetType_3.Option_2.FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_3.Option_2.PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_3.Option_2.LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_3.Option_2.OVERTIME_ALLOWANCE,
                    FLORAL_COST:            Constant.fields.BanquetType_3.Option_2.FLORAL_COST,
                    FLORAL_COST_MARKUP:     Constant.fields.BanquetType_3.Option_2.FLORAL_COST_MARKUP,
                    COGS:                   Constant.fields.BanquetType_3.Option_2.COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_3.Option_2.NET_PRICE_AMOUNT,
                    NET_PRICE_WITH_FLORAL:  Constant.fields.BanquetType_3.Option_2.NET_PRICE_WITH_FLORAL,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_3.Option_2.LOCAL_TAX_ALLOWANCE,
                    SERVICE_INCENTIVE:      Constant.fields.BanquetType_3.Option_2.SERVICE_INCENTIVE,
                    VENUE_SHARE:            Constant.fields.BanquetType_3.Option_2.VENUE_SHARE,
                    VAT:                    Constant.fields.BanquetType_3.Option_2.VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_3.Option_2.CALC_PRICE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_3.Option_2.PROPOSED_PRICE
                },
                ADD_ON_WITH_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_OVERTIME_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE,
                    SERVICE_INCENTIVE:      Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_SERVICE_INCENTIVE,
                    VENUE_SHARE:            Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_VENUE_SHARE,
                    VAT:                    Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_CALC_PRICE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_3.Option_2.ADD_ON_WITH_MP_PROPOSED_PRICE
                },
                ADD_ON_WITHOUT_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE,
                    SERVICE_INCENTIVE:      Constant.fields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP_SERVICE_INCENTIVE,
                    VENUE_SHARE:            Constant.fields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP_VENUE_SHARE,
                    VAT:                    Constant.fields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP_VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP_CALC_PRICE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_3.Option_2.ADD_ON_WITHOUT_MP_PROPOSED_PRICE
                }
            },
            Option_3: {
                BASE: {
                    FOOD_COST:              Constant.fields.BanquetType_3.Option_3.FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_3.Option_3.PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_3.Option_3.LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_3.Option_3.OVERTIME_ALLOWANCE,
                    FLORAL_COST:            Constant.fields.BanquetType_3.Option_3.FLORAL_COST,
                    FLORAL_COST_MARKUP:     Constant.fields.BanquetType_3.Option_3.FLORAL_COST_MARKUP,
                    COGS:                   Constant.fields.BanquetType_3.Option_3.COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_3.Option_3.NET_PRICE_AMOUNT,
                    NET_PRICE_WITH_FLORAL:  Constant.fields.BanquetType_3.Option_3.NET_PRICE_WITH_FLORAL,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_3.Option_3.LOCAL_TAX_ALLOWANCE,
                    SERVICE_INCENTIVE:      Constant.fields.BanquetType_3.Option_3.SERVICE_INCENTIVE,
                    VENUE_SHARE:            Constant.fields.BanquetType_3.Option_3.VENUE_SHARE,
                    VAT:                    Constant.fields.BanquetType_3.Option_3.VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_3.Option_3.CALC_PRICE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_3.Option_3.PROPOSED_PRICE
                },
                ADD_ON_WITH_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_PRODUCTION_ALLOWANCE,
                    LABOR_COST:             Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_LABOR_COST,
                    OVERTIME_ALLOWANCE:     Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_OVERTIME_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_LOCAL_TAX_ALLOWANCE,
                    SERVICE_INCENTIVE:      Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_SERVICE_INCENTIVE,
                    VENUE_SHARE:            Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_VENUE_SHARE,
                    VAT:                    Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_CALC_PRICE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_3.Option_3.ADD_ON_WITH_MP_PROPOSED_PRICE
                },
                ADD_ON_WITHOUT_MP: {
                    FOOD_COST:              Constant.fields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP_FOOD_COST,
                    PRODUCTION_ALLOWANCE:   Constant.fields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP_PRODUCTION_ALLOWANCE,
                    COGS:                   Constant.fields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP_COGS,
                    NET_PRICE_AMOUNT:       Constant.fields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP_NET_PRICE_AMOUNT,
                    LOCAL_TAX_ALLOWANCE:    Constant.fields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP_LOCAL_TAX_ALLOWANCE,
                    SERVICE_INCENTIVE:      Constant.fields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP_SERVICE_INCENTIVE,
                    VENUE_SHARE:            Constant.fields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP_VENUE_SHARE,
                    VAT:                    Constant.fields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP_VAT,
                    CALC_PRICE:             Constant.fields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP_CALC_PRICE,
                    PROPOSED_PRICE:         Constant.fields.BanquetType_3.Option_3.ADD_ON_WITHOUT_MP_PROPOSED_PRICE
                }
            }
        }
    };

    return Constant;

});

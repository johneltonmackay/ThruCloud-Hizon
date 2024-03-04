/**
 * @NApiVersion 2.1
 */
define([],

    () => {

        const NOTIFICATION = {
            REQUIRED: {
                title: 'REQUIRED FIELDS MISSING',
                message: "Kindly ensure all mandatory fields are completed before proceeding with the search."
            },
            RUNMR: {
                title: 'UNDER DEVELOPMENT',
                message: "NOT READY FOR TESTING: DATA CONSOLIDATION"
            },

        }

        return {
            NOTIFICATION,
        }

    });

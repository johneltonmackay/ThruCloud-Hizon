/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
var PAGE_SIZE = 50;
var CLIENT_SCRIPT_FILE_ID = 13686;

define(['N/search', 'N/ui/serverWidget', 'N/url', 'N/redirect','N/file', 'N/render'], function(search, serverWidget, url, redirect, file, render) {
  
    function onRequest(context) {
      if (context.request.method === 'POST') {

        var pdfFile = [];

        var xmlContent = context.request.body;

        log.debug('xmlContent',xmlContent) 
        pdfFile[0] = render.xmlToPdf({
            xmlString: xmlContent
        });

        log.debug('pdfFile',pdfFile[0])

        if (pdfFile[0]) {
            context.response.setHeader({
                name: 'Content-Type',
                value: 'application/pdf'
            })
                    
            context.response.addHeader({
                name: "Content-Disposition",
                value: 'attachment; filename=Summary_of_Issuance_Report.pdf'
            })
                    
            context.response.write({output: pdfFile[0].getContents()})
        }
      }
    }

    return {
        onRequest : onRequest
    };
});
  
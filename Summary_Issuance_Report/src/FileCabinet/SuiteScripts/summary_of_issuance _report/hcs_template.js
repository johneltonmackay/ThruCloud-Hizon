/*
Author  : Phoenix Langaman
Date    : 3/2/2024
*/


define(['N/xml','N/search','N/record'],function(xml,search,record){
    /**
     * Return true if the input variable is empty
     * @param stValue
     * @returns {boolean}
     */
    header = "";
    body = "";
   

    function setHeader(params) {
        var html = '';
        html += '<head>';
            html += '<link type="font" name="Tahoma" subtype="TrueType" src="https://7288693.app.netsuite.com/core/media/media.nl?id=3835&amp;c=7288693&amp;h=BsSPxeq7EQ_kzbkDSSq-l7EFySoUQ165uZ_-470r7HcWwGo1&amp;_xt=.ttf" src-bold="https://7288693.app.netsuite.com/core/media/media.nl?id=3836&amp;c=7288693&amp;h=3u8Z7G1oExUS3UGAWkPkQd0_NHPGbWDw39yDdwQ-AlBauZ-s&amp;_xt=.ttf" />';
            html += "<style>";
                html += ".txt-justify{";
                    html += "text-align:justify;";
                    html += "text-justify: inter-word;";
                    html += "word-break: break-all;";
                html += "}";
                html += ".header{";
                    html += "width:100%;";
                    //html += "margin-top:-0.1in;";
                    html += "table-layout:fixed;";
                html += "}";
                html += ".brdr-top{";
                    html += "border-top:1px solid #000;";
                html += "}";
                html += ".brdr-left{";
                    html += "border-left:1px solid #000;";
                html += "}";

                html += ".brdr-right{";
                    html += "border-right:1px solid #000;";
                html += "}";

                html += ".brdr-bottom{";
                    html += "border-bottom:1px solid #000;";
                html += "}";

                html += ".brdr-bottom-double{";
                    html += "border-bottom:0.5px double #000;";
                html += "}";

                html += ".valign-b{";
                    html += "vertical-align:bottom;";
                html += "}";
                html += ".valign-t{";
                    html += "vertical-align:top;";
                html += "}";
                html += ".valign-m{";
                    html += "vertical-align:middle;";
                html += "}";
                html += 'table{';
                    html += 'font-family: Tahoma, sans-serif;';
                    html += 'font-size: 9pt;';
                html += '}';
            html += "</style>";

            html += "<macrolist>";
                //Footer
                html += "<macro id='nlfooter'>";
                    html += "<table class='header'>";
                        html += '<tr>';
                            //html += '<td style="margin-left:0.5in;"><b>SFM-PUR-0004</b></td>';
                            html += '<td align="right"><b>Page <pagenumber/> of <totalpages/></b></td>';
                        html += '</tr>';
                    html += "</table>";
                html += "</macro>";
                //End Footer
            html += "</macrolist>";
        html += '</head>';
        this.header = html;
    }//end function

    function setBody(params) {
        var html = '';
       

        attributes = [];
        for(var attr in params.attributes){
            var value = params.attributes[attr]
            attributes.push(attr+'='+'"'+value+'"');
        }//end for

        attributes_str = attributes.join(' ');

        html += '<body '+attributes_str+'>';
            html += "<table cellpadding='0' cellspacing='0' class='header'>";
                html += "<tr style='font-size:12pt;'>";
                    html += "<td align='left' class='valign-t'>";
                        html += "<b>HIZON'S RESTAURANT AND CATERING SERVICES, INC.</b>";
                    html += "</td>";					
                html += "</tr>";

                html += "<tr style='height:0.25in;'>";
                    html += "<td style='font-size:9pt;valign-m' align='left' class='valign-t'>";  
                        html += "<b>Consolidated Summary of Ingredients</b>";
                    html += "</td>";					
                html += "</tr>";

                html += "<tr style='font-size:9pt;height:0.25in;valign-m'>";
                    html += "<td align='left' class='valign-t'>";  
                        html += "Calendary Type : "+(params['calendar_type'] === undefined ? '' : params['calendar_type']);
                    html += "</td>";					
                html += "</tr>";

                html += "<tr style='font-size:9pt;height:0.25in;valign-m'>";
                    html += "<td align='left' class='valign-t'>";  
                        html += "Date : "+(params['from_date'] === undefined ? '' : params['from_date']) + " To "+(params['to_date'] === undefined ? '' : params['to_date']);
                    html += "</td>";					
                html += "</tr>";


                html += "<tr style='font-size:9pt;height:0.25in;valign-m'>";
                    html += "<td align='left' class='valign-t'>";  
                        html += "Date Printed : "+(params['date_printed'] === undefined ? '' : params['date_printed']);
                    html += "</td>";					
                html += "</tr>";

            html += '</table>';

            html += "<table cellpadding='0' cellspacing='0' class='header'>";
                html += "<thead>";
                    html += '<tr style="height:0.25in;" class="brdr-top brdr-bottom">';
                        html += '<th style="width:2in;" class="valign-m">Item Code</th>';
                        html += '<th class="valign-m">Item Description</th>';
                        html += '<th style="width:1in;" align="center" class="valign-m">Qty</th>';
                        html += '<th style="width:1in;" align="center" class="valign-m">Stock Unit</th>';
                    html += '</tr>';
                html += "</thead>";

                html += "<tbody>";
                    html += '<tr style="height:0.5in;">';
                        html += '<td colspan="4" class="valign-m"></td>';
                    html += "</tr>";
                    for(var item_grp in params.items){
                        var items = params.items[item_grp];
                        html += '<tr style="height:0.25in;">';
                            html += '<td colspan="3" class="valign-m"><b>'+item_grp+'</b></td>';
                        html += "</tr>";
                        for(var item in items){
                            html += '<tr style="height:0.25in;">';
                                html += '<td class="valign-m">'+items[item]['item']+'</td>';
                                html += '<td class="valign-m">'+items[item]['description']+'</td>';
                                if(items[item]['qty_needed'] !== ''){
                                    html += '<td class="valign-m" align="center">'+toCurrency_precision(items[item]['qty_needed'],2)+'</td>';
                                }else{
                                    html += '<td class="valign-m" align="center"></td>';
                                }
                                
                                html += '<td class="valign-m" align="center">'+items[item]['qty']+'</td>';
                                
                            html += "</tr>";
                        }//end for



                        
                    }//end for
                html += "</tbody>";
            html += '</table>';

            


        html += '</body>';



        

        this.body = html;
    }//end function

    function get_template(){
        var final_xml = "<pdf>";
        final_xml = final_xml.concat(this.header);
        final_xml = final_xml.concat(this.body);
        final_xml = final_xml.concat("</pdf>");
        return final_xml;
    }



    function dateformat_words(date){
        var D = new Date(date);
        var DateStr = '';
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        DateStr = monthNames[D.getMonth()] + ' ' + D.getDate() + ', ' + D.getFullYear();
        return DateStr;
    }

    function toCurrency_precision(amount,precision) {
        var value = amount * 1.0;
        value = value.toFixed(precision);
        if (!value) {
            value = "0.00"; 
        }
        
        value += '';
        value=value.toString().split(".");
        //return value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        
        return value[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (value[1] ? "." + value[1] : "");
    }

     
    
    return {
        setHeader : setHeader,
        setBody : setBody,
        get_template : get_template,
        dateformat_words : dateformat_words,
        toCurrency_precision : toCurrency_precision
    }
});
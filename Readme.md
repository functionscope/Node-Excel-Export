# excel-export #

A simple js module for exporting data set to Excel xlsx file, it works in node and in the browser.

## Using excel-export ##
Setup configs object before passing it into the execute method. If generating multiple sheets, configs object can be an array of worksheet configuration.  Or passing in a worksheet configuration to generate single worksheet xlsx file.   Within a worksheet configuration uses **name** attribute to specify worksheet name.  **cols** is an array for column definition.  Column definition should have caption and type properties while width property is not required.  The unit for width property is character.   **beforeCellWrite** callback is optional.  beforeCellWrite is invoked with row, cell data and option object (eOpt detail later) parameters.  The return value from beforeCellWrite is what get written into the cell.  Supported valid types are string, date, bool and number.  **rows** is the data to be exported. It is an Array of Array (row). Each row should be the same length as cols.  Styling is optional.  However, if you want to style your spreadsheet, a valid excel styles xml file is needed.  An easy way to get a styles xml file is to unzip an existing xlsx file which has the desired styles and copy out the styles.xml file. Use **stylesXml**
property of configuration object to specify the content of the xml file.  Google for "spreadsheetml style" to learn more detail on styling spreadsheet.  eOpt in beforeCellWrite callback contains rowNum for current row number. eOpt.styleIndex should be a valid zero based index from cellXfs tag of the selected styles xml file.  eOpt.cellType is default to the type value specified in column definition.  However, in some scenario you might want to change it for different format.



    var express = require('express');
	var nodeExcel = require('excel-export');
	var app = express();
	var fs = require('fs')

	app.get('/Excel', function(req, res){
	  	var conf ={};
		var xmlFile = fs.readFileSync("styles.xml")
		conf.stylesXml = xmlFile
        conf.name = "mysheet";
	  	conf.cols = [{
			caption:'string',
            type:'string',
            beforeCellWrite:function(row, cellData){
				 return cellData.toUpperCase();
			},
            width:28.7109375
		},{
			caption:'date',
			type:'date',
			beforeCellWrite:function(){
				var originDate = new Date(Date.UTC(1899,11,30));
				return function(row, cellData, eOpt){
              		if (eOpt.rowNum%2){
                		eOpt.styleIndex = 1;
              		}  
              		else{
                		eOpt.styleIndex = 2;
              		}
                    if (cellData === null){
                      eOpt.cellType = 'string';
                      return 'N/A';
                    } else
                      return (cellData - originDate) / (24 * 60 * 60 * 1000);
				} 
			}()
		},{
			caption:'bool',
			type:'bool'
		},{
			caption:'number',
			 type:'number'				
	  	}];
	  	conf.rows = [
	 		['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
	 		["e", new Date(2012, 4, 1), false, 2.7182],
            ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
            ["null date", null, true, 1.414]  
	  	];
	  	var result = nodeExcel.execute(conf);
	  	res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	  	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
	  	res.end(result, 'binary');
	});

	app.listen(3000);
	console.log('Listening on port 3000');

Easiest way to use it in the browser is using buffer. Do npm install buffer

	var Buffer = require('buffer/').Buffer
	// ... same as previous example
	var result = nodeExcel.execute(conf)
	var blob = new Blob([new Buffer(result, 'binary')], {type: 'application/vnd.openxmlformats'})
	saveAs(blob, 'excel.xlsx')


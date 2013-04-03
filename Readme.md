# excel-export #

A simple module for exporting data set to Excel xlsx file.

## Using excel-export ##
Setup configuration object before passing in the execute method. **cols** is an array for column definition. Column definition should have caption and type properties. Supported valid types are string, date, bool and number.  **rows** is the data to be export. It is an Array of Array (row). Each row should be the same length of cols. 

    var express = require('express');
	var nodeExcel = require('excel-export');
	var app = express();

	app.get('/Excel', function(req, res){
	  	var conf ={};
	  	conf.cols = [
			{caption:'string', type:'string'},
			{caption:'date', type:'date'},
			{caption:'bool', type:'bool'},
			{caption:'number', type:'number'}				
	  	];
	  	conf.rows = [
			['pi', (new Date(2013, 4, 1)).getJulian(), true, 3.14],
			["e", (new Date(2012, 4, 1)).getJulian(), false, 2.7182]
	  	];
	  	var result = nodeExcel.execute(conf);
	  	res.setHeader('Content-Type', 'application/vnd.openxmlformats');
	  	res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
	  	res.end(result, 'binary');
	});

	app.listen(3000);
	console.log('Listening on port 3000');

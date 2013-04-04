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
var express = require('express');
//var nodeExcel = require('excel-export');
var nodeExcel = require('../index');
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
	 ['pi', (new Date(Date.UTC(2013, 4, 1))).oaDate(), true, 3.14],
	 ["e", (new Date(2012, 4, 1)).oaDate(), false, 2.7182],
 	 ["M&M<>'", (new Date(Date.UTC(2013, 6, 9))).oaDate(), false, 1.2]   
  ];
  var result = nodeExcel.execute(conf);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
  res.end(result, 'binary');
});

app.listen(3000);
console.log('Listening on port 3000');
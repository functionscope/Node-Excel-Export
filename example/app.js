var express = require('express');
var nodeExcel = require('excel-export');
//var nodeExcel = require('../index');
var app = express();

app.get('/Excel', function(req, res){
    var conf ={};
    conf.cols = [{
        caption:'string',
        type:'string',
        beforeCellWrite:function(row, cellData){
             return cellData.toUpperCase();
        }
    },{
        caption:'date',
        type:'date',
        beforeCellWrite:function(row, cellData){
            var originDate = new Date(Date.UTC(1899, 12, 29));
            return function(row, cellData){
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
	["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.2]   
    ];
  var result = nodeExcel.execute(conf);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats');
  res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
  res.end(result, 'binary');
});

app.listen(3000);
console.log('Listening on port 3000');
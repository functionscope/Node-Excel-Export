// test/main.js
var should = require('should');
var nodeExcel = require('../index');
var path = require('path');

describe('Simple Excel xlsx Export', function() {
  describe('Export', function() {
    it('returns xlsx', function() {
			var conf ={};

			conf.cols = [
				{caption:'string', type:'string'},
				{caption:'date', type:'date'},
				{caption:'bool', type:'bool'},
				{caption:'number 2', type:'number'}		
			];

			conf.rows = [
				['pi', (new Date(Date.UTC(2013, 4, 1))).oaDate(), true, 3.14],
				["e", (new Date(2012, 4, 1)).oaDate(), false, 2.7182],
				["M&M<>'", (new Date(Date.UTC(2013, 6, 9))).oaDate(), false, 1.2],
				["null", null, null, null]
			];
			
	    var result = nodeExcel.execute(conf),
			    fs = require('fs');
			fs.writeFileSync('test1.xlsx', result, 'binary');	
		});

		it('returns xlsx for big data set', function () {
			var conf = {};

			conf.stylesXmlFile = path.resolve(__dirname, 'styles.xml');

			conf.cols = [
				{caption:'Text', type:'string', captionStyleIndex: 1, styleIndex: 2},
				{caption:'Text 2', type:'string', captionStyleIndex: 1, styleIndex: 2},
				{caption:'Number', type:'number', captionStyleIndex: 1, styleIndex: 2},
				{caption:'Boolean', type:'bool', captionStyleIndex: 1, styleIndex: 2}
			];

			conf.rows = [];

			for(var i=0; i<10000; i++) {
				conf.rows.push(['hello', 'world', 32000.4567, true]);
			}

			var result = nodeExcel.execute(conf), fs = require('fs');
			fs.writeFileSync('test2.xlsx', result, 'binary');
		});
  });

describe('Export Async', function() {
		it('returns xlsx for big data set', function () {
			var conf = {};

			conf.stylesXmlFile = path.resolve(__dirname, 'styles.xml');

			conf.cols = [
				{caption:'Text', type:'string', captionStyleIndex: 1, styleIndex: 2},
				{caption:'Text 2', type:'string', captionStyleIndex: 1, styleIndex: 2},
				{caption:'Number', type:'number', captionStyleIndex: 1, styleIndex: 2},
				{caption:'Boolean', type:'bool', captionStyleIndex: 1, styleIndex: 2}
			];

			conf.rows = [];

			for(var i=0; i<10000; i++) {
				conf.rows.push(['hello', 'world', 32000.4567, true]);
			}

			var result = nodeExcel.executeAsync(conf, function (err, sheet) {
				should.not.exist(err);
				should.exist(sheet);
				return sheet;
			}), fs = require('fs');
			fs.writeFileSync('test3.xlsx', result, 'binary');
		});
  });
});

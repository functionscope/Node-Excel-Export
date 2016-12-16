// test/main.js
var should = require('should')
var nodeExcel = require('../index')
var dateUtils = require('./date-utils')

describe('Simple Excel xlsx Export', function () {
  describe('Export', function () {
    it('returns xlsx', function () {
      var conf = {}
      conf.name = 'xxxxxx'
      conf.cols = [{
        caption: 'string',
        type: 'string'
      },
      {
        caption: 'date',
        type: 'date'
      },
      {
        caption: 'bool',
        type: 'bool'
      },
      {
        caption: 'number 2',
        type: 'number'
      }]
      conf.rows = [['pi', dateUtils.oaDate(new Date(Date.UTC(2013, 4, 1))), true, 3.14], ['e', dateUtils.oaDate(new Date(2012, 4, 1)), false, 2.7182], ["M&M<>'", dateUtils.oaDate(new Date(Date.UTC(2013, 6, 9))), false, 1.2], ['null', null, null, null]]

      var result = nodeExcel.execute(conf)
			// console.log(result);

      var fs = require('fs')
      fs.writeFileSync('single.xlsx', result, 'binary')
    })
    it('returns multisheet xlsx', function () {
      var confs = []
      var conf = {}
      conf.cols = [{
        caption: 'string',
        type: 'string'
      },
      {
        caption: 'date',
        type: 'date'
      },
      {
        caption: 'bool',
        type: 'bool'
      },
      {
        caption: 'number 2',
        type: 'number'
      }]
      conf.rows = [['hahai', dateUtils.oaDate(new Date(Date.UTC(2013, 4, 1))), true, 3.14], ['e', dateUtils.oaDate(new Date(2012, 4, 1)), false, 2.7182], ["M&M<>'", dateUtils.oaDate(new Date(Date.UTC(2013, 6, 9))), false, 1.2], ['null', null, null, null]]
      for (var i = 0; i < 3; i++) {
        conf = JSON.parse(JSON.stringify(conf))   // clone
        conf.name = 'sheet' + i
        confs.push(conf)
      }
      var result = nodeExcel.execute(confs),
        fs = require('fs')
      fs.writeFileSync('multi.xlsx', result, 'binary')
    })
  })
})


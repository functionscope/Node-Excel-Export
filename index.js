require('node-zip');

Date.prototype.getJulian = function() {
	return Math.floor((this / 86400000) -
	(this.getTimezoneOffset()/1440) + 2440587.5);
}

var templateXLSX = "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";
var sheetFront = '<?xml version="1.0" encoding="utf-8"?><x:worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><x:sheetPr><x:outlinePr summaryBelow="1" summaryRight="1" /></x:sheetPr><x:sheetViews><x:sheetView tabSelected="0" workbookViewId="0" /></x:sheetViews><x:sheetFormatPr defaultRowHeight="15" /><x:sheetData>';
var sheetBack = '</x:sheetData><x:printOptions horizontalCentered="0" verticalCentered="0" headings="0" gridLines="0" /><x:pageMargins left="0.75" right="0.75" top="0.75" bottom="0.5" header="0.5" footer="0.75" /><x:pageSetup paperSize="1" scale="100" pageOrder="downThenOver" orientation="default" blackAndWhite="0" draft="0" cellComments="none" errors="displayed" /><x:headerFooter /><x:tableParts count="0" /></x:worksheet>';
var sharedStringsFront = '<?xml version="1.0" encoding="UTF-8"?><x:sst xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main" uniqueCount="$count" count="$count">';
var sharedStringsBack = '</x:sst>';
var shareStrings;

exports.executeAsync = function(config, callBack){
	return process.nextTick(function(){
		var r = exports.execute(config);		
		callBack(r);
	});
}

exports.execute = function(config){
	var cols = config.cols,
		data = config.rows;
	
	var xlsx = new JSZip(templateXLSX, { base64: true, checkCRC32: false }),
		sheet = xlsx.file("xl/worksheets/sheet.xml"),
		sharedStringsXml = xlsx.file("xl/sharedStrings.xml"),
		rows = "",
		row ="";
	
	shareStrings = new Array();
	//first row for column caption
	row = '<x:row r="1" spans="1:'+ cols.length + '">';
	for (var k=0; k < cols.length; k++)
	{
		row = row + addStringCol(getColumnLetter(k+1)+1, cols[k].caption);
	}
	row = row + '</x:row>';
	rows = rows + row;	
	
	//fill in data
	for (var i=0;i<data.length;i++)
	{
		var r = data[i], currRow = i+2;
		row = '<x:row r="'+currRow+'" spans="1:'+ cols.length + '">';
		for (var j=0; j<cols.length; j++)
		{
			switch(cols[j].type)
			{
				case 'number':
					row = row + addNumberCol(getColumnLetter(j+1)+currRow, r[j]);
					break;
				case 'date':
					row = row + addDateCol(getColumnLetter(j+1)+currRow, r[j]);
					break;
				case 'bool':
					row = row + addBoolCol(getColumnLetter(j+1)+currRow, r[j]);
					break;					
				default:
					row = row + addStringCol(getColumnLetter(j+1)+currRow, r[j]);
			}
		}
		row = row + '</x:row>';
		rows = rows + row;
	}	
	xlsx.remove(sheet.name);
	xlsx.file(sheet.name, sheetFront + rows + sheetBack);
	if (shareStrings.length >0)
	{
		xlsx.remove(sharedStringsXml.name);
		sharedStringsFront = sharedStringsFront.replace(/\$count/g, shareStrings.length);
		xlsx.file(sharedStringsXml.name, sharedStringsFront + convertShareStrings() + sharedStringsBack);
	}
	
	var r = xlsx.generate({ base64: false, compression: "DEFLATE" });
	delete xlsx;
	delete shareStrings;
	return r;
}

var addNumberCol = function(cellRef, value){
	if (value===null)
		return "";
	else
		return '<x:c r="'+cellRef+'" s="0" t="n"><x:v>'+value+'</x:v></x:c>';
};

var addDateCol = function(cellRef, value){
	if (value===null)
		return "";
	else
		return '<x:c r="'+cellRef+'" s="1" t="n"><x:v>'+value+'</x:v></x:c>';
};

var addBoolCol = function(cellRef, value){
	if (value===null)
		return "";
	if (value){
	  value = 1
	} else
	  value = 0;
	return '<x:c r="'+cellRef+'" s="0" t="b"><x:v>'+value+'</x:v></x:c>';
};
var addStringCol = function(cellRef, value){
	if (value===null)
		return "";
	if (shareStrings.indexOf(value) < 0){
		shareStrings.push(value);
	}
	return '<x:c r="'+cellRef+'" s="0" t="s"><x:v>'+shareStrings.indexOf(value)+'</x:v></x:c>';
};

var convertShareStrings = function(){
	var r = "";
	for (var i=0;i<shareStrings.length;i++)
	{	
		r = r + "<x:si><x:t>"+shareStrings[i]+"</x:t></x:si>";
	}
	return r;
};

var getColumnLetter = function(col){
  if (col <= 0)
	throw "col must be more than 0";
  var array = new Array();
  while (col > 0)
  {
	var remainder = col % 26;
	col /= 26;
	col = Math.floor(col);
	if(remainder ===0)
	{
		remainder = 26;
		col--;
	}
	array.push(64 + remainder);
  }
  return String.fromCharCode.apply(null, array.reverse());
}
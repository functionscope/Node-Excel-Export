var sheetFront = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' 
		+ ' <x:sheetPr/><x:sheetViews><x:sheetView tabSelected="1" workbookViewId="0" /></x:sheetViews>' 
		+ ' <x:sheetFormatPr defaultRowHeight="15" />';
var sheetBack =' <x:pageMargins left="0.75" right="0.75" top="0.75" bottom="0.5" header="0.5" footer="0.75" />'
		+ ' <x:headerFooter /></x:worksheet>';
    
var fs = require('fs');

function Sheet(config, xlsx, shareStrings, convertedShareStrings){
  this.config = config;
  this.xlsx = xlsx;
  this.shareStrings = shareStrings;
  this.convertedShareStrings = convertedShareStrings; 
}

Sheet.prototype.generate = function(){
  var config = this.config, xlsx = this.xlsx;
	var cols = config.cols,
	data = config.rows,
	colsLength = cols.length,
	rows = "",
	row = "",
	colsWidth = "",
	styleIndex,
  self = this,
	k;
	config.fileName = 'xl/worksheets/' + (config.name || "sheet").replace(/[*?\]\[\/\/]/g, '') + '.xml';
	if (config.stylesXmlFile) {
		var path = config.stylesXmlFile;
		var styles = null;
		styles = fs.readFileSync(path, 'utf8');
		if (styles) {
			xlsx.file("xl/styles.xml", styles);
		}
	}

	//first row for column caption
	row = '<x:row r="1" spans="1:' + colsLength + '">';
	var colStyleIndex;
	for (k = 0; k < colsLength; k++) {
		colStyleIndex = cols[k].captionStyleIndex || 0;
		row += addStringCell(self, getColumnLetter(k + 1) + 1, cols[k].caption, colStyleIndex);
		if (cols[k].width) {
			colsWidth += '<col customWidth = "1" width="' + cols[k].width + '" max = "' + (k + 1) + '" min="' + (k + 1) + '"/>';
		}
	}
	row += '</x:row>';
	rows += row;

	//fill in data
	var i, j, r, cellData, currRow, cellType, dataLength = data.length;

	for (i = 0; i < dataLength; i++) {
		r = data[i],
		currRow = i + 2;
		row = '<x:row r="' + currRow + '" spans="1:' + colsLength + '">';
		for (j = 0; j < colsLength; j++) {
			styleIndex = null;
			cellData = r[j];
			cellType = cols[j].type;
			if (typeof cols[j].beforeCellWrite === 'function') {
				var e = {
					rowNum: currRow,
					styleIndex: null,
					cellType: cellType
				};
				cellData = cols[j].beforeCellWrite(r, cellData, e);
				styleIndex = e.styleIndex || styleIndex;
				cellType = e.cellType;
				delete e;
			}
			switch (cellType) {
			case 'number':
				row += addNumberCell(getColumnLetter(j + 1) + currRow, cellData, styleIndex);
				break;
			case 'date':
				row += addDateCell(getColumnLetter(j + 1) + currRow, cellData, styleIndex);
				break;
			case 'bool':
				row += addBoolCell(getColumnLetter(j + 1) + currRow, cellData, styleIndex);
				break;
			default:
				row += addStringCell(self, getColumnLetter(j + 1) + currRow, cellData, styleIndex);
			}
		}
		row += '</x:row>';
		rows += row;
	}
	if (colsWidth !== "") {
		sheetFront += '<cols>' + colsWidth + '</cols>';
	}
	xlsx.file(config.fileName, sheetFront + '<x:sheetData>' + rows + '</x:sheetData>' + sheetBack);
}

module.exports = Sheet;

var startTag = function (obj, tagName, closed){
  var result = "<" + tagName, p;
  for (p in obj){
    result += " " + p + "=" + obj[p];
  }
  if (!closed)
    result += ">";
  else
    result += "/>";
  return result;
};

var endTag = function(tagName){
  return "</" + tagName + ">";
};

var addNumberCell = function(cellRef, value, styleIndex){
  styleIndex = styleIndex || 0;
	if (value===null)
		return "";
	else
		return '<x:c r="'+cellRef+'" s="'+ styleIndex +'" t="n"><x:v>'+value+'</x:v></x:c>';
};

var addDateCell = function(cellRef, value, styleIndex){
  styleIndex = styleIndex || 1;
	if (value===null)
		return "";
	else
		return '<x:c r="'+cellRef+'" s="'+ styleIndex +'" t="n"><x:v>'+value+'</x:v></x:c>';
};

var addBoolCell = function(cellRef, value, styleIndex){
  styleIndex = styleIndex || 0;
	if (value===null)
		return "";
	if (value){
	  value = 1;
	} else
	  value = 0;
	return '<x:c r="'+cellRef+'" s="'+ styleIndex + '" t="b"><x:v>'+value+'</x:v></x:c>';
};


var addStringCell = function(sheet, cellRef, value, styleIndex){
  styleIndex = styleIndex || 0;
	if (value===null)
		return "";
  if (typeof value ==='string'){
    value = value.replace(/&/g, "&amp;").replace(/'/g, "&apos;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
  }
  var i = sheet.shareStrings.get(value, -1);
	if ( i< 0){
    i = sheet.shareStrings.length;
  	sheet.shareStrings.add(value, i);
    sheet.convertedShareStrings += "<x:si><x:t>"+value+"</x:t></x:si>";
	}
	return '<x:c r="'+cellRef+'" s="'+ styleIndex + '" t="s"><x:v>'+i+'</x:v></x:c>';
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
};

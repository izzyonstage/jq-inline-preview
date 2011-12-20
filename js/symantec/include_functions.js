//_________________________________________________________________________________________________
// [STRINGS]


String.prototype.pad = function(sChar, iLength, iEnd)
	{
	if ((sChar == undefined) || (sChar == null)){sChar = " ";} else {sChar = sChar.toString().substring(0,1);};
	if ((iLength == undefined) || (isNaN(iLength))){iLength = this.length};
	if ((iEnd == undefined) || (isNaN(iEnd))){iEnd = 0};     // 0=left; 1=right
	var sTemp = this.toString();
	var iDiff = (iLength - sTemp.length);
	if (iDiff > 0)
		{
		var sDiff = new Array((iLength - sTemp.length) + 1).join(sChar);
		return (iEnd == 0 ? sDiff + sTemp : sTemp + sDiff);
		}
	else
		{ return sTemp; };
	};
String.prototype.lPad = function(sChar, iLength){return this.pad(sChar, iLength, 0);};
String.prototype.rPad = function(sChar, iLength){return this.pad(sChar, iLength, 1);};




// derived from [http://blog.stevenlevithan.com/archives/faster-trim-javascript]
String.prototype.trim = function()
	{
	var sTemp = this.replace(/^\s+/, "");
	for (var ii = (sTemp.length - 1); ii >= 0; ii--){if (/\S/.test(sTemp.charAt(ii))){sTemp = sTemp.substring(0, ii + 1); break;};};
	return sTemp;
	};




String.prototype.isGuid = function()
	{
	var sTemp = this.toString();
	if (sTemp.length >= 36)
		{
		if (sTemp.length == 36){ var oRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i }
			else if (sTemp.length == 38){ var oRegex = /^\{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}$/i };
		return oRegex.test(sTemp); delete oRegex;
		};
	return false;
	};




// from http://javascript.about.com/library/blchunk.htm
String.prototype.chunk = function(iChunk)
	{
	if (typeof iChunk == "undefined"){iChunk = 2};
	return this.match(RegExp(".{1," + iChunk + "}","g"));
	};




//_________________________________________________________________________________________________
// [DATETIME]


Date.prototype.timestamp = function(bShowTime, bShowSeconds, bShowMilliseconds, sDateSeperator, sTimeSeperator, sDateTimeSeperator, bShowOffset)
	{
 	bShowTime = (bShowTime == false ? false : true);
 	bShowSeconds = (bShowSeconds == false ? false : true);
 	bShowMilliseconds = (bShowMilliseconds == true ? true : false);
	sDateSeperator = (typeof sDateSeperator == "string" ? sDateSeperator : "-");
	sTimeSeperator = (typeof sTimeSeperator == "string" ? sTimeSeperator : ":");
	sDateTimeSeperator = (typeof sDateTimeSeperator == "string" ? sDateTimeSeperator : " ");
 	bShowOffset = (bShowOffset == true ? true : false);
	var sYear = this.getFullYear(); var sMonth = (this.getMonth() + 1).toString().pad("0", 2); var sDay = this.getDate().toString().pad("0", 2);
	var sHours = this.getHours().toString().pad("0", 2); var sMinutes = this.getMinutes().toString().pad("0", 2); var sSeconds = this.getSeconds().toString().pad("0", 2); var sMilliseconds = this.getMilliseconds().toString().pad("0", 3);
	var iOffset = new Date().getTimezoneOffset(); var bOffsetNeg = (iOffset > 0); var iOffset = Math.abs(iOffset);     // offset from GMT
	var sOffsetHours = Math.floor(iOffset/60).toString().lPad("0", 2); var sOffsetMinutes = (iOffset % 60).toString().lPad("0", 2);
	var sDate = (sYear) + (sDateSeperator) + (sMonth) + (sDateSeperator) + (sDay);
	var sTime = (sHours) + (sTimeSeperator) + (sMinutes) + (bShowSeconds ? ((sTimeSeperator) + (sSeconds) + (bShowMilliseconds ? ("." + sMilliseconds) : "")) : "");
	var sOffset = (bOffsetNeg ? "-" : "+") + (sOffsetHours) + (sTimeSeperator) + (sOffsetMinutes);
	return sDate + (bShowTime ? (sDateTimeSeperator) + sTime + (bShowOffset ? " " + sOffset : "") : "");
	};




//_________________________________________________________________________________________________
// [ARRAYS]


Array.prototype.removeEmptyKeys = function()
	{
	for (var ii = 0; ii < this.length; ii++){if (this[ii].length == 0){this.splice(ii, 1); ii = ii - 1;};};
	return this;
	};




Array.prototype.trimKeys = function()
	{
	for (var ii = 0; ii < this.length; ii++){if (typeof this[ii] == "string"){this[ii] = this[ii].trim();};};
	return this;
	};








//_________________________________________________________________________________________________
// [GENERIC]
function getTypeOf(vntValue)
	{
	if (typeof vntValue === "object")
		{
		if (null === vntValue){ return "null"; }
		else
			{
			var strReturn = vntValue.constructor.toString().substring(0,50).toLowerCase().replace(/function /, '');
			return strReturn.substring(0, strReturn.indexOf("("));
			};
		}
	else
		{
		if (typeof vntValue === "number") { if (parseInt(vntValue) !== vntValue) { return "float"; } else { return "integer"; }; }
		else { return (typeof vntValue); };
		};
	};
function isArray(vntValue){ return (getTypeOf(vntValue) === "array"); };
function isDate(){ return (getTypeOf(vntValue) === "date"); };
function isFloat(vntValue){ return (getTypeOf(vntValue) === "float"); };
function isInteger(vntValue){ return (getTypeOf(vntValue) === "integer"); };
function isNumeric(vntValue){ return ((getTypeOf(vntValue) === "integer") || (getTypeOf(vntValue) === "float")); };
function isNull(vntValue){ return (getTypeOf(vntValue) === "null"); };
function isObject(vntValue){ return (getTypeOf(vntValue) === "object"); };
function isString(vntValue){ return (getTypeOf(vntValue) === "string"); };
function isUndefined(vntValue){ return (getTypeOf(vntValue) === "undefined"); };


function isTrue(vntValue)
	{
	switch(getTypeOf(vntValue))
		{
		case "undefined": case "null": case "date": case "object": return false; break;
		case "integer": case "float": return (parseInt(vntValue) === 1); break;
		case "boolean": return (vntValue === true); break; 
		case "string": return (["1", "t", "y", "true", "yes", "on", "enabled", "active", "checked", "selected", "ok", "okay"].indexOf(vntValue.toLowerCase()) >= 0 ? true : false); break;
		default: return false; break;
		};
	};


function len(vntValue){ try { return vntValue.toString().length; } catch(err) { return 0 }; };
function hasLen(vntValue){ return (len(vntValue) > 0); };


function generateGuid(blnBraces, blnHyphens)
	{
	var strGuid = ((blnBraces ? "{" : "") + "xxxxxxxx" + (blnHyphens ? "-" : "") + "xxxx" + (blnHyphens ? "-" : "") + "4xxx" + (blnHyphens ? "-" : "") + "yxxx" + (blnHyphens ? "-" : "") + "xxxxxxxxxxxx" + (blnBraces ? "}" : "")).replace(/[xy]/g, function(c){ var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); });
	return strGuid.toUpperCase();
	};
// adapted from [http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript]


function generateCustomGuid(strPrefix, blnBraces, blnHyphens)
	{
	var strGuid = generateGuid(false, blnHyphens);
 	strGuid = strPrefix + strGuid.substr(strPrefix.length);
	if (blnBraces){strGuid = "{" + strGuid + "}";};
	return strGuid;
	};


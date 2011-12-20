// /*Character count*/
// [RM_D3444_20110214] -- this code replaced with jQuery code at bottom of page
// 
// /*General position finding functions*/
// function findPosX(obj)
// {
// 	var curleft = 0;
// 	if (obj.offsetParent)
// 	{
// 		while (obj.offsetParent)
// 		{
// 			curleft += obj.offsetLeft
// 			obj = obj.offsetParent;
// 		}
// 	}
// 	else if (obj.x)
// 		curleft += obj.x;
// 	return curleft;
// }
// 
//  
// function findPosY(obj)
// {
// 	var curtop = 0;
// 	if (obj.offsetParent)
// 	{
// 		while (obj.offsetParent)
// 		{
// 			curtop += obj.offsetTop
// 			obj = obj.offsetParent;
// 		}
// 	}
// 	else if (obj.y)
// 		curtop += obj.y;
// 	return curtop;
// }
// 
// 	
// /*Character count functions*/
// var showCharacterCountCountdown = 10;
// function showCharacterCount(input, show, maxLength)
// {
// 	var divId = "CharacterCount";
// 			
// 	var div = getElementByIdCompatible(divId);
// 	if (div)
// 	{
// 		if (show)
// 		{
// 			var remaining = maxLength - input.value.length;
// 			if (remaining < 0)
// 			{
// 				remaining = 0;
// 			}
// 			if (remaining <= 5000)
// 			{
// 				div.className =  'CharacterCountShow';
// 				div.innerHTML = remaining;
// 				div.style.left = findPosX(input) + input.offsetWidth;
// 				div.style.top = findPosY(input);
// 			}
// 		}
// 		else
// 		{
// 			div.className =  'CharacterCount';
// 		}
// 	}
// }
// 
// 
// function characterCount(e, input, maxLength)
// {
// 	var keyChar = GetEventKey(e); 
//     var keyCode = GetEventKeyCode(e);
//     //alert(keyCode);
// 	if (maxLength==0)
// 	{
// 		return;
// 	}
// 	if (input == null)
// 	{
// 		return;
// 	}
// 	showCharacterCountCountdown = 10;	
// 	showCharacterCount(input, true, maxLength);
// 	hideCharacterCount(input.id);
// 	if (input.value.length >= maxLength)
// 	{
// 		//let cursor keys occur, page up page down
// 		if (keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40 || keyCode == 33 || keyCode == 34) 
// 		{
// 			return true;
// 		}
// 		else
// 		{
// 			input.value = input.value.substr(0, maxLength);
// 			return false;
// 		}
// 		
// 	}
// }
// 
// 
// function hideCharacterCount(id)
// {
// 	if (showCharacterCountCountdown > 0)
// 	{
// 		showCharacterCountCountdown -= 1;
// 		setTimeout("hideCharacterCount('" + id + "')", 1000);
// 	}
// 	else
// 	{
// 		showCharacterCount(id, false, 0);
// 	}
// 			
// }
// 
// /*End Character Count*/




//-------------------------------------------------Preview------------------------------------------------
var g_lBackCount = -1;

//D517 SB 23/11/09 - Replacing ShowPreview function with modified version to work with FF
function ShowPreview(fPopupWindow, lWidth, lHeight, strFrameId, strActionUrl, strPageRange)
	{
	var newWindow = null;
	if (fPopupWindow)
		{
		// centre it 
		if(lWidth==0)
			lWidth = 800;
		if(lHeight==0)
			lHeight = 600;
		var lLeft = 0, lTop = 0;
		var oWind;
		lLeft = (screen.width - lWidth) / 2;
		lTop = (screen.height - lHeight) / 2;
		newWindow = window.open('','ActiBrandPreview','left=' + lLeft + ',top=' + lTop + ',width=' + lWidth + ',height=' + lHeight + ',resizable=yes,scrollbars=yes');
		newWindow.moveTo(lLeft, lTop);
		}
	else
		{
		newWindow = getElementByIdCompatible(strFrameId);
		if (newWindow == null)
			{
			return(false);
			};
		};
	
	//get all the form elements from this page
	var x, y, nNumOfElements;
	var nNumOfForms = document.forms.length;
	var pageHTML;
	var formElem = document.forms["Elateral_Questions"];
	nNumOfElements = formElem.elements.length;
	
	pageHTML = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"></meta></head><body><div style=\"display:none;\"><form id=\"form1\" name=\"form1\" method=\"post\" action=\"" + strActionUrl + "\">";
	
	for(y = 0; y < nNumOfElements; y++)
	{
		if((formElem.elements[y].tagName=="INPUT") && (formElem.elements[y].type!="button") && (formElem.elements[y].type!="image"))
		{
			//alert(document.forms[x].elements[y].type);
			if((formElem.elements[y].type=="checkbox") || (formElem.elements[y].type=="radio"))
			{
				var checked = "";
				if(formElem.elements[y].checked)
					pageHTML += "<input name=\"" + formElem.elements[y].name + "\" type=\"hidden\" value=\"" + FullReplace(formElem.elements[y].value,  '"', '&quot;') + "\">";
				}
			else
				pageHTML += "<input name=\"" + formElem.elements[y].name + "\" type=\"hidden\" value=\"" + FullReplace(formElem.elements[y].value,  '"', '&quot;') + "\">";
			}
		else if((formElem.elements[y].tagName=="SELECT"))
		{
			pageHTML += "<input name=\"" + formElem.elements[y].name + "\" type=\"hidden\" value=\"" + FullReplace(formElem.elements[y].value,  '"', '&quot;') + "\">";
		}
		else if((formElem.elements[y].tagName=="TEXTAREA"))
		{
			pageHTML += "<input name=\"" + formElem.elements[y].name + "\" type=\"hidden\" value=\"" + FullReplace(formElem.elements[y].value,  '"', '&quot;') + "\">";
		}
	}
	//if we have a page range, add a special elaterla form item
	if(strPageRange.length > 0)
	{
		pageHTML += "<input name=\"Elateral_PreviewPageRange\" type=\"hidden\" value=\"" + FullReplace(strPageRange,  '"', '&quot;') + "\">";
	}
	
	pageHTML += "<input name=\"Elateral_PreviewPopupWindow\" type=\"hidden\" value=\"" + fPopupWindow + "\">";	
	pageHTML += "</form></div></body></html>";
			
	pageHTML += "<script language=\"javascript\">document.form1.submit();</script>";
	// newWindow.document.forms['form1'].submit();

	if(newWindow.contentDocument)
		newWindow.contentDocument.write(pageHTML);
	else
		newWindow.document.write(pageHTML);

	return false;
}


function FullReplace(str1, str2, str3)
{
	while(str1.indexOf(str2) != -1)
	{
		str1 = str1.replace(str2, str3);
	}
	return str1;
} 


//-------------------------------------------------- General Funcs ----------------------------------------
function ResizeWindow(lWidth, lHeight)
{
	window.resizeTo(lWidth, lHeight);

	var clientWidth = window.document.body.offsetWidth;
	var clientHeight = window.document.body.offsetHeight;

	var lExtraTop =  lHeight - clientHeight;
	var lExtraLeft =  lWidth - clientWidth;

	window.resizeTo(lWidth + lExtraLeft, lHeight + lExtraTop);

	var clientWidth = window.document.body.offsetWidth;
	var clientHeight = window.document.body.offsetHeight;
}


//-------------------------------------------------- Range Checking ----------------------------------------

// Strings used for error messages - Need translating?
var strNotOptional =	Un(": Cannot be empty", "Includes\JS\Questions.js");
var strTooShort1 =		Un(": Needs to be at least ", "Includes\JS\Questions.js");
var strTooShort2 =		Un(" characters long", "Includes\JS\Questions.js");
var strTooLong1 =		Un(": Cannot be more than ", "Includes\JS\Questions.js");
var strTooLong2 =		Un(" characters long (1)", "Includes\JS\Questions.js");
var strNonNegNum =		Un(": Must be a Positive Number", "Includes\JS\Questions.js");
var strNum =			Un(": Must be a Number", "Includes\JS\Questions.js");
var strAlphaNum =		Un(": Must have only AlphaNumeric characters","Includes\JS\Questions.js");
var strLowVal =			Un(": Needs to have a value of at least ", "Includes\JS\Questions.js");
var strHighVal =		Un(": Cannot be more than  (1)", "Includes\JS\Questions.js");



// BASIC DATA VALIDATION FUNCTIONS:
//
// isWhitespace (s)                    Check whether string s is empty or whitespace.
// isLetter (c)                        Check whether character c is an English letter 
// isDigit (c)                         Check whether character c is a digit 
// isLetterOrDigit (c)                 Check whether character c is a letter or digit.
// isInteger (s [,eok])                True if all characters in string s are numbers.
// isSignedInteger (s [,eok])          True if all characters in string s are numbers; leading + or - allowed.
// isPositiveInteger (s [,eok])        True if string s is an integer > 0.
// isNonnegativeInteger (s [,eok])     True if string s is an integer >= 0.
// isNegativeInteger (s [,eok])        True if s is an integer < 0.
// isNonpositiveInteger (s [,eok])     True if s is an integer <= 0.
// isFloat (s [,eok])                  True if string s is an unsigned floating point (real) number. (Integers also OK.)
// isSignedFloat (s [,eok])            True if string s is a floating point number; leading + or - allowed. (Integers also OK.)
// isAlphabetic (s [,eok])             True if string s is English letters 
// isAlphanumeric (s [,eok])           True if string s is English letters and numbers only.
// 



// VARIABLE DECLARATIONS

var digits = "0123456789";

var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz"

var uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


// whitespace characters
var whitespace = " \t\n\r";


// decimal point character differs by language and culture
var decimalPointDelimiter = "."


// Global variable defaultEmptyOK defines default return value 
// for many functions when they are passed the empty string. 
// By default, they will return defaultEmptyOK.
//
// defaultEmptyOK is false, which means that by default, 
// these functions will do "strict" validation.  Function
// isInteger, for example, will only return true if it is
// passed a string containing an integer; if it is passed
// the empty string, it will return false.
//
// You can change this default behavior globally (for all 
// functions which use defaultEmptyOK) by changing the value
// of defaultEmptyOK.
//
// Most of these functions have an optional argument emptyOK
// which allows you to override the default behavior for 
// the duration of a function call.
//
// This functionality is useful because it is possible to
// say "if the user puts anything in this field, it must
// be an integer (or a phone number, or a string, etc.), 
// but it's OK to leave the field empty too."
// This is the case for fields which are optional but which
// must have a certain kind of content if filled in.

var defaultEmptyOK = false




// Attempting to make this library run on Navigator 2.0,
// so I'm supplying this array creation routine as per
// JavaScript 1.0 documentation.  If you're using 
// Navigator 3.0 or later, you don't need to do this;
// you can use the Array constructor instead.

function makeArray(n) {
//*** BUG: If I put this line in, I get two error messages:
//(1) Window.length can't be set by assignment
//(2) daysInMonth has no property indexed by 4
//If I leave it out, the code works fine.
//   this.length = n;
   for (var i = 1; i <= n; i++) {
      this[i] = 0
   } 
   return this
}



var daysInMonth = makeArray(12);
daysInMonth[1] = 31;
daysInMonth[2] = 29;   // must programmatically check this
daysInMonth[3] = 31;
daysInMonth[4] = 30;
daysInMonth[5] = 31;
daysInMonth[6] = 30;
daysInMonth[7] = 31;
daysInMonth[8] = 31;
daysInMonth[9] = 30;
daysInMonth[10] = 31;
daysInMonth[11] = 30;
daysInMonth[12] = 31;






// Check whether string s is empty.

function isEmpty(s)
{   return ((s == null) || (s.length == 0))
}



// Returns true if string s is empty or 
// whitespace characters only.

function isWhitespace (s)

{   var i;

    // Is s empty?
    if (isEmpty(s)) return true;

    // Search through string's characters one by one
    // until we find a non-whitespace character.
    // When we do, return false; if we don't, return true.

    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);

        if (whitespace.indexOf(c) == -1) return false;
    }

    // All characters are whitespace.
    return true;
}



// Removes all characters which appear in string bag from string s.

function stripCharsInBag (s, bag)

{   var i;
    var returnString = "";

    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.

    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }

    return returnString;
}



// Removes all characters which do NOT appear in string bag 
// from string s.

function stripCharsNotInBag (s, bag)

{   var i;
    var returnString = "";

    // Search through string's characters one by one.
    // If character is in bag, append to returnString.

    for (i = 0; i < s.length; i++)
    {   
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (bag.indexOf(c) != -1) returnString += c;
    }

    return returnString;
}



// Removes all whitespace characters from s.
// Global variable whitespace (see above)
// defines which characters are considered whitespace.

function stripWhitespace (s)

{   return stripCharsInBag (s, whitespace)
}




// WORKAROUND FUNCTION FOR NAVIGATOR 2.0.2 COMPATIBILITY.
//
// The below function *should* be unnecessary.  In general,
// avoid using it.  Use the standard method indexOf instead.
//
// However, because of an apparent bug in indexOf on 
// Navigator 2.0.2, the below loop does not work as the
// body of stripInitialWhitespace:
//
// while ((i < s.length) && (whitespace.indexOf(s.charAt(i)) != -1))
//   i++;
//
// ... so we provide this workaround function charInString
// instead.
//
// charInString (CHARACTER c, STRING s)
//
// Returns true if single character c (actually a string)
// is contained within string s.

function charInString (c, s)
{   for (i = 0; i < s.length; i++)
    {   if (s.charAt(i) == c) return true;
    }
    return false
}



// Removes initial (leading) whitespace characters from s.
// Global variable whitespace (see above)
// defines which characters are considered whitespace.

function stripInitialWhitespace (s)

{   var i = 0;

    while ((i < s.length) && charInString (s.charAt(i), whitespace))
       i++;
    
    return s.substring (i, s.length);
}







// Returns true if character c is an English letter 
// (A .. Z, a..z).
//
// NOTE: Need i18n version to support European characters.
// This could be tricky due to different character
// sets and orderings for various languages and platforms.

function isLetter (c)
{   return ( ((c >= "a") && (c <= "z")) || ((c >= "A") && (c <= "Z")) )
}



// Returns true if character c is a digit 
// (0 .. 9).

function isDigit (c)
{   return ((c >= "0") && (c <= "9"))
}



// Returns true if character c is a letter or digit.

function isLetterOrDigit (c)
{   return (isLetter(c) || isDigit(c))
}



// isInteger (STRING s [, BOOLEAN emptyOK])
// 
// Returns true if all characters in string s are numbers.
//
// Accepts non-signed integers only. Does not accept floating 
// point, exponential notation, etc.
//
// We don't use parseInt because that would accept a string
// with trailing non-numeric characters.
//
// By default, returns defaultEmptyOK if s is empty.
// There is an optional second argument called emptyOK.
// emptyOK is used to override for a single function call
//      the default behavior which is specified globally by
//      defaultEmptyOK.
// If emptyOK is false (or any value other than true), 
//      the function will return false if s is empty.
// If emptyOK is true, the function will return true if s is empty.
//
// EXAMPLE FUNCTION CALL:     RESULT:
// isInteger ("5")            true 
// isInteger ("")             defaultEmptyOK
// isInteger ("-5")           false
// isInteger ("", true)       true
// isInteger ("", false)      false
// isInteger ("5", false)     true

function isInteger (s)

{   var i;

    if (isEmpty(s)) 
       if (isInteger.arguments.length == 1) return defaultEmptyOK;
       else return (isInteger.arguments[1] == true);

    // Search through string's characters one by one
    // until we find a non-numeric character.
    // When we do, return false; if we don't, return true.

    for (i = 0; i < s.length; i++)
    {   
        // Check that current character is number.
        var c = s.charAt(i);

        if (!isDigit(c)) return false;
    }

    // All characters are numbers.
    return true;
}







// isSignedInteger (STRING s [, BOOLEAN emptyOK])
// 
// Returns true if all characters are numbers; 
// first character is allowed to be + or - as well.
//
// Does not accept floating point, exponential notation, etc.
//
// We don't use parseInt because that would accept a string
// with trailing non-numeric characters.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.
//
// EXAMPLE FUNCTION CALL:          RESULT:
// isSignedInteger ("5")           true 
// isSignedInteger ("")            defaultEmptyOK
// isSignedInteger ("-5")          true
// isSignedInteger ("+5")          true
// isSignedInteger ("", false)     false
// isSignedInteger ("", true)      true

function isSignedInteger (s)

{   if (isEmpty(s)) 
       if (isSignedInteger.arguments.length == 1) return defaultEmptyOK;
       else return (isSignedInteger.arguments[1] == true);

    else {
        var startPos = 0;
        var secondArg = defaultEmptyOK;

        if (isSignedInteger.arguments.length > 1)
            secondArg = isSignedInteger.arguments[1];

        // skip leading + or -
        if ( (s.charAt(0) == "-") || (s.charAt(0) == "+") )
           startPos = 1;    
        return (isInteger(s.substring(startPos, s.length), secondArg))
    }
}




// isPositiveInteger (STRING s [, BOOLEAN emptyOK])
// 
// Returns true if string s is an integer > 0.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isPositiveInteger (s)
{   var secondArg = defaultEmptyOK;

    if (isPositiveInteger.arguments.length > 1)
        secondArg = isPositiveInteger.arguments[1];

    // The next line is a bit byzantine.  What it means is:
    // a) s must be a signed integer, AND
    // b) one of the following must be true:
    //    i)  s is empty and we are supposed to return true for
    //        empty strings
    //    ii) this is a positive, not negative, number

    return (isSignedInteger(s, secondArg)
         && ( (isEmpty(s) && secondArg)  || (parseInt (s) > 0) ) );
}






// isNonnegativeInteger (STRING s [, BOOLEAN emptyOK])
// 
// Returns true if string s is an integer >= 0.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isNonnegativeInteger (s)
{   var secondArg = defaultEmptyOK;

    if (isNonnegativeInteger.arguments.length > 1)
        secondArg = isNonnegativeInteger.arguments[1];

    // The next line is a bit byzantine.  What it means is:
    // a) s must be a signed integer, AND
    // b) one of the following must be true:
    //    i)  s is empty and we are supposed to return true for
    //        empty strings
    //    ii) this is a number >= 0

    return (isSignedInteger(s, secondArg)
         && ( (isEmpty(s) && secondArg)  || (parseInt (s) >= 0) ) );
}






// isNegativeInteger (STRING s [, BOOLEAN emptyOK])
// 
// Returns true if string s is an integer < 0.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isNegativeInteger (s)
{   var secondArg = defaultEmptyOK;

    if (isNegativeInteger.arguments.length > 1)
        secondArg = isNegativeInteger.arguments[1];

    // The next line is a bit byzantine.  What it means is:
    // a) s must be a signed integer, AND
    // b) one of the following must be true:
    //    i)  s is empty and we are supposed to return true for
    //        empty strings
    //    ii) this is a negative, not positive, number

    return (isSignedInteger(s, secondArg)
         && ( (isEmpty(s) && secondArg)  || (parseInt (s) < 0) ) );
}






// isNonpositiveInteger (STRING s [, BOOLEAN emptyOK])
// 
// Returns true if string s is an integer <= 0.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isNonpositiveInteger (s)
{   var secondArg = defaultEmptyOK;

    if (isNonpositiveInteger.arguments.length > 1)
        secondArg = isNonpositiveInteger.arguments[1];

    // The next line is a bit byzantine.  What it means is:
    // a) s must be a signed integer, AND
    // b) one of the following must be true:
    //    i)  s is empty and we are supposed to return true for
    //        empty strings
    //    ii) this is a number <= 0

    return (isSignedInteger(s, secondArg)
         && ( (isEmpty(s) && secondArg)  || (parseInt (s) <= 0) ) );
}





// isFloat (STRING s [, BOOLEAN emptyOK])
// 
// True if string s is an unsigned floating point (real) number. 
//
// Also returns true for unsigned integers. If you wish
// to distinguish between integers and floating point numbers,
// first call isInteger, then call isFloat.
//
// Does not accept exponential notation.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isFloat (s)

{   var i;
    var seenDecimalPoint = false;

    if (isEmpty(s)) 
       if (isFloat.arguments.length == 1) return defaultEmptyOK;
       else return (isFloat.arguments[1] == true);

    if (s == decimalPointDelimiter) return false;

    // Search through string's characters one by one
    // until we find a non-numeric character.
    // When we do, return false; if we don't, return true.

    for (i = 0; i < s.length; i++)
    {   
        // Check that current character is number.
        var c = s.charAt(i);

        if ((c == decimalPointDelimiter) && !seenDecimalPoint) seenDecimalPoint = true;
        else if (!isDigit(c)) return false;
    }

    // All characters are numbers.
    return true;
}







// isSignedFloat (STRING s [, BOOLEAN emptyOK])
// 
// True if string s is a signed or unsigned floating point 
// (real) number. First character is allowed to be + or -.
//
// Also returns true for unsigned integers. If you wish
// to distinguish between integers and floating point numbers,
// first call isSignedInteger, then call isSignedFloat.
//
// Does not accept exponential notation.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isSignedFloat (s)

{   if (isEmpty(s)) 
       if (isSignedFloat.arguments.length == 1) return defaultEmptyOK;
       else return (isSignedFloat.arguments[1] == true);

    else {
        var startPos = 0;
        var secondArg = defaultEmptyOK;

        if (isSignedFloat.arguments.length > 1)
            secondArg = isSignedFloat.arguments[1];

        // skip leading + or -
        if ( (s.charAt(0) == "-") || (s.charAt(0) == "+") )
           startPos = 1;    
        return (isFloat(s.substring(startPos, s.length), secondArg))
    }
}




// isAlphabetic (STRING s [, BOOLEAN emptyOK])
// 
// Returns true if string s is English letters 
// (A .. Z, a..z) only.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.
//
// NOTE: Need i18n version to support European characters.
// This could be tricky due to different character
// sets and orderings for various languages and platforms.

function isAlphabetic (s)

{   var i;

    if (isEmpty(s)) 
       if (isAlphabetic.arguments.length == 1) return defaultEmptyOK;
       else return (isAlphabetic.arguments[1] == true);

    // Search through string's characters one by one
    // until we find a non-alphabetic character.
    // When we do, return false; if we don't, return true.

    for (i = 0; i < s.length; i++)
    {   
        // Check that current character is letter.
        var c = s.charAt(i);

        if (!isLetter(c))
        return false;
    }

    // All characters are letters.
    return true;
}




// isAlphanumeric (STRING s [, BOOLEAN emptyOK])
// 
// Returns true if string s is English letters 
// (A .. Z, a..z) and numbers only.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.
//
// NOTE: Need i18n version to support European characters.
// This could be tricky due to different character
// sets and orderings for various languages and platforms.

function isAlphanumeric (s)

{   var i;

    if (isEmpty(s)) 
       if (isAlphanumeric.arguments.length == 1) return defaultEmptyOK;
       else return (isAlphanumeric.arguments[1] == true);

    // Search through string's characters one by one
    // until we find a non-alphanumeric character.
    // When we do, return false; if we don't, return true.

    for (i = 0; i < s.length; i++)
    {   
        // Check that current character is number or letter.
        var c = s.charAt(i);

        if (! (isLetter(c) || isDigit(c) || c == ' ' || c == '\n' || c == '\r') )
        return false;
    }

    // All characters are numbers or letters.
    return true;
}




// reformat (TARGETSTRING, STRING, INTEGER, STRING, INTEGER ... )       
//
// Handy function for arbitrarily inserting formatting characters
// or delimiters of various kinds within TARGETSTRING.
//
// reformat takes one named argument, a string s, and any number
// of other arguments.  The other arguments must be integers or
// strings.  These other arguments specify how string s is to be
// reformatted and how and where other strings are to be inserted
// into it.
//
// reformat processes the other arguments in order one by one.
// * If the argument is an integer, reformat appends that number 
//   of sequential characters from s to the resultString.
// * If the argument is a string, reformat appends the string
//   to the resultString.
//
// NOTE: The first argument after TARGETSTRING must be a string.
// (It can be empty.)  The second argument must be an integer.
// Thereafter, integers and strings must alternate.  This is to
// provide backward compatibility to Navigator 2.0.2 JavaScript
// by avoiding use of the typeof operator.
//
// It is the caller's responsibility to make sure that we do not
// try to copy more characters from s than s.length.
//
// EXAMPLES:
//
// * To reformat a 10-digit U.S. phone number from "1234567890"
//   to "(123) 456-7890" make this function call:
//   reformat("1234567890", "(", 3, ") ", 3, "-", 4)
//
// * To reformat a 9-digit U.S. Social Security number from
//   "123456789" to "123-45-6789" make this function call:
//   reformat("123456789", "", 3, "-", 2, "-", 4)
//
// HINT:
//
// If you have a string which is already delimited in one way
// (example: a phone number delimited with spaces as "123 456 7890")
// and you want to delimit it in another way using function reformat,
// call function stripCharsNotInBag to remove the unwanted 
// characters, THEN call function reformat to delimit as desired.
//
// EXAMPLE:
//
// reformat (stripCharsNotInBag ("123 456 7890", digits),
//           "(", 3, ") ", 3, "-", 4)

function reformat (s)

{   var arg;
    var sPos = 0;
    var resultString = "";

    for (var i = 1; i < reformat.arguments.length; i++) {
       arg = reformat.arguments[i];
       if (i % 2 == 1) resultString += arg;
       else {
           resultString += s.substring(sPos, sPos + arg);
           sPos += arg;
       }
    }
    return resultString;
}


// isIntegerInRange (STRING s, INTEGER a, INTEGER b [, BOOLEAN emptyOK])
// 
// isIntegerInRange returns true if string s is an integer 
// within the range of integer arguments a and b, inclusive.
// 
// For explanation of optional argument emptyOK,
// see comments of function isInteger.


function isIntegerInRange (s, a, b)
{   if (isEmpty(s)) 
       if (isIntegerInRange.arguments.length == 1) return defaultEmptyOK;
       else return (isIntegerInRange.arguments[1] == true);

    // Catch non-integer strings to avoid creating a NaN below,
    // which isn't available on JavaScript 1.0 for Windows.
    if (!isInteger(s, false)) return false;

    // Now, explicitly change the type to integer via parseInt
    // so that the comparison code below will work both on 
    // JavaScript 1.2 (which typechecks in equality comparisons)
    // and JavaScript 1.1 and before (which doesn't).
    var num = parseInt (s);
    return ((num >= a) && (num <= b));
}


function toProperCase(strIn)
{
	var nLoop, nLen, strOut;
	
	nLen = strIn.length;
	strOut = "";
	
	for (nLoop = 0; nLoop < nLen; nLoop++) {
		if (nLoop == 0 || strIn.charAt(nLoop - 1) == " ") {
			strOut += strIn.charAt(nLoop).toUpperCase();
		} else {
			strOut += strIn.charAt(nLoop).toLowerCase();
		}
	}
	return strOut;
}


function GetEventKey(e)
	{
	return String.fromCharCode(GetEventKeyCode(e));
	};


function GetEventKeyCode(e)
	{
	return (e.which) ? e.which : e.keyCode;
	};


function GetTagName(e)
	{
	//return (e.target.type) ? e.target.type : e.srcElement.tagName; 
	// RM [2010-09-20] replaced line above with below from [http://www.quirksmode.org/js/events_properties.html]
	if (!e) {var e = window.event};
	var targ = e.target ? e.target : e.srcElement;
	targ = targ.nodeType == 3 ? targ.parentNode : targ;      // defeat Safari bug
	return (targ.tagName ? targ.tagName : 'UNDEFINED');
	};


function GetTagType(e)
	{
	// return (e.target.type) ? e.target.type : e.srcElement.type; 
	// RM [2010-09-20] replaced line above with below from [http://www.quirksmode.org/js/events_properties.html]
	if (!e) {var e = window.event};
	var targ = e.target ? e.target : e.srcElement;
	targ = targ.nodeType == 3 ? targ.parentNode : targ;      // defeat Safari bug
	return (targ.type ? targ.type : 'INPUT');
	};


function SetEventKey(e, keyChar)
	{
	try
		{
		var eventKeyCode = GetEventKeyCode(e);
		eventKeyCode = keyChar.charCodeAt(0);
		}
	catch (err)
		{
		// do nothing
		// Can't do it in Netscape
		};
	};


function CheckTextKey(e, Ctrl, strName, strOptional, strFilter, strCase, strMinLength, strMaxLength, strMinValue, strMaxValue) 
	{
	var keyChar = GetEventKey(e);
	// characterCount(e, Ctrl, strMaxLength);
	return CheckFormKey(e);
	// so we never actually get to the code below?...      '// RM [2010-09-20]
    // Do filters
	if (strFilter.length > 0) {
		// Check what type of feature
		if (strFilter == "Any") {
			// Ignore
		} else if (strFilter == "Number" || strFilter == "Numeric") {
			// Ignore
		} else if (strFilter == "NegNumber" || strFilter == "NegNumeric") {
			// Ignore
		} else if (strFilter == "AlphaNumeric") {
			if (!isAlphanumeric(keyChar, true)) {
				e.cancelBubble = true;
				return false;
			}
		} else if (strFilter == "Printable") {			
			if (keyChar.charCodeAt(0) == 0x000A || keyChar.charCodeAt(0) == 0x000D) {
				e.cancelBubble = true;
				return false;
			}
		} else if (strFilter == "PrintableCR") {
			// Ignore - allow any
		}
	}

    // Do Case
    if (navigator.appName != "Netscape") {     
		if (strCase == "Upper") {
			SetEventKey(e, keyChar.toUpperCase());
		} else if (strCase == "Lower") {
			SetEventKey(e, keyChar.toLowerCase());
		} else if (strCase == "Proper") {
			// Ignore as we need to know where abouts the character is being put to do Proper Case.
			//SetEventKey(e, toProperCase(keyChar));
		}
	}
	return true;
}


function CheckTextValues(Ctrl, strName, strOptional, strFilter, strCase, strMinLength, strMaxLength, strMinValue, strMaxValue) 
{
	var strVal;
	
	strVal = Ctrl.value;
	
	if (strName.length == 0) {
		strName = Ctrl.name;
	}
	
	if(0!=strOptional.length)
	{
		// First check if it's not Optional
		if (strOptional != "1" && strVal.length == 0) {
			// It's not optional
			alert(strName + strNotOptional);
			return false;
		}
	}	
	//don't check is the strings are zero length
	if((0!=strMinLength.length)&&(0!=strMaxLength.length))
	{
		// Check length
		var nMinLength; nMinLength = parseInt(strMinLength, 10);
		var nMaxLength; nMaxLength = parseInt(strMaxLength, 10);
		if (!(nMinLength == 0 && nMaxLength == 0)) {
			if (nMinLength > strVal.length) {
				alert(strName + strTooShort1 + strMinLength + strTooShort2);
				Ctrl.focus();
				Ctrl.select();
				return false;
			}
			if (nMaxLength < strVal.length) {
				alert(strName + strTooLong1 + strMaxLength + strTooLong2);
				Ctrl.focus();
				Ctrl.select();
				return false;
			}
		}	
	}	
	
	// Check Case
	if (strCase == "Upper") {
		strVal = strVal.toUpperCase();
	} else if (strCase == "Lower") {
		strVal = strVal.toLowerCase();
	} else if (strCase == "Proper") {
		strVal = toProperCase(strVal);
	}
	
	// Check Filter
	if (strFilter.length > 0) {
		// We've got a filter, now check which one.
		var nLen = strVal.length;
		var nLoop;
		
		if (strFilter == "Any") {
			// Ignore
		} else if (strFilter == "Number" || strFilter == "Numeric"){
			if (!isFloat(strVal, true)) {
				alert(strName + strNonNegNum);
				Ctrl.focus();
				Ctrl.select();
				return false;
			}
		} else if (strFilter == "NegNumber" || strFilter == "NegNumeric") {
			if (!isSignedFloat(strVal, true)) {
				alert(strName + strNum);
				Ctrl.focus();
				Ctrl.select();
				return false;
			}
		} else if (strFilter == "AlphaNumeric") {
			if (!isAlphanumeric(strVal, true)) {
				alert(strName + strAlphaNum);
				Ctrl.focus();
				Ctrl.select();
				return false;
			}
		} else if (strFilter == "Printable") {
			var strOut = "";
			for (nLoop = 0; nLoop < nLen; nLoop++) {
				if (strVal.charCodeAt(nLoop) == 0x000D) {
					strOut += " ";
				}
				if (strVal.charCodeAt(nLoop) >= 0x0020) {
					strOut += strVal.charAt(nLoop);
				}
			}	
			strVal = strOut;
		} else if (strFilter == "PrintableCR") {
			var strOut = "";
			for (nLoop = 0; nLoop < nLen; nLoop++) {
				var nChar = strVal.charCodeAt(nLoop)
				//replace cr with space
				if (nChar >= 0x0020 || nChar == 0x000A || nChar == 0x000D) {
					strOut += strVal.charAt(nLoop);
				}
			}	
			strVal = strOut;
		}

	}
	
	//don't check is the strings are zero length
	if((0!=strMinValue.length)&&(0!=strMaxValue.length))
	{
		// Check Value
		var flMinValue;
		var flMaxValue;
			
		flMinValue = parseFloat(strMinValue)
		flMaxValue = parseFloat(strMaxValue)
		if (!(flMinValue == 0.0 && flMaxValue == 0.0))
			{
			if (isNaN(strVal) == false)
				{
				var flVal = parseFloat(strVal)
				if (flMinValue > flVal)
					{
					alert(strName + strLowVal + strMinValue);
					Ctrl.focus();
					Ctrl.select();
					return false;
					};
				if (flMaxValue < flVal)
					{
					alert(strName + strHighVal + strMaxValue);
					Ctrl.focus();
					Ctrl.select();
					return false;
					};
				};
			};
		};
	Ctrl.value = strVal;
	return true;
}


function CheckTextValues2(Ctrl, strName, strOptional, strFilter, strCase, strMinLength, strMaxLength, strMinValue, strMaxValue) 
{
	var strVal;

	strVal = Ctrl.value;
	
	if (strName.length == 0) {
		strName = Ctrl.name;
	}
	
	if(0!=strOptional.length)
	{
		// First check if it's not Optional
		if (strOptional != "1" && strVal.length == 0) {
			// It's not optional
			alert(strName + strNotOptional);
			return false;
		}
	}	
	//RS. DF935. Don't check if the strings are zero length and optional
	if ((strOptional == "1") && (strVal.length != 0))
		{
		// don't check if the strings are zero length
		if ((0!=strMinLength.length) && (0!=strMaxLength.length))
			{
			// Check length
			var nMinLength; nMinLength = parseInt(strMinLength, 10);
			var nMaxLength; nMaxLength = parseInt(strMaxLength, 10);
			if (!(nMinLength == 0 && nMaxLength == 0))
				{
				if (nMinLength > strVal.length)
					{
					alert(strName + strTooShort1 + strMinLength + strTooShort2);
					Ctrl.focus();
					Ctrl.select();
					return false;
					};
				if (nMaxLength < strVal.length)
					{
					alert(strName + strTooLong1 + strMaxLength + strTooLong2);
					Ctrl.focus();
					Ctrl.select();
					return false;
					};
				};
			};
		};
	
	// Check Case
	if (strCase == "Upper") {
		strVal = strVal.toUpperCase();
	} else if (strCase == "Lower") {
		strVal = strVal.toLowerCase();
	} else if (strCase == "Proper") {
		strVal = toProperCase(strVal);
	}
	
	// Check Filter
	if (strFilter.length > 0) {
		// We've got a filter, now check which one.
		var nLen = strVal.length;
		var nLoop;
		
		if (strFilter == "Any") {
			// Ignore
		} else if (strFilter == "Number" || strFilter == "Numeric"){			
			if (!isFloat(strVal, true)) {
				alert(strName + strNonNegNum);
				Ctrl.focus();
				Ctrl.select();
				return false;
			}
		} else if (strFilter == "NegNumber" || strFilter == "NegNumeric") {
			if (!isSignedFloat(strVal, true)) {
				alert(strName + strNum);
				Ctrl.focus();
				Ctrl.select();
				return false;
			}
		} else if (strFilter == "AlphaNumeric") {
			if (!isAlphanumeric(strVal, true)) {
				alert(strName + strAlphaNum);
				Ctrl.focus();
				Ctrl.select();
				return false;
			}
		} else if (strFilter == "Printable") {
			var strOut = "";
			for (nLoop = 0; nLoop < nLen; nLoop++) {
				if (strVal.charCodeAt(nLoop) == 0x000D) {
					strOut += " ";
				}
				if (strVal.charCodeAt(nLoop) >= 0x0020) {
					strOut += strVal.charAt(nLoop);
				}
			}	
			strVal = strOut;
		} else if (strFilter == "PrintableCR") {
			var strOut = "";
			for (nLoop = 0; nLoop < nLen; nLoop++) {
				var nChar = strVal.charCodeAt(nLoop)
				if (nChar >= 0x0020 || nChar == 0x000A || nChar == 0x000D) {
					strOut += strVal.charAt(nLoop);
				}
			}	
			strVal = strOut;
		}

	}
	
	if((0!=strMinValue.length)&&(0!=strMaxValue.length))
	{
		// Check Value
		var flMinValue;
		var flMaxValue;
			
		flMinValue = parseFloat(strMinValue)
		flMaxValue = parseFloat(strMaxValue)
		if (!(flMinValue == 0.0 && flMaxValue == 0.0)) {
			var flVal = parseFloat(strVal)
			if (flMinValue > flVal) {
				alert(strName + strLowVal + strMinValue);
				Ctrl.focus();
				Ctrl.select();
				return false;
			}
			if (flMaxValue < flVal) {
				alert(strName + strHighVal + strMaxValue);
				Ctrl.focus();
				Ctrl.select();
				return false;
			}
		}	
	}
	
	Ctrl.value = strVal;
	return true;
}


function CheckFormKey(e)
{
    var keyChar = GetEventKey(e); 
    var keyCode = GetEventKeyCode(e);
	var tag = GetTagName(e).toLowerCase();
	var tagType = GetTagType(e).toLowerCase();
	if (document.forms['Elateral_Questions'])     // RJM:2010-04-06: added to avoid "form doesn't exist" bug found during UAT testing
		{ document.forms['Elateral_Questions'].elements['Elateral_Cancel'].value = ''; }
	
	switch (keyCode)
	{
		case 13:
		case 3:
			stopProp(e);
			switch (tag)
			{
				case 'textarea':
				case 'iframe':
					return '\r\n';
					break;
				case 'text':
				case 'input':
					CheckSubmit(false);
					return false;
					break;
			}
			break;
		default:
	}
	if (keyCode < 32)
		{
		stopProp(e);
		return true;
		};
	return keyChar;
}


function stopProp(e)
	{
	if (e.stopPropogation)
		{
		e.stopPropogation();
		}
	else if (e.cancelBubble != undefined)
		{
		e.cancelBubble = true;
		};
	};


function CheckFileUpload(Ctrl, strName, strOptional, strFilter, strCase, strMinLength, strMaxLength, strMinValue, strMaxValue)
	{
	var FileType = CheckFileUploadType(Ctrl, strName, strOptional, strFilter, strCase, strMinLength, strMaxLength, strMinValue, strMaxValue);
	if (FileType != '')
		{
		alert(Ctrl.id);
		//alert(getElementByIdCompatible(Ctrl.id).innerHTML);
		CheckFileUploadSize(Ctrl, strName, strOptional, strFilter, strCase, strMinLength, strMaxLength, strMinValue, strMaxValue);
		};
	};


function CheckFileUploadType(Ctrl, strName, strOptional, strFilter, strCase, strMinLength, strMaxLength, strMinValue, strMaxValue)
{
	if (Ctrl.value.substring(Ctrl.value.length-4, Ctrl.value.length) == '.exe')
	{
		Ctrl.value = '';
		alert('The file format is .exe which is not supported. Please upload another type of file.');
	}
	return Ctrl.value;
}


function CheckFileUploadSize(Ctrl, strName, strOptional, strFilter, strCase, strMinLength, strMaxLength, strMinValue, strMaxValue)
{
	if (Ctrl.value != '')
	{
		var fso, f1;
		//fso = new ActiveXObject("Scripting.FileSystemObject");
		// Get a File object to query.
		alert(getElementByIdCompatible(Ctrl.id).value);	
		//f1 = fso.GetFile(getElementByIdCompatible(Ctrl.id).value);  
		//alert('FileSize ' + f1.Size);
	}
}


function RemoveFile(obj, Ctrl)
{
	//var fr=frames["upload_target_x_Offer2URL"];
	//alert(fr.name);
	
	var str1 = "upload_target_";
	var ifrm = str1 + Ctrl;

	
	if (getElementByIdCompatible(ifrm).contentDocument == null)
	{
		//we're on IE
		document.frames(ifrm).getElementByIdCompatible(Ctrl).value = "";
	}
	else
	{
		getElementByIdCompatible(ifrm).contentDocument.getElementById(Ctrl).value = "";
		getElementByIdCompatible(ifrm).contentDocument.getElementById("x_Uploaded").style.display = 'none';	
		getElementByIdCompatible(ifrm).contentDocument.getElementById("Upload").style.display = 'block';		
	}	
	
	//obj.elements["x_Offer2URL"].value="";
	
	alert("done");
}


function getElementByIdCompatible(the_id) 
{
	if (typeof the_id != 'string') {
		return the_id;
	}
	
	if (typeof document.getElementById != 'undefined') {
		return document.getElementById(the_id);
	} else if (typeof document.all != 'undefined') {
		return document.all[the_id];
	} else if (typeof document.layers != 'undefined') {
		return document.layers[the_id];
	} else {
		return null;
	}
}






// [RM_D3444_20110221]
var strCharCounterElementBaseName = "CharCounter";
var intCharCounterShowLength = 1000;
var intSetIntervalId = 0;
j$(document).ready(function(){
	// TODO: change this to a proper plugin, which could then probably have proper LIVE bindings...
	var clnElements = j$(":input[maxlength][maxlength!='0'][maxlength!='2147483647']")
		.each(function(){ createCharCounterDiv(j$(this)); })
		.live("focus", function(){ displayCharCounterDiv(this, true); })
		.live("blur", function(){ displayCharCounterDiv(this, false); });
	if (clnElements.length > 0)
		{
		var strStyles = ""
					+ "<style type=\"text/css\" id=\"characterCount\">\r"
					+ "div.CharCounterWrapper {\r"
					+ "	position: relative;\r"
					+ "	margin: 0px;\r"
					+ "	padding: 0px;\r"
					+ "	display: inline-block;\r"
					+ "}\r"
					+ "div.CharCounterWrapper input,\r"
					+ "div.CharCounterWrapper textarea {\r"
					+ "	margin: 0px;\r"
					+ "}\r"
					+ "div.CharCounterDiv {\r"
					+ "	background-color: #ffffcc;\r"
					+ "	border: 1px solid black;\r"
					+ "	top: 0px;\r"
					+ "	left: 0px;\r"
					+ "	padding: 2px 5px;\r"
					+ "	position: absolute;\r"
					+ "	text-align: center;\r"
					+ "	font-family: Verdana, Arial, Sans-serif;\r"
					+ "	font-size: 10px;\r"
					+ "	visibility: hidden;\r"
					+ "	width: 40px;\r"
					+ "	z-index: 10000;\r"
					+ "}\r"
					+ "</style>\r";
		j$(strStyles).appendTo("head");
		};
	});
function createCharCounterDiv(objInput)
	{
	objInput = (isJQueryObject(objInput) ? objInput : j$(objInput));
	var intMaxValueLength = parseInt(objInput.attr("maxlength"));
	if (isNaN(intMaxValueLength) || (intMaxValueLength == 0) || (intMaxValueLength == 2147483647))     // IE8 adds this automatically to inputs that don't have a maxlength attribute, TODO check other browsers
		{ return false; };
	var objWrapperDiv = objInput.parent("div[class='" + strCharCounterElementBaseName + "Wrapper']");
	var objCharDiv = objInput.next("div." + strCharCounterElementBaseName + "Div");
	if (objWrapperDiv.length == 0)     // wrap the element in a new div which acts as a positioning anchor
		{
		objInput.wrap("<"+"div class=\"" + strCharCounterElementBaseName + "Wrapper\"><"+"/div>");
		objWrapperDiv = j$(objInput.parent("div[class='" + strCharCounterElementBaseName + "Wrapper']"));
		};
	if (objCharDiv.length == 0)     // make it
		{
		var intDisplayLength = (intMaxValueLength - objInput.attr("value").length);
		objInput.after("<"+"div class=\"" + strCharCounterElementBaseName + "Div\" style=\"" + (! j$.support.opacity ? "top: 1px;" : "") + "left: " + objInput.outerWidth(false) + "px; visibility: hidden;\">" + intDisplayLength + "<"+"/div>");
		objCharDiv = objInput.next("div." + strCharCounterElementBaseName + "Div");
		};
	// if this input doesn't have an ID, give it a random one cos we'll need it for the timer
	if (objInput.attr("id").length == 0)
		{ objInput.attr("id", makeGuid()); };
	return true;
	};
function displayCharCounterDiv(objInput, blnShowDiv)
	{
	objInput = (isJQueryObject(objInput) ? objInput : j$(objInput));
	blnShowDiv = (!blnShowDiv ? false : true);
	var objCharDiv = objInput.next("div." + strCharCounterElementBaseName + "Div");
	if (objCharDiv.length == 1)
		{
		if (blnShowDiv)
			{
			// objCharDiv.css("visibility", "visible");     // moved to updateCharCounterDiv() so it's only visible when required
			intSetIntervalId = setInterval("delayedCheckInputLength(\"" + objInput.attr("id") + "\");", 50);
			}
		else
			{
			objCharDiv.css("visibility", "hidden");
			clearInterval(intSetIntervalId);
			};
		};
	return true;
	};
function delayedCheckInputLength(strInputId)
	{
	var objInput = j$(document.getElementById(strInputId));
	if (objInput.length == 1)
		{
		checkInputLength(objInput, null, true);
		return true;
		};
	return false;
	};
function checkInputLength(objInput, intMaxValueLength, blnUpdateCharCounter)
	{
	objInput = (isJQueryObject(objInput) ? objInput : j$(objInput));
	intMaxValueLength = (isNaN(parseInt(intMaxValueLength)) ? parseInt(objInput.attr("maxlength")) : intMaxValueLength);
	if (isNaN(parseInt(intMaxValueLength)))
		{ return false; };
	var strCurrentValue = new String(objInput.attr("value"));
	if (strCurrentValue.length > intMaxValueLength)     // trim the value if required
		{
		strCurrentValue = strCurrentValue.substr(0, intMaxValueLength);
		objInput.attr("value", strCurrentValue);
		};
	if (blnUpdateCharCounter)
		{ updateCharCounterDiv(objInput, false); };
	return true
	};
function updateCharCounterDiv(objInput, blnAlwaysVisible)
	{
	var objInput = (isJQueryObject(objInput) ? objInput : j$(objInput));
	var objCharDiv = objInput.next("div." + strCharCounterElementBaseName + "Div");
	if (objCharDiv.length == 1)
		{
		var intValueCurrentLength = parseInt(objInput.attr("value").length);
		var intValueMaxLength = parseInt(objInput.attr("maxlength"));
		var intDisplayCurrentValue = parseInt(objCharDiv.html());
		var intDisplayLength = (intValueMaxLength - intValueCurrentLength);
		if (intDisplayCurrentValue != intDisplayLength)     // only update if we need to
			{ objCharDiv.html(intDisplayLength); };     // <<< THIS LINE KILLS IE's UNDO, WHY?
		objCharDiv.css("visibility", (blnAlwaysVisible ? "visible" : (intDisplayLength <= intCharCounterShowLength) ? "visible" : "hidden"));     // show or hide the characterCounter depending on how many chars are left
		};
	return true;
	};




function isJQueryObject(obj)
	{
	try {var test = obj.selector; if ((j$.type(test) == "undefined") || (j$.type(test) == "null")){ throw(false); }}
	catch(e) {return e;};
	return true;
	};




function makeGuid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	};
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};

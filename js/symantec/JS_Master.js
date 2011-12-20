	//**************************************************************
	//* Is the client an old netscape browser (v4.7 etc)
	//**************************************************************
	var Cookie_Default_CompanyID				=  0;
	var Cookie_Default_RememberCompanyID		=  1;
	var Cookie_Default_UserID					=  2;
	var Cookie_Default_RememberUserID			=  3;
	var Cookie_Default_Password				=  4;
	var Cookie_Default_RememberPassword		=  5;
	var Cookie_ActiBrand_NavBarPlugin		=  6;
	var Cookie_ActiBrand_ShowFilterControls		=  7;
	var Cookie_ActiBrand_SearchControls = 8;
	
	var isIE;
	var isOldNetscape;
	var isNS;
	isIE = (navigator.appName.indexOf("Microsoft") != -1) ? true : false;

 
	if(!isIE)
	{
		if(parseInt(navigator.appVersion.charAt(0)) <= 4)
		{
			isOldNetscape = true;
		}
		else
		{
			isOldNetscape = false;
		}
	}	
	
	function IsPosInt (str)
	{
		if(str == "00")
			str = "0";

		var i = parseInt(str);

		if (isNaN (i))
			return false;

		if(i < 0)
			return false;

/*
		i = i.toString();
		if (i != str)
			return false;	
*/
		return true;
	}
	
	function IsPosIntEx (str, fAllowZero)
	{
		if(str == "00")
			str = "0";

		var i = parseInt(str);

		if (isNaN (i))
		{
			return false;
		}

		if(fAllowZero)
		{
			if(i < 0)
			{
				return false;
			}
		}
		else
		{
			if(i < 1)
			{
				return false;
			}
		}

/*
		i = i.toString();
		if (i != str)
		{
			return false;	
		}
*/
		return true;
	}
	
	function copyToClipboard(text, successMessage, errorMessage) {
		try {
			clipboardData.setData('Text', text); 
			alert(successMessage);
		}
		catch(err) {
			alert(errorMessage + '\n\n' + text);
		}
	}
	
	var acrobatVersion = 0;
	function getAcrobatVersion() {
		var agent = navigator.userAgent.toLowerCase(); 
		
		// NS3+, Opera3+, IE5+ Mac (support plugin array):  check for Acrobat plugin in plugin array
		if (navigator.plugins != null && navigator.plugins.length > 0) {
	      for (i=0; i < navigator.plugins.length; i++ ) {
	         var plugin = navigator.plugins[i];
	         if (plugin.name.indexOf("Adobe Acrobat") > -1) {
	            acrobatVersion = parseFloat(plugin.description.substring(30));
	         }
	      }
		}
	   
		// IE4+ Win32:  attempt to create an ActiveX object using VBScript
		else if (agent.indexOf("msie") != -1 && parseInt(navigator.appVersion) >= 4 && agent.indexOf("win")!=-1 && agent.indexOf("16bit")==-1) {
		   document.write('<scr' + 'ipt language="VBScript"\> \n');
		   document.write('on error resume next \n');
			document.write('dim obAcrobat \n');
			document.write('set obAcrobat = CreateObject("PDF.PdfCtrl.5") \n');
			document.write('if IsObject(obAcrobat) then \n');
			document.write('acrobatVersion = 5 \n');
			document.write('else set obAcrobat = CreateObject("PDF.PdfCtrl.1") end if \n');
			document.write('if acrobatVersion < 5 and IsObject(obAcrobat) then \n');
			document.write('acrobatVersion = 4 \n');
			document.write('end if');
			document.write('</scr' + 'ipt\> \n');
	  }

		// Can't detect in all other cases
		else {
			acrobatVersion = acrobatVersion_DONTKNOW;
		}

		return acrobatVersion;
	}

	acrobatVersion_DONTKNOW = -1;
	
	

	function detectIE(ClassID,name) { result = false; document.write('<SCRIPT LANGUAGE=VBScript>\n on error resume next \n result = IsObject(CreateObject("' + ClassID + '"))</SCRIPT>\n'); if (result) return name+','; else return ''; }
	function detectNS(ClassID,name) { n = ""; if (nse.indexOf(ClassID) != -1) if (navigator.mimeTypes[ClassID].enabledPlugin != null) n = name+","; return n; }

	
	function HasAcrobat()
	{
		//alert(getAcrobatVersion());
		//return true;
		
		
		var agt=navigator.userAgent.toLowerCase();
		var ie = (agt.indexOf("msie") != -1);
		var ns = (navigator.appName.indexOf("Netscape") != -1);
		var win = ((agt.indexOf("win")!=-1) || (agt.indexOf("32bit")!=-1));
		var mac = (agt.indexOf("mac")!=-1);
		var pluginlist = "";

		if (ie && win) 
		{
			pluginlist = detectIE("Adobe.SVGCtl","SVG Viewer") + detectIE("SWCtl.SWCtl.1","Shockwave Director") + detectIE("ShockwaveFlash.ShockwaveFlash.1","Shockwave Flash") + detectIE("rmocx.RealPlayer G2 Control.1","RealPlayer") + detectIE("QuickTimeCheckObject.QuickTimeCheck.1","QuickTime") + detectIE("MediaPlayer.MediaPlayer.1","Windows Media Player") + detectIE("PDF.PdfCtrl.5","Acrobat Reader");
		}
		if (ns || !win) 
		{
			nse = ""; for (var i=0;i<navigator.mimeTypes.length;i++) nse += navigator.mimeTypes.type.toLowerCase();
			pluginlist = detectNS("image/svg-xml","SVG Viewer") + detectNS("application/x-director","Shockwave Director") + detectNS("application/x-shockwave-flash","Shockwave Flash") + detectNS("audio/x-pn-realaudio-plugin","RealPlayer") + detectNS("video/quicktime","QuickTime") + detectNS("application/x-mplayer2","Windows Media Player") + detectNS("application/pdf","Acrobat Reader");
		}


		pluginlist += navigator.javaEnabled() ? "Java," : "";
		if (pluginlist.length > 0) pluginlist = pluginlist.substring(0,pluginlist.length-1);

		if (pluginlist.indexOf("Acrobat Reader")!=-1)
		{
			
			return true;
		}
		else
		{
			alert(pluginlist);
			return false;
		}
	}
	
	
	
	
	function SubmitExceptionRequest()
	{
		var strName				= GetControlValue("txtName");
		var strEmail			= GetControlValue("txtEmail");
		var strRequiredByDate	= GetControlValue("txtRequiredByDate");
		
		if(strName.length == 0)
		{
			alert(Un("You must enter your name before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtName");
		}
		else if(strEmail.length == 0)
		{
			alert(Un("You must enter your email address before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtEmail");
		}
		else if(strRequiredByDate.length == 0)
		{
			alert(Un("You must enter the date the exception is required before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtRequiredByDate");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function IsFormatSettingsValid(strNamePart, strSuffix, fZeroAllowed, fUnitRequired)
	{
		var strInt = GetControlValue("txt" + strNamePart + "Int" + strSuffix);
		var strDec = GetControlValue("txt" + strNamePart + "Dec" + strSuffix);
		var strUnit = GetControlValue("sel" + strNamePart + "Unit");
		
		if(IsPosIntEx(strInt, fZeroAllowed) && (IsPosIntEx(strDec, true)))
		{
			if(fUnitRequired)
			{
				if(strUnit != "-1")
				{
					return true;
				}
				else
				{
					return false;
				}
			}
			else
			{
				//Unit isn't required, but if a value has been entered it must be selected
				
				if(strInt == "00")
					strInt = "0";
					
				if(strDec == "00")
					strDec = "0";

				var nInt = parseInt(strInt);
				var nDec = parseInt(strDec);
				
				if((nInt > 0) || (nDec > 0))
				{
					if(strUnit != "-1")
					{
						return true;
					}
					else
					{
						return false;
					}
				}
				
				return true;
			}
		}
		else
		{
			return false;
		}
	}
	
	function SubmitEditCreateAdFormat()
	{
		var strFormatName	= GetControlValue("txtFormatName");
						
		if(strFormatName.length < 1)
		{
			alert(Un("You must enter a format name before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtFormatName");
		}
		else if(!IsFormatSettingsValid("TrimSize", "W", false, true))
		{
			alert(Un("You must enter a valid trim size before you can continue.", "Includes\JS\JS_Master.js"));
		}
		else if(!IsFormatSettingsValid("TrimSize", "H", false, true))
		{
			alert(Un("You must enter a valid trim size before you can continue. (1)", "Includes\JS\JS_Master.js"));
		}
		else if(!IsFormatSettingsValid("BleedArea", "W", true, false))
		{
			alert(Un("You must enter a valid bleed area before you can continue.", "Includes\JS\JS_Master.js"));
		}
		else if(!IsFormatSettingsValid("BleedArea", "H", true, false))
		{
			alert(Un("You must enter a valid bleed area before you can continue. (1)", "Includes\JS\JS_Master.js"));
		}
		else if(!IsFormatSettingsValid("TypeArea", "W", true, false))
		{
			alert(Un("You must enter a valid type area before you can continue.", "Includes\JS\JS_Master.js"));
		}
		else if(!IsFormatSettingsValid("TypeArea", "H", true, false))
		{
			alert(Un("You must enter a valid type area before you can continue. (1)", "Includes\JS\JS_Master.js"));
		}
		else if(!IsPosInt(GetControlValue("txtLineScreenInt")))
		{
			alert(Un("You must enter a valid line screen before you can continue.", "Includes\JS\JS_Master.js"));
		}
		else if(!IsPosInt(GetControlValue("txtLineScreenDec")))
		{
			alert(Un("You must enter a valid line screen before you can continue. (1)", "Includes\JS\JS_Master.js"));
		}
		else if(!IsPosInt(GetControlValue("txtScreenAngleCInt")))
		{
			alert(Un("You must enter a valid screen angle before you can continue.", "Includes\JS\JS_Master.js"));
		}
		else if(!IsPosInt(GetControlValue("txtScreenAngleCDec")))
		{
			alert(Un("You must enter a valid screen angle before you can continue. (1)", "Includes\JS\JS_Master.js"));
		}
		else if(!IsPosInt(GetControlValue("txtScreenAngleMInt")))
		{
			alert(Un("You must enter a valid screen angle before you can continue. (2)", "Includes\JS\JS_Master.js"));
		}
		else if(!IsPosInt(GetControlValue("txtScreenAngleMDec")))
		{
			alert(Un("You must enter a valid screen angle before you can continue. (3)", "Includes\JS\JS_Master.js"));
		}
		else if(!IsPosInt(GetControlValue("txtScreenAngleYInt")))
		{
			alert(Un("You must enter a valid screen angle before you can continue. (4)", "Includes\JS\JS_Master.js"));
		}
		else if(!IsPosInt(GetControlValue("txtScreenAngleYDec")))
		{
			alert(Un("You must enter a valid screen angle before you can continue. (5)", "Includes\JS\JS_Master.js"));
		}
		else if(!IsPosInt(GetControlValue("txtScreenAngleKInt")))
		{
			alert(Un("You must enter a valid screen angle before you can continue. (6)", "Includes\JS\JS_Master.js"));
		}
		else if(!IsPosInt(GetControlValue("txtScreenAngleKDec")))
		{
			alert(Un("You must enter a valid screen angle before you can continue. (7)", "Includes\JS\JS_Master.js"));
		}
		else
		{
			SubmitForm();
		}
		
	}
	
	function SubmitAddPublication()
	{
		var strPublicationName	= GetControlValue("txtPublicationName");
		
		if(strPublicationName.length < 1)
		{
			alert(Un("You must enter a publication name before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtPublicationName");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitEditPublication()
	{
		var strPublicationName	= GetControlValue("txtPublicationName");
		
		if(strPublicationName.length < 1)
		{
			alert(Un("You must enter a publication name before you can continue. (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtPublicationName");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SafeGetClientWidth() {
	
		
		var isNS4 = (document.layers) ? true : false;
		var isIE4 = (document.all && !document.getElementById) ? true : false;
		var isIE5 = (document.all && document.getElementById) ? true : false;
		var isNS6 = (!document.all && document.getElementById) ? true : false;	
		if (isNS6) 
		{			
			
			return window.innerWidth;
		}
		else
		{
			return document.body.clientWidth;
		}
		
	}
	
	function SafeGetClientHeight() {
	
		
		var isNS4 = (document.layers) ? true : false;
		var isIE4 = (document.all && !document.getElementById) ? true : false;
		var isIE5 = (document.all && document.getElementById) ? true : false;
		var isNS6 = (!document.all && document.getElementById) ? true : false;	
		if (isNS6) 
		{			
			return window.innerHeight;
		}
		else
		{
			return document.body.clientHeight;
		}
		
	}
	
	
	function SafeGetElementByID(strID) {
	
		
		var isNS4 = (document.layers) ? true : false;
		var isIE4 = (document.all && !document.getElementById) ? true : false;
		var isIE5 = (document.all && document.getElementById) ? true : false;
		var isNS6 = (!document.all && document.getElementById) ? true : false;	
		if (isNS4) 
		{			
			var x, y, nNumOfElements;
			var nNumOfForms = document.forms.length;
			
			for(x = 0; x < nNumOfForms; x++)
			{
				nNumOfElements = document.forms[x].elements.length;				
				for(y = 0; y < nNumOfElements; y++)
				{							
					if(document.forms[x].elements[y].name == strID)
					{
						return document.forms[x].elements[y];					
					}
				}
			}
		}
		else if (isIE4)
		{
			return(document.all[strID]);
		}
		else if (isIE5 || isNS6)
		{
			if (document.getElementById(strID) != null)
			{
				return(document.getElementById(strID));
			}
			else
			{
				// TY 2009-05-01 Add a new test for finding the name instead.
				return(document.getElementsByName(strID)[0]);
			}
		}
		
				
		//Unable to find item, so return null
		//return(document.getElementById(strID));
		
		return null;
	}
	
	//**************************************************************
	//* Global Variables
	//**************************************************************
	
	var g_nSelectedPO = -1;
	
	//**************************************************************
	//* Language Text
	//**************************************************************
	
	// SWB 24/07/2001: Flat file systems will have Tn/Un tags translated.
	// Dynamic systems (usually development) function by simple tag substitution.
	// IMK 13/12/2001: TN and UN files now done in different include files
	// One language file created for each language e.g. Lang_{234234-234234-234234-23423423}.js

	//**************************************************************
	//* Form Functions
	//**************************************************************

	function CancelScheduledEmail(strURL, bCancelTimedOut)
	{
	    if (typeof bCancelTimedOut == 'undefined') bCancelTimedOut = false;	    
	    if (!bCancelTimedOut) {
	        if (confirm(Un("You are about to cancel the scheduled sending of this email. Are you sure you want to proceed?", "Includes\JS\JS_Master.js"))) {
			location.href = strURL;
		}
	    } else {
	        alert(Un("This email cannot be cancelled. The scheduled send time has passed and the email should have been sent.", "Includes\JS\JS_Master.js"));
	    }
	}
	
	function DeleteOrder(strURL)
	{
		if(confirm( Un("Are you sure you would like to delete this order?","Includes\JS\JS_Master.js") ))
		{
			location.href = strURL;
		}
	}
	
	
	function AlertEmailsOff(strURL)
	{
		if(confirm( Un("Turning notification email off will stop the notification email being sent to you each time there is a new report entry.","Includes\JS\JS_Master.js") ))
		{
			location.href = strURL;
		}
	}
	
		
	function AlertEmailsOn(strURL)
	{
		if(confirm( Un("Turning notification email on will result in the notification email being sent to you each time there is a new report entry.","Includes\JS\JS_Master.js") ))
		{
			location.href = strURL;
		}
	}	
	
	
	function ShowSearchOptions()
	{
		var objShowControl = SafeGetElementByID("divShowSearchOptions");
		var objHideControl = SafeGetElementByID("divSearchOptions");	
		
		objShowControl.style.display = "none";
		objHideControl.style.display = "";
		
		SetSubCookie("ElateralMSP", Cookie_ActiBrand_ShowFilterControls, "Show");
	}
		
	function HideSearchOptions()
	{
		var objShowControl = SafeGetElementByID("divShowSearchOptions");
		var objHideControl = SafeGetElementByID("divSearchOptions");	
		
		objShowControl.style.display = "";
		objHideControl.style.display = "none";
		
		SetSubCookie("ElateralMSP", Cookie_ActiBrand_ShowFilterControls, "Hide");
	}
	
	function AutoShowHideSearchOptions()
	{
		var strState = GetSubCookie("ElateralMSP", Cookie_ActiBrand_ShowFilterControls);
		
		if(strState == "Show")
		{
			ShowSearchOptions();
		}
		else
		{
			HideSearchOptions();
		}
	}
		
	function GetKeyPress(objEvent)
	{
		var isNav4, isIE4, nAscii;
				
		if (parseInt(navigator.appVersion.charAt(0)) >= 4) 
		{
			isNav4 = (navigator.appName == "Netscape") ? true : false
			isIE4 = (navigator.appName.indexOf("Microsoft" != -1)) ? true : false
		}
	
		if (isNav4) {
			nAscii = objEvent.which;
			
		} else if (isIE4) {
			nAscii = objEvent.keyCode;
		}
		
		return nAscii;
	}
	
	function SubmitSetDateTime(strHint)
	{
		SetControlValue("hdnHint",strHint);
		SubmitForm();
	}
	
	
	function SubmitAddRecipients()
	{
		var nValidRecips = 0;
		var f;
		var strEmail;
		var strEmailField;
		var bInvalidAddress = 0;
		for(f=1 ; f <= 10; f++) {
			strEmailField = ("txtEmailof" + f);
			strEmail = GetControlValue(strEmailField);
			if(strEmail.length > 0) {
				if(IsEmail(strEmail) == false) {
					alert(Un("Invalid email address at Ref :", "Includes\JS\JS_Master.js") + f);
					bInvalidAddress = 1;
					break;
				}
				else {
					nValidRecips++;
				}				
			}
		}
		if(nValidRecips==0 && bInvalidAddress==0) {
			alert(Un("No email addresses entered.","Includes\JS\JS_Master.js"));
		}
		else if(bInvalidAddress==0){
			SubmitForm();
		}
	}
	
	function SetDateTimeNow(dBlankDate)
	{
		SetControlValue("txtDateTime",Un("Immediately","Includes\JS\JS_Master.js"));
		SetControlValue("hdnDateTime",dBlankDate);
	}
	
	function SetRadio(strIDControl,varState)
	{		
			var x, y, nNumOfElements;
			var nNumOfForms = document.forms.length;
			
			for(x = 0; x < nNumOfForms; x++)
			{
				nNumOfElements = document.forms[x].elements.length;
				
				for(y = 0; y < nNumOfElements; y++)
				{
					if(document.forms[x].elements[y].name == strIDControl)
					{
						if(document.forms[x].elements[y].value == varState)
						{
							document.forms[x].elements[y].checked = true;
						}
					}
				}
			}
	}	
	
	function SetMultipleControlValue(strIDControl,varValue)
	{		
		var x, y, nNumOfElements;
		var nNumOfForms = document.forms.length;
			
		for(x = 0; x < nNumOfForms; x++)
		{
			nNumOfElements = document.forms[x].elements.length;
				
			for(y = 0; y < nNumOfElements; y++)
			{
				if(document.forms[x].elements[y].name == strIDControl)
				{
					document.forms[x].elements[y].value = varValue;
				}
			}
		}
	}	
	
	function SetMultipleOptionControlSelection(strIDControl,varIndex)
	{		
		var x, y, nNumOfElements;
		var nNumOfForms = document.forms.length;
			
		for(x = 0; x < nNumOfForms; x++)
		{
			nNumOfElements = document.forms[x].elements.length;
				
			for(y = 0; y < nNumOfElements; y++)
			{
				if(document.forms[x].elements[y].name == strIDControl)
				{
					document.forms[x].elements[y].selectedIndex = varIndex;
				}
			}
		}
	}	

	function SetCheckAs(strIDControl, strID)
	{
		var isNS4 = (document.layers) ? true : false;
		var isIE4 = (document.all && !document.getElementById) ? true : false;
		var isIE5 = (document.all && document.getElementById) ? true : false;
		var isNS6 = (!document.all && document.getElementById) ? true : false;	//function to check or clear all check boxes that math the ID
		
		var varState = !GetControlCheck(strIDControl);		
		if(1)
		{
			//Netscape 4.x
			
			var x, y, nNumOfElements;
			var nNumOfForms = document.forms.length;
			
			for(x = 0; x < nNumOfForms; x++)
			{
				nNumOfElements = document.forms[x].elements.length;
				
				for(y = 0; y < nNumOfElements; y++)
				{
					if(document.forms[x].elements[y].name == strID)
					{
						document.forms[x].elements[y].checked = varState;
					}
				}
			}
		}
	}

	function GetAllValuesForCheckboxControl(strID, fState)
	{
		var strRet = "";
		var x, y, nNumOfElements;
		var nNumOfForms = document.forms.length;
			
		for(x = 0; x < nNumOfForms; x++)
		{
			nNumOfElements = document.forms[x].elements.length;
				
			for(y = 0; y < nNumOfElements; y++)
			{
				if(document.forms[x].elements[y].name == strID)
				{
					if(document.forms[x].elements[y].checked == fState)
						strRet += ("|" + document.forms[x].elements[y].value + "|");
				}
			}
		}
		return strRet;
	}
		
	function SubmitAddStaticFile()
	{
		var strStaticFile	= GetControlValue("fileStaticFile");
		var strThumbnail	= GetControlValue("fileThumbnail");
		var strName			= GetControlValue("txtDocumentName");
		var strPreview		= GetControlValue("filePreview");
		var strThumbnailSelected = GetControlValue("radThumbnail"); 
		
		strThumbnail	= strThumbnail.toLowerCase();
		strPreview		= strPreview.toLowerCase();
		
		if(strStaticFile.length < 1)
		{
			alert(Un("You must select a static file before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("fileStaticFile");
		}
		else if((strThumbnailSelected == "Custom") && (strThumbnail.length < 1))
		{
			alert(Un("You have selected to upload a custom thumbnail, please choose an image from your computer to upload.", "Includes\JS\JS_Master.js"));	
			FocusControl("fileThumbnail");
		}
		else if((strThumbnailSelected != "Custom") && (strThumbnail.length > 0))
		{
			alert(Un("If you would like to upload a custom thumbnail, please select the \"Custom\" option.", "Includes\JS\JS_Master.js"));	
			FocusControl("fileThumbnail");
		}
		else if((strThumbnail.length > 0) && ((strThumbnail.indexOf(".gif") == -1) && (strThumbnail.indexOf(".jpg") == -1)))
		{
			alert(Un("You must select a valid thumbnail image before you can continue. Images must be in either gif or jpg format.", "Includes\JS\JS_Master.js"));	
			FocusControl("fileThumbnail");
		}
		else if((strPreview.length > 0) && ((strPreview.indexOf(".gif") == -1) && (strPreview.indexOf(".jpg") == -1)))
		{
			alert(Un("Preview images must be in either gif or jpg format.", "Includes\JS\JS_Master.js"));	
			FocusControl("filePreview");
		}
		else if(strName.length < 1)
		{
			alert(Un("You must enter a document name before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtDocumentName");
		}
		else
		{
			SubmitForm();		
		}
	}
	
	function SubmitRequestFullReport()
	{
		var strEmail = GetControlValue("txtEmail");
		var divisions = document.getElementsByName("divisions");
		
		var divisionsChecked = 0;
		if(divisions.length > 0)
		{
			//There is a list of divisions, so count the number that are checked.
			for(var x = 0; x <= divisions.length; x++)
			{
				var checkBox = divisions[x];
				if(checkBox != null && checkBox.checked)
				{
					divisionsChecked++;
				}
			}
		}
		
		if(IsEmail(strEmail)==false)
		{
			alert(Un("You must enter your Email Address before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtEmail");
		}
		else if (divisions.length > 0 && divisionsChecked == 0)
		{
			alert(Un("You must select at least one division to report on before you can continue.", "Includes\JS\JS_Master.js"));
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitForgottenPassword()
	{
		var strCompanyID	= GetControlValue("txtCompanyID");
		var strUserID		= GetControlValue("txtUserID");
		var strEmail		= GetControlValue("txtEmail");
		
		if(strCompanyID.length < 1)
		{
			alert(Un("You must enter your Company ID before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtCompanyID");
		}
		else if(strUserID.length < 1)
		{
			alert(Un("You must enter your User ID before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtUserID");
		}
		else if(IsEmail(strEmail)==false)
		{			
			alert(Un("You must enter a valid email address.", "Includes\JS\JS_Master.js"));			
			FocusControl("txtEmail");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitEditProductionUser()
	{
		var strFirstname	= GetControlValue("txtFirstName");
		var strSurname		= GetControlValue("txtSurname");
		var strEmail		= GetControlValue("txtEmail");
		var strUserID		= GetControlValue("txtUserID")
		
		if(strFirstname.length < 1)
		{
			alert(Un("You must enter the first name", "Includes\JS\JS_Master.js"));
			FocusControl("txtFirstName");
		}
		else if(strSurname.length < 1)
		{
			alert(Un("You must enter the surname.", "Includes\JS\JS_Master.js"));
			FocusControl("txtSurname");
		}
		else if(IsEmail(strEmail)==false)
		{			
			alert(Un("You must enter a valid email address. (3)", "Includes\JS\JS_Master.js"));			
			FocusControl("txtEmail");
		}
		else if(CheckUserID(strUserID)==false) 
		{
			alert(Un("You must enter a valid UserID before you can continue. The UserID can contain letters and numbers and must be at least 6 characters in length.", "Includes\JS\JS_Master.js"));
			FocusControl("txtUserID");
		}		
		else
		//Everything ok, so submit the form
		{
			SubmitForm();
		}
	}	
	
	
	function SubmitCreateProductionUser()
	{
		var strFirstname	= GetControlValue("txtFirstName");
		var strSurname		= GetControlValue("txtSurname");
		var strEmail		= GetControlValue("txtEmail");
		var strUserID		= GetControlValue("txtUserID")
		var strPassword1	= GetControlValue("txtPassword1");
		var strPassword2	= GetControlValue("txtPassword2");
		
		if(strFirstname.length < 1)
		{
			alert(Un("You must enter the first name (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtFirstName");
		}
		else if(strSurname.length < 1)
		{
			alert(Un("You must enter the surname. (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtSurname");
		}
		else if(IsEmail(strEmail)==false)
		{			
			alert(Un("You must enter a valid email address. (4)", "Includes\JS\JS_Master.js"));			
			FocusControl("txtEmail");
		}
		else if(CheckUserID(strUserID)==false) 
		{
			alert(Un("You must enter a valid UserID before you can continue. The UserID can contain letters and numbers and must be at least 6 characters in length. (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtUserID");
		}
		//Check for new password
		else if(strPassword1.length < 6)
		{
			alert(Un("You must enter a new password of 6 or more characters before you can continue.", "Includes\JS\JS_Master.js"));
			ClearControl("txtPassword1");
			ClearControl("txtPassword2");
			FocusControl("txtPassword1");
		}
		//Check that the new password was confirmed correctly
		else if(strPassword1 != strPassword2)
		{
			alert(Un("You did not confirm the new password correctly.", "Includes\JS\JS_Master.js"));
			ClearControl("txtPassword1");
			ClearControl("txtPassword2");
			FocusControl("txtPassword1");
		}
		//Check that the new password has letters and numbers
		else if(!CheckPassword(strPassword1))
		{	
			alert(Un("You must enter a valid password before you can continue. Passwords should contain letters and numbers and be at least 6 characters in length.", "Includes\JS\JS_Master.js"));
			ClearControl("txtPassword1");
			ClearControl("txtPassword2");
			FocusControl("txtPassword1");
		}
		else
		//Everything ok, so submit the form
		{
			SubmitForm();
		}
	}	
	
	function SubmitTestDocument()
	{
		var fAllowSubmit = true;
					
		var strTestIR	= GetControlValue("radTestIR");

		if(strTestIR=="SHOW")
		{
			var strIRLanguageUID		= GetControlValue("txtIRLanguageUID");

			var strIRExitURL			= GetControlValue("txtIRExitURL");
			var radIRExitURL			= GetControlValue("radIRExitURL");
			var strIRDeactivatedURL		= GetControlValue("txtIRDeactivatedURL");
			var radIRDeactivatedURL		= GetControlValue("radIRDeactivatedURL");
			var strIRErrorURL			= GetControlValue("txtIRErrorURL");
			var radIRErrorURL			= GetControlValue("radIRErrorURL");
			
			
			var strIRUserLogonUID		= GetControlValue("hdnIRUserLogonUID");	

			var strIREmailSubject	= GetControlValue("txtIREmailSubject");
			var strIREmailMessage	= GetControlValue("txtIREmailMessage");						
			var strIRAttachmentName	= GetControlValue("txtIRAttachmentName");						
			var strIREmailFrom		= GetControlValue("txtIREmailFrom");
			var strIREmailFromAddress	= GetControlValue("txtIREmailFromAddress");		
			
			var strHttp = "http://";	

				if(strIRLanguageUID.length < 1)
			{
				alert(Un("You must select a user language", "Includes\JS\JS_Master.js"));
				fAllowSubmit = false;
				return;
			}						

			if(radIRErrorURL == "Custom")
			{
				if((strIRErrorURL.length < 1)  || (strIRErrorURL == "http://"))
				{
					alert(Un("You must enter an Error URL before you can continue", "Includes\JS\JS_Master.js"));
					FocusControl("txtIRErrorURL");
					fAllowSubmit = false;
					return;
				}
			}
			if(radIRDeactivatedURL == "Custom")
			{
				if((strIRDeactivatedURL.length < 1)  || (strIRDeactivatedURL == "http://"))
				{
					alert(Un("You must enter a Deactivated URL error page before you can continue", "Includes\JS\JS_Master.js"));
					FocusControl("txtIRDeactivatedURL");
					fAllowSubmit = false;
					return;
				}
			}
			if(radIRExitURL == "URL")
			{
			
				if(strIRExitURL.length > 0 && strIRExitURL.substring(0,7) != strHttp)
				{
					SetURLInputHttpQualifier("txtIRExitURL");
					FocusControl("txtIRExitURL");
				}
				
				if((strIRExitURL.length < 1) || (strIRExitURL == "http://"))
				{
					alert(Un("You must enter an exit URL before you can continue", "Includes\JS\JS_Master.js"));
					FocusControl("txtIRExitURL");
					fAllowSubmit = false;
					return;
				}
			}
			if(strIREmailFrom.length < 1)
			{
				alert(Un("You must complete the Sender's name field", "Includes\JS\JS_Master.js"));
				FocusControl("txtIREmailFrom");
				fAllowSubmit = false;
				return;
			}						
			if(IsEmail(strIREmailFromAddress) == false)
			{
				alert(Un("You must complete the Reply to email address field", "Includes\JS\JS_Master.js"));
				FocusControl("txtIREmailFromAddress");
				fAllowSubmit = false;
				return;
			}						
			if(strIREmailSubject.length < 1)
			{
				alert(Un("You must complete Email subject field", "Includes\JS\JS_Master.js"));
				FocusControl("txtIREmailSubject");
				fAllowSubmit = false;
				return;
			}	
			if(strIREmailMessage.length > 500)
			{
				alert(Un("Your Email message text must contain no more than 500 characters", "Includes\JS\JS_Master.js"));
				FocusControl("txtIREmailMessage");
				fAllowSubmit = false;
				return;
			}						
			if(strIRAttachmentName.length < 1)
			{
				alert(Un("You must complete the Email attachment name field", "Includes\JS\JS_Master.js"));
				FocusControl("txtIRAttachmentName");
				fAllowSubmit = false;
			}	
		
		}
		if(true==fAllowSubmit)
			SubmitForm();	
	}
	
	function SetURLInputHttpQualifier(strInputID)
	{
		//D948.
		var urlInput	= document.getElementById(strInputID);
		var strHttp		= "http://";
		
		if(urlInput != null)
		{
			var strInputText = urlInput.value;
			if(strInputText.length > 0 && strInputText.indexOf(strHttp) == -1)
			{
				strInputText = "http://" + strInputText;
				urlInput.value = strInputText;
				return;
			}
			if(strInputText.length < 1)
			{
				strInputText = "http://" + strInputText;
				urlInput.value = strInputText;
				return;
			}
			if(strInputText.length > 0 && strInputText.substring(0,7) != "http://")
			{
				strInputText = "http://" + strInputText;
				urlInput.value = strInputText;
				return;
			}
		}
		return;
	}
	
	
	
	function ToggleShowItem(strItemID, strShowState)
	{
		var theItem = SafeGetElementByID(strItemID);
		if(strShowState=='SHOW')
		{
			theItem.style.display = '';
		}
		else
		{
			theItem.style.display = 'none';
		}
	}	
	
	function SubmitProductionCompleteJob()
	{
		var strCourierName		= GetControlValue("txtCourierName");
		var strAirwayBillNumber = GetControlValue("txtAirwayBillNumber");
		
		if(strCourierName.length < 1)
		{
			alert(Un("You must enter the Courier Name before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtCourierName");
		}
		else if(strAirwayBillNumber < 1)
		{
			alert(Un("You must enter the Airway Bill Number before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("strAirwayBillNumber");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function IsEmail(string) {
		if (string.search(/^\w+((-\w+)|(\.\w+))*\@\w+((\.|-)\w+)*\.\w+$/) != -1)
			return true;
		else
	        return false;
	}

	function SubmitIREmail()
	{
		var strEmail = GetControlValue("txtEmail");
	
		if(IsEmail(strEmail)==false)
		{
			alert(Un("You must enter an email address before you can continue", "Includes\JS\JS_Master.js"));
			FocusControl("txtEmail");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitProductionAcceptOrder()
	{
		var strJobNumber		= GetControlValue("txtJobNumber");
		var strPrice			= GetControlValue("txtPrice");
		var strDecimal			= GetControlValue("txtPriceDecimal");
		
		
		if(strJobNumber.length < 1)
		{
			alert(Un("You must enter a Job Number before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtJobNumber");
		}
		else if(strPrice.length < 1)
		{
			alert(Un("You must enter a Price before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtPrice");
		}
		else if(((!IsNumeric(strPrice)) || (!IsNumeric(strDecimal))))
		{
			alert(Un("You must enter a valid Price before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtPrice");
		}
		else
		{
			SubmitForm();
		}
	}

	function IsNumeric(str)
	{
		var strValid = "0123456789";
		var i;
		var strCurrentChar = "";
				
		//Check Characters
		for(i = 0; i < str.length; i++)
		{
			strCurrentChar = str.charAt(i);
			if(strValid.indexOf(strCurrentChar) == -1)
			{
				return false;
			}
		} 
		
		//Check Range
		if((str < -922337203685477.5808) || (str > 922337203685477.5807))
		{
			//Out of range
			return false;
		}
		
		return true;
	}
	
	function IsPrice(str)
	{
		var strValid = "0123456789.";
		var i;
		var strCurrentChar = "";
				
		//Check Characters
		for(i = 0; i < str.length; i++)
		{
			strCurrentChar = str.charAt(i);
			if(strValid.indexOf(strCurrentChar) == -1)
			{
				return false;
			}
		} 
		
		//Check Range
		if((str < -922337203685477.5808) || (str > 922337203685477.5807))
		{
			//Out of range
			return false;
		}
		
		return true;
	}
	
	function SubmitAcceptOrder(nCheckerType, nOutputType)
	{
		var CHECKER_AUTHORISERPO	= 103
		var OUTPUT_PRINT			= 1
		var OUTPUT_ADVERT			= 2
	
		if(nCheckerType == CHECKER_AUTHORISERPO)
		{
			var strInvAddress	= GetControlValue("hdnInvoiceAddressUID");
			var strPONumber		= GetControlValue("txtPONumber");
			
			if(((nOutputType == OUTPUT_PRINT) || (nOutputType == OUTPUT_ADVERT)) && (strInvAddress.length < 1))
			{
				alert(Un("You must select an invoice address for this order before you can continue.", "Includes\JS\JS_Master.js"));
			}
			else if(strPONumber.length < 1)
			{
				alert(Un("You must enter a PO Number before you can continue.", "Includes\JS\JS_Master.js"));
				FocusControl("txtPONumber");
			}
			else
			{
				SubmitForm();
			}
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitOrderConfigureFriendlyUrl()
	{
		var fAllowSubmit	= true;
		var strFriendlyUrl	= GetControlValue("cboFriendlyUrl");

		if(strFriendlyUrl.length < 1)
		{
			
			fAllowSubmit = false;
		}
		
		strFriendlyUrl	= GetControlValue("txtFriendlyUrl");

		if(strFriendlyUrl.length < 1 && fAllowSubmit == false)
		{
			
			fAllowSubmit = false;
		}
		else
		{
			fAllowSubmit = true;
		}
		
		if(fAllowSubmit == true)
		{
			SubmitForm();
		}
		else if ((SafeGetElementByID("txtFriendlyUrl") != null) && (SafeGetElementByID("cboFriendlyUrl") != null))
		{
			alert(Un("You must either select an existing URL or enter your own.", "Includes\JS\JS_Master.js"));
			return;			
		}
		else if (SafeGetElementByID("cboFriendlyUrl") == null)
		{
			alert(Un("You must enter your own URL.", "Includes\JS\JS_Master.js"));
			return;			
		}
		else
		{
			alert(Un("You must select an existing URL.", "Includes\JS\JS_Master.js"));
			return;			
		}
	}
	
	function SubmitOrderConfigure(nOutputType, strBrandedEmailWorkflow)
	{			
		var fAllowSubmit = true; 
		var OUTPUT_INSTANTRESPONSE	= 4;
		var OUTPUT_BRANDEDEMAIL		= 5;

		
		if(nOutputType == OUTPUT_INSTANTRESPONSE)
		{
			var strIRLanguageUID		= GetControlValue("txtIRLanguageUID");	
			var strIRErrorURL			= GetControlValue("txtIRErrorURL");
			var radIRErrorURL			= GetControlValue("radIRErrorURL");
			var strIRDeactivatedURL		= GetControlValue("txtIRDeactivatedURL");
			var radIRDeactivatedURL		= GetControlValue("radIRDeactivatedURL");
			var strIRExitURL			= GetControlValue("txtIRExitURL");
			var radIRExitURL			= GetControlValue("radIRExitURL");
			var strIRUserLogonUID		= GetControlValue("hdnIRUserLogonUID");	
				
			var strIREmailSubject	= GetControlValue("txtIREmailSubject");
			var strIREmailMessage	= GetControlValue("txtIREmailMessage");						
			var strIRAttachmentName	= GetControlValue("txtIRAttachmentName");						
			var strIREmailFrom		= GetControlValue("txtIREmailFrom");
			var strIREmailFromAddress	= GetControlValue("txtIREmailFromAddress");		
			
			var strHttp = "http://";				

			if(strIRLanguageUID.length < 1)
			{
				alert(Un("You must select a user language (2)", "Includes\JS\JS_Master.js"));
				fAllowSubmit = false;
				return;
			}						

			if(radIRErrorURL == "Custom")
			{
				if((strIRErrorURL.length < 1)  || (strIRErrorURL == "http://"))
				{
					alert(Un("You must enter an Error URL before you can continue (2)", "Includes\JS\JS_Master.js"));
					FocusControl("txtIRErrorURL");
					fAllowSubmit = false;
					return;
				}
			}
			if(radIRDeactivatedURL == "Custom")
			{
				if((strIRDeactivatedURL.length < 1)  || (strIRDeactivatedURL == "http://"))
				{
					alert(Un("You must enter a Deactivated URL error page before you can continue (2)", "Includes\JS\JS_Master.js"));
					FocusControl("txtIRDeactivatedURL");
					fAllowSubmit = false;
					return;
				}
			}
			if(radIRExitURL == "URL")
			{
			
				if(strIRExitURL.length > 0 && strIRExitURL.substring(0,7) != strHttp)
				{
					SetURLInputHttpQualifier("txtIRExitURL");
					FocusControl("txtIRExitURL");
				}
				
				if((strIRExitURL.length < 1) || (strIRExitURL == "http://"))
				{
					alert(Un("You must enter an exit URL before you can continue (2)", "Includes\JS\JS_Master.js"));
					FocusControl("txtIRExitURL");
					fAllowSubmit = false;
					return;
				}
			}
			if(strIREmailFrom.length < 1)
			{
				alert(Un("You must complete the Sender's name field (2)", "Includes\JS\JS_Master.js"));
				FocusControl("txtIREmailFrom");
				fAllowSubmit = false;
				return;
			}						
			if(IsEmail(strIREmailFromAddress) == false)
			{
				alert(Un("You must complete the Reply to email address field (2)", "Includes\JS\JS_Master.js"));
				FocusControl("txtIREmailFromAddress");
				fAllowSubmit = false;
				return;
			}						
			if(strIREmailSubject.length < 1)
			{
				alert(Un("You must complete Email subject field (2)", "Includes\JS\JS_Master.js"));
				FocusControl("txtIREmailSubject");
				fAllowSubmit = false;
				return;
			}	
			if(strIREmailMessage.length > 500)
			{
				alert(Un("Your Email message text must contain no more than 500 characters (2)", "Includes\JS\JS_Master.js"));
				FocusControl("txtIREmailMessage");
				fAllowSubmit = false;
				return;
			}						
			if(strIRAttachmentName.length < 1)
			{
				alert(Un("You must complete the Email attachment name field (2)", "Includes\JS\JS_Master.js"));
				FocusControl("txtIRAttachmentName");
				fAllowSubmit = false;
			}	

			if(true == fAllowSubmit)
			{
				SubmitForm();
			}		
		}
		else if(nOutputType == OUTPUT_BRANDEDEMAIL)
		{
			var strReplyTo		= GetControlValue("hdnBEReplyTo");
			var strSender		= GetControlValue("hdnBESenderName");						
			var strTrailer		= GetControlValue("hdnBETrailer");
				
			if((strSender.length < 1) && strBrandedEmailWorkflow != "STATIC_FROM")
			{
				alert(Un("You must specify a sender that Branded Email will appear to be coming from.", "Includes\JS\JS_Master.js"));
				FocusControl("hdnBESenderName");
			}
			else if((IsEmail(strReplyTo) == false) && strBrandedEmailWorkflow != "STATIC_FROM" && strBrandedEmailWorkflow != "STATIC_ALIAS_FROM")
			{
				alert(Un("Please enter a valid email address for the Replies.", "Includes\JS\JS_Master.js"));
				FocusControl("hdnBEReplyTo");
			}	
			else if((IsEmail(strReplyTo) == false) && (strBrandedEmailWorkflow == "STATIC_FROM") && (strReplyTo.length >= 1))
			{
				alert(Un("Please enter a valid email address for the Replies. (1)", "Includes\JS\JS_Master.js"));
				FocusControl("hdnBEReplyTo");
			}									
			else if(strTrailer.length < 1)
			{
				alert(Un("You must select the address that will be the trailer for this Branded Email.", "Includes\JS\JS_Master.js"));
			}
			else if(strTrailer.length < 15)
			{
				alert(Un("The address for the trailer MUST be a valid address.", "Includes\JS\JS_Master.js"));
			}
			else
			{
				SubmitForm();
			}				
		}
	}
	
	// SubmitOrderConfigure revised for landing page validation
	function SubmitOrderConfigureSelfService(requiredProfileFieldIdArray, requiredProfileFieldNameArray, requiredProfileFieldMinLengthArray)
	{			
		var fAllowSubmit = true; 
		var OUTPUT_INSTANTRESPONSE	= 4;
		var OUTPUT_BRANDEDEMAIL		= 5;

		
		//if(nOutputType == OUTPUT_INSTANTRESPONSE)
		//{
		var strIRLanguageUID		= GetControlValue("txtIRLanguageUID");	
		var strIRErrorURL			= GetControlValue("txtIRErrorURL");
		var radIRErrorURL			= GetControlValue("radIRErrorURL");
		var strIRDeactivatedURL		= GetControlValue("txtIRDeactivatedURL");
		var radIRDeactivatedURL		= GetControlValue("radIRDeactivatedURL");
		var strIRExitURL			= GetControlValue("txtIRExitURL");
		var radIRExitURL			= GetControlValue("radIRExitURL");
		var strIRUserLogonUID		= GetControlValue("hdnIRUserLogonUID");	
			
		var strIREmailSubject	= GetControlValue("txtIREmailSubject");
		var strIREmailMessage	= GetControlValue("txtIREmailMessage");						
		var strIRAttachmentName	= GetControlValue("txtIRAttachmentName");						
		var strIREmailFrom		= GetControlValue("txtIREmailFrom");
		var strIREmailFromAddress	= GetControlValue("txtIREmailFromAddress");
		
		var strHttp = "http://";				

		if(strIRLanguageUID.length < 1)
		{
			alert(Un("You must select a user language (2) (1)", "Includes\JS\JS_Master.js"));
			fAllowSubmit = false;
			return;
		}						

		if(radIRErrorURL == "Custom")
		{
			if((strIRErrorURL.length < 1)  || (strIRErrorURL == "http://") || (strIRErrorURL.length > 0 && strIRErrorURL.substring(0,7) != strHttp))
			{
				alert(Un("You must enter an Error URL before you can continue ", "Includes\JS\JS_Master.js"));
				SetURLInputHttpQualifier("txtIRErrorURL");
				FocusControl("txtIRErrorURL");
				fAllowSubmit = false;
				return;
			}
		}
		if(radIRDeactivatedURL == "Custom")
		{
			if((strIRDeactivatedURL.length < 1)  || (strIRDeactivatedURL == "http://") || (strIRDeactivatedURL.length > 0 && strIRDeactivatedURL.substring(0,7) != strHttp))
			{
				alert(Un("You must enter a Deactivated URL error page before you can continue (2) (1)", "Includes\JS\JS_Master.js"));
				SetURLInputHttpQualifier("txtIRDeactivatedURL");
				FocusControl("txtIRDeactivatedURL");
				fAllowSubmit = false;
				return;
			}
		}
		if(radIRExitURL == "URL")
		{
			if(strIRExitURL.length > 0 && strIRExitURL.substring(0,7) != strHttp)
			{
				SetURLInputHttpQualifier("txtIRExitURL");
				FocusControl("txtIRExitURL");
			}
		
			if((strIRExitURL.length < 1) || (strIRExitURL == "http://"))
			{
				alert(Un("You must enter an exit URL before you can continue (3)", "Includes\JS\JS_Master.js"));
				SetURLInputHttpQualifier("txtIRExitURL");
				FocusControl("txtIRExitURL");
				fAllowSubmit = false;
				return;
			}
		}
		if(strIREmailFrom.length < 1)
		{
			alert(Un("You must complete the Sender's name field (2) (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtIREmailFrom");
			fAllowSubmit = false;
			return;
		}						
		if(IsEmail(strIREmailFromAddress) == false)
		{
			alert(Un("You must complete the Reply to email address field (2) (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtIREmailFromAddress");
			fAllowSubmit = false;
			return;
		}						
		if(strIREmailSubject.length < 1)
		{
			alert(Un("You must complete Email subject field (2) (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtIREmailSubject");
			fAllowSubmit = false;
			return;
		}	
		if(strIREmailMessage.length > 500)
		{
			alert(Un("Your Email message text must contain no more than 500 characters (2) (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtIREmailMessage");
			fAllowSubmit = false;
			return;
		}						
		if(strIRAttachmentName.length < 1)
		{
			alert(Un("You must complete the Email attachment name field (2) (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtIRAttachmentName");
			fAllowSubmit = false;
		}	
		
		for(i = 0; i < requiredProfileFieldIdArray.length; i++)
		{
			if (GetControlValue(requiredProfileFieldIdArray[i]).length < requiredProfileFieldMinLengthArray[i])	
			{
				alert(Un("You must complete the ", "Includes\JS\JS_Master.js") + requiredProfileFieldNameArray[i]);
				FocusControl(requiredProfileFieldIdArray[i]);
				fAllowSubmit = false;		
			}
		} 

		if(true == fAllowSubmit)
		{
			SubmitForm();
		}
		

		//}
	}
		
	function SubmitOrderDetails(nOrderOption, nOutputType, nMDFType, nPOType, nCustomQuantities)
	{
		var ORDER_PLACEORDER		= 0;
		var ORDER_SAVEORDER			= 1;
		
		var OUTPUT_PRINT			= 1;
		var OUTPUT_ADVERT			= 2;
		var OUTPUT_DESKTOPDOWNLOAD	= 3;
		var OUTPUT_INSTANTRESPONSE	= 4;
		var OUTPUT_BRANDEDEMAIL		= 5;
		var OUTPUT_STATICFILE		= 6;
		var OUTPUT_BRANDEDEMAIL_DOC_ANNOUNCE = 7;
		var OUTPUT_BRANDEDEMAIL_GEN_ANNOUNCE = 8;	
		var OUTPUT_DESKTOPDOWNLOAD_PUSH = 9;
		var OUTPUT_PRINT_PUSH = 10;
	
		var PO_USER					= 0;
		var PO_AUTH					= 1;
		var PO_SINGLE				= 2;
		var PO_AUTO					= 3;
	
		var strRef;
		var strDelAddress;
		var strInvAddress;
		var strPONumber;
		var strQuantity;
		var strUnits;
		var arrQuantity;
		var strPubName;
		var strIssueDate;
		var strContactName;
		var strContactTel;
		var strAdType;
		var arrAdType;
		var strFilmSpec;
		var strBRFilePath;
		var strCSVFile;
		var strRecipVar;
		var strCustomQuantities = "";
		var nHighestQuantity = 0;
		var strUnitQuantities = "";
	
		if(nOrderOption == ORDER_PLACEORDER)
		{
			if(nOutputType == OUTPUT_PRINT_PUSH) 
			{
				SubmitForm();
			}
			else if(nOutputType == OUTPUT_PRINT)
			{
				strRef			= GetControlValue("txtRef");
				strDelAddress	= GetControlValue("hdnDeliveryAddressUID");
				strInvAddress	= GetControlValue("hdnInvoiceAddressUID");
				strPONumber		= GetControlValue("txtPONumber");
				strUnitQuantities = GetControlValue("txtUnitQuantity");
				
				strQuantity		= GetControlValue("selQuantity");
								
				if(strQuantity == "")
				{
					strQuantity		= "-1";
				}
				
				strUnits		= GetControlValue("txtUnitQuantity");
				
				if(!isOldNetscape)
				{
					arrQuantity		= strQuantity.split('_');
				}
				else
				{
					
				}

				if(strRef.length < 1)
				{
					alert(Un("You must enter a reference number for this order before you can continue.", "Includes\JS\JS_Master.js"));
					FocusControl("txtRef");
				}
				else if(strDelAddress.length < 1)
				{
					alert(Un("You must select a delivery address for this order before you can continue.", "Includes\JS\JS_Master.js"));
				}
				else if((nPOType == PO_USER) && (strInvAddress.length < 1))
				{
					alert(Un("You must select an invoice address for this order before you can continue. (1)", "Includes\JS\JS_Master.js"));
				}
				else if((nPOType == PO_USER) && (strPONumber.length < 1))
				{
					alert(Un("You must enter a PO Number before you can continue. (1)", "Includes\JS\JS_Master.js"));
					FocusControl("txtPONumber");
				}
				else if(!isOldNetscape)
				{
					if(nCustomQuantities == 1)
					{
						strCustomQuantities = GetControlValue("txtCustomQuantity");
						nHighestQuantity = GetControlValue("hdnHighestQuantity_" + arrQuantity[1]);
					}
				
					if(strQuantity == "-1")
					{
						alert(Un("You must select a quantity amount for this order before you can continue.", "Includes\JS\JS_Master.js"));
						FocusControl("selQuantity");
					}
					else if((arrQuantity[0] == "1") && ((strUnitQuantities.length < 1) || (!IsInteger(strUnitQuantities))))
					{
						alert(Un("You must enter a valid unit quantity for this order before you can continue.", "Includes\JS\JS_Master.js"));
						FocusControl("txtUnitQuantity");
					}
					else if((arrQuantity[0] == "-2") && ((strCustomQuantities.length < 1) || (!IsInteger(strCustomQuantities))))
					{
						alert(Un("You must enter a valid custom quantity for this order before you can continue.", "Includes\JS\JS_Master.js"));
						FocusControl("txtCustomQuantity");
					}
					else if((arrQuantity[0] == "-2") && ((parseInt(strCustomQuantities) > parseInt(nHighestQuantity)) || (parseInt(strCustomQuantities) <= 0)))
					{
						alert(Un("You must enter a whole number of units between zero and the highest price break before you can continue.", "Includes\JS\JS_Master.js"));
						FocusControl("txtCustomQuantity");
					}
					else
					{
						SubmitForm();
					}
				}
				else
				{
					SubmitForm();
				}
			}
			else if(nOutputType == OUTPUT_ADVERT)
			{
				strRef			= GetControlValue("txtRef");
				strPubName		= GetControlValue("txtPubName");
				strIssueDate	= GetControlValue("txtIssueDate");
				strContactName	= GetControlValue("txtContactName");
				strContactTel	= GetControlValue("txtContactTel");
				strFilmSpec		= GetControlValue("txtFilmSpec");
				
				strAdType		= GetControlValue("selAdType");
				
				if(strAdType == null)
				{
					arrAdType = new Array("null");
				}
				else
				{
					arrAdType = strAdType.split('_');
				}
				
				if(strRef.length < 1)
				{
					alert(Un("You must enter a reference number for this order before you can continue. (1)", "Includes\JS\JS_Master.js"));
					FocusControl("txtRef");
				}
				else if(strAdType == "-1")
				{
					alert(Un("You must enter an output type for this order before you can continue.", "Includes\JS\JS_Master.js"));
					FocusControl("selAdType");
				}
				else if((arrAdType[0] == "AdFilmProof") && (strFilmSpec.length < 1))
				{
					alert(Un("You must enter a film specification for this order before you can continue.", "Includes\JS\JS_Master.js"));
					FocusControl("txtFilmSpec");
				}
				else if(strPubName.length < 1)
				{
					alert(Un("You must enter a name for the publication before you can continue.", "Includes\JS\JS_Master.js"));
					FocusControl("txtPubName");
				}
				else if(strIssueDate.length < 1)
				{
					alert(Un("You must enter an issue date for the publication before you can continue.", "Includes\JS\JS_Master.js"));
					FocusControl("txtIssueDate");
				}
				else if(strContactName.length < 1)
				{
					alert(Un("You must enter a contact name for the publication before you can continue.", "Includes\JS\JS_Master.js"));
					FocusControl("txtContactName");
				}
				else if(strContactTel.length < 1)
				{
					alert(Un("You must enter a contact telephone number for the publication before you can continue.", "Includes\JS\JS_Master.js"));
					FocusControl("txtContactTel");
				}
				else
				{
					SubmitForm();
				}
			}
			else if(nOutputType == OUTPUT_DESKTOPDOWNLOAD || nOutputType == OUTPUT_DESKTOPDOWNLOAD_PUSH)
			{
				strRef = GetControlValue("txtRef");
						
				if(strRef.length < 1)
				{
					alert(Un("You must enter a reference number for this order before you can continue. (2)", "Includes\JS\JS_Master.js"));
					FocusControl("txtRef");
				}
				else
				{
					SubmitForm();
				}
			}
			else if(nOutputType == OUTPUT_INSTANTRESPONSE)
			{
				strRef = GetControlValue("txtRef");
						
				if(strRef.length < 1)
				{
					alert(Un("You must enter a reference number for this order before you can continue. (3)", "Includes\JS\JS_Master.js"));
					FocusControl("txtRef");
				}
				else
				{
					SubmitForm();
				}
			}
			else if(nOutputType == OUTPUT_BRANDEDEMAIL  || nOutputType == OUTPUT_BRANDEDEMAIL_DOC_ANNOUNCE || nOutputType == OUTPUT_BRANDEDEMAIL_GEN_ANNOUNCE)
			{
				strRef			= GetControlValue("txtRef");
				strBRFilePath	= GetControlValue("hdnBEFilePath");
				strCSVFile		= GetControlValue("CSVFile");
				strRecipVar		= GetControlValue("radAddr");
						
				if(strRef.length < 1)
				{
					alert(Un("You must enter a reference number for this order before you can continue. (4)", "Includes\JS\JS_Master.js"));
					FocusControl("txtRef");
				}
				else
				{
					if(nOutputType == OUTPUT_BRANDEDEMAIL_DOC_ANNOUNCE || nOutputType == OUTPUT_BRANDEDEMAIL_GEN_ANNOUNCE)
					{
						SubmitForm();
					}
					else
					{
						if((strRecipVar == "0") && (isOldNetscape == false)) {
							if((strBRFilePath.length < 1) && (strCSVFile.length < 1))
							{
								alert(Un("You must select a CSV file to upload for this order before you can continue.", "Includes\JS\JS_Master.js"));
								FocusControl("CSVFile");
							}						
							else
							{
								SubmitForm();
							}
						}
						else {
							SubmitForm();
						}					
					}
				}
			}
			else if(nOutputType == OUTPUT_STATICFILE)
			{
				strRef = GetControlValue("txtRef");
						
				if(strRef.length < 1)
				{
					alert(Un("You must enter a reference number for this order before you can continue. (5)", "Includes\JS\JS_Master.js"));
					FocusControl("txtRef");
				}
				else
				{
					SubmitForm();
				}
			}
			else
			{
				//Unknown output type
			}
		}
		else if(nOrderOption == ORDER_SAVEORDER)
		{
			var strRef = GetControlValue("txtRef");
			
			if(strRef.length < 1)
			{
				alert(Un("You must enter a reference number for this order before you can continue. (6)", "Includes\JS\JS_Master.js"));
				FocusControl("txtRef");
			}
			else
			{
				SubmitForm();
			}
		}
		else
		{
			//Unknown order option
		}
	}

	function IsInteger(str)
	{
		var strValid = "0123456789";
		var i;
		var strCurrentChar = "";
		
		for(i = 0; i < str.length; i++)
		{
			strCurrentChar = str.charAt(i);
			if(strValid.indexOf(strCurrentChar) == -1)
			{
				return false;
			}
		} 
		
		return true;
	}
	
	function Back()
	{
		history.back();
	}
	
	function LoginKeyDown(ev) 
	{
		if(!isOldNetscape)
		{
			var isNav4, isIE4;
			var ns, ie;
				
			if (parseInt(navigator.appVersion.charAt(0)) >= 4) 
			{
				isNav4 = (navigator.appName == "Netscape") ? true : false;
				isIE4 = (navigator.appName.indexOf("Microsoft") != -1) ? true : false;
			}
		
			if (isNav4) {
				ns = ev.which;
				if (ns == 13) {
					Login();
					return false;
				}
			} else if (isIE4) {
				ie = ev.keyCode;
				if (ie == 13) {
					Login();
					return false;
				}
			}
		}
	}
	
	function LoginKeyDownForVirDir(ev, strVirDir) 
	{
		if(!isOldNetscape)
		{
			var isNav4, isIE4;
			var ns, ie;
				
			if (parseInt(navigator.appVersion.charAt(0)) >= 4) 
			{
				isNav4 = (navigator.appName == "Netscape") ? true : false;
				isIE4 = (navigator.appName.indexOf("Microsoft") != -1) ? true : false;
			}
		
			if (isNav4) {
				ns = ev.which;
				if (ns == 13) {
					LoginForVirDir(strVirDir);
					return false;
				}
			} else if (isIE4) {
				ie = ev.keyCode;
				if (ie == 13) {
					LoginForVirDir(strVirDir);
					return false;
				}
			}
		}
	}
	
	function Login()
	{
		/*
		if(!isOldNetscape)
		{
			//Get the local (client) time
			var localTime = new Date();
			SetControlValue("hdnClientTime", localTime.toLocaleString());
		}
		
		SubmitForm();
		*/
		
		LoginForVirDir("Default");
	}
		
	function LoginForVirDir(strVirDir)
	{
		if(!isOldNetscape)
		{
			//Get the local (client) time
			var localTime = new Date();
			SetControlValue("hdnClientTime", localTime.toLocaleString());
		}
		
		var objRememberCompanyID = SafeGetElementByID("chkRememberCompanyID");
		var objRememberUserID = SafeGetElementByID("chkRememberUserID");
		var objRememberPassword = SafeGetElementByID("chkRememberPassword");
		
		var strCompanyID = GetControlValue("txtCompanyID");
		var strUserID = GetControlValue("txtUserID");
		var strPassword = GetControlValue("txtPassword");
		
	
		
		
		if(objRememberCompanyID != null)
		{
			if(objRememberCompanyID.checked == true)
			{
				//Remember value
				SetNamedSubCookie("ElateralMSP", Cookie_Default_CompanyID, strVirDir, strCompanyID);
				SetNamedSubCookie("ElateralMSP", Cookie_Default_RememberCompanyID, strVirDir, "Yes");
			}
			else
			{
				//Forget value
				SetNamedSubCookie("ElateralMSP", Cookie_Default_CompanyID, strVirDir, "");
				SetNamedSubCookie("ElateralMSP", Cookie_Default_RememberCompanyID, strVirDir, "No");
			}
		}
		else
		{
			//Forget value
			SetNamedSubCookie("ElateralMSP", Cookie_Default_CompanyID, strVirDir, "");
			SetNamedSubCookie("ElateralMSP", Cookie_Default_RememberCompanyID, strVirDir, "No");
		}
		
		if(objRememberUserID != null)
		{
			if(objRememberUserID.checked == true)
			{
				//Remember value
				SetNamedSubCookie("ElateralMSP", Cookie_Default_UserID, strVirDir, strUserID);
				SetNamedSubCookie("ElateralMSP", Cookie_Default_RememberUserID, strVirDir, "Yes");
			}
			else
			{
				//Forget value
				SetNamedSubCookie("ElateralMSP", Cookie_Default_UserID, strVirDir, "");
				SetNamedSubCookie("ElateralMSP", Cookie_Default_RememberUserID, strVirDir, "No");
			}
		}
		else
		{
			//Forget value
			SetNamedSubCookie("ElateralMSP", Cookie_Default_UserID, strVirDir, "");
			SetNamedSubCookie("ElateralMSP", Cookie_Default_RememberUserID, strVirDir, "No");
		}
		
		if(objRememberPassword != null)
		{
			if(objRememberPassword.checked == true)
			{
				//Remember value
				SetNamedSubCookie("ElateralMSP", Cookie_Default_Password, strVirDir, strPassword);
				SetNamedSubCookie("ElateralMSP", Cookie_Default_RememberPassword, strVirDir, "Yes");
			}
			else
			{
				//Forget value
				SetNamedSubCookie("ElateralMSP", Cookie_Default_Password, strVirDir, "");
				SetNamedSubCookie("ElateralMSP", Cookie_Default_RememberPassword, strVirDir, "No");
			}
		}
		else
		{
			//Forget value
			SetNamedSubCookie("ElateralMSP", Cookie_Default_Password, strVirDir, "");
			SetNamedSubCookie("ElateralMSP", Cookie_Default_RememberPassword, strVirDir, "No");
		}
		
		if (strVirDir.toLowerCase() == "dcos" )
		{
			//append _Old
			var strUserIDLc = strUserID.toLowerCase();
			if (strUserIDLc > 4)
			{
				if (strUserIDLc.substring((strUserIDLc).length() - 4, 4).toLowerCase() != "_old")
				{
					SetControlValue("txtUserID", strUserID + "_Old");
				}
			}
			else
			{
				SetControlValue("txtUserID", strUserID + "_Old");
			}
		}
		
		if (strVirDir.toLowerCase() == "motorola" || strVirDir.toLowerCase() == "symbol")
		{
			//dont modify vendor login
			strCompanyIDLc = strCompanyID.toLowerCase();
			if (strCompanyIDLc == "motorola")
			{	
				//SetControlValue("txtCompanyID", "SYMBOL");
			}
			else if (strCompanyIDLc.substring(0, 9) != "motorola_")
			{
				SetControlValue("txtCompanyID", "MOTOROLA_" + strCompanyID);
			}
		}
		
		SubmitForm();
	}
		
	function SafeValue(strValue)
	{
		if(strValue == "undefined")
		{
			strValue = "";					
		}
		else if(strValue == null)
		{
			strValue = "";
		}
		
		return strValue;
	}	
		
	function LoginPageSetupForVirDir(strVirDir, strAllowRememberCompanyID, strAllowRememberUserID, strAllowRememberPassword)
	{
		if(strAllowRememberCompanyID == "True")
		{
			SetControlValue("txtCompanyID", SafeValue(GetNamedSubCookie("ElateralMSP", Cookie_Default_CompanyID, strVirDir)));
						
			if(GetNamedSubCookie("ElateralMSP", Cookie_Default_RememberCompanyID, strVirDir) != "No")
			{
				var objControl = SafeGetElementByID("chkRememberCompanyID");
					
				if(objControl != null)
				{
					objControl.checked = true;
				}
			}
		}
	
		if(strAllowRememberUserID == "True")
		{
			SetControlValue("txtUserID", SafeValue(GetNamedSubCookie("ElateralMSP", Cookie_Default_UserID, strVirDir)));
			
			if(GetNamedSubCookie("ElateralMSP", Cookie_Default_RememberUserID, strVirDir) != "No")
			{
				var objControl = SafeGetElementByID("chkRememberUserID");
					
				if(objControl != null)
				{
					objControl.checked = true;
				}
			}
		}
		
		if(strAllowRememberPassword == "True")
		{
			SetControlValue("txtPassword", SafeValue(GetNamedSubCookie("ElateralMSP", Cookie_Default_Password, strVirDir)));
			
			if(GetNamedSubCookie("ElateralMSP", Cookie_Default_RememberPassword, strVirDir) != "No")
			{
				var objControl = SafeGetElementByID("chkRememberPassword");
					
				if(objControl != null)
				{
					objControl.checked = true;
				}
			}
		}
	
		//Set the focus to the first control (company id text box).
		FocusFirstControl();
	}	
	
	function ResetQuickSearchAndFilters()
	{
		//Reset the search
		var strPage = GetControlValue("hdnCurrentPage");
		ClearControl(strPage + "_QS");
		
		//Reset the filters
		var x, strValue, strID;
		var nNumOfFilters	= GetControlValue("hdn_NumOfFilters");
		var strCurrentPage	= GetControlValue("hdnCurrentPage");
		for(x = 0; x <= nNumOfFilters; x++)
		{
			strID = "hdn_DefaultFilter_" + strCurrentPage + "_F_" + x
			strValue = GetControlValue(strID);
			SetControlValue(strCurrentPage + "_F_" + x, strValue);
		}
		
		//Submit the form
		SubmitQuickSearchAndFilters();
	}
	
	function SubmitSearchOrdersForm()
	{
		window.document.frmSearchOrdersForm.submit();
	}
	
	function SubmitSearchOfferingsForm()
	{
		var objListControl = SafeGetElementByID("InCat");
		var nListCount = objListControl.length;
		var x = 0;
		var strInstancesList = "";	
		for(x = 0; x < nListCount; x++)
		{
			var strValue = objListControl.options[x].value;
			strInstancesList += strValue + ",";			
		}
		strInstancesList = strInstancesList.substring(0, strInstancesList.length - 1);		
		SetControlValue("hdnSelectedCategories", strInstancesList);
		objListControl = SafeGetElementByID("InCam");
		nListCount = objListControl.length;
		x = 0;
		strInstancesList = "";	
		for(x = 0; x < nListCount; x++)
		{
			var strValue = objListControl.options[x].value;
			strInstancesList += strValue + ",";
		}
		strInstancesList = strInstancesList.substring(0, strInstancesList.length - 1);			
		SetControlValue("hdnSelectedCampaigns", strInstancesList);			
		//Trim the last comma
		window.document.frmSearchOfferingsForm.submit();
	}
	
	function SubmitQuickSearchAndFilters()
	{
		window.document.frmQuickSearchAndFilters.submit();
	}
		
	function SubmitQuickSearch()
	{
		window.document.frmQuickSearch.submit();
	}
	
	function ResetQuickSearch()
	{
		var strPage = GetControlValue("hdnCurrentPage");

		ClearControl(strPage + "_QS");

		SubmitQuickSearch();
	}
	
	function SubmitFilters()
	{
		window.document.frmFilters.submit();
	}
	
	function ResetFilters()
	{
		var x, strValue, strID;
		var nNumOfFilters	= GetControlValue("hdn_NumOfFilters");
		var strCurrentPage	= GetControlValue("hdnCurrentPage");
		for(x = 0; x <= nNumOfFilters; x++)
		{
			strID = "hdn_DefaultFilter_" + strCurrentPage + "_F_" + x
			strValue = GetControlValue(strID);
			SetControlValue(strCurrentPage + "_F_" + x, strValue);
		}
		
		window.document.frmFilters.submit();
	}
	
	function SubmitChangePassword()
	{
		var strOldPassword		= GetControlValue("txtOldPassword");
		var strNewPassword		= GetControlValue("txtNewPassword");
		var strConfirmPassword	= GetControlValue("txtConfirmNewPassword");
		
		//Check for old password
		if(strOldPassword.length < 1)
		{
			alert(Un("You must enter your old password before you can continue.", "Includes\JS\JS_Master.js"));
			ClearControl("txtOldPassword");
			FocusControl("txtOldPassword");
		}
		//Check for new password
		else if(strNewPassword.length < 6)
		{
			alert(Un("You must enter a new password of 6 or more characters before you can continue. (1)", "Includes\JS\JS_Master.js"));
			ClearControl("txtNewPassword");
			ClearControl("txtConfirmNewPassword");
			FocusControl("txtNewPassword");
		}
		//Check that the new password was confirmed correctly
		else if(strNewPassword != strConfirmPassword)
		{
			alert(Un("You did not confirm your new password correctly.", "Includes\JS\JS_Master.js"));
			ClearControl("txtNewPassword");
			ClearControl("txtConfirmNewPassword");
			FocusControl("txtNewPassword");
		}
		//Check that the new password has letters and numbers
		else if(!CheckPassword(strNewPassword))
		{	
			alert(Un("You must enter a valid password before you can continue. Passwords should contain letters and numbers and be at least 6 characters in length. (1)", "Includes\JS\JS_Master.js"));
			ClearControl("txtNewPassword");
			ClearControl("txtConfirmNewPassword");
			FocusControl("txtNewPassword");
		}
		//Everything ok, so submit the form
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitManageUsersChangePassword()
	{
		var strNewPassword		= GetControlValue("txtNewPassword");
		var strConfirmPassword	= GetControlValue("txtConfirmNewPassword");
		
		//Check for new password
		if(strNewPassword.length < 6)
		{
			alert(Un("You must enter a new password of 6 or more characters before you can continue. (2)", "Includes\JS\JS_Master.js"));
			ClearControl("txtNewPassword");
			ClearControl("txtConfirmNewPassword");
			FocusControl("txtNewPassword");
		}
		//Check that the new password was confirmed correctly
		else if(strNewPassword != strConfirmPassword)
		{
			alert(Un("You did not confirm your new password correctly. (1)", "Includes\JS\JS_Master.js"));
			ClearControl("txtNewPassword");
			ClearControl("txtConfirmNewPassword");
			FocusControl("txtNewPassword");
		}
		//Check that the new password has letters and numbers
		else if(!CheckPassword(strNewPassword))
		{	
			alert(Un("You must enter a valid password before you can continue. Passwords should contain letters and numbers and be at least 6 characters in length. (2)", "Includes\JS\JS_Master.js"));
			ClearControl("txtNewPassword");
			ClearControl("txtConfirmNewPassword");
			FocusControl("txtNewPassword");
		}
		//Everything ok, so submit the form
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitEditAddress(isUSUser)
	{
		SubmitAddAddress(isUSUser);
	}
	
	function SubmitAddAddress(isUSUser)
	{
		var strContactName	= GetControlValue("txtContactName");
		var strAddress1		= GetControlValue("txtAddress1");
		var strAddress3		= GetControlValue("txtAddress3");
		var strAddress4		= GetControlValue("txtAddress4");
		var strPostCode		= GetControlValue("txtPostCode");
		var strCountry		= GetControlValue("txtCountry");
		var strTelephone		= GetControlValue("txtTelephone");
		
		if(strContactName.length < 1)
		{
			alert(Un("You must enter a contact name for this address before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtContactName");
		}
		else if(strAddress1.length < 1)
		{
			alert(Un("You must enter the first line of this address before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtAddress1");
		}
		else if( (strAddress3.length < 1) && (isUSUser))
		{
			alert("You must enter the city part of this address before you can continue.");
			FocusControl("txtAddress3");
		}
		else if( (strAddress4.length < 1) && (isUSUser))
		{
			alert("You must enter the state part of this address before you can continue.");
			FocusControl("txtAddress4");
		}
		else if(strPostCode.length < 1)
		{
			alert(Un("You must enter the post code of this address before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtPostCode");
		}
		else if((strCountry.length < 1) && !isUSUser)
		{
			alert(Un("You must enter the country of this address before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtCountry");
		}
		else if((strTelephone.length < 1) && isUSUser)
		{
			alert("You must enter a telephone number before you can continue.");
			FocusControl("txtTelephone");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitEmailAddress()
	{
		var strEmail		= GetControlValue("txtEmail");

		//Check for email
		if(IsEmail(strEmail) == false)
		{
			alert(Un("You must enter a valid email address. (2)", "Includes\JS\JS_Master.js"));
			FocusControl("txtEmail");
		}
		//Everything ok, so submit the form
		else
		{
			SubmitForm();
		}
	}

	function SubmitMyCompanyProfile()
	{
		var strName	= GetControlValue("txtName");
		
		if(strName.length < 1)
		{
			alert(Un("You must enter the company name", "Includes\JS\JS_Master.js"));
			FocusControl("txtName");
		}
		else {				
			SubmitForm();
		}
	}

	function SubmitMyProfile()
	{
		var strFirstName	= GetControlValue("txtFirstName");
		var strSurname		= GetControlValue("txtSurname");
		var strEmail		= GetControlValue("txtEmail");
		
		//Check for first name
		if(strFirstName.length < 1)
		{
			alert(Un("You must enter the first name (2)", "Includes\JS\JS_Master.js"));
			FocusControl("txtFirstName");
		}
		//Check for surname
		else if(strSurname.length < 1)
		{
			alert(Un("You must enter the surname. (2)", "Includes\JS\JS_Master.js"));
			FocusControl("txtSurname");
		}
		//Check for email
		else if(IsEmail(strEmail) == false)
		{
			alert(Un("You must enter a valid email address. (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtEmail");
		}
		//Everything ok, so submit the form
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitAddProductionPartner()
	{
		var strProductionPartnerUID = GetControlValue("selProductionPartner");
		
		if(strProductionPartnerUID == "-1")
		{
			alert(Un("You must select a production partner from the list provided before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("selProductionPartner");
		}
		else
		{
			/*
			//Check Prices
			var nIndex;
			var nNumOfControls = document.MyForm.length;
			var objControl;
		
			for(nIndex = 0; nIndex < nNumOfControls; nIndex++)
			{
				objControl = document.MyForm[nIndex];
				
				if(objControl.type == "text")
				{
					
					var strName = objControl.name;
					var strValue = GetControlValue(strName);
					if(!IsPrice(strValue))
					{
						alert(Un("You must enter a valid price before you can continue.", "Includes\JS\JS_Master.js"));
						FocusControl(strName);
						return;
					}
				}
			}
			*/
			
			SubmitForm();
		}
	}
	

	
	function SubmitEditProductionPartner()
	{
		/*
		//Check Prices
		var nIndex;
		var nNumOfControls = document.MyForm.length;
		var objControl;
		
		for(nIndex = 0; nIndex < nNumOfControls; nIndex++)
		{
			objControl = document.MyForm[nIndex];
				
			if(objControl.type == "text")
			{
				var strName = objControl.name;
				var strValue = GetControlValue(strName);
				if(!IsPrice(strValue))
				{
					alert(Un("You must enter a valid price before you can continue. (1)", "Includes\JS\JS_Master.js"));
					FocusControl(strName);
					return;
				}
			}
		}
		*/
	
		SubmitForm();
	}
	
	function SubmitCreateCategory()
	{
		var strName	= GetControlValue("txtName");
		
		if(strName.length < 1)
		{
			alert(Un("You must select a name for this category before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtName");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitCreateCampaigns()
	{
		var strName			= GetControlValue("txtName");
		var strThumbnail	= GetControlValue("fileThumbnail");
		
		strThumbnail = strThumbnail.toLowerCase();
		
		if(strName.length < 1)
		{
			alert(Un("You must select a name for this campaign before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtName");
		}
		else if((strThumbnail.length > 0) && ((strThumbnail.indexOf(".gif") == -1) && (strThumbnail.indexOf(".jpg") == -1)))
		{
			alert(Un("You must select a valid thumbnail image before you can continue. Images must be in either gif or jpg format. (1)", "Includes\JS\JS_Master.js"));	
			FocusControl("fileThumbnail");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitEditCampaigns()
	{
		var strName			= GetControlValue("txtName");
		var strThumbnail	= GetControlValue("fileThumbnail");
		
		strThumbnail = strThumbnail.toLowerCase();
		
		if(strName.length < 1)
		{
			alert(Un("You must select a name for this campaign before you can continue. (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtName");
		}
		else if((strThumbnail.length > 0) && ((strThumbnail.indexOf(".gif") == -1) && (strThumbnail.indexOf(".jpg") == -1) && (strThumbnail.indexOf(".png") == -1)))
		{
			alert(Un("You must select a valid thumbnail image before you can continue. Images must be in either gif or jpg format. (2)", "Includes\JS\JS_Master.js"));	
			FocusControl("fileThumbnail");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitEditCategory()
	{
		var strName	= GetControlValue("txtName");
		
		if(strName.length < 1)
		{
			alert(Un("You must select a name for this category before you can continue. (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtName");
		}
		else
		{
			SubmitForm();
		}
	}
	
	
		
	function AddCheckers()
	{
		AddListItem();
	}
	
	function RemoveCheckers()
	{
		RemoveListItem();
	}
	
	function AddListItem()
	{
		SetControlValue("hdnEditType", "Add");
		SubmitForm();
	}
	
	function RemoveListItem()
	{
		SetControlValue("hdnEditType", "Remove");
		SubmitForm();
	}
	
	function SubmitAssignToTesting()
	{
		//Check that at least one tester has been selected
		
		var nNumOfTesters = GetControlValue("hdnNumOfTesters");
		
		//nNumOfTesters = nNumOfTesters.toInteger();
		
		if(nNumOfTesters == 0)
		{
			alert(Un("You must select at least one tester before this document can be put into testing.", "Includes\JS\JS_Master.js"));
		}
		else
		{
			SetControlValue("hdnEditType", "");
			SubmitForm();
		}
	}
	
	function AddTesters()
	{
		SetControlValue("hdnEditType", "Add");
		SubmitForm();
	}
	
	function RemoveTesters()
	{
		SetControlValue("hdnEditType", "Remove");
		SubmitForm();
	}
	
	function ValidateExtraFieldOptionEditable(myForm)
	{
		//F381 - SPB 21/09/09
		if(myForm.chkfEditable.checked == 1)
		{
			if(myForm.chkfVisibleToOrderer.checked == 0)
			{
				myForm.chkfVisibleToOrderer.checked = 1;
			}
		}
		else if(myForm.chkfEditable.checked == 0 && myForm.chkDefaultFromProject.checked == 0 && myForm.txtDefault.value == '' && myForm.chkfRequired.checked == 1)
		{
			myForm.chkfEditable.checked = 1;
		}
		return
	}
	
	function ValidateExtraFieldOptionVisibleToOrderer(myForm)
	{
		//F381 - SPB 21/09/09
		if(myForm.chkfVisibleToOrderer.checked == 0)
		{
			if(myForm.chkfEditable.checked == 1) 
			{
				myForm.chkfVisibleToOrderer.checked = 1;
				return;
			}
			else if(myForm.chkfRequired.checked == 1 && myForm.chkDefaultFromProject.checked == 0 && myForm.txtDefault.value == '')
			{
				myForm.chkfVisibleToOrderer.checked = 1;
				return;
			}
		}
	}
	
	function ValidateExtraFieldOptionRequired(myForm)
	{
		//F381 - SPB 21/09/09
		if(myForm.chkfRequired.checked == 1 && myForm.chkDefaultFromProject.checked == 0 && myForm.txtDefault.value == '') 
		{
			if(myForm.chkfVisibleToOrderer.checked == 0)
			{
				myForm.chkfVisibleToOrderer.checked = 1;
			}
			if(myForm.chkfEditable.checked == 0)
			{
				myForm.chkfEditable.checked = 1;
			}
			return;
		}
	}
	
	function ValidateExtraFieldOptionDefault(myForm)
	{
		//F381 - SPB 21/09/09
		if(myForm.chkfRequired.checked == 1 && myForm.txtDefault.value == '' && myForm.chkDefaultFromProject.checked == 0)
		{
			if(myForm.chkfVisibleToOrderer.checked == 0)
			{
				myForm.chkfVisibleToOrderer.checked = 1;
			}
			if(myForm.chkfEditable.checked == 0)
			{
				myForm.chkfEditable.checked = 1;
			}
			return;
		}
	}
	
	function ValidateExtraFieldOptionDefaultFromProject(myForm)
	{
		//F381 - SPB 21/09/09
		if(myForm.chkDefaultFromProject.checked == 0 && myForm.chkfRequired.checked == 1 && myForm.txtDefault.value == '')
		{
			if(myForm.chkfVisibleToOrderer.checked == 0)
			{
				myForm.chkfVisibleToOrderer.checked = 1;
			}
			if(myForm.chkfEditable.checked == 0)
			{
				myForm.chkfEditable.checked = 1;
			}
			return;
		}
	}
	
	function SubmitAddExtraField()
	{
		var strLabel			= GetControlValue("txtLabel");
		var strType				= GetControlValue("selType");
		var strInstructions		= GetControlValue("txtInstructions");
		
		if(strLabel.length < 1)
		{
			alert(Un("You must enter a label for this extra field before you can continue. Please try again.", "Includes\JS\JS_Master.js"));
		}
		else if(strInstructions.length > 2000)
		{
			alert(Un("You may only enter up to 2000 characters for the instructions. Please try again.", "Includes\JS\JS_Master.js"));
		}
		else if(strType == "-1")
		{
			alert(Un("You must select a type for this extra field before you can continue. Please try again.", "Includes\JS\JS_Master.js"));
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitEditExtraField()
	{
		SubmitAddExtraField();
	}
	
	
	function SubmitAssignGroups()
	{		
		SubmitForm();
	}
	
	function SubmitUploadNow()
	{
		var x, y, nNumOfElements;
		var nNumOfForms = document.forms.length;
		//upload file
		var strCSVFile = GetControlValue('CSVFile');
		if(strCSVFile == '')
			alert(Un('You must select a file to upload.','Includes\JS\JS_Master.js'));
		else
		{
			SetControlValue('hdnUploadNow','1')
			SubmitForm();
			return;
		}
	}

	function SubmitUploadNow2()
	{
		var x, y, nNumOfElements;
		var nNumOfForms = document.forms.length;
		//upload file
		var strCSVFile = GetControlValue('CSVFile');
		if(strCSVFile == '')
			alert(Un('You must select a file to upload.','Includes\JS\JS_Master.js'));
		else
		{
			SubmitForm();
			return;
		}
	}
	
	function UploadFirstWarning()
	{
		alert(Un('Please select a file to upload, then click on Upload Now, before continuing.','Includes\JS\JS_Master.js'));
	}	
	
	function SubmitAssignGroupsAtLeastAndUpload(strID)
	{
		var x, y, nNumOfElements;
		var nNumOfForms = document.forms.length;
		//Get Radio Entry
		var bGroups = false;
		for(x = 0; x < nNumOfForms; x++)
		{
			nNumOfElements = document.forms[x].elements.length;
			
			for(y = 0; y < nNumOfElements; y++)
			{
				if(document.forms[x].elements[y].name == 'radList' && document.forms[x].elements[y].value == 'CHOOSE_GROUPS' && document.forms[x].elements[y].checked == true)								
				{					
					bGroups = true;				
				}
			}
		}		
		if(bGroups) {		
			for(x = 0; x < nNumOfForms; x++)
			{
				nNumOfElements = document.forms[x].elements.length;
				
				for(y = 0; y < nNumOfElements; y++)
				{	
					if(document.forms[x].elements[y].name == strID)
					{	
						if(document.forms[x].elements[y].checked == true) 
						{
							SubmitForm();
							return;
						}
					}
				}
			}
			alert(Un('You must select at least 1 group to continue.', 'Includes\JS\JS_Master.js'));		
		}
		else
		{
			//upload file
			if(SafeGetElementByID('CSVFile').value == '') {
				SubmitForm();
				return;				
			}
			else
			{
				alert(Un('Clicking the upload button to upload the selected file before continuing','Includes\JS\JS_Master.js'));
			}
				
		}
	}
	
	function SubmitQuickSearchForm() 
	{
		var strName	= GetControlValue("txtSearch");
		var strType	= GetControlValue("selSearchFormat");
		SetCookie('SEARCH_PANEL_OFFERING',strName);
		SetCookie('SEARCH_PANEL_TYPE',strType);
		window.document.MySearchForm.submit();
	}
	
	function SubmitAssignGroupsAtLeast(strID)
	{
		var x, y, nNumOfElements;
		var nNumOfForms = document.forms.length;
		
		for(x = 0; x < nNumOfForms; x++)
		{
			nNumOfElements = document.forms[x].elements.length;
			
			for(y = 0; y < nNumOfElements; y++)
			{	
				if(document.forms[x].elements[y].name == strID)
				{	
					if(document.forms[x].elements[y].checked == true) 
					{
						SubmitForm();
						return;
					}
				}
			}
		}
	}
		
	function SubmitAssignGroupsCalculate()
	{
		SetControlValue('hdnCalculateNow','1');
		SubmitForm();
	}			
	
	function SubmitAssignCategories()
	{
		SubmitForm();
	}
	
	function SubmitCreateOutputSpec()
	{
		var strName	= GetControlValue("txtName");
		
		if(strName.length < 1)
		{
			alert(Un("You must select a name for this output spec before you can continue.", "Includes\JS\JS_Master.js"));
			FocusControl("txtName");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function SubmitEditOutputSpecDetails()
	{
		var strName	= GetControlValue("txtName");
		if(strName.length < 1)
		{
			alert(Un("You must select a name for this output spec before you can continue. (1)", "Includes\JS\JS_Master.js"));
			FocusControl("txtName");
		}
		else
		{
			SubmitForm();
		}
	}
	
	function GetControlValue(strID)
	{
		//All Browsers
		//IMK Change 29/1/2002
		var objControl = SafeGetElementByID(strID);

		if(objControl != null)
		{
			//Netscape 4.7 handles selects differently - IMK 08/04/2002..
			var isNS4 = (document.layers) ? true : false;
			
			//alert(document.layers);
			//alert(document.forms.length);
			if(isNS4) {
				if(objControl.type == "select-one") {
					for (var i = objControl.selectedIndex; i < objControl.options.length; i++) {
						if (objControl.options[i].selected) {
							return(objControl.options[i].value);
						}
					}
				}
			}
			if(objControl.type == "radio")			
			{
				var x, y, nNumOfElements;
				var nNumOfForms = document.forms.length;
				for(x = 0; x < nNumOfForms; x++) {
					nNumOfElements = document.forms[x].elements.length;				
					for(y = 0; y < nNumOfElements; y++) {							
						if(document.forms[x].elements[y].name == strID &&
							document.forms[x].elements[y].type == "radio" ||
							document.forms[x].elements[y].type == "select-one") {
							if(document.forms[x].elements[y].checked == true) {
								return document.forms[x].elements[y].value;					
							}
						}
					}
				}
			}
			else
			{
				return objControl.value;
			}
		}
		else
		{
			return "";
		}
	}
	
	function GetControlCheck(strID)
	{
		//All Browsers
		//IMK Change 29/1/2002
		var objControl = SafeGetElementByID(strID);
					
		if(objControl != null)
		{
			if(objControl.type == "radio")			
			{
				var x, y, nNumOfElements;
				var nNumOfForms = document.forms.length;
				for(x = 0; x < nNumOfForms; x++) {
					nNumOfElements = document.forms[x].elements.length;				
					for(y = 0; y < nNumOfElements; y++) {							
						if(document.forms[x].elements[y].name == strID &&
							document.forms[x].elements[y].type == "radio") {
							if(document.forms[x].elements[y].checked == true) {
								return document.forms[x].elements[y].checked;					
							}
						}
					}
				}
			}
			else
			{
				return objControl.checked;
			}
		}
		else
		{
			return false;
		}
	}
	
	function OldGetControlValue(strID)
	{
		if(document.layers)
		{
			//Netscape 4.x
			
			var x, y, nNumOfElements;
			var nNumOfForms = document.forms.length;
			
			for(x = 0; x < nNumOfForms; x++)
			{
				nNumOfElements = document.forms[x].elements.length;
				
				for(y = 0; y < nNumOfElements; y++)
				{
					if(document.forms[x].elements[y].name == strID)
					{
						return document.forms[x].elements[y].value;
					}
				}
			}
		}
		else
		{
			//All IEs, Netscape 6.x+
			
			if(document.getElementById(strID) != null)
			{
				if(document.getElementById(strID).type == "radio")
				{
					var isNS4 = (document.layers) ? true : false;
					var isIE4 = (document.all && !document.getElementById) ? true : false;
					var isIE5 = (document.all && document.getElementById) ? true : false;
					var isNS6 = (!document.all && document.getElementById) ? true : false;					
					var radCol;
					if (isIE4) {
						radCol = document.all[strID];
					}
					else if (isIE5 || isNS6) {
						radCol = document.getElementById(strID);
					}
					var nIndex = 0;
					for(nIndex = 0; nIndex < radCol.length; nIndex++)
					{
						if(radCol[nIndex].checked == true)
						{
							return radCol[nIndex].value;
						}
					}
					return "";
				}
				else
				{
					return document.getElementById(strID).value;
				}
			}
			else
			{
				return "";
			}
		}
	}

	
	function SetControlValue(strID, strValue)
	{
		if(document.layers)
		{
			//Netscape 4.x
			
			var x, y, nNumOfElements;
			var nNumOfForms = document.forms.length;
			
			for(x = 0; x < nNumOfForms; x++)
			{
				nNumOfElements = document.forms[x].elements.length;
				
				for(y = 0; y < nNumOfElements; y++)
				{
					if(document.forms[x].elements[y].name == strID)
					{
						document.forms[x].elements[y].value = strValue;
						return;
					}
				}
			}
		}
		else
		{
			//All IEs, Netscape 6.x+
			var obj = getElementByIdCompatible(strID);
			if(obj != null)
			{
				obj.value = strValue;
			}
			else
			{
				//alert("Null ID: '" + strID + "'");
			}
		}
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
	
	function addLoadEvent(func) 
	{	
		var oldonload = window.onload;
		if(typeof window.onload != "function")
		{
			window.onload = func;
		}
		else
		{		
			window.onload = function() { oldonload(); func();}
		}
	}
	
	function SubmitForm()
	{
		window.document.MyForm.submit();
	}
	
	function ClearControl(strID)
	{
		SetControlValue(strID, "")
	}
	
	function FocusControl(strID)
	{
		SafeGetElementByID(strID).focus();
		if(SafeGetElementByID(strID).type == "text")
		{
			SafeGetElementByID(strID).select();
		}
	}
	
	function ShowControl(strID)
	{
		SafeGetElementByID(strID).style.display = "";
	}
	
	function HideControl(strID)
	{
		SafeGetElementByID(strID).style.display = "none";
	}
	
	function ExtraField_DefaultTextVisible()
	{
		if(!isOldNetscape)
		{
			var EXTRAFIELD_TEXTBOX		= 0;
			var EXTRAFIELD_TEXTAREA		= 1;
			var EXTRAFIELD_ATTACHMENT	= 2;
	
			var nAttachmentType = GetControlValue("selType");
		
			if(nAttachmentType == EXTRAFIELD_ATTACHMENT)
			{
				SafeGetElementByID("chkfEditable").disabled=true;
				HideControl("DefaultTextInput");
				ShowControl("DefaultTextInputDisabled");
			}
			else
			{
				SafeGetElementByID("chkfEditable").disabled=false;
				HideControl("DefaultTextInputDisabled");
				ShowControl("DefaultTextInput");
			}
		}
	}
	
	
	//**************************************************************
	//* Navigation Panel Functions
	//**************************************************************

	function ToggleMenuItem(strItemName)
	{		
		if (SafeGetElementByID("Item" + strItemName).style.display == "none")
		{ 
			ExpandItem(strItemName);
		}
		else
		{
			CollapseItem(strItemName)
		}
	}
	
	function CollapseItem(strItemName)
	{
		if(SafeGetElementByID("Item" + strItemName) != null)
		{
			SafeGetElementByID("Item" + strItemName).style.display = "none";
			SafeGetElementByID("Image" + strItemName).src = "/images/bridgehead/plus.gif";
			SetNamedSubCookie("ElateralMSP", Cookie_ActiBrand_NavBarPlugin, strItemName, "Collapsed");
		}
	}
	
	
	function ExpandItem(strItemName)
	{
		if(SafeGetElementByID("Item" + strItemName) != null)
		{
			SafeGetElementByID("Item" + strItemName).style.display = "";
			SafeGetElementByID("Image" + strItemName).src = "/images/bridgehead/minus.gif";
			SetNamedSubCookie("ElateralMSP", Cookie_ActiBrand_NavBarPlugin, strItemName, "Expanded");
		}
	}

	function SetNavState()
	{
		var varNavSubCookie = GetSubCookie("ElateralMSP", Cookie_ActiBrand_NavBarPlugin);
		var str = "";
		var strName = "";
		var strValue = "";
		var nPos = 0;
		if(varNavSubCookie!=null)
		{
			varNavSubCookie = varNavSubCookie.split("|");		
			for(x=0;x<varNavSubCookie.length;x+=2)
			{
				strName = varNavSubCookie[x];
				str = varNavSubCookie[x+1];
				if(str == "Expanded")
				{
					ExpandItem(strName)
				}
			}
		}
	}

	//**************************************************************
	//* Cookie Functions
	//**************************************************************

	function SetCookie(strName, strValue)
	{
		var nowDate = new Date();
		var strExpires = "";

		nowDate.setMonth(nowDate.getMonth() + 12);
		strExpires = nowDate.toGMTString();

		//alert("Before: " + strValue);		
		strValue = escape(strValue);
		
		document.cookie = strName + "=" + strValue + ";path=/;expires=" + strExpires;
		//alert("After: " + GetCookie(strName));
	}

	function SetSubCookie(strName, nIndex, strValue)
	{
		//get the existing cookie
		var varValue = GetCookie(strName);
		var strNewVale = "";
		var n = 0;
		if(varValue!=null)
		{
			varValue = varValue.split(";");
			varValue[nIndex] = strValue;  
			strNewValue = varValue.join(";");
			
			SetCookie(strName, strNewValue);
		}
	}
	
	//format would be
	//CookieName=name1|value1;name2|value2;
	function SetNamedSubCookie(strName, nIndex, strSubName, strValue)
	{
		//get the existing cookie
		var varSubValue = GetSubCookie(strName, nIndex);

		var strNewVale = "";
		var fSet = false;
		var n = 0;
		if(varSubValue==null)
		{
			varSubValue = "";
		}
		
		//is there a named entry already - if so replace
		if(varSubValue.length!=0)
		{
			varSubValue = varSubValue.split("|");
						
			for(n=0; n<varSubValue.length; n+=2)
			{
				if(varSubValue[n]==strSubName)
				{
					varSubValue[n+1] = strValue;
					fSet = true;
					break;
				}
			}
		}
		if(!fSet)
		{
			//didn't find a match so add one
			if(varSubValue.length==0)
			{
				varSubValue = Array();
				varSubValue[0] = strSubName;
				varSubValue[1] = strValue;
			}
			else
			{
				varSubValue[varSubValue.length] = strSubName;
				varSubValue[varSubValue.length] = strValue;
			}
		}
		
		strNewValue = varSubValue.join("|");
		
		SetSubCookie(strName, nIndex, strNewValue);
	}

	function GetNamedSubCookie(strName, nIndex, strSubName)
	{
		var varValue = GetSubCookie(strName, nIndex);
		var n = 0;
		if(varValue != null)
		{
			//make an array
			varValue = varValue.split("|");
			for(n=0; n < varValue.length; n+=2)
			{
				if(varValue[n] == strSubName)
				{
					var strValue = varValue[n+1];
					
					
					
					return strValue;
				}
			}
			
			return "";
		}
	}

	function GetSubCookie(strName, nIndex)
	{
		var varValue = GetCookie(strName);
		if(varValue!=null)
		{
			//make an array
			varValue = varValue.split(";");
			return varValue[nIndex];
		}
	}

	function GetCookie(strName)
	{
		var strValue = document.cookie;
		var nStart = strValue.indexOf(" " + strName + "=");
		
		if (nStart == -1)
		{
			nStart = strValue.indexOf(strName + "=");
		}
		
		if (nStart == -1)
		{
			strValue = "";
		}
		else
		{
			nStart = strValue.indexOf("=", nStart) + 1;
			var nEnd = strValue.indexOf(";", nStart);
			if (nEnd == -1)
			{
				nEnd = strValue.length;
			}
			
			strValue = unescape(strValue.substring(nStart, nEnd));
		}
		
		return strValue;
	}

	function GetAllCookies(strNamePrefix)
	{
		var arrCookies = new Array();
		var nCount = 0;
		var strCookies = document.cookie;
		var nStart = 1;
		var nEnd = 0;
		var strName = "";
		
		while(nStart >= 0)
		{		
			nStart = strCookies.indexOf(" " + strNamePrefix, nStart);
			nEnd = strCookies.indexOf("=", nStart);
				
			strName = strCookies.substring(nStart,nEnd);
			arrCookies[nCount] = strName + "|" + GetCookie(strName);
			nCount++;
			
			if(nStart!=-1)
			{
				nStart++;
			}
		}
		
		return arrCookies;
	}

	//**************************************************************
	//* Helper Functions
	//**************************************************************
	
	function LoginPageSetup(strAllowRememberCompanyID, strAllowRememberUserID, strAllowRememberPassword)
	{
		LoginPageSetupForVirDir("Default", strAllowRememberCompanyID, strAllowRememberUserID, strAllowRememberPassword)
	}
	
	function ShowNewWindowCentredNoScroll(URL, lWidth, lHeight)
	{
		var lLeft = 0, lTop = 0;
		var objWin;
		lLeft = (screen.width - lWidth) / 2;
		lTop = (screen.height - lHeight) / 2;
				
		objWin = window.open(URL,'MyWindow','left=' + lLeft.toString() + ',top=' + lTop.toString() + ',width=' + lWidth.toString() + ',height=' + lHeight.toString() + ',resizable=yes,scrollbars=no'); 
		objWin.focus();
	}
	
	function ShowNewWindowCentred(URL, lWidth, lHeight)
	{
		var lLeft = 0, lTop = 0;
		var objWin;
		lLeft = (screen.width - lWidth) / 2;
		lTop = (screen.height - lHeight) / 2;
				
		objWin = window.open(URL,'MyWindow','left=' + lLeft.toString() + ',top=' + lTop.toString() + ',width=' + lWidth.toString() + ',height=' + lHeight.toString() + ',resizable=yes,scrollbars=yes'); 
		objWin.focus();
	}
	
	function ShowNewWindowCentred2(URL, lWidth, lHeight)
	{
		var lLeft = 0, lTop = 0;
		var objWin;
		lLeft = (screen.width - lWidth) / 2;
		lTop = (screen.height - lHeight) / 2;
				
		objWin = window.open(URL,'MyWindow','left=' + lLeft.toString() + ',top=' + lTop.toString() + ',width=' + lWidth.toString() + ',height=' + lHeight.toString() + ',resizable=yes,scrollbars=yes,toolbar=yes,menubar=yes,status=yes'); 
		objWin.focus();
	}
	
	function NewWindow(URL)
	{
		ShowNewWindowCentred(URL, 780, 580);
	}
	
	function FocusFirstControl()
		{
		// if(!isOldNetscape) { window.document.forms[0].elements[0].focus(); };
		if (j$("form").length > 0){ j$("form").eq(0).find("input[type!=hidden]").eq(0).focus(); };
		};
	
	function CheckPassword(strPassword)
	{
		var i = 0;
		var fSet1Found = false;
		var fSet2Found = false;
		var strCurrentChar = "";
		var strSet1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";	//Valid character set 1
		var strSet2 = "1234567890";												//Valid character set 1
		var nPos = -1;
		
		if (strPassword.length < 6)
		{
			return false;
		}
							  
		for(i = 0; i < strPassword.length; i++)
		{
			strCurrentChar = strPassword.charAt(i);
			if(strSet1.indexOf(strCurrentChar) > -1)
			{
				fSet1Found = true;
			}
				
			if(strSet2.indexOf(strCurrentChar) > -1)
			{
				fSet2Found = true;
			}
				
			if(fSet1Found && fSet2Found)
			{
				return true
			}
		} 

		return false;
	}
	
	function CheckUserID(strUserID)
	{
		var i = 0;
		var fSetFound = false;
		var strCurrentChar = "";
		var strSet1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";	//Valid character set 1
		var strSet2 = "1234567890";												//Valid character set 1
		var nPos = -1;
		
		if (strUserID.length < 6)
		{
			return false;
		}
							  
		for(i = 0; i < strUserID.length; i++)
		{
			fSetFound = false
			strCurrentChar = strUserID.charAt(i);
			if(strSet1.indexOf(strCurrentChar) > -1)
			{
				fSetFound = true;
			}
				
			if(strSet2.indexOf(strCurrentChar) > -1)
			{
				fSetFound = true;
			}
				
			if(fSetFound != true)
			{
				return false
			}
		} 
		return true;
	}
	
	function SetControlValueInOpener(strID, strValue)
	{
		if(document.layers)
		{
			//Netscape 4.x
			
			var x, y, nNumOfElements;
			var nNumOfForms = self.opener.document.forms.length;
			
			for(x = 0; x < nNumOfForms; x++)
			{
				nNumOfElements = self.opener.document.forms[x].elements.length;
				
				for(y = 0; y < nNumOfElements; y++)
				{
					if(self.opener.document.forms[x].elements[y].name == strID)
					{
						self.opener.document.forms[x].elements[y].value = strValue;
						return;
					}
				}
			}
		}
		else
		{
			//All IEs, Netscape 6.x+
			var elem = self.opener.document.getElementById(strID);
			if (elem)
			{
				elem.value = strValue;
			}
		}
	}
	
	function SelectDelegate(strVendorUserUID)
	{
		SetControlValueInOpener("hdnVendorUserUID", strVendorUserUID);
		SetControlValueInOpener("hdnHint", "SELECTUSER");
		
		self.opener.document.MyForm.submit();
		window.close();
	}
	
	function SelectChecker(strVendorUserUID, strCheckerUID, strHint)
	{
		SetControlValueInOpener("hdnVendorUserUID", strVendorUserUID);
		SetControlValueInOpener("hdnCheckerUID", strCheckerUID);
		SetControlValueInOpener("hdnHint", strHint);
		
		self.opener.document.MyForm.submit();
		window.close();
	}
	
	function SelectAddress(strAddressUID, strControl)
	{
		SetControlValueInOpener(strControl, strAddressUID);
		SetControlValueInOpener("hdnHint", "SelectAddress");
		
		self.opener.document.MyForm.submit();
		window.close();
	}
	
	function SetAddress(strAddressUID, strControl)
	{
		SetControlValueInOpener(strControl, unescape(strAddressUID));
		window.close();
	}
	
	function SetUser(strUserName, strUserLogonUID, strDisplayElement, strValueControl, strDisplayControl)
	{
		SetControlValueInOpener(strValueControl, unescape(strUserLogonUID));
		SetControlValueInOpener(strDisplayControl, unescape(strUserName));
		
		if(document.layers)
		{
			//Netscape 4.x
			SetControlValueInOpener(strDisplayElement, unescape(strUserName));
		}
		else
		{
			self.opener.document.getElementById(strDisplayElement).innerHTML = unescape(strUserName);
		}
		
		window.close();
	}
	
	function SelectTestData(strUID, strControl)
	{
		SetControlValueInOpener(strControl, strUID);
		SetControlValueInOpener("hdnHint", strControl);
		SetControlValueInOpener("BypassOverridables", "1");		
		self.opener.document.MyForm.submit();
		window.close();	
	}
	
	function SelectAssetProfile(strAssetName, strUID, strControl,strUID2)
	{
		SetControlValueInOpener("AssetName", strAssetName);
		SetControlValueInOpener(strControl, strUID);
		SetControlValueInOpener("hdnHint", strControl);
		SetControlValueInOpener("AssetUID", strUID2);
		
		self.opener.document.MyForm.submit();
		
		window.close();
	}
	
	function SetMyProfileAssetProfile(strControl,strUID)
	{
		SetControlValueInOpener(strControl, strUID);
		window.close();
	}	
		
	function SelectDefaultVendor(strUID) 
	{
		SetControlValue("VendorUID",strUID);
		SetControlValue("hdnHint","VendorUID");
		SubmitForm();
	}

	function SelectDefaultDivision(strUID) 
	{
		SetControlValue("hdnHint","DivisionUID");
		SetControlValue("DivisionUID",strUID);
		SubmitForm();		
	}	
	
	function CloseWindow()
	{
		window.close();
	}
	
	function BuildingAlert()
	{
		alert(Un("This job is being built. Please refresh page to update the status.", "Includes\JS\JS_Master.js"));
	}
	
	function ReportAlert()
	{
		alert(Un("You did not order this Branded Email, therefore you don't have the authority to view the report.", "Includes\JS\JS_Master.js"));
	}		
	
	function ReportMultiDocAlert()
	{
		alert(Un("You did not order this Multi Document, therefore you don't have the authority to view the report.", "Includes\JS\JS_Master.js"));
	}		
	
	function ReportAlertSelfService()
	{
		alert(Un("You did not order this Self Service, therefore you don't have the authority to view the report.", "Includes\JS\JS_Master.js"));
	}	
		
	function ShowItem(id, show)
	{
		if(show)
		{
			document.getElementById(id).style.display="";
		}
		else
		{
			document.getElementById(id).style.display="none";
		}				
	}
			
	function AddOption(srcId, dstId)
	{
		if(document.getElementById(srcId).selectedIndex==-1)
		{
			//auto select top item
			if(document.getElementById(srcId).options.length>0)
			{
				document.getElementById(srcId).selectedIndex = 0;	
			}
			else
			{
				alert("There are no items to move");
				return;
			}
		}
		var srcOption = document.getElementById(srcId).options[document.getElementById(srcId).selectedIndex];
		var newOption = new Option(srcOption.text, srcOption.value);
		document.getElementById(srcId).options[document.getElementById(srcId).selectedIndex] = null;
		document.getElementById(dstId).options.add(newOption, 0);
	}
			
	function AddAll(srcId, dstId)
	{
		while(document.getElementById(srcId).options.length)
		{
			var srcOption = document.getElementById(srcId).options[0];
			var newOption = new Option(srcOption.text, srcOption.value);
			document.getElementById(srcId).options[0] = null;
			document.getElementById(dstId).options.add(newOption, 0);
		}
	}
	
	function ToggleSearchControls(showSearchOrders)
	{
		if(!showSearchOrders)
		{
			document.getElementById("SearchOrders").style.display='none';
			document.getElementById("SearchOfferings").style.display='';
			
			SetSubCookie("ElateralMSP", Cookie_ActiBrand_SearchControls, "ShowOfferings");
		}
		else
		{
			document.getElementById("SearchOrders").style.display='';
			document.getElementById("SearchOfferings").style.display='none';
			
			SetSubCookie("ElateralMSP", Cookie_ActiBrand_SearchControls, "ShowOrders");
		}
	}	
	/*Character count*/

	/*General position finding functions*/
	function findPosXIR(obj)
	{
		var curleft = 0;
		if (obj.offsetParent)
		{
			while (obj.offsetParent)
			{
				curleft += obj.offsetLeft
				obj = obj.offsetParent;
			}
		}
		else if (obj.x)
			curleft += obj.x;
		return curleft;
	}
	 
	function findPosYIR(obj)
	{
		var curtop = 0;
		if (obj.offsetParent)
		{
			while (obj.offsetParent)
			{
				curtop += obj.offsetTop
				obj = obj.offsetParent;
			}
		}
		else if (obj.y)
			curtop += obj.y;
		return curtop;
	}
		
	/*Character count functions*/
	var showCharacterCountCountdown = 10;
	function showCharacterCountIR(input, show, maxLength)
	{
		var divId = "CharacterCount";
				
		var div = document.getElementById(divId);
		if (show)
		{
			var remaining = maxLength - input.value.length;
			if (remaining < 0)
			{
				remaining = 0;
			}
			if (remaining <= 5000)
			{
				div.className =  'CharacterCountShow';
				div.innerHTML = remaining;
				div.style.left = findPosXIR(input) + input.offsetWidth;
				div.style.top = findPosYIR(input);
			}
		}
		else
		{
			div.className =  'CharacterCount';
		}
	}
			
	function characterCountIR(e, input, maxLength)
	{
		var keyChar = GetEventKeyIR(e); 
		var keyCode = GetEventKeyCodeIR(e);
		//alert(keyCode);
		if (maxLength==0)
		{
			return;
		}
		if (input == null)
		{
			return;
		}
		showCharacterCountCountdown = 10;	
		showCharacterCountIR(input, true, maxLength);
		hideCharacterCountIR(input.id);
		if (input.value.length >= maxLength)
		{
			//let cursor keys occur, page up page down
			if (keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40 || keyCode == 33 || keyCode == 34) 
			{
				return true;
			}
			else
			{
				input.value = input.value.substr(0, maxLength);
				return false;
			}
			
		}
	}
	
	function GetEventKeyIR(e) { 
			var keyChar = ""; 
			if (navigator.appName == "Netscape") { 
					keyChar = String.fromCharCode(e.which);         
			} else { 
					keyChar = String.fromCharCode(e.keyCode);         
			} 
			return keyChar; 
	} 

	function GetEventKeyCodeIR(e) { 
			var keyCode = ""; 
			if (navigator.appName == "Netscape") { 
					keyCode = e.which;         
			} else { 
					keyCode = e.keyCode;         
			} 
			return keyCode; 
	} 
			
	function hideCharacterCountIR(id)
	{
		if (showCharacterCountCountdown > 0)
		{
			showCharacterCountCountdown -= 1;
			setTimeout("hideCharacterCountIR('" + id + "')", 1000);
		}
		else
		{
			showCharacterCountIR(id, false, 0);
		}
				
	}
	
function GetEventKey(e)
{
	return String.fromCharCode(GetEventKeyCode(e)); 
} 

function GetEventKeyCode(e)
{
	return (e.which) ? e.which : e.keyCode;
}

function GetTagName(e)
{
	return (e.target) ? e.target.type : e.srcElement.tagName; 
}
function GetTagType(e)
{
	return (e.target) ? e.target.type : e.srcElement.type; 
}

function CheckSubmit(e, submitJS)
{
	var keyChar = GetEventKey(e); 
    var keyCode = GetEventKeyCode(e);
	var tag = GetTagName(e).toLowerCase();
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
					eval(submitJS);
					return false;
					break;
			}
			break;
		default:
	}
	
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
	}
}


/*End Character Count*/

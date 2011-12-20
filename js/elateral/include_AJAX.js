var g_ScriptStarting = true;
var g_FadeSpeed = 500;
var g_previewResponseGUID = '';
var g_objAJAXRequest = null;
var g_previewImage = null;
var g_previewLinkSrc = '';
var g_previewBtn = null;

if (j$.type(failedHTML) == 'undefined')	
	var failedHTML = "\<div class=\"Error f1\">\<h1\>Error\</h1\>\<h3\>An error occured processing your preview, please contact support.\</h3\>\</div\>";

function RemoveImageAndFadeOut(sFrameId)
{
	if (g_previewResponseGUID === '')
	{
		var previewContainer = j$('div#' + sFrameId);
		var previewElem = previewContainer.find('img,div');
		if (previewElem.length)
		{
			if (g_previewBtn != null)
				g_previewBtn.attr('disabled','disabled');
			
			j$(previewElem).animate({ opacity: 0 }, g_FadeSpeed);
		}
	}
}

function AddImageAndFadeIn(sFrameId, guidInternalPreviewResponseGUID)
{
	if (guidInternalPreviewResponseGUID === g_previewResponseGUID)
	{
		var previewContainer = j$('div#' + sFrameId);
		
		var newImageElem = j$('\<img src="' + g_previewImage.src + '" /\>')
			.css('border', '0')
			.css('width', g_previewImage.width)
			.css('height', g_previewImage.height)
			.css('opacity', '0')
			.css('display', 'block');
		
		if (!j$.support.opacity)     // IE doesn't support opacity, so we can use it as a test
		{
			var divHeight = previewContainer.height();
			divHeight = (j$.type(divHeight) != 'number' || divHeight == 0 ? 400 : divHeight);
			
			var padT = Math.round((divHeight - g_previewImage.height) / 2);
			
			newImageElem.css('top', padT);
		}
		
		var bWithLink = false;
		if (j$.type(g_previewLinkSrc) === 'string')
		{
			bWithLink = (g_previewLinkSrc.length != 0);
		}
		
		// clear the current contence of the container before adding the new image / anchor
		previewContainer.empty();
		
		if (bWithLink)
		{
			var previewLink = j$('\<a target="_new" id="preview_' + guidInternalPreviewResponseGUID + '" href="' + g_previewLinkSrc + '"\></a>');
			previewLink.appendTo(previewContainer);
			
			// reset the previewContainer object to be the newly appended anchor tag.
			previewContainer = previewLink;
		}
		newImageElem.appendTo(previewContainer);
		
		newImageElem.animate({ opacity: 1 }, g_FadeSpeed, function ()
		{
			g_previewResponseGUID = '';
			g_previewLinkSrc = '';
			
			if (g_previewBtn != null)
			{
				g_previewBtn.removeAttr('disabled');
				g_previewBtn = null;
			}
		});
	}
}

function showError(previewElementId, guidInternalPreviewResponseGUID, strError)
{
	if (guidInternalPreviewResponseGUID === g_previewResponseGUID)
	{
		var newErrorElem = j$('\<div class="Error"\>\</div\>')
			.css('opacity', '0')
			.css('display', 'block');
			
		if (strError != null && strError.length)
			newErrorElem.append(failedHTML + '<br /><font size="2">' + strError +'</font>');
		else
			newErrorElem.append(failedHTML);
		
		if (!j$.support.opacity)
		{
			var padT = Math.round( (previewElement.height() - newErrorElem.height()) / 2 );
			newErrorElem.css('top', padT);
		}
			
		var previewContainer = j$('div#' + previewElementId);
		if (previewContainer.children().size() > 0)
			previewContainer.empty(); // make sure there is nothing in the preview div before we append the error div
		newErrorElem.appendTo(previewContainer);
		
		newErrorElem.animate({ opacity: 1 }, g_FadeSpeed, function ()
		{
			g_previewResponseGUID = '';
			g_previewLinkSrc = '';
			
			g_previewBtn.removeAttr('disabled');
			g_previewBtn = null;
		});
	}
}

function getElementByIdCompatible(the_id) 
{
	if (typeof the_id != 'string')
	{
		return the_id;
	}
	if (typeof document.getElementById != 'undefined')
	{
		return document.getElementById(the_id);
	}
	if (typeof document.all != 'undefined')
	{
		return document.all[the_id];
	}
	if (typeof document.layers != 'undefined')
	{
		return document.layers[the_id];
	}
	return null;
}

function AddParam(strParams, strNewParamName, strNewParamValue)
{
	if (strNewParamName.length > 0)
	{
		var nParamPos = strParams.indexOf(strNewParamName + '=');
		if (nParamPos != -1)
		{	// Update existing parameter
			var nParamEndPos = strParams.indexOf('&', nParamPos);
			var tmpParams = strParams.substring(0, nParamPos + 1);
			//RS. DF2907
			tmpParams += strNewParamName + '=' + encodeURIComponent(EscapeChars(strNewParamValue));
			
			
			// only append the end of the params list if there is anything to append
			if (nParamEndPos != -1)
				tmpParams += strParams.substring(nParamEndPos);
			
			// Now reset the passed in param string to the updated version
			strParams = tmpParams;
		}
		else
		{	// Add new parameter
			if (strParams.length > 0)
			{
				if (strParams.indexOf('?') < 0)
					strParams += '?';
				else
					strParams += '&';
			}
			//RS. DF2907
			strParams += strNewParamName + '=' + encodeURIComponent(EscapeChars(strNewParamValue));
		}
	}
	
	return strParams;
}

function EscapeChars(strIn)
{
	var strOut = strIn;
	if (j$.type(strIn) == 'string')
	{
		strOut = strIn.replace(/\n/g, '<br />');
		strOut = strOut.replace(/\r/g, '<br />');
		strOut = strOut.replace(/\"/g, '\\\"');
	}
	else if (j$.type(strIn) == 'boolean')
	{
		if (strIn)
			strOut = 'true';
		else
			strOut = 'false';
	}
	return strOut;
}

function GetParam(strParams, strRequiredParamName)
{
	var strReturn = '';
	if (strRequiredParamName.length > 0)
	{
		var aParams = strParams.split('&');
		for (var i = 0; i < aParams.length; i++)
		{
			var strParamName = aParams[i].split('=')[0];
			if (strParamName == strRequiredParamName)
			{
				strReturn = aParams[i].split('=')[1];
				break;
			}
		}
	}
	return strReturn;
}

function arrayHasValue(aArray, sValue)
{
	var retVal = -1;
	for (var i = 0; i < aArray.length; i++)
	{
		if (aArray[i] == sValue)
		{
			retVal = i;
			break;
		}
	}
	return retVal;
}

function ClickButton(sButtonId) { j$('input#' + sButtonId + ', img#' + sButtonId).trigger('click'); }

function GetDefaultPreviewSize(nSize, nFrameSize)
{
	if (nSize <= 0)
	{
		if (nFrameSize <= 0)
			nSize = 400;
		else
			nSize = nFrameSize;
	}
	return nSize;
}

function isJQueryObject(obj)
{
	try
	{
		var test = obj.selector;
		if (j$.type(test) == 'undefined' || j$.type(test) == 'null')
			throw(false);
	}
	catch(e)
	{
		return e;
	}
	return true;
}

function EmbedScaleImage(pdfSrc, imageSrc, previewDivId, guidInternalPreviewResponseGUID)
{
	// now we need to update the HTML of the preview
	if (imageSrc.length > 0)
	{
		var img = new Image();
		j$(img)
			.load(function ()
			{
				try
				{
					var previewDiv = j$('div#' + previewDivId);
					
					var divWidth = previewDiv.width();
					divWidth = (j$.type(divWidth) != 'number' || divWidth == 0 ? 400 : divWidth);
					var divHeight = previewDiv.height();
					divHeight = (j$.type(divHeight) != 'number' || divHeight == 0 ? 400 : divHeight);
					var width = img.width;
					var height = img.height;
					var scaleH = (divWidth / width);
					var scaleV = (divHeight / height);
					var scale = scaleH < scaleV ? scaleH : scaleV;
					
			        if (scale != 0)
                    {
			            img.width = Math.round(width * scale);
			            img.height = Math.round(height * scale);
			        }
					
					AddImageAndFadeIn(previewDivId, guidInternalPreviewResponseGUID);
			    }
			    catch (e)
				{
			        showError(previewDivId, guidInternalPreviewResponseGUID);
			    }
			})
			.error(function ()
			{
			    showError(previewDivId, guidInternalPreviewResponseGUID);
			})
			.attr('src', imageSrc);
		g_previewImage = img;
		g_previewLinkSrc = pdfSrc;
	}
	else
		window.location = pdfSrc;
}

function ProcessInlinePreview()
{
	var args = Array.prototype.slice.call(arguments);
	
	var prevBtn = args[0];
	var strFrameId = args[1];
	var strPageRange = args[2];
	var fPopupWindow = args[3];
	var nPreviewWidth = args[4];
	var nPreviewHeight = args[5];
	var strProjectUID = args[6];
	var strVersionUID = args[7];
	var fIsThankYouEmail = args[8];
	
	if (args.size() < 9) {
		prevBtn = j$("#Preview");
		strFrameId = args[0];
		strPageRange = args[1];
		fPopupWindow = args[2];
		nPreviewWidth = args[3];
		nPreviewHeight = args[4];
		strProjectUID = args[5];
		strVersionUID = args[6];
		fIsThankYouEmail = args[7];
	}
	
	if ((!fPopupWindow && g_previewResponseGUID == '') || fPopupWindow) {
		ActualyDoPreview(prevBtn, strFrameId, strPageRange, fPopupWindow, nPreviewWidth, nPreviewHeight, strProjectUID, strVersionUID, fIsThankYouEmail)
	}
}

function ResetPopupGuid()
{
	g_previewResponseGUID = '';
}

function ActualyDoPreview(prevBtn, strFrameId, strPageRange, fPopupWindow, nPreviewWidth, nPreviewHeight, strProjectUID, strVersionUID, fIsThankYouEmail)
{
	if (fPopupWindow == null)
		fPopupWindow = false;
	
	// get the inline preview iframe
	var sFrameId = strFrameId.length ? strFrameId : 'InlinePreview';
	var previewDiv = j$('div#' + sFrameId + ', iframe#' + sFrameId);
	if (previewDiv.length == 0 && !fPopupWindow)
		return;
	
	var defaultWidth = 400;
	var defaultHeight = 400;
	var previewTagName = 'DIV';
	if (previewDiv.length > 0)
	{
		var tagDefaultWidth = previewDiv.attr('width');
		if (j$.type(tagDefaultWidth) == 'number')
			defaultWidth = tagDefaultWidth;
		
		var tagDefaultHeight = previewDiv.attr('height');
		if (j$.type(tagDefaultHeight) == 'number')
			defaultHeight = tagDefaultHeight;
		
		previewTagName = previewDiv[0].tagName;
	}
	
	nPreviewWidth = GetDefaultPreviewSize(nPreviewWidth, defaultWidth);
	nPreviewHeight = GetDefaultPreviewSize(nPreviewHeight, defaultHeight);
	
	var fIsMultiDoc = ((strProjectUID.length > 0) && (strVersionUID.length > 0));
	fPopupWindow = (fIsMultiDoc ? true : fPopupWindow);
	
	var strActionUrl = previewAction;
	if (fPopupWindow || previewDiv[0].tagName.toUpperCase() == 'IFRAME')
	{
		g_previewResponseGUID = 'PopUp';
		
		strActionUrl = AddParam(strActionUrl, 'PreviewHeight', nPreviewWidth);
		strActionUrl = AddParam(strActionUrl, 'PreviewWidth', nPreviewHeight);
		
		//if we have a page range, add a special parameter
		if (strPageRange.length > 0)
			strActionUrl = AddParam(strActionUrl, 'previewPageRange', strPageRange);
		
		if (fIsMultiDoc)
		{
			strActionUrl = AddParam(strActionUrl, 'previewSubDoc', strProjectUID);
			strActionUrl = AddParam(strActionUrl, 'previewSubDocVersion', strVersionUID);
			if (fIsThankYouEmail)
				strActionUrl = AddParam(strActionUrl, 'ThankYouEmail', 'true');
		}
		
		ShowPreview(fPopupWindow, nPreviewWidth, nPreviewHeight, strFrameId, strActionUrl, strPageRange);
		
		setTimeout('ResetPopupGuid();', 500);
	}
	else
	{
		// create an id for this request
		var guidInternalPreviewResponseGUID = generateCustomGuid('IP', false, true);
		
		// display the spinner to show we are processing the preview
		g_previewBtn = j$(prevBtn);
		RemoveImageAndFadeOut(sFrameId);
		
		strActionUrl = (previewActionAJAX.length > 0 ? previewActionAJAX : strActionUrl);
		
		strActionUrl = AddParam(strActionUrl, 'PreviewRequestGUID', guidInternalPreviewResponseGUID);
		
		strActionUrl = AddParam(strActionUrl, 'PreviewWidth', nPreviewWidth);
		strActionUrl = AddParam(strActionUrl, 'PreviewHeight', nPreviewHeight);
		
		//if we have a page range, add a special parameter
		if (strPageRange.length > 0)
		{
			strActionUrl = AddParam(strActionUrl, 'Elateral_PreviewPageRange', strPageRange);
		}
		
		strActionUrl = AddParam(strActionUrl, 'Elateral_PreviewPopupWindow', fPopupWindow);
		
		var pos = strFrameId.lastIndexOf ('_');
		if (pos > 0)
		{
			var fileType = strFrameId.substring (pos + 1);
			strActionUrl = AddParam(strActionUrl, 'filetype', fileType);
		}
		
        pos = strFrameId.lastIndexOf('HiRes');
        if (pos > 0)
		{
            strActionUrl = AddParam(strActionUrl, 'HiRes', 'True');
        }
		
		if (fIsMultiDoc)
		{
			strActionUrl = AddParam(strActionUrl, 'previewSubDoc', strProjectUID);
			strActionUrl = AddParam(strActionUrl, 'previewSubDocVersion', strVersionUID);
			if (fIsThankYouEmail)
				strActionUrl = AddParam(strActionUrl, 'ThankYouEmail', 'true');
			
			// temporary update to AJAX url so we can support multi-docs
			var arrSplitURL = strActionUrl.split('?');
            var strActionUrl = '/Includes/AJAX/AJAX-Multi_Doc_InlinePreview.asp?' + arrSplitURL[1]
		}
		
		// setup posted form params to send
		var oPostData = j$('#Elateral_Questions').serializeArray();
		
		// now we set the current active response id
		g_previewResponseGUID = guidInternalPreviewResponseGUID;
		
		// Make the AJAX call
		DoProcessAJAX(oPostData, strActionUrl, sFrameId, strFrameId, strPageRange, fPopupWindow, nPreviewWidth, nPreviewHeight, fIsThankYouEmail, guidInternalPreviewResponseGUID);
	}
}

function DoProcessAJAX(oPostData, strActionUrl, previewDivId, strFrameId, strPageRange, fPopupWindow, nPreviewWidth, nPreviewHeight, fIsThankYouEmail, guidInternalPreviewResponseGUID)
{
	if (g_objAJAXRequest)
	{
		g_objAJAXRequest.abort();
		g_objAJAXRequest = null;
	}
	
	// now we perform the ajax call to process the preview
	g_objAJAXRequest = j$.ajax(
	{
		type: 'POST',
		data: oPostData,
		contentType: 'application/x-www-form-urlencoded',
		url: strActionUrl,
		dataType: 'json',
		cache: false,
		success: function(oResponse, sErrorDesc, oXHTTPRequest)
		{
			try
			{
				g_objAJAXRequest = null;
				
				if (g_previewResponseGUID == oResponse.PreviewRequestGUID)
				{
					if (oResponse.Status == 'Cancelled')
						window.location = oResponse.CancelledURL; // cancelled order so redirect to the cancelled url
					else
					if (oResponse.Status == 'OK')
						RenderPreview(strFrameId, oResponse.Params, strPageRange, fPopupWindow, nPreviewWidth, nPreviewHeight, g_previewResponseGUID, fIsThankYouEmail);
					else
					if (oResponse.Status == 'Preview' || oResponse.Status == 'Error' || oResponse.Status == 'Warning')
					{
						// now we need to update the HTML of the preview
						DoShowPreview(oResponse.ReturnImagePath, oResponse.ReturnLinkHref, previewDivId, oResponse.PreviewRequestGUID);
						
						if (oResponse.Status == 'Error' || oResponse.Status == 'Warning')
						{
							//DoErrorAlert(oResponse);
						}
					}
					else
					{
						if (oResponse.Status != 0)
							showError(previewDivId, oResponse.PreviewRequestGUID, oXHTTPRequest.responseText);
					}
				}
			}
			catch(e)
			{
				showError(previewDivId, oResponse.PreviewRequestGUID, oXHTTPRequest.responseText);
			}
		},
		error: function(oXHTTPRequest, sErrorDesc, oError)
		{
			if (oXHTTPRequest.status != 0)
				showError(previewDivId, guidInternalPreviewResponseGUID, oXHTTPRequest.responseText);
		}
	});
}

function DoErrorAlert(oResponse)
{
	var errorMessage = '';
	
	if (oResponse.ErrorCode == 'ERROR_UNKNOWN')
	{
		errorMessage = 'An Unknown Error Occured.';
	}
	else if (oResponse.ErrorCode == 'ERROR_TEXTOVERFLOW')
	{
		errorMessage = 'Your text has overflowed.';
	}
	else if (oResponse.ErrorCode == 'ERROR_GLYPHMISSING')
	{
		errorMessage = 'There is a glyph missing.';
	}
	else if (oResponse.ErrorCode == 'ERROR_CORRUPTPROJECT')
	{
		errorMessage = 'The project has been corupted.';
	}
	else if (oResponse.ErrorCode == 'ERROR_FONTNOTFOUND')
	{
		errorMessage = 'A required font was not found.';
	}
	else if (oResponse.ErrorCode == 'ERROR_RASTERIZATION')
	{
		errorMessage = 'The rasterization process has failed.';
	}
	else if (oResponse.ErrorCode == 'ERROR_HTMLGENERATION')
	{
		errorMessage = 'The HTML failed to generate.';
	}
	
	if (errorMessage.length())
	{
		//alert(oResponse.Status + ':\n' + errorMessage);
	}
}

function DoShowPreview(strImagePath, strLinkHref, previewDivId, guidInternalPreviewResponseGUID)
{	
	// now we need to update the HTML of the preview
	if (strImagePath.length > 0)
	{
		EmbedScaleImage(strLinkHref, strImagePath, previewDivId, guidInternalPreviewResponseGUID);
	}
	else
	{
		j$('div#' + previewDivId).html('\<div class="Error"\>\</div\>');
		window.open(strLinkHref, '_Preview', 'width=' + screen.width + ', height=' + screen.height);
	}
}

function RenderPreview(strFrameId, parameters, strPageRange, fPopupWindow, nPreviewWidth, nPreviewHeight, guidInternalPreviewResponseGUID, fIsThankYouEmail)
{
	if (fPopupWindow == null)
		fPopupWindow = false;
	
	// get the inline preview iframe
	var sFrameId = strFrameId.length ? strFrameId : 'InlinePreview';
	var previewDiv = j$('div#' + sFrameId);
	if (previewDiv.length == 0)
		return;
	
	//OUTPUT_PRINT						= 1
	//OUTPUT_ADVERT						= 2
	//OUTPUT_DESKTOPDOWNLOAD			= 3
	//OUTPUT_INSTANTRESPONSE			= 4
	//OUTPUT_BRANDEDEMAIL				= 5
	//OUTPUT_STATICFILE					= 6
	//OUTPUT_BRANDEDEMAIL_DOC_ANNOUNCE	= 7
	//OUTPUT_BRANDEDEMAIL_GEN_ANNOUNCE	= 8
	//OUTPUT_DESKTOPDOWNLOAD_PUSH		= 9
	//OUTPUT_PRINT_PUSH					= 10
	//OUTPUT_BUNDLE						= 11
	var nOutputType = parseInt(GetParam(parameters, 'OutputType'));
	if (isNaN(nOutputType) || nOutputType < 1 || nOutputType > 11)
	    nOutputType = 5;
	
	var bWithLink = (parseInt(GetParam(parameters, 'WithLink')) == 0 ? false : true);
	
	var strActionUrl;
	switch (nOutputType)
	{
		case 4: // OUTPUT_INSTANTRESPONSE
			strActionUrl = 'Includes/AJAX/AJAX-MakePreview-IR.asp?' + parameters;
			if (!fIsThankYouEmail)
				break;
		case 5: // OUTPUT_BRANDEDEMAIL
		case 7: // OUTPUT_BRANDEDEMAIL_DOC_ANNOUNCE
		case 8: // OUTPUT_BRANDEDEMAIL_GEN_ANNOUNCE
			strActionUrl = 'Includes/AJAX/AJAX-MakePreview-Email.asp?' + parameters;
			break;
		default:
			strActionUrl = 'Includes/AJAX/AJAX-MakePreview-Screen.asp?' + parameters;
			break;
	}
		
	//if we have a page range, add a special parameter
	if (strPageRange.length > 0)
		strActionUrl = AddParam(strActionUrl, 'previewPageRange', strPageRange);
	
	strActionUrl = AddParam(strActionUrl, 'PopupWindow', fPopupWindow);
	strActionUrl = AddParam(strActionUrl, 'PreviewWidth', nPreviewWidth);
	strActionUrl = AddParam(strActionUrl, 'PreviewHeight', nPreviewHeight);
	
	// add the current request id to the call
	strActionUrl = AddParam(strActionUrl, 'PreviewRequestGUID', guidInternalPreviewResponseGUID);

	if (g_previewResponseGUID != guidInternalPreviewResponseGUID)
    {
	    if (g_objAJAXRequest)
        {
	        g_objAJAXRequest.abort();
	        g_objAJAXRequest = null;
	    }

	    // now we set the current active response id
	    g_previewResponseGUID = guidInternalPreviewResponseGUID;
	}
	
	// now we perform the ajax call to render the preview
	g_objAJAXRequest = j$.ajax(
	{
		type: 'GET',
		url: strActionUrl,
		dataType: 'json',
		cache: false,
		success: function(oResponse, sStatusDesc, oXHTTPRequest)
		{
			try
			{
				g_objAJAXRequest = null;
				if (g_previewResponseGUID == oResponse.PreviewRequestGUID)
				{
					if (oResponse.Status == 'OK' || oResponse.Status == 'Error' || oResponse.Status == 'Warning')
					{
						// now we need to update the HTML of the preview
						DoShowPreview(oResponse.ReturnImagePath, oResponse.ReturnLinkHref, sFrameId, oResponse.PreviewRequestGUID);
						
						if (oResponse.Status == 'Error' || oResponse.Status == 'Warning')
						{
							//DoErrorAlert(oResponse);
						}
					}
					else
					{
						if (oResponse.Status != 0)
							showError(sFrameId, oResponse.PreviewRequestGUID, oXHTTPRequest.responseText);
					}
				}
			}
			catch(e)
			{
				showError(sFrameId, oResponse.PreviewRequestGUID, oXHTTPRequest.responseText);
			}
		},
		error: function(oXHTTPRequest, sErrorDesc, oError)
		{
			if (g_previewResponseGUID == guidInternalPreviewResponseGUID)
			{
				if (oXHTTPRequest.status != 0)
					showError(sFrameId, guidInternalPreviewResponseGUID, oXHTTPRequest.responseText);
			}
		}
	});
}

/*
// requires "includes/js/jquery.timers.js" to work
function delayedAutoClick(nAutoClickInterval, oAutoForm)
{
	// make sure we have a jQuery form object to use
	if (!isJQueryObject(oAutoForm))
		oAutoForm = j$(oAutoForm);
	
	// make sure we have a form in the jQuery Object
	if (oAutoForm.length == 0)
		return;
	
	// validate the interval
	nAutoClickInterval = parseInt(nAutoClickInterval);
	if (isNaN(nAutoClickInterval) || nAutoClickInterval <= 0)
		return;
	
	// Stop timer if it is already running
	oAutoForm.stopTime('auto-click');
	
	oAutoForm.oneTime(nAutoClickInterval + 's', 'auto-click', function()
	{
		// Add the new timer for the delayed submission
		oAutoForm.find('input:submit').trigger('click');
	}).find('input:submit').click(function(event)
	{
		// Add submit buttons click to stop the counter
		// in case the submit button has overriding onclick method.
		oAutoForm.stopTime('auto-click');
		event.stopImmediatePropagation();
	}).end().find('input:button,input:reset').click( function(event)
	{
		// Add reset function for the timer when clicking buttons other than the submit ones
		delayedAutoClick(nAutoClickInterval, oAutoForm);
		event.stopImmediatePropagation();
	}).end().find('input:text,textarea,select').keypress(function(event)
	{
		// Add reset function for the timer when using valid keys in a text input
		var code = (event.keyCode ? event.keyCode : event.which);
		var isValidKey = (code > 45 && code < 91) || (code > 95 && code < 112)
			|| (code > 185 && code < 192) || (code > 218 && code < 223)
			|| (code == 32) || (code == 13) || (code == 8);
		if (isValidKey)
		{
			delayedAutoClick(nAutoClickInterval, oAutoForm);
			event.stopImmediatePropagation();
		}
	}).end().find('input:checkbox,input:radio,select').mouseup(function()
	{
		// Add reset function for the timer when clicking checkboxes and radio inputs
		delayedAutoClick(nAutoClickInterval, oAutoForm);
		event.stopImmediatePropagation();
	});
};
*/
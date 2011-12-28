(function($) {
	$.widget("ui.inlinepreview", {
		options: {
			style: {
				type: "tabbed", // [simple, tabbed]
				initialSelectedTab: null, // [null, tab.index, tab.title] if null no autoInitSelection will be made
				popupButtons: true,
				useSlider: false,
				processingImage: "images/processing.gif"
				width: 400,
				height: 400,
			},
			previewWidth: 400, // [int, string["sizeof(jQuery Selector)", "valueof(jQuery Selector)"]]
			previewHeight: 400, // [int, string["sizeof(jQuery Selector)", "valueof(jQuery Selector)"]]
			fade: {
				speed: 500,
				easing: "swing"
			},
			tabs: [
				{title: "Portrait", href: "?tab=1"},
				{title: "Landscape", href: "?tab=2"},
				{title: "No Preview", href: "?tab=3"},
				{title: "Script Error", href: "?tab=4"},
				{title: "Warning", href: "?tab=5"}
			],
			errorCodes: [
				{errorCode: "ERROR_ALREADYPROCESSING", errorMessage: "There is already a preview being generated."},
				{errorCode: "ERROR_CORRUPTPROJECT", errorMessage: "The project has been corrupted."},
				{errorCode: "ERROR_FONTNOTFOUND", errorMessage: "A required font was not found."},
				{errorCode: "ERROR_GLYPHMISSING", errorMessage: "There is a glyph missing."},
				{errorCode: "ERROR_HTMLGENERATION", errorMessage: "The HTML failed to generate."},
				{errorCode: "ERROR_INVALIDRESPONSE", errorMessage: "An invalid response was returned by the preview request script."},
				{errorCode: "ERROR_NODATA", errorMessage: "No preview data was returned."},
				{errorCode: "ERROR_PROCESSING", errorMessage: "There was an error processing the preview request data."},
				{errorCode: "ERROR_RASTERIZATION", errorMessage: "The rasterization process has failed."},
				{errorCode: "ERROR_REQUEST", errorMessage: "There was an error requesting the preview."},
				{errorCode: "ERROR_SCALING", errorMessage: "There was an error scaling the preview image."},
				{errorCode: "ERROR_TEXTOVERFLOW", errorMessage: "Your text has overflowed."},
				{errorCode: "ERROR_UNKNOWN", errorMessage: "An Unknown Error Occured."}
			],
			processingUrls: {
				inline: "ajax/process.asp",
				popup: "process.asp"
			},
			formId: "#Elateral_Questions",
			proccessIdQuerystringParamName: "PreviewRequestGUID"
		},
		_currentPreview: null,
		_guidInternalPreviewResponseGUID: "",
		_tabControl: null,
		_previewContainer: null,
		_sliderControl: null,
		_buttonPanel: null,
		_popupButtonPanel: null,
		_messageDialog: null,
		_create: function() {
			// setup preview controls
		},
		_init: function() {
			// add functionality to the controls
		},
		_requestPreview: function() {
			// make the request for a new preview
		},
		_embedPreviewImage: function() {
			// scale and display the new preview image
		},
		_displayMessage: function() {
			// use messageDialog to display and error or a popup preview
		},
		_getErrorMessages: function( errorCode ) {
			var self = this,
				errorCodes = self.options.errorCodes;
			
			var errorMessage = '';
			for (var i = 0; i < errorCodes.length; i++)
			{
				if (errorCode.toUpperCase() === errorCodes[i].errorCode.toUpperCase())
				{
					errorMessage = errorCodes[i].errorMessage;
					break;
				}
			}
			return errorMessage;
		},
		_parseBool: function( str ) {
			return /^true$/.test(str.toLowerCase());
		},
		_generateCustomGuid: function( prefix, withBraces, withHyphens ) {
			var Guid = this._generateGuid(false, withHyphens);
			Guid = prefix + Guid.substr(prefix.length);
			if (withBraces){Guid = "{" + Guid + "}";};
			return Guid;
		},
		_generateGuid: function( withBraces, withHyphens ) {
			var Guid = ((withBraces ? "{" : "") + "xxxxxxxx" + (withHyphens ? "-" : "") + "xxxx" + (withHyphens ? "-" : "") + "4xxx" + (withHyphens ? "-" : "") + "yxxx" + (withHyphens ? "-" : "") + "xxxxxxxxxxxx" + (withBraces ? "}" : "")).replace(/[xy]/g, function(c){ var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); });
			return Guid.toUpperCase();
		},
		_appendParams: function ( baseUrl, newParams ) {
			if (newParams.length != 0)
			{
				var newUrl = baseUrl;
				if (newUrl.length != 0)
				{
					if (newUrl.indexOf("?") < 0 && newParams.charAt(0) != "?")
						newUrl += "?";
					else if (newParams.charAt(0) != "?")
						newUrl += "&";
				}
				newUrl += newParams;
				
				return newUrl;
			}
			
			return baseUrl;
		},
		_appendParam: function( baseUrl, paramName, paramValue ) {
			if ( paramName.length != 0 )
			{
				var newUrl = baseUrl;
				if ( newUrl.indexOf("?") < 0)
					newUrl += "?";
				else
					newUrl += "&";
				
				newUrl += paramName + "=" + paramValue;
				
				return newUrl;
			}
			
			return baseUrl;
		},
		_setOption: function ( option, value ) {
			switch (option) {
				// ToDo: add settings change processing
			}
			
			// this line will be replaced by the commented out line underneath in jQuery UI 1.9
			$.Widget.prototype._setOption.apply( this, arguments );
			//this._super( "_setOption", key, value );
		},
		destroy: function() {
			this.element.empty();
			
			// this line will not be required in jQuery UI 1.9
			$.Widget.prototype.destroy.call( this );
		}
	});
})(jQuery);
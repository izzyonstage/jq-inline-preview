(function($) {
	$.widget("ui.inlinepreview", {
		options: {
			style: {
				type: "tabs", // [simple, buttons, tabs]
				initialSelectedTab: null, // [null, tab.index, tab.id] if null no autoInitSelection will be made
				autoSelectedPopup: null, // [null, tab.index, tab.id] if null no autoInitSelection will be made
				popupButtons: true,
				useSlider: false,
				processingImage: "images/processing.gif",
				buttonPanelRuleColor: "#cccccc",
				width: 400,
				height: 400
			},
			previewWidth: "sizeof(#preview-container)", // [int, string["sizeof(jQuery Selector)", "valueof(jQuery Selector)"]]
			previewHeight: "sizeof(#preview-container)", // [int, string["sizeof(jQuery Selector)", "valueof(jQuery Selector)"]]
			fade: {
				speed: 500,
				easing: "swing"
			},
			tabs: [
				{id: "preview", title: "Preview", href: "#tab=1"}
			],
			errorCodes: [
				{errorCode: "MESSAGE_POPUP", errorMessage: "Here is the requested preview."},
				{errorCode: "ERROR_IMAGELOAD", errorMessage: "There was an error loading the preview image."},
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
				inline: "",
				popup: ""
			},
			formId: "",
			proccessIdQuerystringParamName: "PreviewRequestGUID"
		},
		_currentPreview: null,
		_guidInternalPreviewResponseGUID: "",
		_tabControl: null,
		_tabPanel: null,
		_previewContainer: null,
		_sliderControl: null,
		_buttonPanel: null,
		_popupButtonPanel: null,
		_messageDialog: null,
		previewImage: null,
		_create: function() {
			this._trigger("creatingInlinePreview", null, this);
			
			// setup preview controls
			var self = this,
				options = self.options,
				elem = self.element;
			
			// setup the inline preview element and empty it
			elem.empty();
			elem.addClass("ui-widget ui-ip");
			
			// create new preview container element (will be attached later)
			self._previewContainer = $("<div></div>")
				.attr("id", "preview-container")
				.html("&nbsp;")
				.css({
					"width": ($.type(options.style.width) === "string" ? options.style.width : parseInt(options.style.width) + "px"),
					"height": ($.type(options.style.height) === "string" ? options.style.height : parseInt(options.style.height) + "px")
				});
			
			if (options.style.type.toLowerCase() != "simple")
			{
				var tabsBox = $("<div></div>")
					.attr("id", "ip-tabs")
				
				var tabsList = $("<ul></ul>").appendTo(tabsBox);
				
				var tabItems = options.tabs;
				if (options.style.type.toLowerCase() === "buttons")
				{
					tabItems = [{id: "preview", title: "Preview", href: "#tab-1"}];
				}
				
				for (var i = 0; i < tabItems.length; i++)
				{
					var tabitem = $("<li></li>")
						.appendTo(tabsList);
					
					var tablink = $("<a></a>")
						.attr("href", "#tabs-1")
						.attr("data-popup", "false")
						.attr("data-url", self._appendParams(options.style.type.toLowerCase() === "tabs" ? options.processingUrls.inline : "", options.tabs[i].href))
						.addClass("ip-tab")
						.text(tabItems[i].title)
						.appendTo(tabitem);
				}
				
				self._tabPanel = $("<div></div>")
					.addClass("previewBox")
					.attr("id", "tabs-1")
					.appendTo(tabsBox);
				
				// add the preview container to the tab.
				self._previewContainer.appendTo(tabsBox);
				
				// add the tabs to the main element
				tabsBox.appendTo(elem);
				
				self._tabControl = tabsBox;
			}
			else
			{
				// add the preview container to the main element
				self._previewContainer.appendTo(elem);
			}
			
			if (options.style.useSlider)
			{
				self._sliderControl = $("<div></div>")
					.attr("id", "ip-page-selector")
					.appendTo(elem);
			}
			
			if (options.style.type.toLowerCase() != "tabs" || options.style.popupButtons)
			{
				if (options.style.type.toLowerCase() != "tabs")
				{
					$("<hr />")
						.css("color", options.style.buttonPanelRuleColor)
						.css("background-color", options.style.buttonPanelRuleColor)
						.appendTo(options.style.type.toLowerCase() != "simple" ? self._tabControl : elem);
					
					self._buttonPanel = $("<div></div>")
						.attr("id", "inline-preview-buttonPanel")
						.addClass("ip-btn-panel")
						.appendTo(options.style.type.toLowerCase() != "simple" ? self._tabControl : elem);
				}
				
				if (options.style.popupButtons)
				{
					$("<hr />")
						.css("color", options.style.buttonPanelRuleColor)
						.css("background-color", options.style.buttonPanelRuleColor)
						.appendTo(options.style.type.toLowerCase() != "simple" ? self._tabControl : elem);
					
					self._popupButtonPanel = $("<div></div>")
						.attr("id", "inline-preview-popupButtonPanel")
						.addClass("ip-btn-panel")
						.appendTo(options.style.type.toLowerCase() != "simple" ? self._tabControl : elem);
				}
				
				for (var i = 0; i < options.tabs.length; i++)
				{
					if (options.style.type.toLowerCase() != "tabs")
					{
						self._appendButton(i, false, self._buttonPanel);
					}
					
					if (options.style.popupButtons)
					{
						self._appendButton(i, true, self._popupButtonPanel);
					}
				}
			}
			
			self._messageDialog = $("<div></div>")
				.attr("id", "preview-dialog")
				.attr("title", "Preview Dialog")
				.appendTo(elem);
			
			this._trigger("createdInlinePreview", null, this);
		},
		_init: function() {
			// add functionality to the controls
			this._trigger("initialisingInlinePreview", null, this);
			
			var self = this,
				options = self.options;
				
			self._messageDialog
				.dialog({
					autoOpen: false,
					resizable: false,
					heigth: options.style.height + 25,
					width: options.style.width + 25,
					draggable: false,
					modal: true,
					buttons: {
						OK: function() {
							$( this ).dialog( "close" );
						}
					}
				});
			
			if (self._tabControl != null)
			{
				self._tabControl.tabs({
					selected: options.style.type.toLowerCase() !== "tabs" ? 0 : -1,
					select: function(event, ui) {
						if (options.style.type.toLowerCase() === "tabs")
						{
							return self._requestPreview(ui.index + 1, ui.tab);
						}
						
						return false;
					}
				});
			}
			
			if (self._sliderControl != null)
			{
				self._sliderControl.slider({
					min: 1,
					max: options.tabs.length,
					slide: function( event, ui ) {
						self._trigger("selectingPage", null, ui);
						
						if (options.style.type.toLowerCase() === "tabs")
						{
							self._tabControl.tabs("select", ui.value - 1);
						}
						else
						{
							self._requestPreview(ui.value, $(this));
						}
						
						self._trigger("pageSelected", null, ui);
					}
				});
			}
			
			if (options.style.initialSelectedTab != null)
			{
				var previewId = self._getTabIndex(options.style.initialSelectedTab);
				
				if (self._sliderControl != null)
				{
					self._sliderControl.slider("value", previewId);
				}
				
				switch (options.style.type)
				{
					case "tabs": self._tabControl.tabs("select", previewId); break;
					default: $("button:nth-child(" + previewId + ")", self._buttonPannel).click(); break;
				}
			}
			
			if (options.style.autoSelectedPopup != null && options.style.popupButtons)
			{
				// nth-child selector is 1-indexed so need to add 1 to the tabIndexReturned
				var previewId = self._getTabIndex(options.style.autoSelectedPopup) + 1;
				$("button:nth-child(" + previewId + ")", self._popupButtonPanel).click();
			}
			
			this._trigger("initialisedInlinePreview", null, this);
		},
		_getTabIndex: function (tabInfo) {
			if (tabInfo == null) return 1;
			
			var self = this,
				options = self.options;
			
			// check if the index was already passed
			if ($.type(tabInfo) == "number" && tabInfo < options.tabs.length) return tabInfo;
			
			// now check if the id or title was passed
			for (var i = 0; i < options.tabs.length; i++)
			{
				if (options.tabs[i].id === tabInfo)
				{
					return i;
				}
				
				if (options.tabs[i].title === tabInfo)
				{
					return i;
				}
			}
			
			// no tab found default to the first tab
			return 1;
		},
		_getPreviewSize: function( dimension ) {
			var dimensionValue = 400,
				containerValue = 400,
				self = this,
				options = self.options;
			
			switch (dimension)
			{
				case "width":
					dimensionValue = options.previewWidth;
					containerValue = options.style.width;
					break;
				case "height":
					dimensionValue = options.previewHeight;
					containerValue = options.style.height;
					break;
			}
			
			if ($.type(dimensionValue) === "string")
			{
				var bracketPos = dimensionValue.indexOf('(');
				var bracketEndPos = dimensionValue.indexOf(')');
				if (bracketPos != -1 && bracketEndPos != -1)
				{
					// must be a value from an element
					var functionProcess = dimensionValue.substring(0, bracketPos);
					var selector = dimensionValue.substring(bracketPos + 1, bracketEndPos);
					switch (functionProcess)
					{
						case "sizeof":
							dimensionValue = parseInt($(selector).css(dimension));
							break;
						case "valueof":
							dimensionValue = parseInt($(selector).val());
							break;
					}
				}
				else
				{
					dimensionValue = parseInt(dimensionValue);
				}
			}
			
			return ($.type(dimensionValue) != 'number' || dimensionValue == 0 ? containerValue : dimensionValue);
		},
		_requestPreview: function( pageToPreview, ui ) {
			// make the request for a new preview
			this._trigger("requestingPreview", null, this);
			
			var result = true,
				self = this,
				options = self.options;
				
			self._currentPreview = parseInt(pageToPreview);
			
			var ajaxUrl = $(ui).attr("data-url");
			if (self._parseBool($(ui).attr("data-popup")))
			{
				self._displayMessage( ajaxUrl, '', '', '', false );
			}
			else
			{
				if (self._guidInternalPreviewResponseGUID.length == 0)
				{
					self._previewContainer
						.addClass("loading")
						.css("background-image", "url(" + options.style.processingImage + ")");
					
					self._guidInternalPreviewResponseGUID = self._generateCustomGuid('IP', false, false);
					ajaxUrl = self._appendParam(ajaxUrl, options.proccessIdQuerystringParamName, self._guidInternalPreviewResponseGUID)
					
					if (self.previewImage != null)
						self.previewImage.off("click.inline-previe-image");
					self._previewContainer.find("img").animate({ opacity: 0 }, options.fade.speed, options.fade.easing);
					
					var postFormData = $('form' + options.formId).serializeArray();
					
					$.ajax({
						type: 'POST',
						data: postFormData,
						contentType: 'application/x-www-form-urlencoded',
						url: ajaxUrl,
						dataType: 'json',
						cache: false,
						success: function( oResponse, sErrorDesc, oXHTTPRequest )
						{
							try
							{
								if (self._guidInternalPreviewResponseGUID == oResponse.PreviewRequestGUID)
								{
									switch (oResponse.Status)
									{
										case "Cancelled":
											window.location = oResponse.CancelledURL; // cancelled order so redirect to the cancelled url
											break;
										case "Preview":
										case "Error":
										case "Warning":
											// now we need to update the HTML of the preview
											if (oResponse.PreviewImage.length != 0)
											{
												self._embedPreviewImage( oResponse.PreviewImage, oResponse.PreviewLink )
											}
											else
											{
												if (oResponse.PreviewLink.length != 0)
												{
													self._displayMessage( oResponse.PreviewLink, '', '', '', true );
												}
												else
												{
													self._displayMessage( '', '', "ERROR_NODATA", '', true );
												}
											}
											if (oResponse.Status == 'Error' || oResponse.Status == 'Warning')
											{
												var icon = (oResponse.Status === "Error" ? "circle-close" : "alert");
												self._displayMessage( '', icon, oResponse.ErrorCode, '', true );
											}
											break;
										default:
											self._displayMessage( '', '', "ERROR_INVALIDRESPONSE", '', true );
											break;
									}
								}
							}
							catch(e)
							{
								self._displayMessage( '', '', "ERROR_PROCESSING", '', true );
							}
						},
						error: function(oXHTTPRequest, sErrorDesc, oError)
						{
							if (oXHTTPRequest.status != 0)
								self._displayMessage( '', '', "ERROR_REQUEST", '', true );
						}
					});
				}
				else
				{
					self._displayMessage( '', "alert", "ERROR_ALREADYPROCESSING", '', false );
					result = false;
				}
			}
			
			this._trigger("previewRequestedComplete", null, this);
			
			return result;
		},
		_embedPreviewImage: function( imageSrc, imageLinkURL ) {
			// scale and display the new preview image
			this._trigger("embeddingScaledImage", null, this);
			
			var self = this,
				options = self.options;
			
			var img = new Image();
			$(img).load(function () {
					try
					{
						var divWidth = self._getPreviewSize("width");
						var divHeight = self._getPreviewSize("height");
						
						var width = img.width;
						var height = img.height;
						
						var scaleH = (width / divWidth);
						var scaleV = (height / divHeight);
						var scale = scaleH < scaleV ? scaleH : scaleV;
						
						if (scale != 1)
						{
							img.width = Math.round(width * scale);
							img.height = Math.round(height * scale);
						}
					}
					catch (e)
					{
						self._displayMessage( '', '', "ERROR_SCALING", '', true );
					}
					
					self.previewImage = $('\<img src="' + img.src + '" /\>')
						.attr('alt', 'Preview Image')
						.css('border', '0')
						.css('width', img.width)
						.css('height', img.height)
						.css('opacity', '0');
					
					if (!$.support.opacity)     // IE doesn't support opacity, so we can use it as a test
					{
						var divHeight = self._getPreviewSize("height");
						var padT = Math.round((divHeight - img.height) / 2);
						
						self.previewImage.css('top', padT);
					}
					
					// clear the current contence of the container before adding the new image / anchor
					self._previewContainer.empty();
					
					if ($.type(imageLinkURL) === 'string' && imageLinkURL.length != 0)
					{
						self.previewImage.on("click.inline-previe-image", function() { self._displayMessage( imageLinkURL, '', '', '', false ); });
					}
					self.previewImage.appendTo(self._previewContainer);
					
					self.previewImage.animate({ opacity: 1 }, options.fade.speed, options.fade.easing, function() {
						self._previewContainer
							.removeClass("loading")
							.css("background-image", "none");
						
						self._guidInternalPreviewResponseGUID = "";
					});
				})
				.error(function () {
					self._displayMessage( '', '', "ERROR_IMAGELOAD", '', true );
				})
				.attr('src', imageSrc);
			
			this._trigger("embededScaledImage", null, this);
		},
		_displayMessage: function( displaySrc, iconClass, errorCode, message, removeSpinner ) {
			// use messageDialog to display and error or a popup preview
			var self = this,
				options = self.options;
			
			// clear previous messages
			self._messageDialog.empty();
			
			var title = (displaySrc.length != 0 ? "Preview" : (iconClass == "circle-close" || iconClass.length == 0 ? "An Error Occured" : "Warning"));
			
			if (displaySrc.length != 0)
			{
				var contentIFrame = $("<iframe></iframe>")
					.attr("src", displaySrc)
					.css({
						height: options.style.height,
						width: options.style.width
					})
					.appendTo(self._messageDialog);
			}
			else
			{
				var icon = $("<span></span>")
					.addClass("ui-icon ui-icon-" + (iconClass.length != 0 ? iconClass : "circle-close"))
					.css({
						"float": "left",
						"margin": "0 7px 50px 0"
					})
					.appendTo(self._messageDialog);
				var para = $("<p></p>").appendTo(self._messageDialog);
				
				if (errorCode.length != 0)
				{
					para.text(self._getErrorMessages(errorCode));
				}
				else if (message.length != 0)
				{
					para.text(message);
				}
			}
			
			if (removeSpinner)
			{
				self._previewContainer
					.removeClass("loading")
					.css("background-image", "none");
				
				self._guidInternalPreviewResponseGUID = "";
			}
			
			self._messageDialog
				.attr("title", title)
				.dialog("open");
		},
		_appendButton: function( tabId, isPopup, buttonPanelElem ) {
			var self = this,
				options = self.options;
			
			var tab = options.tabs[tabId];
			
			var btn = $("<button>")
				.addClass("ip-btn")
				.text(tab.title)
				.attr("data-popup", isPopup ? "true" : "false")
				.attr("data-url", self._appendParams(isPopup ? options.processingUrls.popup : options.processingUrls.inline, tab.href))
				.appendTo(buttonPanelElem)
				.button()
				.on("click.inline-preview-button", function() {
					if ($(this).attr("data-popup") === "false") { self._currentPreview = tabId; }
					self._requestPreview(self._currentPreview, $(this));
				});
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
			$("button", this.element).off("click.inline-preview.button");
			if (this.previewImage != null)
				this.previewImage.off("click.inline-previe-image");
			
			this.element.empty();
			
			// this line will not be required in jQuery UI 1.9
			$.Widget.prototype.destroy.call( this );
		}
	});
})(jQuery);
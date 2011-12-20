(function($) {
	$.widget("ui.inlinepreview", {
		options: {
			processURL: {
				ajax: "ajax/process.asp",
				popup: "process.asp"
			},
			tabbed: true,
			popupButton: true,
			slider: false,
			processingImage: "images/processing.gif",
			width: 400,
			height: 400,
			tabs: [
				{title: "Portrait", href: "?tab=1"},
				{title: "Landscape", href: "?tab=2"},
				{title: "No Preview", href: "?tab=3"},
				{title: "Script Error", href: "?tab=4"},
				{title: "Warning", href: "?tab=5"}
			],
			defaultSelectedTab: 0,
			autoLoadOnStart: true,
			currentPage: 1,
			formId: "#Elateral_Questions",
			fadeSpeed: 500,
			proccessIdQuerystringParamName: "PreviewRequestGUID"
		},
		destroy: function() {
			this.element.empty();
			
			// this line will not be required in jQuery UI 1.9
			$.Widget.prototype.destroy.call( this );
		},
		_setOption: function ( option, value ) {
			switch (option) {
				case "processURL":
					// for each button or tab change the href to use the new processingURL
					break;
				//tabbed
				//popupButton
				//slider
				//processingImage
				//width
				//height
				//tabs
				//errorMessage
			}
			
			// this line will be replaced by the commented out line underneath
			$.Widget.prototype._setOption.apply( this, arguments );
			//this._super( "_setOption", key, value );
		},
		tabControl: null,
		previewContainer: null,
		slider: null,
		buttonPanel: null,
		popUpButtonPanel: null,
		messageDialog: null,
		_guidInternalPreviewResponseGUID: "",
		_create: function() {
			var self = this,
				options = self.options,
				elem = self.element;
			
			elem.empty();
			elem.addClass("ui-widget ui-ip");
			
			var tabsBox = $("<div></div>")
				.attr("id", "ip-tabs")
				.appendTo(elem);
			
			var tabsList = $("<ul></ul>").appendTo(tabsBox);
			
			var tabItems = options.tabs;
			if (!options.tabbed)
			{
				tabItems = [{title: "Preview", href: "#tab-1"}];
			}
			
			for (var i = 0; i < tabItems.length; i++)
			{
				var tabitem = $("<li></li>")
					.appendTo(tabsList);
				
				var tablink = $("<a></a>")
					.attr("href", "#tabs-1")
					.attr("data-popup", "false")
					.attr("data-url", this._appendParams(options.processURL.ajax, options.tabs[i].href))
					.addClass("ip-tab")
					.text(options.tabs[i].title)
					.appendTo(tabitem);
			}
			
			var parentElem = $("<div></div>")
				.addClass("previewBox")
				.attr("id", "tabs-1")
				.appendTo(tabsBox);
			
			this.tabControl = tabsBox.tabs({
				select: function(event, ui) {
					if (options.tabbed)
					{
						return self._requestPreview(options.currentPage, ui);
					}
					else
					{
						return false;
					}
				}
			});
			
			this.previewContainer = $("<div></div>")
				.attr("id", "preview-container")
				.html("&nbsp;")
				.appendTo(parentElem)
				.css({
					"width": options.width + "px",
					"height": options.height + "px"
				});
			
			if (options.slider)
			{
				this.slider = $("<div></div>")
					.attr("id", "ip-page-selector")
					.appendTo(elem)
					.slider({
						value: options.currentPage,
						min: 1,
						max: options.tabs.length,
						slide: function( event, ui ) {
							self._trigger("selectingPage", null, ui);
							
							options.currentPage = ui.value;
							self._requestPreview(options.currentPage, $(this));
							
							self._trigger("pageSelected", null, ui);
						}
					});
			}
			
			if (!options.tabbed || options.popupButton)
			{
				if (!options.tabbed)
				{
					this.buttonPanel = $("<div></div>")
						.addClass("ip-btn-panel")
						.appendTo(this.tabControl);
				}
					
				this.popUpButtonPanel = $("<div></div>")
						.addClass("ip-btn-panel")
						.appendTo(this.tabControl);
				for (var i = 0; i < options.tabs.length; i++)
				{
					if (!options.tabbed)
					{
						var btn = $("<button>")
							.addClass("ip-btn")
							.text(options.tabs[i].title)
							.attr("data-popup", "false")
							.attr("data-url", this._appendParams(options.processURL.ajax, options.tabs[i].href))
							.appendTo(this.buttonPanel)
							.button()
							.click(function() {
								self._requestPreview(options.currentPage, $(this));
							});
					}
					
					if (options.popupButton)
					{
						btn = $("<button>")
							.addClass("ip-btn")
							.text(options.tabs[i].title)
							.attr("data-popup", "true")
							.attr("data-url", this._appendParams(options.processURL.popup, options.tabs[i].href))
							.appendTo(this.popUpButtonPanel)
							.button()
							.click(function() {
								self._requestPreview(options.currentPage, $(this));
							});
					}
				}
			}
			
			this._trigger("createdPreview", null, this);
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
		_init: function() {
			// put init stuff here
			var self = this,
				options = self.options;
			
			if (self.tabControl != null && options.tabbed && options.autoLoadOnStart)
			{
				self.tabControl.tabs("select", options.defaultSelectedTab);
			}
			
			this._trigger("initialisedPreview", null, this);
		},
		_requestPreview: function( pageToPreview, ui ) {
			this._trigger("requestingPreview", null, this);
			
			var result = true,
				self = this,
				options = self.options,
				elem = self.element;
			
			var ajaxUrl = "";
			var isPopup = false;
			if (ui.tab)
			{
				ajaxUrl = $(ui.tab).attr("data-url");
				isPopup = this._parseBool($(ui.tab).attr("data-popup"));
			}
			else
			{
				ajaxUrl = $(ui).attr("data-url");
				isPopup = this._parseBool($(ui).attr("data-popup"));
			}
			
			if (isPopup)
			{
				self._popupDisplay( "Preview", ajaxUrl );
			}
			else
			{
				if (this._guidInternalPreviewResponseGUID.length == 0)
				{
					this.previewContainer
						.addClass("loading")
						.css("background-image", "url(" + options.processingImage + ")");
					
					this._guidInternalPreviewResponseGUID = this._generateCustomGuid('IP', false, false);
					ajaxUrl = this._appendParam(ajaxUrl, options.proccessIdQuerystringParamName, this._guidInternalPreviewResponseGUID)
					
					this.previewContainer.find("img").animate({ opacity: 0 }, options.fadeSpeed);
					
					var postFormData = $('form' + options.formId).serializeArray();
					
					$.ajax({
						type: 'POST',
						data: postFormData,
						contentType: 'application/x-www-form-urlencoded',
						url: ajaxUrl,
						dataType: 'json',
						cache: false,
						success: function(oResponse, sErrorDesc, oXHTTPRequest)
						{
							try
							{
								if (self._guidInternalPreviewResponseGUID == oResponse.PreviewRequestGUID)
								{
									if (oResponse.Status == 'Cancelled')
										window.location = oResponse.CancelledURL; // cancelled order so redirect to the cancelled url
									else
									//if (oResponse.Status == 'OK')
									//	RenderPreview(strFrameId, oResponse.Params, strPageRange, fPopupWindow, nPreviewWidth, nPreviewHeight, self._guidInternalPreviewResponseGUID, fIsThankYouEmail);
									//else
									if (oResponse.Status == 'Preview' || oResponse.Status == 'Error' || oResponse.Status == 'Warning')
									{
										// now we need to update the HTML of the preview
										if (oResponse.PreviewImage.length != 0)
										{
											self._embedScaledImage( oResponse.PreviewImage, oResponse.PreviewLink )
										}
										else
										{
											if (oResponse.PreviewLink.length != 0)
											{
												self.previewContainer
													.removeClass("loading")
													.css("background-image", "none");
												
												self._guidInternalPreviewResponseGUID = "";
												
												self._popupDisplay( "Preview", oResponse.PreviewLink );
											}
											else
											{
												self._displayError( "No preview data was returned.", "circle-close", true );
											}
										}
										
										if (oResponse.Status == 'Error' || oResponse.Status == 'Warning')
										{
											var icon = (oResponse.Status === "Error" ? "circle-close" : "alert");
											self._displayError( self._getErrorMessages(oResponse.ErrorCode), icon, true );
										}
									}
									else
									{
										if (oResponse.Status != 0)
											self._displayError( "An invalid response was returned by the preview request script.", "circle-close", true );
									}
								}
							}
							catch(e)
							{
								self._displayError( "There was an error processing the preview request data.", "circle-close", true );
							}
						},
						error: function(oXHTTPRequest, sErrorDesc, oError)
						{
							if (oXHTTPRequest.status != 0)
								self._displayError( "There was an error requesting the preview.", "circle-close", true );
						}
					});
				}
				else
				{
					self._displayError( "There is already a preview being generated.", "alert", false );
					result = false;
				}
			}
			
			this._trigger("previewRequested", null, this);
			
			return result;
		},
		_popupDisplay: function( title, displaySrc ) {
			var self = this,
				options = self.options;
			
			this.messageDialog = $("<div></div>")
				.attr("id", "preview-dialog")
				.attr("title", title)
				.appendTo(this.element);
			
			var contentIFrame = $("<iframe></iframe>")
				.attr("src", displaySrc)
				.css({
					height: options.height,
					width: options.width
				})
				.appendTo(this.messageDialog);
			
			this.messageDialog.dialog({
				resizable: false,
				heigth: options.height + 25,
				width: options.width + 25,
				draggable: false,
				modal: true,
				buttons: {
					OK: function() {
						$( this ).dialog( "close" );
						$( this ).remove();
					}
				}
			});
		},
		_getErrorMessages: function( errorCode ) {
			var errorMessage = '';
			
			switch (errorCode)
			{
				case 'ERROR_UNKNOWN': errorMessage = 'An Unknown Error Occured.'; break;
				case 'ERROR_TEXTOVERFLOW': errorMessage = 'Your text has overflowed.'; break;
				case 'ERROR_GLYPHMISSING': errorMessage = 'There is a glyph missing.'; break;
				case 'ERROR_CORRUPTPROJECT': errorMessage = 'The project has been corupted.'; break;
				case 'ERROR_FONTNOTFOUND': errorMessage = 'A required font was not found.'; break;
				case 'ERROR_RASTERIZATION': errorMessage = 'The rasterization process has failed.'; break;
				case 'ERROR_HTMLGENERATION': errorMessage = 'The HTML failed to generate.'; break;
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
		_embedScaledImage: function( imageSrc, imageLinkURL ) {
			this._trigger("embedingScaledImage", null, this);
			
			var self = this,
				options = self.options;
			
			// embed the image and remove the background spinner
			var img = new Image();
			$(img)
				.load(function ()
				{
					try
					{
						var divWidth = self.previewContainer.width();
						divWidth = ($.type(divWidth) != 'number' || divWidth == 0 ? options.width : divWidth);
						var divHeight = self.previewContainer.height();
						divHeight = ($.type(divHeight) != 'number' || divHeight == 0 ? options.height : divHeight);
						
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
					}
					catch (e)
					{
						self._displayError( "There was an error scaling the preview image.", "circle-close", true );
					}
					
					var newImageElem = $('\<img src="' + img.src + '" /\>')
						.attr('alt', 'Preview Image'
						.css('border', '0')
						.css('width', img.width)
						.css('height', img.height)
						.css('opacity', '0');
						//.css('display', 'block');
					
					var imgContainer = self.previewContainer;
					if (!$.support.opacity)     // IE doesn't support opacity, so we can use it as a test
					{
						var divHeight = imgContainer.height();
						divHeight = ($.type(divHeight) !== 'number' || divHeight === 0 ? options.height : divHeight);
						
						var padT = Math.round((divHeight - img.height) / 2);
						
						newImageElem.css('top', padT);
					}
					
					var bWithLink = false;
					if ($.type(imageLinkURL) === 'string')
					{
						bWithLink = (imageLinkURL.length != 0);
					}
					
					// clear the current contence of the container before adding the new image / anchor
					imgContainer.empty();
					
					if (bWithLink)
					{
						var previewLink = $('\<a target="_new" id="preview_' + self._guidInternalPreviewResponseGUID + '" href="' + imageLinkURL + '"\></a>');
						previewLink.appendTo(imgContainer);
						
						// reset the imgContainer object to be the newly appended anchor tag.
						imgContainer = previewLink;
					}
					newImageElem.appendTo(imgContainer);
					
					newImageElem.animate({ opacity: 1 }, options.fadeSpeed, function() {
						self.previewContainer
							.removeClass("loading")
							.css("background-image", "none");
						
						self._guidInternalPreviewResponseGUID = "";
					});
				})
				.error(function ()
				{
					self._displayError( "There was an error loading the preview image.", "circle-close", true );
				})
				.attr('src', imageSrc);
			
			this._trigger("embededScaledImage", null, this);
		},
		_displayError: function( errorMessage, iconClass, removeSpinner ) {
			// show error and remove the background spinner
			var title = (iconClass == "circle-close" ? "An Error Occured" : "Warning");
			
			this.messageDialog = $("<div></div>")
				.attr("id", "error-dialog")
				.attr("title", title)
				.appendTo(this.element);
			
			var icon = $("<span></span>")
				.addClass("ui-icon ui-icon-" + iconClass)
				.css({
					"float": "left",
					"margin": "0 7px 50px 0"
				});
			
			if (errorMessage.length == 0)
				errorMessage = "An unknown error occured.";
			var para = $("<p></p>")
				.text(errorMessage)
				.prepend(icon)
				.appendTo(this.messageDialog);
			
			this.messageDialog.dialog({
				resizable: false,
				modal: true,
				draggable: false,
				buttons: {
					OK: function() {
						$( this ).dialog( "close" );
						$( this ).remove();
					}
				}
			});
			
			if (removeSpinner)
			{
				this.previewContainer
					.removeClass("loading")
					.css("background-image", "none");
				
				this._guidInternalPreviewResponseGUID = "";
			}
		}
	});
})(jQuery);
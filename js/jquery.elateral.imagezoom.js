(function ($) {
    $.widget('elateral.imagezoom', {
        options: {
            log: true,
            locale: "en-GB",
            templateName: null,
            magnifyContainerClass: null
        },

        _largeImageUri: null,

        _zoomer: null,

        _setOption: function (key, value) {
            if (this.options[key] === value) {
                return this;
            }

            switch (key) {
                case "log":
                    this.options.log = value;
                    break;
                case "locale":
                    this.options.locale = value;
                    break;
                case "templateName":
                    this.options.templateName = value;
                    break;
                case "magnifyContainerClass":
                    this.options.magnifyContainerClass = value;
                    break;
            }
        },

        _create: function () {
            this.log("_create");

            this._ajaxGetTranslations();
            this._largeImageUri = $(this.element).attr("src");
            this._createZoom();
            this._createWait();
        },

        _init: function () {
            this.log("_init");

        },

        _createZoom: function () {
            var self = this;

            this._zoomer = $(this.element).addimagezoom({
                zoomrange: [3, 10],
                cursorshade: true,
                hoverTitle: self._getTranslation("{Label_ZoomTitle}"),
                hoverDescription: self._getTranslation("{Label_ZoomDescription}"),
                magnifyContainerClass: self.options.magnifyContainerClass,
                largeimage: self._largeImageUri,
                generatelargeimage: function () {
                    if (self._largeImageUri == $(self.element).attr("src")) {
                        self._generatePdf();
                    }
                },
                mouseOverCallBack: function () {
                    $(self.element).trigger("zoomMouseOver", {});
                    if ($(".zoomWait"))
                        $(".zoomWait").show();
                    //$("#zoomWait").ajaxspinner("show");
                },
                mouseOutCallBack: function () {
                    $(self.element).trigger("zoomMouseOut", {});
                    if ($(".zoomWait"))
                        $(".zoomWait").hide();
                    // $(".zoomWait").ajaxspinner("hide");
                }
            });
        },

        _createWait: function () {
            var container = $(this.options.magnifyContainerClass);

            container
                .prepend($("<div>" + this._getTranslation("{Label_ZoomLoading}") + "</div>")
                        .addClass("zoomWait")
                        .css("top", container.height() / 2)
                        .css("left", (container.width() / 2) - 55));

            $(".zoomWait").hide();

            //                    .ajaxspinner({
            //                         size: "large"
            //                    }));
        },

        _destroyWait: function () {
            $(".zoomWait")
                .removeData()
                .remove();
        },

        destroyZoom: function () {
            $(".magnifyarea")
                .removeData()
                .remove();
            $(".zoomstatus")
                .removeData()
                .remove();
            $(".zoomtracker")
                .removeData()
                .remove();
            $(".cursorshade")
                .removeData()
                .remove();
            $(".zoomWait")
                .removeData()
                .remove();
        },

        _generatePdf: function () {
            var self = this;
            $.generatePdfForDownloadAsynch("low", self.options.templateName, 1200, 1200, function (result) {
                self._triggerPdfLoaded(result);
                self._destroyWait();
            });
        },

        _triggerPdfLoaded: function (result) {
            if (result.location) {
                var imageUri = this._rewriteUrl(result.location);

                $(".magnifyarea")
                    .find("img")
                    .trigger("loadevt", { largeImageUri: imageUri });
            }
        },

        _rewriteUrl: function (url) {
            var urlArr = url.split('&');
            return urlArr[0].replace(".pdf", ".pdf.jpg").concat("&", urlArr[1], "&", urlArr[2].replace(".pdf", ".jpg"));
        },

        _getTranslation: function (text) {
            try {
                return this._translations[text];
            }
            catch (err) {
                this.log("Cannot find translation for " + text);
            }

            return text;
        },

        _ajaxGetTranslations: function () {
            this.log("_ajaxGetTranslations");
            this._translations = new Array();

            switch (this.options.locale) {
                case "zh-cn":
                    this._translations["{Label_ZoomTitle}"] = "当前缩放比例: ";
                    this._translations["{Label_ZoomDescription}"] = "使用鼠标滚轮放大/缩小";
                    this._translations["{Label_ZoomLoading}"] = "正在加载...";
                    break;
                case "de":
                    this._translations["{Label_ZoomTitle}"] = "aktuellen Zoom: ";
                    this._translations["{Label_ZoomDescription}"] = "Mausrad benutzen, um In / Out Zoom";
                    this._translations["{Label_ZoomLoading}"] = "Loading...";
                    break;
                case "tr":
                    this._translations["{Label_ZoomTitle}"] = "Geçerli Yakınlaştırma: ";
                    this._translations["{Label_ZoomDescription}"] = "Fare Tekerleğini kullanarak Yakınlaştır/Uzaklaştır";
                    this._translations["{Label_ZoomLoading}"] = "Yükleniyor...";
                    break;
                case "ru":
                    this._translations["{Label_ZoomTitle}"] = "Current Zoom: ";
                    this._translations["{Label_ZoomDescription}"] = "Use Mouse Wheel to Zoom In/Out";
                    this._translations["{Label_ZoomLoading}"] = "Loading...";
                    break;
                case "pt":
                case "pt-br":
                    this._translations["{Label_ZoomTitle}"] = "Current Zoom: ";
                    this._translations["{Label_ZoomDescription}"] = "Use Mouse Wheel to Zoom In/Out";
                    this._translations["{Label_ZoomLoading}"] = "Loading...";
                    break;
                case "th":
                    this._translations["{Label_ZoomTitle}"] = "Current Zoom: ";
                    this._translations["{Label_ZoomDescription}"] = "Use Mouse Wheel to Zoom In/Out";
                    this._translations["{Label_ZoomLoading}"] = "Loading...";
                    break;
                case "fr":
                    this._translations["{Label_ZoomTitle}"] = "Current Zoom: ";
                    this._translations["{Label_ZoomDescription}"] = "Use Mouse Wheel to Zoom In/Out";
                    this._translations["{Label_ZoomLoading}"] = "Loading...";
                    break;
                case "ja":
                    this._translations["{Label_ZoomTitle}"] = "Current Zoom: ";
                    this._translations["{Label_ZoomDescription}"] = "Use Mouse Wheel to Zoom In/Out";
                    this._translations["{Label_ZoomLoading}"] = "Loading...";
                    break;
                case "es":
                case "es-ar":
                case "es-co":
                case "es-cr":
                case "es-do":
                case "es-gt":
                case "es-hn":
                case "es-mx":
                case "es-ni":
                case "es-pa":
                case "es-pr":
                case "es-sv":
                case "es-ve":
                    this._translations["{Label_ZoomTitle}"] = "Current Zoom: ";
                    this._translations["{Label_ZoomDescription}"] = "Use Mouse Wheel to Zoom In/Out";
                    this._translations["{Label_ZoomLoading}"] = "Loading...";
                    break;
                default:
                    this._translations["{Label_ZoomTitle}"] = "Current Zoom: ";
                    this._translations["{Label_ZoomDescription}"] = "Use Mouse Wheel to Zoom In/Out";
                    this._translations["{Label_ZoomLoading}"] = "Loading...";
                    break;
            }
        },

        log: function (msg) {
            if (!this.options.log) return;

            if (window.console && console.log) { // firebug logger or IE Dev 
                console.log("imagezoom: " + msg);
            }
        }
    });

})(jQuery);


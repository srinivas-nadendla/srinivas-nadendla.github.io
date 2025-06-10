/* ExtFallback - Start */
var ExtFallback = (function () {
    var enumerables = [ //'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
        'valueOf', 'toLocaleString', 'toString', 'constructor'
    ],
        arrayPrototype = Array.prototype,
        supportsIndexOf = 'indexOf' in arrayPrototype,
        slice = arrayPrototype.slice;

    return { // public interface
        isString: function (value) {
            return typeof value === 'string';
        },

        getUuid: function (strGuid) {
            var uuid;
            if (strGuid) {
                strGuid = strGuid.replace(/-/g, '');
                if (strGuid.length !== 32) {
                    console.error("Invalid guid string");
                    return null;
                }
                uuid = strGuid.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, '$1-$2-$3-$4-$5');

            } else {
                var d = new Date().getTime();
                uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            }
            return uuid;
        },
        Object: {
            isEmpty: function (object) {
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        return false;
                    }
                }
                return true;
            }
        },
        isEmpty: function (value, allowEmptyString) {
            return (value == null) || (!allowEmptyString ? value === '' : false) || (ExtFallback.isArray(value) && value.length === 0);
        },

        isArray: ('isArray' in Array) ? Array.isArray : function (value) {
            return toString.call(value) === '[object Array]';
        },
        applyIf: function (object, config) {
            if (object && config && typeof config === 'object') {
                for (var property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }

            return object;
        },
        apply: function (object, config, defaults) {
            if (object) {
                if (defaults) {
                    ExtFallback.apply(object, defaults);
                }

                if (config && typeof config === 'object') {
                    var i, j, k;

                    for (i in config) {
                        object[i] = config[i];
                    }

                    if (enumerables) {
                        for (j = enumerables.length; j--;) {
                            k = enumerables[j];
                            if (config.hasOwnProperty(k)) {
                                object[k] = config[k];
                            }
                        }
                    }
                }
            }

            return object;
        },

        Array: {
            contains: supportsIndexOf ? function (array, item) {
                return arrayPrototype.indexOf.call(array, item) !== -1;
            } : function (array, item) {
                var i, ln;

                for (i = 0, ln = array.length; i < ln; i++) {
                    if (array[i] === item) {
                        return true;
                    }
                }

                return false;
            },
            clean: function (array) {
                var results = [],
                    i = 0,
                    ln = array.length,
                    item;

                for (; i < ln; i++) {
                    item = array[i];

                    if (!ExtFallback.isEmpty(item)) {
                        results.push(item);
                    }
                }

                return results;
            },
        },
        isDefined: function (value) {
            return typeof value !== 'undefined';
        },

        isFunction: (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function (value) {
            return !!value && toString.call(value) === '[object Function]';
        } : function (value) {
            return !!value && typeof value === 'function';
        },

        isIterable: function (value) {
            // To be iterable, the object must have a numeric length property and must not be a string or function.
            if (!value || typeof value.length !== 'number' || typeof value === 'string' || ExtFallback.isFunction(value)) {
                return false;
            }

            // Certain "standard" collections in IE (such as document.images) do not offer the correct
            // Javascript Object interface; specifically, they lack the propertyIsEnumerable method.
            // And the item property while it does exist is not typeof "function"
            if (!value.propertyIsEnumerable) {
                return !!value.item;
            }

            // If it is a regular, interrogatable JS object (not an IE ActiveX object), then...
            // If it has its own property called "length", but not enumerable, it's iterable
            if (value.hasOwnProperty('length') && !value.propertyIsEnumerable('length')) {
                return true;
            }

            // Test against whitelist which includes known iterable collection types
            return iterableRe.test(toString.call(value));
        },
        pass: function (fn, args, scope) {
            if (!ExtFallback.isArray(args)) {
                if (ExtFallback.isIterable(args)) {
                    args = ExtFallback.Array.clone(args);
                } else {
                    args = args !== undefined ? [args] : [];
                }
            }

            return function () {
                var fnArgs = args.slice();
                fnArgs.push.apply(fnArgs, arguments);
                return fn.apply(scope || this, fnArgs);
            };
        },

        isMobile: {
            Android: function () {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function () {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function () {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function () {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function () {
                return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
            },
            any: function () {
                return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
            }
        },

        isDesktop: function () {
            return !this.isMobile.any();
        },

        GlobalEvents: {
            fireEvent: function (eventName, args) {
                console.log('GlobalEvents fireEvent =====>', eventName, args)
            }
        }

    };
})();

function assignExt(ExtFallback) {
    var Ext = ExtFallback;
}
/* ExtFallback - End */

/* SketchConstants - Start */
var SketchConstants = (function () {
    var privateVar = '';
    
    function privateMethod() {
        // ...
    }
    
    return { // public interface
        modes: {
            EDIT: 'edit',
            VIEW: 'view',
            NONE: 'none'
        },
        
        ZoomConfig: {
            MinimumZoom: 0.1,
            MaximumZoom: 13
        },
        
        hoverSupportedMarkups: ['extractionArea'],
        
        markupActions: {
            InitialLoad: 0,
            Add: 1,
            Update: 2,
            Delete: 3
        }
    };
})();
/* SketchConstants - End */

/* IQSketchLightHelper - Start */
var IQSketchLightHelper = (function () {

    return {
        zoomToArea: function (drawingContext, pointer, currentObj, minZoom, maxZoom, curScale, callback) {

            var staticObjCoord = {
                left: pointer.x,
                top: pointer.y,
                width: currentObj.width,
                height: currentObj.height
            };

            //Evaluate sheet canvas scale to fit object to canvas
            var zW = drawingContext.topCanvas.width / staticObjCoord.width,
                zH = drawingContext.topCanvas.height / staticObjCoord.height,
                scale = zW < zH ? zW : zH;

            if (scale < minZoom) {
                scale = minZoom;
            }

            if (scale > maxZoom) {
                scale = maxZoom;
            }

            var adjustedScale = IQSketchLightZoomHandler.getNormalizedZoomLevel(scale);

            //Evaluate viewport transform for sheet and top canvas
            var adjLeft = currentObj.originX == "left" ? currentObj.left : currentObj.left - currentObj.width / 2,
                adjTop = currentObj.originY == "top" ? currentObj.top : currentObj.top - currentObj.height / 2;

            if (currentObj.width < 0) {
                adjLeft = adjLeft + currentObj.width;
            }
            if (currentObj.height < 0) {
                adjTop = adjTop + currentObj.height;
            }

            adjLeft = (-1 * adjLeft * adjustedScale), adjTop = (-1 * adjTop * adjustedScale);
            adjLeft = adjLeft + ((drawingContext.topCanvas.width - (currentObj.width * adjustedScale)) / 2);
            adjTop = adjTop + ((drawingContext.topCanvas.height - (currentObj.height * adjustedScale)) / 2);

            IQSketchLightZoomHandler.panAndZoom(drawingContext, {
                zoom: adjustedScale,
                left: adjLeft,
                top: adjTop
            }, function () {
                callback && callback();
            });
        },

        evaluateImagePointer: function (drawingContext, point, isRelative) {

            if (!point || !drawingContext) return new fabric.Point(0, 0);

            // returns point relativeness with respect to the image
            var imageWidth = drawingContext.imageWidth || 1,
                imageHeight = drawingContext.imageHeight || 1,
                wfactor = isRelative ? 1 / imageWidth : imageWidth,
                hfactor = isRelative ? 1 / imageHeight : imageHeight;

            return new fabric.Point(point.x * wfactor, point.y * hfactor);
        },

        evalMarkupByMouseEvent: function (drawingContext, mouseEvent) {

            var pointer = drawingContext.topCanvas.getPointer(mouseEvent.e, true),
                markupObject,
                pointOverMarkupObject = function (markup, point) {
                    return markup && markup.containsPoint && markup.containsPoint(point);
                };
            for (var key in drawingContext.cacheCanvas.getObjects()) {
                var obj = drawingContext.cacheCanvas.getObjects()[key];
                if (!pointOverMarkupObject(obj, pointer)) { } else
                    markupObject = obj;
            }

            return markupObject;
        },

        resizeCanvasIcons: function (curContext) {
            var that = this;
            var arr = ['cacheCanvas', 'topCanvas'];

            for (var key in arr) {
                var canvas = arr[key];
                that.resizeMarkups(curContext[canvas].getObjects(), curContext);
                curContext[canvas].renderAll();
            }
        },

        resizeMarkups: function (markups, curContext) {
            for (var key in markups) {
                var markup = markups[key];
                switch (markup.markuptype) {
                    case 'extractionArea':
                        markup.set('strokeWidth', 4 / curContext.topCanvas.getZoom());
                        break;
                }
            }
        },

        evaluateObjectsBoundary: function (objects, curContext) {
            var x1 = 0,
                x2 = 0,
                y1 = 0,
                y2 = 0,
                zoom = curContext.topCanvas.getZoom(),
                eachObjCoords = [];
            for (var key in objects) {
                var object = objects[key];
                var centerPoint = object.getCenterPoint(),
                    borderWidth = (object.getBoundingRect().width) / zoom,
                    borderHeight = (object.getBoundingRect().height) / zoom,
                    left = centerPoint.x - (borderWidth / 2),
                    top = centerPoint.y - (borderHeight / 2),
                    width = centerPoint.x + (borderWidth / 2),
                    height = centerPoint.y + (borderHeight / 2),
                    temp = 0;

                eachObjCoords.push({
                    left: left,
                    top: top,
                    width: borderWidth,
                    height: borderHeight
                });

                x1 === 0 && (x1 = left);
                y1 === 0 && (y1 = top);

                x1 = left < x1 ? left : x1;
                y1 = top < y1 ? top : y1;

                temp = width;
                x2 = temp > x2 ? temp : x2;

                temp = height;
                y2 = temp > y2 ? temp : y2;
            }

            return {
                width: x2 - x1,
                height: y2 - y1,
                left: x1,
                top: y1,
                eachObjCoords: eachObjCoords
            };
        },

        MarkupInfoTooltip: function () {
            var toolTipComponents = [];

            function show(pointer, markupData) {

                if (!pointer) {
                    return console.error("Missing pointer to show tooltip");
                }

                var tooltipExists = false;

                markupData.markupId && toolTipComponents.forEach(function (cmp) {
                    cmp.markupId == markupData.markupId && !cmp.destroyed && (tooltipExists = true);
                });
                markupData.markupId && toolTipComponents.forEach(function (cmp) {
                    cmp.markupId == markupData.markupId && !cmp.destroyed && (tooltipExists = true);
                });

                if (tooltipExists) return;
                else destroy();

                /* var isModern = false,
                    btnXtype = isModern ? 'Ext.Button' : 'Ext.button.Button',
                    btn = Ext.create(btnXtype, {
                        ui: 'plain',
                        text: '',
                        width: 10,
                        height: 10,
                        renderTo: Ext.getBody(),
                        disabled: true,
                        style: 'position:absolute; left:' + pointer.x + 'px; top:' + pointer.y + 'px;'
                    }),
                    infoToolTip = _showMarkupHover(markupData);

                if (!infoToolTip) return;

                infoToolTip.targetBtn = btn;
                infoToolTip.markupId = markupData.markupId;
                if (isModern && Ext.isEmpty(markupData.locationId)) {
                    infoToolTip.showBy(btn, 'tl-tr?');
                } else {
                    //Adding delay to show markup tooltip when classic 
                    var task = new Ext.util.DelayedTask(function () {
                        !infoToolTip.destroyed && infoToolTip.showBy(btn, 'tl-tr?');
                    });
                    task.delay(500);
                } */
                if (!markupData.text) return;
                var infoToolTipText = _getMarkupInfoTooltipData(markupData),
                    infoToolTip = document.createElement("div");
                infoToolTip.setAttribute("class", "markup-tooltip");
                infoToolTip.setAttribute("style", 'position:absolute; left:' + pointer.x + 'px; top:' + pointer.y + 'px;');
                infoToolTip.innerHTML = infoToolTipText;
                document.getElementsByTagName('body')[0].appendChild(infoToolTip);
                toolTipComponents.push(infoToolTip);

            }

            function _getMarkupInfoTooltipData(markupData, appType) {
                var name = '<span class = markup-info-name>' + markupData.text + '</span>',
                    data = "<div class=arrow-up></div><div class = markup-info-parent>" + name + "</div>";

                return data;
            }

            /* function _showMarkupHover(markupData) {
                return Ext.create('Ext.tip.ToolTip', {
                    cls: 'markup-tooltip',
                    anchor: 'top',
                    autoHide: false,
                    html: _getMarkupInfoTooltipData(markupData)
                });
            } */

            function destroy() {
                toolTipComponents.forEach(function (cmp) {
                    cmp.targetBtn && cmp.targetBtn.destroy();
                    cmp.destroy && cmp.destroy();
                    cmp.remove && cmp.remove();
                });
                toolTipComponents = [];
            }

            function getTooltipsComponents() {
                return toolTipComponents;
            }

            return {
                show: show,
                destroy: destroy,
                getTooltipsComponents: getTooltipsComponents
            }
        }()
    }
})();
/* IQSketchLightHelper - End */

/* IQSketchLightZoomHandler - Start */
var IQSketchLightZoomHandler = (function () {

    return { // public interface
        _updateCanvasViewportTransform: function (canvas, zoom, left, top) {
            var vpt = canvas.viewportTransform;
            vpt[0] = zoom;
            vpt[3] = zoom;
            vpt[4] = left;
            vpt[5] = top;
            canvas.setViewportTransform(vpt);
        },

        _zoomCanvasesToExtent: function (drawingContext) {
            var correctionFactor = -10,
                imgWidth = drawingContext.imageWidth,
                imgHeight = drawingContext.imageHeight,
                canvasWidth = drawingContext.topCanvas.width + correctionFactor,
                canvasHeight = drawingContext.topCanvas.height + correctionFactor;

            var zW = canvasWidth / imgWidth,
                zH = canvasHeight / imgHeight,
                adjustedScale = zW < zH ? zW : zH;

            adjustedScale = this.getNormalizedZoomLevel(adjustedScale);

            var adjLeft = ((drawingContext.topCanvas.width - (imgWidth * adjustedScale)) / 2),
                adjTop = ((drawingContext.topCanvas.height - (imgHeight * adjustedScale)) / 2);

            drawingContext.extentZoom = adjustedScale;

            this._updateCanvasViewportTransform(drawingContext.topCanvas, adjustedScale, adjLeft, adjTop);
        },

        initializeDrawingState: function (drawingContext, doZoomExtent, callBack) {

            drawingContext.topCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

            var imgWidth = drawingContext.imageWidth,
                imgHeight = drawingContext.imageHeight;

            doZoomExtent && this.zoomExtent(drawingContext, callBack);

        },

        zoomExtent: function (drawingContext, callBack) {
            this._zoomCanvasesToExtent(drawingContext);
            this.zoomBackground(drawingContext, callBack);
        },

        zoomIn: function (drawingContext, callBack) {
            this.applyZoom(drawingContext, drawingContext.topCanvas.getZoom() * 1.2, callBack);
        },

        zoomOut: function (drawingContext, callBack) {
            this.applyZoom(drawingContext, drawingContext.topCanvas.getZoom() / 1.2, callBack);
        },

        applyZoom: function (drawingContext, currentScale, callBack) {
            var point = new fabric.Point(drawingContext.topCanvas.width / 2, drawingContext.topCanvas.height / 2);

            currentScale = this.getNormalizedZoomLevel(currentScale);

            drawingContext.topCanvas.zoomToPoint(point, currentScale);

            this.zoomBackground(drawingContext, callBack);
        },

        panAndZoom: function (drawingContext, zoomData, callBack) {
            this._updateCanvasViewportTransform(drawingContext.topCanvas, zoomData.zoom, zoomData.left, zoomData.top);
            this.zoomBackground(drawingContext, callBack);
        },

        zoomBackground: function (drawingContext, callBack) {
            drawingContext.imageHandler.zoomToPercent(drawingContext.topCanvas.viewportTransform[0],
                drawingContext.topCanvas.viewportTransform[4], drawingContext.topCanvas.viewportTransform[5],
                function () {
                    drawingContext.cacheCanvas.setViewportTransform(drawingContext.topCanvas.viewportTransform);
                    callBack && callBack();
                });
        },

        getNormalizedZoomLevel: function (zoom) {
            const maxZoom = 13,
                minZoom = 0.1;

            if (zoom < minZoom) zoom = minZoom;
            else if (zoom > maxZoom) zoom = maxZoom;

            return zoom;
        }
    };
})();
/* IQSketchLightZoomHandler - End */

/* ImageHandler - Start */
class ImageHandler {
    constructor() {
        this.zoomPercent = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoomSettings = null;
        this.zoomLevelMin = 0;
        this.zoomLevelMax = 0;
        this.canvasLeft = 0;
        this.canvasTop = 0;
        this.canvasWidth = null;
        this.canvasHeight = null;
        this.canvas = null;
        this.zoomLevel = 0;
        this.minZoom = 0;
        this.maxZoom = 4;
        this.imageWidth = null;
        this.imageHeight = null;
        this.ctx = null;
        this.zoomLevelFull = -1;
    }


    _requestPaint(callbackAfterPaint) {
        var that = this,
            animRequest = window.requestAnimationFrame;
        if (animRequest) {
            animRequest(function () {
                that._paintImage(callbackAfterPaint);
            });
        } else {
            window.setTimeout(function () {
                that._paintImage(callbackAfterPaint);
            }, 10);
        }
    }

    _loadImage(callback) {
        var that = this;

        this.image = new Image();
        this.image.src = this.imageUrl;

        this.image.onload = function () {
            that.imageWidth = this.width;
            that.imageHeight = this.height;
            callback();
        };
    }

    _paintImage(callbackAfterPaint) {
        var zoomPower = Math.pow(2, this.zoomLevel),
            x1 = this.offsetX,
            y1 = this.offsetY;

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.ctx.drawImage(this.image, Math.ceil(x1), Math.ceil(y1), Math.ceil(this.imageWidth * this.zoomLevel), Math.ceil(this.imageHeight * this.zoomLevel));

        callbackAfterPaint && callbackAfterPaint();
    }

    init(settings) {
        this.zoomSettings = settings;
        this.canvas = settings.canvas;
        this.zoomLevel = settings.defaultZoom && settings.defaultZoom;
        this.minZoom = settings.minZoom;
        this.maxZoom = settings.maxZoom;
        this.zoomLevelMin = settings.minZoom;
        this.zoomLevelMax = settings.maxZoom;
        this.imageHeight = settings.imageHeight;
        this.imageWidth = settings.imageWidth;
        this.ctx = this.canvas.getContext('2d');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.imageUrl = settings.imageUrl;
        this.ctx.webkitImageSmoothingEnabled = true;
        this.ctx.mozImageSmoothingEnabled = true;
        this.ctx.imageSmoothingEnabled = true;
        this._initTiles(settings);
    }

    _initTiles(settings) {
        var that = this;
        this._loadImage(function () {
            settings.callback && settings.callback({
                imageWidth: that.imageWidth,
                imageHeight: that.imageHeight
            });
        });
    }

    updateCanvasData(settings) {
        this.canvasWidth = settings.canvasWidth;
        this.canvasHeight = settings.canvasHeight;
        this.canvasRight = this.canvasWidth;
        this.canvasBottom = this.canvasHeight;

        settings.imageUrl && (this.imageUrl = settings.imageUrl);

        this.canvasLeft = this.canvasTop = this.offsetX = this.offsetY = 0;

        this.ctx = this.canvas.getContext('2d');

        this._initTiles(settings);
    }

    zoomToPercent(zoom, left, top, callbackAfterPaint) {
        //find closest zoomlevel tiles that we can paint
        var curZoomLevel = zoom;
        this.zoomPercent = zoom;

        if (curZoomLevel >= this.zoomLevelMin && curZoomLevel <= this.zoomLevelMax) {
            this.zoomLevel = curZoomLevel;
            this.offsetX = left;
            this.offsetY = top;
            this._paintImage(callbackAfterPaint);
        }
    }
}
/* ImageHandler - End */

/* SketchLightDesktopPan - Start */
var SketchLightDesktopPan = (function () {
    var isDown = false,
        x = 0,
        y = 0,
        panCounter = 0;

    return {
        start: function (drawingContext, mouseEvent, pointer) {
            var pointer = pointer ? pointer : drawingContext.topCanvas.getPointer(mouseEvent.e, true);
            this.appId = drawingContext.appId;

            x = pointer && pointer.x;
            y = pointer && pointer.y;
            isDown = true;
            panCounter = 1;
        },

        move: function (drawingContext, mouseEvent, pointer) {
            if (isDown !== true || this.appId != drawingContext.appId) {
                isDown && this.destroy();
                return;
            }
            panCounter++;
            var pointer = pointer ? pointer : drawingContext.topCanvas.getPointer(mouseEvent.e, true),
                point = new fabric.Point(pointer.x - x, pointer.y - y);

            this.panCanvases(drawingContext, point, pointer);

            x = pointer.x;
            y = pointer.y;
        },

        end: function (drawingContext, mouseEvent, pointer) {
            this.destroy();

            this.onPanEnd(drawingContext, mouseEvent)
        },

        destroy: function () {
            isDown = false;
            x = 0, y = 0;
            panCounter = 0;
        },

        panCanvases: function (drawingContext, point, pointer) {
            drawingContext.topCanvas.relativePan(point);
            IQSketchLightZoomHandler.zoomBackground(drawingContext);

            this.onAfterPan(drawingContext, pointer);
        },

        onAfterPan: function (drawingContext, pointer) {
            ExtFallback.GlobalEvents.fireEvent('panCanvas', {
                action: 'panCanvas',
                appId: drawingContext.appId,
                data: {
                    start: new fabric.Point(x, y),
                    end: pointer
                }
            });
        },

        onPanEnd: function (drawingContext, mouseEvent) {
            IQSketchLightZoomHandler.zoomBackground(drawingContext, function () {
                var markupObject = IQSketchLightHelper.evalMarkupByMouseEvent(drawingContext, mouseEvent);
                if (!markupObject) return;

                drawingContext.topCanvas.fire('object:selected', {
                    target: markupObject,
                    e: drawingContext.topCanvas.getPointer(mouseEvent.e, true)
                });
            });
        }
    }
})();
/* SketchLightDesktopPan - End */

/* SketchLightTouchPan - Start */
var SketchLightTouchPan = (function () {

    var isDown = false,
        isMoving = false,
        ispan = false,
        x = 0,
        y = 0,
        panCounter = 0,
        zoomFactor = 1,
        initialDistance = 0,
        cachePointer = {},
        SCALE_FACTOR = 1.2;

    return {
        start: function (drawingContext, mouseEvent) {
            var point = drawingContext.topCanvas.getPointer(mouseEvent.e, true);
            this.appId = drawingContext.appId;
            panCounter = 1;
            if (mouseEvent.e.touches && mouseEvent.e.touches.length > 1) {
                zoomFactor = this.getBaseCanvas(drawingContext).getZoom();
                initialDistance = this.calculateDistance(mouseEvent);
                SCALE_FACTOR = zoomFactor / 750;
                isDown = true;
                x = point.x;
                y = point.y;
                ispan = false;
            } else if (point.x) {
                x = point.x;
                y = point.y;
                isDown = true;
                ispan = true;
            }
        },

        move: function (drawingContext, mouseEvent) {

            if (mouseEvent.e === undefined || this.appId != drawingContext.appId)
                return;

            panCounter++;
            var pointer = drawingContext.topCanvas.getPointer(mouseEvent.e, true);

            if (mouseEvent.e.touches && mouseEvent.e.touches.length === 1) {

                if (isDown !== true || ispan == false) return this.start(drawingContext, mouseEvent);

                cachePointer = new fabric.Point(pointer.x - x, pointer.y - y);

                isMoving = true;

                this.panCanvases(drawingContext, pointer, cachePointer);

                x = pointer.x;
                y = pointer.y;


            } else if (mouseEvent.e.touches && mouseEvent.e.touches.length > 1) {

                if (isDown !== true || ispan == true) return this.start(drawingContext, mouseEvent);

                var newDist = (this.calculateDistance(mouseEvent) - initialDistance),
                    newZoom = 1;
                if (newDist > 0) {
                    newZoom = zoomFactor + Math.abs(newDist * SCALE_FACTOR);
                } else {
                    newZoom = zoomFactor - Math.abs(newDist * SCALE_FACTOR);
                }
                if (newZoom > 16) {
                    newZoom = 16;
                } else if (newZoom < 0.1) {
                    newZoom = 0.1;
                }
                cachePointer = pointer;

                this.zoomCanvases(drawingContext, newZoom, mouseEvent, cachePointer);

                isMoving = true;

            } else {
                if (isDown !== true) return;
                cachePointer = new fabric.Point(pointer.x - x, pointer.y - y);

                this.panCanvases(drawingContext, pointer, cachePointer);

                isMoving = true;
                ispan = true;
                x = pointer.x;
                y = pointer.y;
            }
        },

        end: function (drawingContext, mouseEvent) {
            isDown = false;
            isMoving = false;
            ispan = false;
            x = 0;
            y = 0;
            panCounter = 0;

            this.onTouchEnd(drawingContext, mouseEvent);
        },

        calculateDistance: function (mouseEvent) {
            var xs = 0;
            var ys = 0;
            xs = Math.abs(mouseEvent.e.touches[1].clientX -
                mouseEvent.e.touches[0].clientX);
            xs = xs * xs;
            ys = Math.abs(mouseEvent.e.touches[1].clientY -
                mouseEvent.e.touches[0].clientY);
            ys = ys * ys;
            return Math.sqrt(xs + ys);
        },

        getBaseCanvas: function (drawingContext) {
            return drawingContext.topCanvas;
        },

        panCanvases: function (drawingContext, pointer, cachePointer) {
            drawingContext.topCanvas.relativePan(cachePointer);
            IQSketchLightZoomHandler.zoomBackground(drawingContext);

            this.onAfterPan(drawingContext, pointer);
        },

        onAfterPan: function (drawingContext, pointer) {
            ExtFallback.GlobalEvents.fireEvent('panCanvas', {
                action: 'panCanvas',
                appId: drawingContext.appId, data: {
                    start: new fabric.Point(x, y), end: pointer
                }
            });
        },

        zoomCanvases: function (drawingContext, newZoom, mouseEvent, cachePointer) {
            var zoomDiff = newZoom - drawingContext.topCanvas.getZoom(),
                pointerWithZoom = drawingContext.topCanvas.getPointer(mouseEvent.e);

            drawingContext.topCanvas.zoomToPoint(cachePointer, newZoom);
            IQSketchLightZoomHandler.zoomBackground(drawingContext, function () {
            });

            this.onAfterZoom(drawingContext, mouseEvent, zoomDiff, pointerWithZoom);
        },

        onAfterZoom: function (drawingContext, mouseEvent, zoomDiff, pointerWithZoom) {
            ExtFallback.GlobalEvents.fireEvent('zoomToPoint', {
                action: 'zoomToPoint',
                appId: drawingContext.appId, data: {
                    point: IQSketchHelper.evaluateImagePointer(drawingContext,
                        pointerWithZoom, true),
                    zoom: zoomDiff
                }
            });
        },

        onTouchEnd: function (drawingContext, mouseEvent) {
            IQSketchLightZoomHandler.zoomBackground(drawingContext, function () {
                var markupObject = IQSketchLightHelper.evalMarkupByMouseEvent(drawingContext, mouseEvent);
                if (!markupObject) return;

                drawingContext.topCanvas.fire('object:selected', {
                    target: markupObject,
                    e: drawingContext.topCanvas.getPointer(mouseEvent.e, true)
                });
            });
        }
    }
})();
/* SketchLightTouchPan - End */

/* IQSketchLightShapeHelper - Start */
var IQSketchLightShapeHelper = (function () {

    return { // public interface
        getWindowCoordsFromCanvasPointer: function (pointer, canvas) {
            var mousePointer = fabric.util.transformPoint(pointer, canvas.viewportTransform),
                offsetValues = canvas._offset;

            return {
                x: parseInt(mousePointer.x + offsetValues.left),
                y: parseInt(mousePointer.y + offsetValues.top)
            }
        },

        isShapeWithinImage: function (curContext, pointer) {
            return pointer.x > 0 && pointer.y > 0 &&
                pointer.x < curContext.imageWidth && pointer.y < curContext.imageHeight;
        }
    };
})();
/* IQSketchLightShapeHelper - End */

/* Crop - Start */
class Crop {
    modes = {
        ZoomWindow: 1,
        Crop: 2
    }

    defaultConfig = {
        x: 0,
        y: 0,
        isDown: false,
        relativeStart: null,
    }
    constructor(config) {
        config = config || {};
        this.x = config.x || this.defaultConfig.x;
        this.y = config.y || this.defaultConfig.y;
        this.isDown = config.isDown || this.defaultConfig.isDown;
        this.relativeStart = config.relativeStart || this.defaultConfig.relativeStart;
        this.data = config.data || this.defaultConfig.data;
        this.drawingManager = config.drawingManager;
        this.type = config.type;
        this.config = config;
    }

    setConfig(config) {
        config.hasOwnProperty('x') ? this.x = config.x : false;
        config.hasOwnProperty('y') ? this.y = config.y : false;
        config.hasOwnProperty('isDown') ? this.isDown = config.isDown : false;
        config.hasOwnProperty('relativeStart') ? this.relativeStart = config.relativeStart : false;
        config.hasOwnProperty('data') ? this.data = config.data : false;
    }

    setIsDown(isDown) {
        this.isDown = isDown;
    }
    getIsDown() {
        return this.isDown;
    }
    setRelativeStart(relativeStart) {
        this.relativeStart = relativeStart;
    }
    getRelativeStart() {
        return this.relativeStart;
    }
    setData(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    setX(x) {
        this.x = x;
    }
    getX() {
        return this.x;
    }
    setY(y) {
        this.y = y;
    }
    getY() {
        return this.y;
    }
    getType() {
        return this.type;
    }

    start(drawingContext, mouseEvent) {

        // Not sure why we need this >> refactored existing code ??
        var drawingManager = this.drawingManager,
            zoomwindowMarkupReferences = drawingManager &&
                drawingManager.getMarkupObjectByProperty('markuptype', 'zoomwindow');
        if (zoomwindowMarkupReferences.length > 0) return;


        this.setIsDown(true);
        var pointer = drawingContext.topCanvas.getPointer(mouseEvent.e);
        this.setRelativeStart(drawingContext.topCanvas.getPointer(mouseEvent.e), true);
        this.setX(pointer.x);
        this.setY(pointer.y);

        var cropMakupObject = new fabric.Rect({
            left: this.getX(),
            top: this.getY(),
            fill: 'transparent',
            width: 1,
            height: 1,
            originX: 'left',
            originY: 'top',
            stroke: "red",
            strokeWidth: 2 / drawingContext.topCanvas.viewportTransform[0],
            selectable: false,
            hasControls: false,
            hasBorders: true,
            hasRotatingPoint: false,
            strokeDashArray: [5 / drawingContext.topCanvas.viewportTransform[0], 5 / drawingContext.topCanvas.viewportTransform[0]]
        }),
            configData = this.config && this.config.data,
            markupType = (configData && configData.isZoom) ? 'zoomwindow' : 'crop';

        cropMakupObject.set({
            markuptype: markupType,
            id: ExtFallback.getUuid()
        });

        drawingContext.topCanvas.add(cropMakupObject);
        this.cropMakupObject = cropMakupObject;
        drawingContext.topCanvas.bringToFront(cropMakupObject);
        drawingContext.topCanvas.setActiveObject(cropMakupObject);
    }

    move(drawingContext, mouseEvent) {
        if (!this.getIsDown()) {
            return;
        }
        var cropMakupObject = drawingContext.topCanvas.getActiveObject(),
            pointer = drawingContext.topCanvas.getPointer(mouseEvent.e);

        this.updateCoords(cropMakupObject, pointer);

        cropMakupObject.lockRotation = true;
        cropMakupObject.setCoords();
        drawingContext.topCanvas.renderAll();
    }

    updateCoords(cropMakupObject, pointer) {
        cropMakupObject.set({
            width: Math.abs(this.getX() - pointer.x),
            height: Math.abs(this.getY() - pointer.y)
        })

        this.getX() > pointer.x && cropMakupObject.set({
            left: pointer.x
        });
        this.getY() > pointer.y && cropMakupObject.set({
            top: pointer.y
        });

        cropMakupObject.setCoords();
    }

    end(drawingContext, mouseEvent) {
        if (!this.getIsDown()) {
            return;
        }

        this.setIsDown(false);

        // eval end point co-ordinates on canvas
        var drawingManager = this.drawingManager,
            cropMakupObject = drawingContext.topCanvas.getActiveObject(),
            configData = this.config && this.config.data,
            mode = (configData && configData.isZoom) ? this.modes.ZoomWindow : this.modes.Crop;

        var endPointCoordinate = drawingContext.topCanvas.getPointer(mouseEvent.e),
            endPointCoordinateWithoutZoom = drawingContext.topCanvas.getPointer(mouseEvent.e, true),
            topCanvasZoom = drawingContext.topCanvas.getZoom();

        // remove the markup from canvas
        drawingContext.topCanvas.remove(cropMakupObject);

        var pointers = {
            start: IQSketchLightHelper.evaluateImagePointer(drawingContext,
                new fabric.Point(this.getX(), this.getY()), true),
            end: IQSketchLightHelper.evaluateImagePointer(drawingContext,
                endPointCoordinate, true)
        };

        if (mode == this.modes.ZoomWindow) {

            drawingManager.zoomToArea(cropMakupObject, {
                x: cropMakupObject.getBoundingRect().left,
                y: cropMakupObject.getBoundingRect().top
            });

            ExtFallback.GlobalEvents.fireEvent('zoomArea', {
                action: 'zoomArea',
                appId: drawingContext.appId,
                data: {
                    pointers: pointers
                }
            });
        } else {

        }
        this.setRelativeStart(null);
    }

    destroy() {
        this.setIsDown(false);
        this.cropMakupObject && this.cropMakupObject.canvas.remove(this.cropMakupObject);
    }
}
/* Crop - End */

/* Rectangle - Start */
class Rectangle {
    defaultConfig = {
        x: 0,
        y: 0,
        isStarted: null,
        data: null
    }
    constructor(config) {
        config = config || {};
        this.x = config.x || this.defaultConfig.x;
        this.y = config.y || this.defaultConfig.y;
        this.isStarted = config.isStarted || this.defaultConfig.isStarted;
        this.data = config.data || this.defaultConfig.data;
        this.drawingManager = config.drawingManager;
        this.type = config.type;
    }
    setConfig(config) {
        config.hasOwnProperty('x') ? this.x = config.x : false;
        config.hasOwnProperty('y') ? this.y = config.y : false;
        config.hasOwnProperty('isStarted') ? this.isStarted = config.isStarted : false;
        config.hasOwnProperty('data') ? this.data = config.data : false;
    }
    setIsStarted(isStarted) {
        this.isStarted = isStarted;
    }
    getIsStarted() {
        return this.isStarted;
    }
    setData(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    getType() {
        return this.type;
    }
    setX(x) {
        this.x = x;
    }
    getX() {
        return this.x;
    }
    setY(y) {
        this.y = y;
    }
    getY() {
        return this.y;
    }

    start(context, event, sp) {

        this.canvas = context.topCanvas;
        var pointer = sp || this.canvas.getPointer(event.e);

        if (!this.isValidPosition(context, pointer)) {
            return;
        }
        this.pointer = pointer;

        this.startPointer = this.pointer;

        sp && (this.correctionFactor = context.defaultSettings.strokeSettings.strokeWidth / 2);

        this.setConfig({
            isStarted: true,
            x: this.pointer.x,
            y: this.pointer.y
        });

        context.canFireObjectEvents = false;
        var data = this.getData();

        if (data.markupType == 'extractionArea') {
            var markup = this.drawingManager._getMarkupObjectsByMarkupValueKey('type', data.markupValue.type)[0];

            this.prevMarkupToClear = markup;
        }

        this.rect = this.getRectangle(this.pointer, context);
        this.canvas.add(this.rect);
    }

    isValidPosition(context, pointer) {
        var data = this.getData();
        return data.markupType == 'extractionArea' ?
            IQSketchLightShapeHelper.isShapeWithinImage(context, pointer) : true;
    }

    move(context, event) {

        if (this.getIsStarted()) {
            var pointer = this.canvas.getPointer(event.e);
            if (!this.isValidPosition(context, pointer)) return;
            this.pointer = pointer;
            this.updateEndPoint();
            if (this.prevMarkupToClear && this.rect.width > 1 && this.rect.height > 1) {
                this.prevMarkupToClear.canvas.remove(this.prevMarkupToClear);
                this.prevMarkupToClear = null;
            }
        }
    }

    end(context, event, sp) {
        if (this.getIsStarted() && this.drawingManager && this.drawingManager.validateMarkup(this.rect)) {
            this.pointer = sp || this.canvas.getPointer(event.e);
            this.isValidPosition(context, this.pointer) && this.updateEndPoint();
            context.canFireObjectEvents = true;
            this.drawingManager && this.drawingManager.onMarkupAction(this.rect, SketchConstants.markupActions.Add, false, context);
            delete this.correctionFactor;
        }
        this.resetValues();
    }

    resetValues() {
        this.setIsStarted(false);
        this.canvas = null;
        this.pointer = null;
        this.startPointer = null;
        this.rect = null;
        this.prevMarkupToClear = null;
    }

    updateEndPoint() {
        this.setRectangleMarkupProperties(this.rect, {
            x: this.getX(),
            y: this.getY()
        }, this.pointer);

        this.canvas.renderAll();
    }

    getRectangle(pointer, context) {
        var data = this.getData();

        this.correctionFactor &&
            (pointer = {
                x: pointer.x - this.correctionFactor,
                y: pointer.y - this.correctionFactor
            });

        return new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            width: 0,
            height: 0,
            originX: 'left',
            originY: 'top',
            fill: data.fill || 'transparent',
            stroke: data.stroke || 'red',
            strokeWidth: data.strokeWidth || 4 / context.topCanvas.getZoom(),
            markuptype: data.markupType || 'rectangle',
            markupValue: data.markupValue,
            opacity: data.opacity || 1,
            id: ExtFallback.getUuid(),
            locked: data.locked,
            selectable: !data.locked,
            showValidation: data.showValidation
        });
    }

    setRectangleMarkupProperties(rectangleMarkup, startPointer, pointer) {

        rectangleMarkup.set({
            width: Math.abs(startPointer.x - pointer.x),
            height: Math.abs(startPointer.y - pointer.y)
        });

        this.correctionFactor &&
            (pointer = {
                x: pointer.x - this.correctionFactor,
                y: pointer.y - this.correctionFactor
            });

        startPointer.x > pointer.x && rectangleMarkup.set({
            left: pointer.x
        });
        startPointer.y > pointer.y && rectangleMarkup.set({
            top: pointer.y
        });
        rectangleMarkup.setCoords();
    }

    place(context, markupPosition, canvas) {
        var rectangle = this.getRectangle(markupPosition[0], context),
            canvas = canvas || context.topCanvas;
        this.setRectangleMarkupProperties(rectangle, markupPosition[0], markupPosition[1]);
        canvas.add(rectangle);
        this.drawingManager && this.drawingManager.onAfterCanvasStateChanged(rectangle.toDatalessObject(), SketchConstants.markupActions.InitialLoad);
        canvas.renderAll();
        return rectangle;
    }
}
/* Rectangle - End */

/* UndoRedo - Start */
class UndoRedo {
    constructor(config) {
        config = config || {};
        this.markupList = config.markupList || [];
        this.state = config.state || [];
        this.index = config.index || 0;
        this.index2 = config.index2 || 0;
        this.action = config.action || false;
        this.refresh = config.refresh || false;
        this.undoIndex = config.undoIndex || 0;
        this.drawingManager = config.drawingManager || false;
        this.config = config;
    }
    init(config) {
        this.drawingManager = config && config.drawingManager;
    }

    clearStack() {
        this.markupList = [];
        this.state = [];
        this.index = 0;
        this.index2 = 0;
        this.action = false;
        this.refresh = true;
        this.undoIndex = 0;
        this.toggleRedo(false);
        this.toggleUndo(false);
    }

    toggleRedo(enable) {
        var redoButton = this.drawingManager.mainView.parentElement.getElementsByClassName('canvas-icon-bar')[0] && this.drawingManager.mainView.parentElement.getElementsByClassName('canvas-icon-bar')[0].querySelector('[action=redo]');
        redoButton ? redoButton.disabled = !enable : '';
    }

    toggleUndo(enable) {
        var undoBtn = this.drawingManager.mainView.parentElement.getElementsByClassName('canvas-icon-bar')[0] && this.drawingManager.mainView.parentElement.getElementsByClassName('canvas-icon-bar')[0].querySelector('[action=undo]');
        undoBtn ? undoBtn.disabled = !enable : '';
    }

    objectAdded(curContext, object) {
        this.action = false;
        this.toggleRedo(false);
        if (this.undoIndex > 0) {
            this.checkIfObjectRemovedStillAtStack(curContext);
            this.undoIndex = 0;
        }
        this.saveHistory(0, curContext, object);
    }

    checkIfObjectRemovedStillAtStack(curContext) {
        var objIndex = 0;
        var indexes = [];
        var that = this;
        this.state.forEach(function (obj) {
            objIndex++;
            var found = false,
                objects = curContext.cacheCanvas.getObjects().concat(curContext.topCanvas.getObjects());
            objects.forEach(function (markup) {
                if (obj.id == markup.id)
                    found = true;
            });
            if (!found) indexes.push(objIndex);
        });
        if (indexes.length > 0) {
            indexes.forEach(function (ind) {
                that.state.splice(ind, 1);
            });
        }
    }

    objectModified(curContext, object) {
        this.action = false;
        this.saveHistory(1, curContext, object);
    }

    checkValidMarkup(curContext, markupObject) {
        var invalidContextMode = ["zoomwindow"],
            invalidMarkupType = [];

        if (!ExtFallback.Array.contains(invalidContextMode, curContext.mode) &&
            !ExtFallback.Array.contains(invalidMarkupType, markupObject.markuptype)) {
            return true;
        }
        return false;
    }

    objectRemoved(curContext, object) {
        this.action = false;
        if (this.canAddObjectToStack(object))
            this.saveHistory(2, curContext, object);
    }

    canAddObjectToStack(object) {
        if (object.id === undefined) return false;

        return true;
    }

    saveHistory(mode, curContext, object) {
        if (this.action === true) {
            this.state = [this.state[this.index2]];
            this.action = false;
            this.index = 1;
        }

        var obj = object.toDatalessObject();

        object.magnetised && ExtFallback.apply(obj, {
            shadow: object.shadow
        });

        this.state[this.index] = {
            s: mode,
            d: obj,
            id: object.id
        };
        this.index++;
        this.index2 = this.index - 1;
        this.refresh = true;
    }

    saveSpecialTypeAndSavedMarkups(object, curContext) {
        this.markupList.push({
            d: object,
            id: object.id
        });
    }

    undo(curContext) {
        var current = this.state[this.index - 1];

        if (this.index <= 0 || this.state.length <= 0) {
            this.index = 0;
            return;
        }

        this.toggleRedo(true);
        this.undoIndex++;
        curContext.canFireObjectEvents = false;


        this.index2 = this.index - 1;
        //undo ? add ->remove
        //undo ? remove ->add
        switch (current.s) {
            case 0: //add  - to remove
                this.removeFromCanvas(curContext, current);
                break;
            case 1: //modified - update
                this.updateInCanvas(curContext, current, true);
                break;
            case 2: //removed - to add
                this.addToCanvas(curContext, current);
                break;
        }
        this.index--;
        if (this.index <= 0)
            this.toggleUndo(false);

        curContext.topCanvas.renderAll();
        this.action = true;
        curContext.canFireObjectEvents = true;
    }

    addToCanvas(curContext, objectCur) {
        var klass = fabric.util.getKlass(objectCur.d.type),
            me = this,
            canvas = curContext.mode === SketchConstants.modes.VIEW ?
                curContext.cacheCanvas : curContext.topCanvas;

        //if (klass.async) {
        klass.fromObject(objectCur.d, function (obj) {
            curContext.canFireObjectEvents = false;
            canvas.add(obj);

            objectCur.d = obj.toDatalessObject();
            obj.magnetised && ExtFallback.apply(objectCur.d, {
                shadow: obj.shadow
            });
            curContext.canFireObjectEvents = true;
        });
    }

    removeFromCanvas(curContext, objectCur) {

        var canvas = curContext.mode === SketchConstants.modes.VIEW ? curContext.cacheCanvas : curContext.topCanvas,
            objects = canvas.getObjects(),
            me = this;
        objects.forEach(function (obj) {
            if (obj.id === objectCur.id) {
                objectCur.d = obj.toDatalessObject();
                obj.magnetised && ExtFallback.apply(objectCur.d, {
                    shadow: obj.shadow
                });
                canvas.remove(obj);
            }
        });
    }

    getLastUndoModification(curContext, objectCur) {
        for (var i = this.index2 - 1; i >= 0; i--) {
            if (this.state[i].id == objectCur.id) {
                return this.state[i];
            }
        }
    }

    getLastRedoModification(curContext, objectCur) {
        for (var i = this.index; i < this.state.length; i++) {
            if (this.state[i].id == objectCur.id) {
                return this.state[i];
            }
        }
    }

    getSpecialTypeObject(obj) {
        var object = null;
        this.markupList.forEach(function (markup) {
            if (obj.id === markup.id) {
                object = markup;
            }
        });
        return object;
    }

    updateInCanvas(curContext, objectCur, isUndo) { //update object in topcanvas 
        var canvas = curContext.mode === SketchConstants.modes.VIEW ? curContext.cacheCanvas : curContext.topCanvas,
            objects = canvas.getObjects();
        var lastState = null,
            me = this;
        if (isUndo) {
            lastState = me.getLastUndoModification(curContext, objectCur);
        } else
            lastState = me.getLastRedoModification(curContext, objectCur);

        objects.forEach(function (obj) {
            if (obj.id === objectCur.id) {
                canvas.remove(obj);
                if (lastState && lastState != null) {
                    me.addPreviousObjectStateToCanvas(lastState, curContext);
                } else {
                    lastState = me.getSpecialTypeObject(obj);
                    me.addPreviousObjectStateToCanvas(lastState, curContext);
                }
            }
        });
    }

    addPreviousObjectStateToCanvas(lastState, curContext) {
        var klass = fabric.util.getKlass(lastState.d.type),
            me = this,
            canvas = curContext.mode === SketchConstants.modes.VIEW ? curContext.cacheCanvas : curContext.topCanvas;
        //if (klass.async) {
        klass.fromObject(lastState.d, function (img) {
            canvas.add(img);
            lastState.d = img.toDatalessObject();
            img.magnetised && ExtFallback.apply(lastState.d, {
                shadow: img.shadow
            });
        });

        curContext.topCanvas.discardActiveObject();
    }

    redo(curContext) {
        var current = this.state[this.index];

        this.action = true;
        if (this.index >= this.state.length || this.state.length <= 0) {
            return;
        }
        this.toggleUndo(true);
        this.undoIndex--;
        curContext.canFireObjectEvents = false;

        this.index2 = this.index + 1;

        //undo ? add ->remove
        //undo ? remove ->add        
        switch (current.s) {
            case 0: //add  - to remove
                this.addToCanvas(curContext, current);
                break;
            case 1: //modified - update
                this.updateInCanvas(curContext, current);
                break;
            case 2: //removed - to add
                this.removeFromCanvas(curContext, current);
                break;
        }
        this.index++;

        if (this.index >= this.state.length)
            this.toggleRedo(false);

        curContext.topCanvas.renderAll();
        curContext.canFireObjectEvents = true;
    }

    removeMagnetizedAndLockedObjects(object) {
        var stackObjects = [];
        this.state.forEach(function (obj) {
            if (object.id === obj.id && obj.s != 0) {
                this.index--;
            } else {
                stackObjects.push(obj);
            }
        });
        this.state = stackObjects;
        if (this.index <= 0)
            this.toggleUndo(false);
    }
}
/* UndoRedo - End */

/* DrawingManager - Start */
var DrawingManager = (function () {
    var SKETCHMODE = {
        Pan: 0,
        Select: 1,
        Drawing: 2
    };

    return {
        init: function (container, canvasParam) {

            this.fabricController = canvasParam.fabricController;
            this.configData = canvasParam;
            this.mainView = canvasParam.fabricController.getMainView();
            this.curContext = {
                appId: this.mainView.appId,
                topCanvas: null,
                bgCanvas: null,
                imageUrl: canvasParam.imageUrl,
                markups: canvasParam.markups,
                canvasVersion: 'light',
                zoomAndPanEnabled: true,
                defaultSettings: {
                    strokeSettings: {
                        strokeWidth: 2
                    }
                }
            };

            this._initializeCanvas();
            this._initializeEngManagers();

            this._setCanvasCoordinates({
                width: canvasParam.width,
                height: canvasParam.height,
                imageWidth: canvasParam.width,
                imageHeight: canvasParam.height
            });

            // this.setCanvasViewMode();
            this.initialized = true;
        },

        _initializeCanvas: function () {
            var mainView = this.mainView,
                curContext = this.curContext,
                appId = mainView && mainView.appId,
                that = this,
                defaultCanvasConfig = {
                    targetFindTolerance: 30,
                    selection: false,
                    isDrawingMode: false
                },
                appIdAppender = ExtFallback.isEmpty(appId) ? '' : '_' + appId.replace(/-/g, '');

            curContext.topCanvas = new fabric.Canvas(('light_sketch_canvas' + appIdAppender), ExtFallback.apply(defaultCanvasConfig, {
                stopContextMenu: true,
                fireRightClick: true,
                isMoveMode: false
            }));

            curContext.cacheCanvas = new fabric.StaticCanvas(("light_drawing_canvas" + appIdAppender), defaultCanvasConfig);

            curContext.bgCanvas = document.getElementById(('light_bg_canvas' + appIdAppender));
            curContext.topCanvas.x = curContext.topCanvas.y = 0;
            curContext.cacheCanvas.x = curContext.cacheCanvas.y = 0;
            curContext.topCanvas.upperCanvasEl.tabIndex = 1;
            this._setCanvasListeners(curContext.topCanvas);
        },

        _initializeEngManagers: function () {
            var mainView = this.mainView;

            this.undoRedoManager = mainView && mainView.undoRedoManager;
            this.undoRedoManager && this.undoRedoManager.init({
                drawingManager: this
            });
        },

        _setCanvasListeners: function (canvas) {
            var that = this,
                curContext = that.curContext,
                topCanvas = curContext.topCanvas;
            canvas.on({
                'object:selected': function (evt) {
                    var activeObject = topCanvas.getActiveObject();
                    if (activeObject && (activeObject.type == "activeSelection")) return;

                    that.onObjectSelected(evt);
                },
                'object:modified': function (evt) {
                    that.onObjectModified(evt);
                },
                'object:added': function (evt) {
                    that.onObjectAdded(evt);
                },
                'object:removed': function (evt) {
                    that.onObjectRemoved(evt);
                },
                'object:moving': function (evt) {
                    that.onObjectMoving(evt);
                },
                'object:scaling': function (evt) {
                    that.onObjectScaling(evt);
                },
                'before:selection:cleared': function (evt) {
                    that.onBeforeSelectionCleared(evt);
                },
                'selection:cleared': function (evt) {
                    that.onSelectionCleared(evt);
                },
                'selection:created': function (evt) {
                    that.onObjectSelected(evt);
                },
                'selection:updated': function (evt) {
                    that.onObjectSelected(evt);
                },
                'mouse:down': function (evt) {
                    that.onMousedown(evt);
                },
                'mouse:move': function (evt) {
                    that.onMousemove(evt);
                },
                'mouse:up': function (evt) {
                    that.onMouseup(evt);
                },
                'mouse:out': function (evt) {
                    that.onMouseOut(evt);
                },
                'mouse:wheel': function (evt) {
                    that.onMouseWheel(evt);
                }
            });
        },

        onObjectModified: function (evt) {
            var that = this,
                markup = evt.target,
                curContext = this.curContext;

            if (this.curContext.canFireObjectEvents == false) {
                return;
            }
            if ((markup.type === "group" || markup.type === "activeSelection") && markup.markuptype === "group") {
                var groupObj = markup;
                curContext.topCanvas.discardActiveObject();
                groupObj.getObjects().forEach(function (obj) {
                    obj.resizeToScale();
                    that.onMarkupAction(obj, SketchConstants.markupActions.Update, false, curContext);
                });
                setTimeout(function () {
                    var activeSelection = new fabric.ActiveSelection(groupObj.getObjects(), {
                        originX: 'center',
                        originY: 'center',
                        canvas: curContext.topCanvas,
                        id: groupObj.id,
                        markuptype: 'group'
                    });
                    curContext.topCanvas.setActiveObject(activeSelection);
                    !activeSelection.prevState && ExtFallback.apply(activeSelection, {
                        prevState: {
                            angle: activeSelection.angle,
                            left: activeSelection.left,
                            top: activeSelection.top
                        }
                    });
                    curContext.topCanvas.renderAll();
                }, 50);
            } else {
                markup.resizeToScale();
                this.onMarkupAction(markup, SketchConstants.markupActions.Update, false, curContext);
            }
        },

        onSelectionCleared: function (evt) {

        },

        onBeforeSelectionCleared: function (evt) {
            // var curContext = this.curContext,
            //     markup = curContext.topCanvas.getActiveObject();

            // switch (markup.markuptype) {
            //     case 'extractionArea':
            //         curContext.mode === SketchConstants.modes.VIEW && this.setCanvasViewMode();
            //         break;
            // }
        },

        onObjectRemoved: function (evt) {
            var markup = evt.target;
            if (this.curContext.canFireObjectEvents == false) {
                return;
            }
            this.onMarkupAction(markup, SketchConstants.markupActions.Delete);
        },

        onObjectAdded: function (evt) {
            var markup = evt.target;
            if (this.curContext.canFireObjectEvents == false) {
                return;
            }
        },

        onObjectMoving: function (evt) {
            evt.target.setCoords();
            evt.target.markuptype == "extractionArea" && this.setObjectWithinImage(evt.target, 'move');
        },

        onObjectScaling: function (evt) {
            evt.target.setCoords();
            evt.target.markuptype == "extractionArea" && this.setObjectWithinImage(evt.target, 'scale');
        },

        setObjectWithinImage: function (object, action) {
            object.left <= 0 && object.set('left', 1);
            object.top <= 0 && object.set('top', 1);

            if (action == 'move') {
                object.left + object.width > this.curContext.imageWidth &&
                    object.set('left', this.curContext.imageWidth - object.width - 2);

                object.top + object.height > this.curContext.imageHeight &&
                    object.set('top', this.curContext.imageHeight - object.height - 2);
            }

            if (action == 'scale') {
                if (object.left + (object.width * object.scaleX) > this.curContext.imageWidth) {
                    object.set('width', this.curContext.imageWidth - object.left - 2);
                    object.set('scaleX', 1);
                    object.setCoords();
                }

                if (object.top + (object.height * object.scaleY) > this.curContext.imageHeight) {
                    object.set('height', this.curContext.imageHeight - object.top - 2);
                    object.set('scaleY', 1);
                    object.setCoords();
                }
            }
        },

        onMarkupAction: function (markup, action, fromUndoRedo, context) {
            var me = this,
                actionType = action == SketchConstants.markupActions.Add ? 'markupPlaced' :
                action == SketchConstants.markupActions.Update ? 'markupModified' : 'markupRemoved';

            switch (markup.markuptype) {
                case 'extractionArea':
                    if (action != SketchConstants.markupActions.InitialLoad) {
                        console.log("Extraction area ...");
                        var evtData = {
                                markuptype: markup.markuptype,
                                markupValue: markup.markupValue,
                                coordinates: {
                                    x1: markup.left,
                                    y1: markup.top,
                                    x2: markup.left + markup.getWidth(),
                                    y2: markup.top + markup.getHeight()
                                }
                            };
                        (markup.showValidation && context && markup) ?
                            me.showValidation({
                                    coordinates: IQSketchLightShapeHelper.getWindowCoordsFromCanvasPointer(markup.aCoords.br, context.topCanvas)
                                },
                                function () {
                                    //yes callback
                                    me.mainView.getController().fireEvent(actionType, evtData);
                                },
                                function () {
                                    //no callback
                                    context.canFireObjectEvents = false;
                                    markup.canvas.remove(markup);
                                    context.canFireObjectEvents = true;
                                }) :
                        this.mainView.getController().fireEvent(actionType, evtData);
                        action == SketchConstants.markupActions.Add && this.autoSelectMarkup(markup);
                    }
                    break;
            }

            if (!fromUndoRedo)
                this.onAfterCanvasStateChanged(markup, action);
        },

        showValidation: function (data, yesCallback, cancelCallback) {
            if(data && data.coordinates){
                var validationBtns = document.getElementById("validationButtons");
                validationBtns && validationBtns.remove && validationBtns.remove();
                validationBtns = document.createElement("div");
                validationBtns.setAttribute("id", "validationButtons");
                validationBtns.setAttribute("class", "validation-buttons");
                validationBtns.setAttribute("style",
                    'left: ' + data.coordinates.x + 'px;' +
                    'top: ' + data.coordinates.y + 'px;');
                validationBtns.innerHTML = '<button action="ok" class="ok-cls" title="Ok"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiM0YWIyNTIiIGQ9Ik01MTIgMC4wNjRjLTI4Mi43NyAwLTUxMiAyMjkuMjMtNTEyIDUxMnMyMjkuMjMgNTEyIDUxMiA1MTJjMjgyLjc3IDAgNTEyLTIyOS4yMyA1MTItNTEydjBjMC0yODIuNzctMjI5LjIzLTUxMi01MTItNTEydjB6TTc3NS40ODggMzg4LjM1MmwtMzAwLjggMzAxLjg4OGMtOS41NjUgOS42MTMtMjIuNzAxIDE1LjY2NS0zNy4yNDkgMTUuOTk5bC0wLjA2MyAwLjAwMWMtMC4xODYgMC4wMDMtMC40MDYgMC4wMDQtMC42MjcgMC4wMDQtMTQuNDc3IDAtMjcuNTE5LTYuMTQ3LTM2LjY1Ny0xNS45NzNsLTAuMDI4LTAuMDMxLTE1MS40ODgtMTUxLjQ4OGMtOC45MjktOS41NDUtMTQuNDEzLTIyLjQxLTE0LjQxMy0zNi41NTcgMC0yOS41ODUgMjMuOTgzLTUzLjU2OCA1My41NjgtNTMuNTY4IDE0LjE0NiAwIDI3LjAxMiA1LjQ4MyAzNi41ODcgMTQuNDQxbC0wLjAzMC0wLjAyOCAxMTMuMDI0IDExMy4wMjQgMjYzLjQ4OC0yNjMuNDg4YzkuNjA0LTkuODcgMjMuMDE1LTE1Ljk5MyAzNy44NTYtMTUuOTkzczI4LjI1MiA2LjEyMyAzNy44NDQgMTUuOTgxbDAuMDEyIDAuMDEyYzkuMzE0IDkuNjUzIDE1LjA1MiAyMi44MSAxNS4wNTIgMzcuMzA4IDAgMTUuMDQxLTYuMTc3IDI4LjYzOC0xNi4xMzEgMzguMzk2bC0wLjAwOSAwLjAwOXoiPjwvcGF0aD4KPC9zdmc+Cg=="></button>' +
                    '<button action="cancel" class="cancel-cls" title="Cancel"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGQ9Ik01MTIgMTAyNGMyODIuNzcgMCA1MTItMjI5LjIzIDUxMi01MTJzLTIyOS4yMy01MTItNTEyLTUxMmMtMjgyLjc3IDAtNTEyIDIyOS4yMy01MTIgNTEydjBjMCAyODIuNzcgMjI5LjIzIDUxMiA1MTIgNTEydjB6TTc3OS43NzYgMjQ0LjIyNGMxMC4yOTIgMTAuMjk1IDE2LjY1NyAyNC41MTYgMTYuNjU3IDQwLjIyNHMtNi4zNjUgMjkuOTI5LTE2LjY1NyA0MC4yMjRsLTE4Ny4zMjggMTg3LjMyOCAxODcuMzI4IDE4Ny4zMjhjOS44MzUgMTAuMjEyIDE1Ljg5MyAyNC4xMjEgMTUuODkzIDM5LjQ0NSAwIDMxLjQyMy0yNS40NzMgNTYuODk2LTU2Ljg5NiA1Ni44OTYtMTUuMzI0IDAtMjkuMjMzLTYuMDU4LTM5LjQ2My0xNS45MWwwLjAxOCAwLjAxNy0xODcuMzI4LTE4Ny4zMjgtMTg3LjMyOCAxODcuMzI4Yy0xMC4yMTIgOS44MzUtMjQuMTIxIDE1Ljg5My0zOS40NDUgMTUuODkzLTMxLjQyMyAwLTU2Ljg5Ni0yNS40NzMtNTYuODk2LTU2Ljg5NiAwLTE1LjMyNCA2LjA1OC0yOS4yMzMgMTUuOTEtMzkuNDYzbC0wLjAxNyAwLjAxOCAxODcuMzI4LTE4Ny4zMjgtMTg3LjMyOC0xODcuMzI4Yy05LjgzNS0xMC4yMTItMTUuODkzLTI0LjEyMS0xNS44OTMtMzkuNDQ1IDAtMzEuNDIzIDI1LjQ3My01Ni44OTYgNTYuODk2LTU2Ljg5NiAxNS4zMjQgMCAyOS4yMzMgNi4wNTggMzkuNDYzIDE1LjkxbC0wLjAxOC0wLjAxNyAxODcuMzI4IDE4Ny4zMjggMTg3LjMyOC0xODcuMzI4YzEwLjI5NS0xMC4yOTIgMjQuNTE2LTE2LjY1NyA0MC4yMjQtMTYuNjU3czI5LjkyOSA2LjM2NSA0MC4yMjQgMTYuNjU3djB6Ij48L3BhdGg+Cjwvc3ZnPgo="></button>';
                document.getElementsByTagName('body')[0].appendChild(validationBtns);
                var buttons = validationBtns.querySelectorAll('button');
                buttons.forEach(function (btn) {
                    btn.addEventListener('click', function (b) {
                        validationBtns = document.getElementById("validationButtons");
                        validationBtns && validationBtns.remove && validationBtns.remove();
                        var action = b.currentTarget.getAttribute('action');
                        if (action == 'ok') {
                            yesCallback && yesCallback();
                        } else {
                            cancelCallback && cancelCallback();
                        }
                    });
                });
            }
        },

        onAfterCanvasStateChanged: function (object, mode) {
            this.updateMarkupStack(object, mode);
        },

        updateMarkupStack: function (object, mode) {
            var curContext = this.curContext,
                undoRedoManager = this.undoRedoManager,
                markupActions = SketchConstants.markupActions;

            if (!object || !undoRedoManager.checkValidMarkup(curContext, object)) return;

            switch (mode) {
                case markupActions.InitialLoad:
                    undoRedoManager.saveSpecialTypeAndSavedMarkups(object, curContext);
                    break;
                case markupActions.Add:
                    undoRedoManager.objectAdded(curContext, object);
                    break;
                case markupActions.Delete:
                    curContext.topCanvas.changed = true;
                    undoRedoManager.objectRemoved(curContext, object);
                    break;
                case markupActions.Update:
                    undoRedoManager.objectModified(curContext, object);
                    break;
            }

            mode != markupActions.InitialLoad && undoRedoManager.toggleUndo(true);
        },

        onMouseOut: function (evt) {
            IQSketchLightHelper.MarkupInfoTooltip.destroy();
        },

        onMouseWheel: function (evt) {
            this.fabricController.onZoomActionBtnClick(evt.e.deltaY < 0 ? {
                action: 'zoomin'
            } : {
                    action: 'zoomout'
                });
        },

        onMouseup: function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            this.onTouchEnd(null, e);
        },

        onMousemove: function (e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            //IE ISSUE: CANVAS LOOSES FOCUS 
            // Ext.isIE && document.body !== document.activeElement && document.body.focus();
            this.onTouchMove(null, e);
        },

        onTouchStart: function (source, evt) {
            this.curContext.sketchMode == SKETCHMODE.Drawing && this.curContext.topCanvas.selection &&
                ExtFallback.apply(this.curContext.topCanvas, {
                    selection: false,
                    skipTargetFind: true
                });

            if (!this.curContext.zoomAndPanEnabled) {
                return;
            }

            if (evt.target && (evt.target.canvas.selection ||
                this.curContext.sketchMode == SKETCHMODE.Drawing)) {
                return;
            }

            this.curContext.shape && this.curContext.shape.start(this.curContext, evt);
        },

        onTouchMove: function (source, evt) {
            if (this.curContext.sketchMode === SKETCHMODE.Select) {
                return;
            }

            if (!this.curContext.zoomAndPanEnabled) {
                return;
            }

            evt.e.type == "mousemove" && this.onMouseHover(evt);

            this.curContext.shape && this.curContext.shape.move(this.curContext, evt);
        },

        onMouseHover: function (mouseEvnt) {
            var markup = null,
                curContext = this.curContext,
                pointer = curContext.topCanvas.getPointer(mouseEvnt.e),
                pointerWithoutZoom = curContext.topCanvas.getPointer(mouseEvnt.e, true);
            for (var key in curContext.cacheCanvas.getObjects()) {
                var mObject = curContext.cacheCanvas.getObjects()[key];
                var tooltipSupportedMarkup = ExtFallback.Array.contains(SketchConstants.hoverSupportedMarkups, mObject.markuptype);

                if (tooltipSupportedMarkup && !mObject.isDrawing &&
                    mObject.containsPoint(pointerWithoutZoom) && mObject.visible) {
                    markup = mObject;
                }
            }

            if (!markup) {
                IQSketchLightHelper.MarkupInfoTooltip.destroy();
                return;
            }

            IQSketchLightHelper.MarkupInfoTooltip.show(IQSketchLightShapeHelper.getWindowCoordsFromCanvasPointer({
                x: markup.getCenterPoint().x,
                y: markup.getCenterPoint().y
            }, this.curContext.topCanvas),
                this._getMarkupTooltipData(markup), true);
        },

        currentMode: function () {
            return this.curContext.mode;
        },

        // getMarkupByIdFromCanvas: function (id) {
        //     return this.getCanvasMarkupById(['cacheCanvas', 'topCanvas'], id);
        // },

        // getCanvasMarkupById: function (canvasList, id) {
        //     var that = this,
        //         markup = null;

        //     Ext.each(canvasList, function (canvas) {
        //         that.curContext[canvas].getObjects().forEach(function (obj) {
        //             if (obj.id === id)
        //                 markup = obj;
        //         });
        //     });
        //     return markup;
        // },

        getCanvasMarkupByProperty: function (canvasList, property, value) {
            var that = this,
                objMarkups = [];
            for (var key1 in canvasList) {
                var canvas = canvasList[key1];
                for (var key2 in that.curContext[canvas].getObjects()) {
                    var markup = that.curContext[canvas].getObjects()[key2];
                    if (markup && markup[property] && markup[property] === value) {
                        objMarkups.push(markup);
                    }
                }
            }
            return objMarkups;
        },

        _getMarkupTooltipData: function (markup) {
            var data = {};
            switch (markup.markuptype) {
                case 'extractionArea':
                    data = {
                        text: markup.markupValue.type,
                        markupId: markup.id
                    };
                    break;
            }

            return data;
        },

        onMousedown: function (e) {

            if (e.e && e.e.preventDefault) {
                e.e.preventDefault();
            }

            if (e.button === 1) {
                this.onTouchStart(null, e);
            }
        },

        onTouchEnd: function (source, evt) {
            this.prevPointer = null;

            if (!this.curContext.zoomAndPanEnabled) {
                return;
            }

            this.curContext.shape && this.curContext.shape.end(this.curContext, evt);
        },

        _setCanvasCoordinates: function (data) {
            var that = this;
            var arr = ['topCanvas', 'cacheCanvas'];
            for (var key in arr) {
                var canvas = arr[key];
                that.curContext[canvas].setHeight(data.height);
                that.curContext[canvas].setWidth(data.width);
            }
            that.curContext.bgCanvas.width = data.width;
            that.curContext.bgCanvas.height = data.height;
        },

        decorateCanvas: function (inputData) {

            var me = this,
                mainView = this.mainView,
                curContext = this.curContext;

            if (curContext.imageUrl) {
                this._loadBackgroundImage();
            }
        },

        _loadBackgroundImage: function () {
            var me = this,
                mainView = this.mainView,
                curContext = this.curContext,
                appId = curContext.appId,
                bgCanvas = curContext.bgCanvas,
                topCanvas = curContext.topCanvas;

            topCanvas.clear();

            curContext.imageHandler = new ImageHandler();
            curContext.imageHandler.init({
                canvas: curContext.bgCanvas,
                minZoom: 0.1,
                maxZoom: 13,
                imageUrl: curContext.imageUrl,
                callback: function (data) {
                    ExtFallback.apply(curContext, data);
                    me.loadMarkups();
                }
            });
        },

        loadMarkups: function () {
            var that = this,
                topCanvas = that.curContext.topCanvas;
            if (this.curContext.markups) {
                this.curContext.markups.extractionAreas &&
                    this._addExtractionAreas(this.curContext.markups.extractionAreas);
            }
            this._onAfterImageAndMarkupLoad();
        },

        _addExtractionAreas: function (extractionAreas) {
            /* extractionAreas = Ext.Array.filter(extractionAreas, function (a) {
                return a.coordinates;
            }); */
            extractionAreas = extractionAreas.filter(function (a) {
                return a.coordinates;
            })

            if (extractionAreas.length == 0) return;

            var curContext = this.curContext,
                shape = new Rectangle({
                    drawingManager: this,
                    type: 'extractionArea'
                }),
                /* shape = Ext.create('Common.view.eng.shapes.Rectangle', {
                    drawingManager: this,
                    type: 'extractionArea'
                }), */
                panToBoundaries = [];

            extractionAreas = extractionAreas.sort(function (a, b) {
                return a.coordinates.y2 > b.coordinates.y2 ? -1 : 1;
            });
            /* extractionAreas = Ext.Array.sort(extractionAreas, function (a, b) {
                return a.coordinates.y2 > b.coordinates.y2 ? -1 : 1;
            }); */
            for (var index in extractionAreas) {
                var boundaryData = extractionAreas[index];
                var boundary = boundaryData.coordinates;
                shape.setData({
                    markupValue: boundaryData.data,
                    stroke: boundaryData.stroke || 'red',
                    fill: boundaryData.stroke,
                    opacity: 0.3,
                    markupType: 'extractionArea',
                    locked: boundaryData.locked
                });

                var object = shape.place(curContext, [{
                    x: boundary.x1,
                    y: boundary.y1
                },
                {
                    x: boundary.x2,
                    y: boundary.y2
                }
                ], curContext.cacheCanvas);

                index < 2 && panToBoundaries.push(object);
            }

            var viewpointAreaMarkup = this.getViewpointAreaForMarkups(panToBoundaries);

            this.curContext.panToViewPoint = viewpointAreaMarkup;
        },

        _onAfterImageAndMarkupLoad: function (config) {
            var that = this,
                viewPortTransform = this.curContext.topCanvas.viewportTransform;

            !this.curContext.mode && this.setCanvasViewMode();

            IQSketchLightZoomHandler.initializeDrawingState(this.curContext, true, function () {
                //Desktop - focus to canvas to resolve issue with keyboard shortcuts.
                ExtFallback.isDesktop() && that.configData && !that.configData.stopFocus && that.curContext.topCanvas.upperCanvasEl.focus();
                //pan to viewpoint
                that.curContext.panToViewPoint &&
                    that.fitViewToMarkup(that.curContext.panToViewPoint, {
                        maxZoom: that.curContext.extentZoom ? that.curContext.extentZoom * 7 : 1
                    });

                that.onAfterZoom();
            });
        },

        fitViewToMarkup: function (markup, options) {
            var options = options || {},
                that = this,
                curContext = this.curContext,
                pointer = fabric.util.transformPoint({
                    x: markup.left,
                    y: markup.top
                }, curContext.topCanvas.viewportTransform),
                zoomToArea = function () {
                    that.zoomToArea(markup, pointer, options);
                };

            this.curContext.mode === SketchConstants.modes.VIEW || options.retainMode ?
                zoomToArea() : this.setCanvasViewMode(function () {
                    zoomToArea();
                });
        },

        updates: function (cmp) {
            // To-DO - This code has to be optimized
            var canvasData = {
                width: cmp.el.getWidth(),
                height: cmp.el.getHeight()
            };

            var curContext = this.curContext,
                topCanvas = curContext.topCanvas,
                panToViewPoint = curContext.extentZoom != topCanvas.viewportTransform[0];

            if (panToViewPoint) {
                var currentCenterPoint = topCanvas.getVpCenter(),
                    viewpointAreaMarkup = new fabric.Rect({
                        left: currentCenterPoint.x,
                        top: currentCenterPoint.y,
                        width: 1,
                        height: 1,
                        fill: 'transparent',
                        stroke: '#4FC3F7',
                        strokeWidth: 1,
                        originX: 'center',
                        originY: 'center'
                    });

                canvasData.panToViewPoint = {
                    markup: viewpointAreaMarkup,
                    options: {
                        maxZoom: topCanvas.viewportTransform[0]
                    }
                };
            }

            this.resizeCanvas(canvasData);
        },

        resizeCanvas: function (canvasData) {
            this._setCanvasCoordinates({
                width: canvasData.width,
                height: canvasData.height
            });

            this.rerenderCanvas(canvasData);
        },

        isTouchEnabled: function () {
            return window.navigator && window.navigator.maxTouchPoints > 0;
        },

        applyZoom: function (action, btnStatus) {
            if (!this.curContext.zoomAndPanEnabled) {
                return;
            }

            var zoomHandler = this._getZoomHandler();
            switch (action) {
                case 'zoomin':
                    zoomHandler.zoomIn(this.curContext, ExtFallback.pass(this.onAfterZoom, [], this));
                    break;
                case 'zoomout':
                    zoomHandler.zoomOut(this.curContext, ExtFallback.pass(this.onAfterZoom, [], this));
                    break;
                case 'zoomextent':
                    zoomHandler.zoomExtent(this.curContext, ExtFallback.pass(this.onAfterZoom, [], this));
                    break;
                case 'zoomwindow':
                    btnStatus && this.setMarkup({
                        action: 'zoomwindow',
                        data: {
                            isZoom: true
                        }
                    });
                    break;
            }

            btnStatus = action == 'zoomwindow' && btnStatus;
            this.fabricController.fireEvent('toggleZoomControlButtonByAction', 'zoomwindow', btnStatus);
        },

        onObjectSelected: function (evt) {
            var target = evt.target;

            !target.markuptype && (target.type == "group" || target.type == 'activeSelection') && ExtFallback.apply(target, {
                contextMenuType: "multishape",
                markuptype: "group"
            });

            this.curContext.mode === SketchConstants.modes.VIEW && this.onObjectTapped(evt);
        },

        onObjectTapped: function (evt) {
            var markup = evt.target,
                that = this;
            switch (markup.markuptype) {
                case 'extractionArea':
                    !markup.locked && this.setCanvasSelectionMode(function () {
                        //that.curContext.topCanvas.selectionType = that.curContext.topCanvas.selectionModes_.single;
                        var tappedMarkup = that.getMarkupObjectByProperty('id', markup.id)[0];
                        tappedMarkup && that.curContext.topCanvas.setActiveObject(tappedMarkup);
                        tappedMarkup && that.curContext.topCanvas.renderAll();
                    });
                    break;
            }
        },

        autoSelectMarkup: function (markup, hasControls) {
            if (this.curContext.offsetMode || !markup) return;

            ExtFallback.apply(this.curContext.topCanvas, {
                selection: true,
                skipTargetFind: false
            });

            ExtFallback.apply(markup, {
                selectable: true,
                hasControls: ExtFallback.isDefined(hasControls) ? hasControls : true,
                hasBorders: true
            });

            this.curContext.topCanvas.setActiveObject(markup);
            this.curContext.topCanvas.renderAll();
        },

        // _moveMarkup: function (markup, fromCanvas, toCanvas, callback) {
        //     var markupObject = markup.toDatalessObject(),
        //         klass = fabric.util.getKlass(markupObject.type),
        //         that = this;
        //     this.curContext.canFireObjectEvents = false;
        //     klass.fromObject(markupObject, function (obj) {
        //         toCanvas.add(obj);
        //         fromCanvas.remove(markup);
        //         that.curContext.canFireObjectEvents = true;
        //         callback && callback(obj);
        //     });
        // },

        _setObjectsSelectable: function (selectable) {
            var that = this,
                curContext = this.curContext;

            curContext.topCanvas.selection = selectable;
            curContext.topCanvas.skipTargetFind = !selectable;

            curContext.topCanvas.forEachObject(function (object) {
                that._setObjectSelectable(object, selectable);
            });
        },

        _setObjectSelectable: function (object, selectable) {
            if (!ExtFallback.Object.isEmpty(object) && object.markuptype != 'grid') {
                object.perPixelTargetFind = selectable;
                object.selectable = !object.locked && selectable;
                object.hasControls = selectable;
                object.hasBorders = selectable;
                object.lockRotation = !selectable;
                object.lockScalingX = object.lockScalingY = !selectable;
                object.lockMovementX = object.lockMovementY = !selectable;
            }
        },

        setMarkup: function (markupProps) {
            var data = markupProps.data,
                type = markupProps.action;

            this._resetAllModes(data);

            switch (type) {
                case 'zoomwindow':
                    this.curContext.shape = new Crop({
                        data: data,
                        drawingManager: this,
                        type: type
                    });
                    break;
                case 'extractionArea':
                    data = {
                        markupType: 'extractionArea',
                        markupValue: data.data,
                        stroke: data.stroke,
                        fill: data.stroke,
                        opacity: 0.4,
                        showValidation: data.showValidation
                    };
                    this.curContext.shape = new Rectangle({
                        data: data,
                        drawingManager: this,
                        type: type
                    });
                    break;
            }

            this.curContext.sketchMode = SKETCHMODE.Drawing;

            this.curContext.mode = type;

            this._setObjectsSelectable(false);
        },

        onAfterZoom: function () {
            IQSketchLightHelper.resizeCanvasIcons(this.curContext);
        },

        _getZoomHandler: function () {
            return IQSketchLightZoomHandler;
        },

        _resetAllModes: function () {
            this.curContext.mode == 'extractionArea' &&
                this.mainView.getController().fireEvent('resetextractionarea');

            this.fabricController.fireEvent('afterResettingModes');
            this.curContext.shape = null;
            this.curContext.topCanvas.selection = false;
            this.curContext.sketchMode = null;
            this.curContext.topCanvas.isViewMode = false;
            this.curContext.topCanvas.isDrawingMode = false;
        },

        clearUnwantedShapes: function () {
            return;
        },

        getMarkupObjectByProperty: function (property, value) {
            return this.getCanvasMarkupByProperty(['topCanvas', 'cacheCanvas'], property, value);
        },

        zoomToArea: function (areaObj, pointer, options) {
            var that = this,
                drawingContext = this.curContext,
                options = options || {};

            IQSketchHelper.sketchLightZoomToArea(drawingContext, pointer, areaObj,
                options.minZoom || SketchConstants.ZoomConfig.MinimumZoom,
                options.maxZoom || SketchConstants.ZoomConfig.MaximumZoom,
                drawingContext.topCanvas.getZoom(),
                function () {
                    that.onAfterZoom();
                });
        },

        clearAllMarkupCanvases: function () {
            this.curContext.topCanvas.clear();
            this.curContext.cacheCanvas.clear();
        },

        rerenderCanvas: function (config) {
            var me = this,
                viewportTransform = this.curContext.topCanvas.viewportTransform;

            this.curContext.imageHandler && this.curContext.imageHandler.updateCanvasData({
                canvasWidth: this.curContext.bgCanvas.width,
                canvasHeight: this.curContext.bgCanvas.height,
                imageUrl: this.curContext.imageUrl,
                callback: function (data) {
                    me.clearAllMarkupCanvases();
                    me.loadMarkups();
                    ExtFallback.apply(me.curContext, data);
                    IQSketchLightZoomHandler.initializeDrawingState(me.curContext, true, function () {
                        me.onAfterZoom();
                    });
                }
            });
        },

        updateBackgroundImage: function (img) {
            if (!img) return;

            this.curContext.imageUrl = img;

            this.rerenderCanvas({
                retainZoomLevel: this.curContext.topCanvas.getZoom()
            });
        },

        setCanvasViewMode: function (callBack) {
            var that = this,
                curContext = this.curContext;
            this._resetAllModes();
            this._moveObjectsBetweenCanvas(this.curContext.topCanvas, this.curContext.cacheCanvas, function () {
                curContext.mode = SketchConstants.modes.VIEW;
                curContext.topCanvas.isViewMode = true;
                curContext.shape = ExtFallback.isDesktop() && !that.isTouchEnabled() ? SketchLightDesktopPan : SketchLightTouchPan;
                curContext.topCanvas.selectionType = curContext.topCanvas.selectionModes_.multiselect;
                ExtFallback.apply(curContext.topCanvas, {
                    selection: false,
                    skipTargetFind: true
                });
                callBack && callBack();
            });
        },

        setCanvasSelectionMode: function (callback) {
            var that = this,
                curContext = this.curContext;
            this._resetAllModes();
            this._moveObjectsBetweenCanvas(this.curContext.cacheCanvas, this.curContext.topCanvas, function () {
                curContext.sketchMode === SKETCHMODE.Select;
                curContext.mode = SketchConstants.modes.NONE;
                curContext.topCanvas.selectionType = curContext.topCanvas.selectionModes_.multiselect;
                that._setObjectsSelectable(true);
                callback && callback();
            });
        },

        _moveObjectsBetweenCanvas: function (fromCanvas, toCanvas, callback) {
            var that = this,
                curContext = this.curContext,
                needUpdate = true;

            curContext.canFireObjectEvents = false;
            toCanvas.renderOnAddRemove = false;
            fromCanvas.renderOnAddRemove = false;

            if (fromCanvas.getObjects().length > 0) {
                needUpdate = true;
                var fromJson = fromCanvas.toDatalessJSON();
                fromCanvas.clear().renderAll();

                //retain existing objects if there is one
                if (toCanvas.getObjects().length > 0) {
                    var toJsonObjects = toCanvas.toDatalessJSON();
                    toCanvas.clear();
                    fromJson.objects = fromJson.objects.concat(toJsonObjects.objects);
                }

                toCanvas.loadFromJSON(fromJson, function () {
                    that._onAfterMoveObjectsBetweenCanvas(fromCanvas, toCanvas, callback, needUpdate);
                });
            } else {
                that._onAfterMoveObjectsBetweenCanvas(fromCanvas, toCanvas, callback, needUpdate);
            }
        },

        _onAfterMoveObjectsBetweenCanvas: function (fromCanvaslocal, toCanvaslocal, callback, needUpdate) {
            needUpdate && toCanvaslocal.renderAll();
            toCanvaslocal.renderOnAddRemove = true;
            fromCanvaslocal.renderOnAddRemove = true;
            this.curContext.canFireObjectEvents = true;

            ExtFallback.isFunction(callback) && callback();
        },

        _getMarkupObjectsByMarkupValueKey: function (key, value) {
            return this._getCanvasMarkupsByMarkupValueKey(['topCanvas', 'cacheCanvas'], key, value)
        },

        _getCanvasMarkupsByMarkupValueKey: function (canvasList, key, value) {
            var that = this,
                objMarkups = [];
            for (var key1 in canvasList) {
                var canvas = canvasList[key1];
                for (var key2 in that.curContext[canvas].getObjects()) {
                    var markup = that.curContext[canvas].getObjects()[key2];
                    if (!markup || !markup.markupValue || !markup.markupValue[key] || !value) { } else {
                        var markupValueObject = markup.markupValue[key];
                        if (ExtFallback.isArray(markupValueObject) && ExtFallback.Array.contains(markupValueObject, value))
                            objMarkups.push(markup);
                        else
                            (value && ExtFallback.isString(markupValueObject) && markupValueObject.toLowerCase() === value.toString().toLowerCase() ||
                                markupValueObject == value) && objMarkups.push(markup);
                    }
                }
            }
            return objMarkups;
        },

        panToMarkupByMarkupData: function (markupData) {
            var markupObj = this._getMarkupByData(markupData);

            markupObj && this.panToMarkup(markupObj);
        },

        panToMarkupsByMarkupData: function (markupsData) {
            var that = this,
                markups = [];
            for (var key in markupsData) {
                var markupData = markupsData[key];
                var markupObj = that._getMarkupByData(markupData);
                markupObj && markups.push(markupObj);
            }

            markups.length > 0 && this.panToMarkups(markups);
        },

        _getMarkupByData: function (markupData) {
            var markupObj = markupData.key && markupData.value ?
                this._getMarkupObjectsByMarkupValueKey(markupData.key, markupData.value)[0] :
                this.getMarkupObjectByProperty('id', markupData.markupId)[0];

            return markupObj;
        },

        getViewpointAreaForMarkups: function (markups) {
            var objectsBoundary = IQSketchLightHelper.evaluateObjectsBoundary(markups, this.curContext);

            var viewpointAreaMarkup = new fabric.Rect({
                left: objectsBoundary.left,
                top: objectsBoundary.top,
                width: objectsBoundary.width,
                height: objectsBoundary.height,
                fill: 'transparent',
                stroke: '#4FC3F7',
                strokeWidth: 1,
                originX: 'left',
                originY: 'top'
            });
            return viewpointAreaMarkup;
        },

        panToMarkups: function (markups) {
            if (markups.length == 1) {
                this.panToMarkup(markups[0]);
                return;
            }
            for (var key in markups) {
                var markup = markups[key];
                markup.highlight(true);
                setTimeout(function () {
                    markup.highlight && markup.highlight(false);
                }, 5000);
            }

            var viewpoint = this.getViewpointAreaForMarkups(markups);
            this.fitViewToMarkup(viewpoint, {
                maxZoom: this.curContext.extentZoom ? this.curContext.extentZoom * 7 : 1
            });
        },

        panToMarkup: function (markupObject) {
            if (!markupObject) return;
            this._panCanvasToObj(markupObject);
            markupObject && markupObject.highlight(true);
            markupObject && setTimeout(function () {
                markupObject.highlight && markupObject.highlight(false);
            }, 5000);
        },

        _panCanvasToObj: function (markupObj) {
            if (!markupObj) return;

            var zoom = this.curContext.topCanvas.getZoom(),
                boundingWidth = markupObj.getBoundingRect().width,
                boundingHeight = markupObj.getBoundingRect().height,
                widthDiff = boundingWidth - (markupObj.width * zoom),
                heightDiff = boundingHeight - (markupObj.height * zoom),
                pointer = {
                    x: markupObj.getBoundingRect().left,
                    y: markupObj.getBoundingRect().top
                },
                minZoom = zoom < 0.1 ? 0.1 : zoom,
                maxZoom = this.curContext.extentZoom ? this.curContext.extentZoom * 10 : 1;


            pointer.x = pointer.x + (widthDiff / 2);
            pointer.y = pointer.y + (heightDiff / 2);

            this.zoomToArea(markupObj, pointer, {
                minZoom: minZoom,
                maxZoom: maxZoom
            });
        },

        zoomToArea: function (areaObj, pointer, options) {
            var that = this,
                drawingContext = this.curContext,
                options = options || {};

            IQSketchLightHelper.zoomToArea(drawingContext, pointer, areaObj,
                options.minZoom || SketchConstants.ZoomConfig.MinimumZoom,
                options.maxZoom || SketchConstants.ZoomConfig.MaximumZoom,
                drawingContext.topCanvas.getZoom(),
                function () {
                    that.onAfterZoom();
                });
        },

        onUndo: function () {
            this.curContext.topCanvas.discardActiveObject();
            this.undoRedoManager.undo(this.curContext);
        },

        onRedo: function () {
            this.curContext.topCanvas.discardActiveObject();
            this.undoRedoManager.redo(this.curContext);
        },

        removeMarkup: function (data) {
            if (!data) {
                var markup = this.curContext.topCanvas.getActiveObject();
                markup && this.curContext.topCanvas.remove(markup);
                this.curContext.topCanvas.renderAll();
                return;
            }
            data.disableEvents && (this.curContext.canFireObjectEvents = false);
            switch (data.type) {
                case 'markupValue':
                    var markup = this._getMarkupObjectsByMarkupValueKey(data.key, data.value)[0],
                        canvas = markup && markup.canvas;
                    markup && markup.canvas.remove(markup);
                    canvas && canvas.renderAll();
                    break;
            }
            data.disableEvents && (this.curContext.canFireObjectEvents = true);
        },

        validateMarkup: function (object) {
            if (object.height < 0.5 || object.width < 0.5) {
                this.curContext.canFireObjectEvents = false;
                this.curContext.topCanvas.remove(object);
                this.curContext.canFireObjectEvents = true;
                return false;
            } else {
                return true;
            }
        },

        getUpdatedExtractionAreas: function () {
            var that = this,
                orignalAreas = this.curContext.markups.extractionAreas || [],
                updatedExtractionAreas = [],
                extractionAreasOnCanvas = this.getMarkupObjectByProperty('markuptype', 'extractionArea');
            for (var key in extractionAreasOnCanvas) {
                var area = extractionAreasOnCanvas[key];
                var type = area.markupValue.type,
                    coordinates = {
                        x1: area.left,
                        y1: area.top,
                        x2: area.left + area.width,
                        y2: area.top + area.height
                    };
                updatedExtractionAreas.push({
                    type: type,
                    coordinates: coordinates
                });
            }

            that.setCanvasViewMode();

            return updatedExtractionAreas;
        }
    }
})();
/* DrawingManager - End */

/* IQSketchLiteManager - Start */
class IQSketchLiteManager {
    constructor(config) {
        var that = this;
        if (config && config.domElementId && config.initialconfig) {
            that.domElementId = config.domElementId;
            that.start(config.domElementId, config.initialconfig);
        }
    }
    start = function (domElementId, initialconfig) {
        var that = this,
            domChecker = document.getElementById(domElementId),
            canvasDom = document.getElementById('light_bg_canvas_' + initialconfig.appId);
        if (canvasDom){
            return;
        }
        if (!domChecker) {
            setTimeout(function(){
                that.start(domElementId, initialconfig);
            }, 1000);
            return;
        }

        if (typeof Ext === "undefined") {
            // assignExt(ExtFallback);
        } else {
            ExtFallback.applyIf(Ext, ExtFallback);
            ExtFallback = Ext;
        }
        window.ExtFallback = ExtFallback;
        if (initialconfig.totalCount > 1) {
            var pages = initialconfig.pages;
            if (pages[initialconfig.currentPage - 1]){
                initialconfig.imageUrl = pages[initialconfig.currentPage - 1].imageUrl;
                initialconfig.markups = pages[initialconfig.currentPage - 1].markups || initialconfig.markups;
            }
            setTimeout(function() {
                /* Navigation Control creation - Start */
                var navigationDiv = document.createElement("div");
                // navigationDiv.setAttribute("class", "common-navigation-control");
                navigationDiv.innerHTML = '<div class="common-navigation-control"><button action="prev" class="prev-cls ' + (initialconfig.currentPage == 1 ? "disabled-cls" : "") + '" title="Prev"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik02OTguMTEyIDEwMDIuMjk3YzUuNDkyIDYuMzUyIDEzLjU2MSAxMC4zNDggMjIuNTY0IDEwLjM0OHMxNy4wNzItMy45OTUgMjIuNTMyLTEwLjMxbDAuMDMyLTAuMDM4YzUuODAyLTYuNjY1IDkuMzM5LTE1LjQzNSA5LjMzOS0yNS4wMzFzLTMuNTM3LTE4LjM2Ni05LjM3OC0yNS4wNzdsMC4wMzkgMC4wNDYtMzk2Ljg0My00NDAuMjQ5IDM5Ni44NzEtNDQwLjE3OGM1LjgwMi02LjY2NSA5LjMzOS0xNS40MzUgOS4zMzktMjUuMDMxcy0zLjUzNy0xOC4zNjYtOS4zNzgtMjUuMDc3bDAuMDM5IDAuMDQ2Yy01LjQ5Mi02LjM1Mi0xMy41NjEtMTAuMzQ4LTIyLjU2NC0xMC4zNDhzLTE3LjA3MiAzLjk5NS0yMi41MzIgMTAuMzFsLTAuMDMyIDAuMDM4LTQyMC4xOTYgNDY1LjIyM2MtNS44MDIgNi42NjUtOS4zMzkgMTUuNDM1LTkuMzM5IDI1LjAzMXMzLjUzNyAxOC4zNjYgOS4zNzggMjUuMDc3bC0wLjAzOS0wLjA0NnoiPjwvcGF0aD4KPC9zdmc+Cg=="></button></div>' +
                    '<div class="navigation-body-cls"><span class="current-page">' + initialconfig.currentPage + '</span> of <span class="total-count">' + initialconfig.totalCount + '</span></div>' +
                    '<div class="common-navigation-control right-navigation"><button action="next" class="next-cls ' + (initialconfig.currentPage == initialconfig.totalCount ? "disabled-cls" : "") + '" title="Next"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik0zMjMuMDg2IDEwMDIuMjk3Yy01LjQ5MiA2LjM1Mi0xMy41NjEgMTAuMzQ4LTIyLjU2NCAxMC4zNDhzLTE3LjA3Mi0zLjk5NS0yMi41MzItMTAuMzFsLTAuMDMyLTAuMDM4Yy01LjgwMi02LjY2NS05LjMzOS0xNS40MzUtOS4zMzktMjUuMDMxczMuNTM3LTE4LjM2NiA5LjM3OC0yNS4wNzdsLTAuMDM5IDAuMDQ2IDM5Ni44NDMtNDQwLjI0OS0zOTYuODcxLTQ0MC4xNzhjLTUuODAyLTYuNjY1LTkuMzM5LTE1LjQzNS05LjMzOS0yNS4wMzFzMy41MzctMTguMzY2IDkuMzc4LTI1LjA3N2wtMC4wMzkgMC4wNDZjNS40OTItNi4zNTIgMTMuNTYxLTEwLjM0OCAyMi41NjQtMTAuMzQ4czE3LjA3MiAzLjk5NSAyMi41MzIgMTAuMzFsMC4wMzIgMC4wMzggNDIwLjE5NiA0NjUuMjIzYzUuODAyIDYuNjY1IDkuMzM5IDE1LjQzNSA5LjMzOSAyNS4wMzFzLTMuNTM3IDE4LjM2Ni05LjM3OCAyNS4wNzdsMC4wMzktMC4wNDZ6Ij48L3BhdGg+Cjwvc3ZnPgo="></button></div>';
                document.getElementById(domElementId).appendChild(navigationDiv);
                that.assignNavigationListeners(navigationDiv, initialconfig);
                /* Navigation Control creation - End */
            }, 100);
        }
        var mainDiv = document.createElement("div");
        mainDiv.setAttribute("class", "light_fabric_container");
        var canvasHtml = '<canvas id="light_bg_canvas_' + initialconfig.appId + '" style="z-index: 1;position: absolute;"></canvas>' +
            '<canvas id="light_drawing_canvas_' + initialconfig.appId + '" style="z-index:1;position: absolute;"></canvas>' +
            '<canvas id="light_sketch_canvas_' + initialconfig.appId + '" style="z-index:1;position: absolute;" ></canvas>';
        mainDiv.innerHTML = canvasHtml;
        mainDiv.initialconfig = initialconfig;
        mainDiv.initialData = initialconfig;
        mainDiv.appId = initialconfig.appId;
        mainDiv.getController = function () {
            return that
        };
        document.getElementById(domElementId).innerHTML = "";
        /* Toolbar creation - Start */
        if (initialconfig.showToolbar) {
            var toolbarDiv = document.createElement("div");
            toolbarDiv.setAttribute("class", "canvas-icon-bar");
            toolbarDiv.innerHTML = '<button disabled title="Undo" action="undo" tabindex="0"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik00OTMuNDU0IDE3MC42Njd2NjA2LjgwNWwtNDA4LjEyMS0zMDMuMzg4IDQwOC4xMjEtMzAzLjQxN3oiPjwvcGF0aD4KPHBhdGggZmlsbD0iIzAwMCIgZD0iTTQ5My40NTQgMzY5Ljc3OHYxODkuNjM5YzAgMCAyNzcuMzA1LTQxLjQ3MiA0NDUuMjEyIDI2NS40NzIgMCAwIDI1Ljk0MS01MDguODcxLTQ0NS4yMTItNDU1LjExMXoiPjwvcGF0aD4KPC9zdmc+Cg=="></button>' +
                '<button disabled action="redo" title="Redo" tabindex="0"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik01MzAuNTQ2IDE3MC42Njd2NjA2LjgwNWw0MDguMTIxLTMwMy4zODgtNDA4LjEyMS0zMDMuNDE3eiI+PC9wYXRoPgo8cGF0aCBmaWxsPSIjMDAwIiBkPSJNNTMwLjU0NiAzNjkuNzc4djE4OS42MzljMCAwLTI3Ny4zMDUtNDEuNDcyLTQ0NS4yMTIgMjY1LjQ3MiAwIDAtMjUuOTQxLTUwOC44NzEgNDQ1LjIxMi00NTUuMTExeiI+PC9wYXRoPgo8L3N2Zz4K"></button>' +
                '<button action="removeMarkup" title="Delete" tabindex="0"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGQ9Ik02NjMuOTk0IDM5MS45OTh2NDAwLjAwOGgtMzE5Ljk5MnYtNDAwLjAwOGgzMTkuOTkyek02MDMuOTkxIDE1MmgtMTk5Ljk5MWwtNDAuMDA4IDQwLjAwOGgtMTM5Ljk5MnY3OS45OTRoNTU5Ljk5MXYtNzkuOTk0aC0xMzkuOTkyek03NDMuOTgzIDMxMi4wMDloLTQ4MC4wMDJ2NDgwLjAwMmMwLjEzNiA0NC4xMzMgMzUuODggNzkuODcgODAuMDA1IDc5Ljk5NGgzMjAuMDAyYzQ0LjEyNi0wLjEzNiA3OS44NTgtMzUuODY4IDc5Ljk5NC03OS45Nzd2LTAuMDEyeiI+PC9wYXRoPgo8L3N2Zz4K"></button>' +
                '<button action="markNewExtractionArea" title="Add" tabindex="0"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbWl0ZXJsaW1pdD0iNCIgc3Ryb2tlLXdpZHRoPSIyNi45NDc0IiBzdHJva2U9IiMwMDAiIGQ9Ik0yMzQuMTA5IDE2MGg1NTUuNzg5YzQwLjkzIDAgNzQuMTA5IDMzLjE3OSA3NC4xMDkgNzQuMTA5djU1NS43ODljMCA0MC45My0zMy4xNzkgNzQuMTA5LTc0LjEwOSA3NC4xMDloLTU1NS43ODljLTQwLjkzIDAtNzQuMTA5LTMzLjE3OS03NC4xMDktNzQuMTA5di01NTUuNzg5YzAtNDAuOTMgMzMuMTc5LTc0LjEwOSA3NC4xMDktNzQuMTA5eiI+PC9wYXRoPgo8cGF0aCBmaWxsPSJub25lIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLW1pdGVybGltaXQ9IjQiIHN0cm9rZS13aWR0aD0iMjYuOTQ3NCIgc3Ryb2tlPSIjMDAwIiBkPSJNMjM0LjEwOSAxNjkuMjU5aDU1NS43ODljMzUuODA5IDAgNjQuODM2IDI5LjAyNyA2NC44MzYgNjQuODM2djU1NS43ODljMCAzNS44MDktMjkuMDI3IDY0LjgzNi02NC44MzYgNjQuODM2aC01NTUuNzg5Yy0zNS44MDkgMC02NC44MzYtMjkuMDI3LTY0LjgzNi02NC44MzZ2LTU1NS43ODljMC0zNS44MDkgMjkuMDI3LTY0LjgzNiA2NC44MzYtNjQuODM2eiI+PC9wYXRoPgo8cGF0aCBmaWxsPSIjMDAwIiBkPSJNNjg2Ljc4MSA0MTQuNzM3di02OS40NzNoLTY5LjQ3M3YyNy43ODZoLTE5NC41Mjd2LTI3Ljc4NmgtNjkuNDczdjY5LjQ3M2gyNy43ODZ2MTk0LjUyN2gtMjcuNzg2djY5LjQ3M2g2OS40NzN2LTI3Ljc4NmgxOTQuNTI3djI3Ljc4Nmg2OS40NzN2LTY5LjQ3M2gtMjcuNzg2di0xOTQuNTI3ek02MzEuMTk5IDM1OS4xNjRoNDEuNjl2NDEuNjloLTQxLjY5ek0zNjcuMTk5IDQwMC44MzZ2LTQxLjY5aDQxLjY5djQxLjY5ek00MDguODg1IDY2NC44MzZoLTQxLjY5di00MS42OWg0MS42OXpNNjcyLjg4NyA2MjMuMTY0djQxLjY5aC00MS42OXYtNDEuNjl6TTY0NS4wOTAgNjA5LjI2M2gtMjcuNzg2djI3Ljc4NmgtMTk0LjUyN3YtMjcuNzg2aC0yNy43ODZ2LTE5NC41MjdoMjcuNzg2di0yNy43ODZoMTk0LjUyN3YyNy43ODZoMjcuNzg2eiI+PC9wYXRoPgo8L3N2Zz4K"></button>';
            document.getElementById(domElementId).appendChild(toolbarDiv);
            that.assignToolbarListeners(toolbarDiv);
        }
        /* Toolbar creation - End */
        /* Zoom Control creation - Start */
        var zoomControlDiv = document.createElement("div");
        zoomControlDiv.setAttribute("class", "common-zoom-control");
        zoomControlDiv.innerHTML = '<table>' +
            '<tr><td></td><td></td><td><button class="close-cls" title="Close" action="close" tabindex="0"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik04NzkuMzE3IDc5Mi45ODFsLTEwNS4yMzcgMTA1Ljk0MS0yNzIuNDA1LTI3MC42NTYtMjcwLjY1NiAyNzIuMzg0LTEwNS45NDEtMTA1LjIzNyAyNzAuNjU2LTI3Mi40MDUtMjcyLjM4NC0yNzAuNjU2IDEwNS4yMzctMTA1Ljk0MSAyNzIuNDA1IDI3MC42NTYgMjcwLjY1Ni0yNzIuMzg0IDEwNS45NDEgMTA1LjIzNy0yNzAuNjU2IDI3Mi40MDUgMjcyLjM4NCAyNzAuNjU2eiI+PC9wYXRoPgo8L3N2Zz4K"></button></td></tr>' +
            '<tr><td></td><td><button class="zoom-to-window-cls" title="Zoom to window" action="zoomwindow" tabindex="0"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik03MjQuMDA5IDc3Mi40MDdsMjQ0LjA3NCAyNDQuMDc0YzI1LjI3MyAyNi4yMjEgNzQuNjE5LTIzLjI1MSA0OC4zOTgtNDguMzk4bC0yNDQuMTM3LTI0NC4xMzd6TTQxMC42ODcgMGMyMjYuODE2IDAgNDEwLjY4NyAxODMuODcxIDQxMC42ODcgNDEwLjY4N3MtMTgzLjg3MSA0MTAuNjg3LTQxMC42ODcgNDEwLjY4N2MtMjI2LjgxNiAwLTQxMC42ODctMTgzLjg3MS00MTAuNjg3LTQxMC42ODd2MGMwLTAuMTMxIDAtMC4yODcgMC0wLjQ0MyAwLTIyNi41NzIgMTgzLjY3My00MTAuMjQ0IDQxMC4yNDQtNDEwLjI0NCAwLjE1NiAwIDAuMzExIDAgMC40NjcgMGgtMC4wMjR6TTEzNi45MTcgMjA1LjM0M3YzNDIuMzIzaDEzNi45MTd2MTM2LjkxN2gzNDIuMjZ2LTM0Mi4zMjNoLTEzNi45MTd2LTEzNi45MTd6TTIwNS4zNDMgMjczLjgzM2gyMDUuMzQzdjY4LjQyN2gtMTM2Ljg1M3YxMzYuOTE3aC02OC40OXpNMzQyLjI2IDQxMC42ODdoMjA1LjM0M3YyMDUuMzQzaC0yMDUuMzQzeiI+PC9wYXRoPgo8L3N2Zz4K"></button></td><td></td></tr>' +
            '<tr><td><button class="zoom-in-cls" action="zoomin" title="Zoom In" tabindex="0"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGQ9Ik05MTcuMzMzIDU5MC4zNzloLTM0OC4yODh2MzQ4LjI4OGgtMTM1LjQyNHYtMzQ4LjI4OGgtMzQ4LjI4OHYtMTM1LjQyNGgzNDguMjg4di0zNDguMjg4aDEzNS40MjR2MzQ4LjI4OGgzNDguMjg4djEzNS40MjR6Ij48L3BhdGg+Cjwvc3ZnPgo="></button></td><td><button title="Pan" class="pan-cls" action="pan" tabindex="0"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik01MTMuMzA4IDAuMDU3bC0zLjM1NiAwLjM0MWgtMC43NGMtMS4yNTIgMC0yLjQ0NiAwLTMuNjk4IDAuMzQxaC0wLjc0bC0xLjEzOCAwLjM0MS0xLjQ3OSAwLjM5OGgtMS4xMzhsLTAuNzQgMC4zNDEtMi42MTcgMS4xMzhoLTAuMzQxYy0xLjEzOCAwLjQ1NS0yLjIxOSAwLjkxLTMuMzU2IDEuNDc5IDAgMCAwIDAgMCAwLjM0MWgtMS4xMzhsLTEuMTM4IDAuNzQtMC43NCAwLjc0LTAuNzQgMC4zNDEtMC4zNDEgMC4zNDFxLTEuNzA3IDAuODUzLTMuMzU2IDEuODJsLTAuMzQxIDAuNzQtMi4yMTkgMi4yMTlxLTEuMzY1IDEuMDI0LTIuNjE3IDIuMjE5bC0wLjM0MSAwLjc0LTEyMi44OCAxMjIuODhjLTYuNzkxIDcuMjM0LTEwLjk2MiAxNi45OTYtMTAuOTYyIDI3LjczMyAwIDIyLjQwMiAxOC4xNiA0MC41NjIgNDAuNTYyIDQwLjU2MiAxMC41MjQgMCAyMC4xMTItNC4wMDggMjcuMzIxLTEwLjU4MWwtMC4wMzIgMC4wMjkgNTYuODg5LTU2Ljg4OXYxODMuNThjLTAuMTMzIDEuMjM1LTAuMjA5IDIuNjY3LTAuMjA5IDQuMTE2IDAgMjIuNDAyIDE4LjE2IDQwLjU2MiA0MC41NjIgNDAuNTYyczQwLjU2Mi0xOC4xNiA0MC41NjItNDAuNTYyYzAtMS41Ny0wLjA4OS0zLjEyLTAuMjYzLTQuNjQ0bDAuMDE3IDAuMTg2di0xODIuMDQ0bDU2LjI2MyA1NS44NjVjNy40MDUgNy43ODYgMTcuODQyIDEyLjYyOCAyOS40MSAxMi42MjggMjIuNDAyIDAgNDAuNTYyLTE4LjE2IDQwLjU2Mi00MC41NjIgMC0xMS41NjgtNC44NDMtMjIuMDA1LTEyLjYxMS0yOS4zOTRsLTAuMDE3LTAuMDE2LTExOS40NjctMTE5LjQ2N3EtMC44NTMtMS4zMDgtMS44NzctMi42MTdsLTEuMTM4LTAuNzQtMS40NzktMi4yMTktMC4zNDEtMC4zNDFjLTAuOTk4LTAuODctMi4wOTItMS43MjktMy4yMjgtMi41MzFsLTAuMTI4LTAuMDg2cS0xLjQyMi0xLjM2NS0yLjk1OC0yLjU2bC0yLjYxNy0xLjg3Ny0wLjc0LTAuMzQxLTIuOTU4LTEuMTM4LTEuNDc5LTAuNzQtMi42MTctMS4xMzhoMC4yODRsLTMuMzU2LTAuNzQtMC43NC0wLjM0MS0yLjk1OC0wLjc0aC00LjMyNGwtMC43NC0wLjM0MXpNMTYzLjIxNCAzNDUuNDI5Yy05Ljk0NCAxLjAyOC0xOC42ODIgNS41MTUtMjUuMTMyIDEyLjIxOGwtMC4wMTIgMC4wMTMtMTE5LjQ2NyAxMTkuNDY3LTIuMjE5IDEuODItMS4xMzggMS4xMzgtMi4yMTkgMS40NzktMC4zNDEgMC43NGMtMC45MSAwLjk2Ny0xLjc2NCAxLjkzNC0yLjYxNyAyLjk1OHMtMS41MzYgMS45MzQtMi4yMTkgMi45NTgtMS4yNTIgMS45MzQtMS44NzcgMi45NThsLTAuNzQgMC4zNDFxLTAuNjI2IDEuNDc5LTEuMTM4IDIuOTU4bC0wLjc0IDEuNDc5Yy0wLjM5OCAwLjg1My0wLjc5NiAxLjcwNy0xLjEzOCAyLjYxN3MwIDAgMCAwLjM5OHEtMC40NTUgMS42NS0wLjc0IDMuMzU2bC0wLjM0MSAwLjc0YzAgMS4wODEtMC4yODQgMi4yMTktMC4zNDEgMy4zNTZsLTAuMzQxIDAuNzRxMCAxLjQ3OSAwIDIuOTU4bC0wLjM0MSAwLjc0cTAgMS44NzcgMC4zNDEgMy42OThzMCAwIDAgMC4zNDFjMCAxLjI1MiAwIDIuNDQ2IDAuMzQxIDMuNjk4IDAgMCAwIDAgMCAwLjM0MXMwIDAuNTEyIDAgMC43NGwwLjM0MSAwLjc0IDAuMzQxIDEuNDc5cTAgMC41NjkgMCAxLjEzOGwwLjM0MSAwLjc0cTAuNTEyIDEuMzA4IDEuMTM4IDIuNjE3czAgMC41MTIgMCAwLjc0IDAuOTY3IDEuOTkxIDEuNDc5IDIuOTU4bDAuMzQxIDAuMzQxczAgMC41MTIgMCAwLjc0bDEuNDc5IDIuMjc2IDAuMzQxIDAuNzRoMC4zNDFxMC44NTMgMS43MDcgMS44NzcgMy4zNTZsMC43NCAwLjM0MSAxLjg3NyAxLjg3NyAwLjM0MSAwLjc0cTEuMjUyIDEuMTk1IDIuNjE3IDIuMjE5bDAuMzQxIDAuMzk4IDEyMi44OCAxMjMuMjIxYzcuNDQ3IDguMTY4IDE4LjEzMiAxMy4yNzMgMzAuMDA5IDEzLjI3MyAyMi40MDIgMCA0MC41NjItMTguMTYgNDAuNTYyLTQwLjU2MiAwLTExLjY2NS00LjkyNC0yMi4xOC0xMi44MDctMjkuNThsLTAuMDIyLTAuMDIwLTU2Ljg4OS01Ny4zNDRoMTgzLjU4YzEuMjM1IDAuMTMzIDIuNjY3IDAuMjA5IDQuMTE2IDAuMjA5IDIyLjQwMiAwIDQwLjU2Mi0xOC4xNiA0MC41NjItNDAuNTYycy0xOC4xNi00MC41NjItNDAuNTYyLTQwLjU2MmMtMS41NyAwLTMuMTIgMC4wODktNC42NDQgMC4yNjNsMC4xODYtMC4wMTdoLTE4Mi4wNDRsNTUuODY1LTU2LjI2M2M3LjY0Ni03LjM4NyAxMi4zOTMtMTcuNzMyIDEyLjM5My0yOS4xODUgMC0yMi40MDItMTguMTYtNDAuNTYyLTQwLjU2Mi00MC41NjItMC4xMTcgMC0wLjIzNCAwLTAuMzUxIDAuMDAxaDAuMDE4Yy0wLjYxMi0wLjAzNC0xLjMyOC0wLjA1My0yLjA0OC0wLjA1M3MtMS40MzYgMC4wMTktMi4xNDcgMC4wNTdsMC4wOTktMC4wMDR6TTg1My4wNDkgMzQ1LjQyOWMtMjAuNTgxIDIuMTM3LTM2LjQ5MSAxOS4zODktMzYuNDkxIDQwLjM1NyAwIDExLjQ3IDQuNzYxIDIxLjgyOCAxMi40MTUgMjkuMjA2bDAuMDEyIDAuMDEyIDU1LjUyNCA1Ni4yNjNoLTE4Mi4wNDRjLTEuMzM4LTAuMTU2LTIuODg3LTAuMjQ2LTQuNDU4LTAuMjQ2LTIyLjQwMiAwLTQwLjU2MiAxOC4xNi00MC41NjIgNDAuNTYyczE4LjE2IDQwLjU2MiA0MC41NjIgNDAuNTYyYzEuNDUgMCAyLjg4Mi0wLjA3NiA0LjI5Mi0wLjIyNGwtMC4xNzYgMC4wMTVoMTgzLjkyMmwtNTYuODg5IDU3LjM0NGMtOC45MSA3LjQ5MS0xNC41MzMgMTguNjQzLTE0LjUzMyAzMS4xMDkgMCAyMi40MDIgMTguMTYgNDAuNTYyIDQwLjU2MiA0MC41NjIgMTIuNTc5IDAgMjMuODIxLTUuNzI2IDMxLjI2MS0xNC43MTRsMC4wNTUtMC4wNjggMTIyLjg4LTEyMy4yMjEgMC43NC0wLjM0MXExLjEzOC0xLjA4MSAyLjIxOS0yLjIxOWwyLjk1OC0yLjk1OHExLjE5NS0xLjU5MyAyLjIxOS0zLjM1NmwwLjM0MS0wLjc0IDEuNDc5LTIuMjc2IDAuMzQxLTAuNzRzMCAwIDAtMC4zNDEgMS4yNTItMS45MzQgMS44NzctMi45NTggMC0wLjUxMiAwLTAuNzQgMC43OTYtMS43MDcgMS4xMzgtMi42MTcgMC0wLjUxMiAwLTAuNzQgMC0wLjc0IDAtMS4xMzhsMC43NC0xLjQ3OXMwLTAuNTEyIDAtMC43NCAwLTAuNTEyIDAtMC43NCAwIDAgMC0wLjM0MWMwLjI4NC0xLjE5NSAwLjU2OS0yLjQ0NiAwLjc0LTMuNjk4IDAgMCAwIDAgMC0wLjM0MSAwLTEuMjUyIDAtMi40NDYgMC0zLjY5OCAwIDAgMC0wLjUxMiAwLTAuNzRzMC0xLjk5MSAwLTIuOTU4bC0wLjM0MS0wLjc0cS0wLjI4NC0xLjY1LTAuNzQtMy4zNTZzMC0wLjUxMiAwLTAuNzRxLTAuMjg0LTEuNjUtMC43NC0zLjM1NmwtMC4zNDEtMC4zNDFxLTAuNTEyLTEuMzA4LTEuMTM4LTIuNjE3bC0wLjM0MS0xLjQ3OXEtMC42ODMtMS41MzYtMS40NzktMi45NThsLTAuMzQxLTAuMzQxYy0wLjU2OS0xLjAyNC0xLjE5NS0xLjk5MS0xLjg3Ny0yLjk1OHMtMS43MDctMS45OTEtMi42MTctMi45NTgtMS43MDctMS45OTEtMi42MTctMi45NThsLTAuMzQxLTAuNzQtMS44NzctMS40NzktMS4xMzgtMS4xMzgtMi4yMTktMS44NzctMTE5LjkyMi0xMTkuNDY3Yy03LjMyNy03LjUxMS0xNy41MzUtMTIuMTg0LTI4LjgzNC0xMi4yMzFoLTAuMDA5Yy0wLjYxMi0wLjAzNC0xLjMyOC0wLjA1My0yLjA0OC0wLjA1M3MtMS40MzYgMC4wMTktMi4xNDcgMC4wNTdsMC4wOTktMC4wMDR6TTUxMC4zNSA2NTguODg3Yy0yMS4zNjcgMS4yNzgtMzguMjEyIDE4LjkxOS0zOC4yMTIgNDAuNDk0IDAgMC45ODUgMC4wMzUgMS45NjEgMC4xMDQgMi45MjlsLTAuMDA3LTAuMTN2MTgzLjY5NGwtNTYuODg5LTU3LjM0NGMtNy4xNzctNi41NDQtMTYuNzY1LTEwLjU1Mi0yNy4yODktMTAuNTUyLTIyLjQwMiAwLTQwLjU2MiAxOC4xNi00MC41NjIgNDAuNTYyIDAgMTAuNzM3IDQuMTcyIDIwLjQ5OSAxMC45ODIgMjcuNzU1bC0wLjAyMC0wLjAyMiAxMjIuODggMTIyLjg4IDAuMzQxIDAuNzRjMC44NTMgMC43OTYgMS43MDcgMS41MzYgMi42MTcgMi4yMTlsMi4yMTkgMi4yMTkgMC4zNDEgMC43NHExLjY1IDEuMDI0IDMuMzU2IDEuODJsMC4zNDEgMC4zNDEgMC43NCAwLjM5OCAwLjc0IDAuNzQgMS4xMzggMC43NCAxLjEzOCAwLjM5OGMxLjA4MSAwLjY4MyAyLjIxOSAxLjMwOCAzLjM1NiAxLjgyaDAuMzQxbDIuNjE3IDAuNzQgMC43NCAwLjM5OGgxLjEzOGwxLjQ3OSAwLjM0MSAxLjEzOCAwLjM0MWgwLjc0YzEuMjUyIDAgMi40NDYgMC4yODQgMy42OTggMC4zOThoMC43NGwzLjM1NiAwLjM0MSAwLjc0LTAuMzQxaDQuMDk2bDIuOTU4LTAuNzRoMC43NGwzLjM1Ni0xLjEzOGgtMC4xMTRsMi42MTctMS4xMzggMS40NzktMC4zNDEgMi45NTgtMS40NzkgMC43NC0wLjM0MSAyLjYxNy0xLjg3N3ExLjUzNi0xLjI1MiAyLjk1OC0yLjYxN2MxLjI2NC0wLjg4NSAyLjM1OC0xLjc0NCAzLjQwNC0yLjY1N2wtMC4wNDcgMC4wNDAgMC4zNDEtMC4zNDEgMS40NzktMS44MiAxLjEzOC0xLjEzOHEwLjk2Ny0xLjI1MiAxLjg3Ny0yLjYxN2wxMTkuNDY3LTExOS40NjdjNy43ODYtNy40MDUgMTIuNjI4LTE3Ljg0MiAxMi42MjgtMjkuNDEgMC0yMi40MDItMTguMTYtNDAuNTYyLTQwLjU2Mi00MC41NjItMTEuNTY4IDAtMjIuMDA1IDQuODQzLTI5LjM5NCAxMi42MTFsLTAuMDE2IDAuMDE3LTU2LjI2MyA1NS44NjV2LTE4Mi4wNDRjMC4wODAtMC45NTMgMC4xMjUtMi4wNjMgMC4xMjUtMy4xODQgMC0yMi40MDItMTguMTYtNDAuNTYyLTQwLjU2Mi00MC41NjItMC43NDQgMC0xLjQ4NCAwLjAyMC0yLjIxOSAwLjA2MGwwLjEwMi0wLjAwNHoiPjwvcGF0aD4KPC9zdmc+Cg=="></button></td><td><button class="zoom-out-cls" title="Zoom Out" action="zoomout" tabindex="0"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik04NS4zMzMgNDI2LjY2N2g4NTMuMzMzdjE3MC42NjdoLTg1My4zMzN2LTE3MC42Njd6Ij48L3BhdGg+Cjwvc3ZnPgo="></button></td></tr>' +
            '<tr><td></td><td><button class="zoom-extent-cls" title="Zoom Extent" action="zoomextent" tabindex="0"><img src="data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik02NDIuODQ0IDM0MS4zMzN2LTI5MC4xMzNoLTY4LjI2N3Y0MDMuOTExaDQwMy45MTF2LTY4LjI2N2gtMjg0LjQ0NGwzMjkuOTU2LTMyOS45NTYtNDUuNTExLTUxLjJ6Ij48L3BhdGg+CjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik02MzcuMTU2IDY5NC4wNDRsMzM1LjY0NCAzMjkuOTU2IDQ1LjUxMS01MS4yLTMzNS42NDQtMzI5Ljk1NmgyOTUuODIydi02OC4yNjdoLTQwOS42djQwMy45MTFoNjguMjY3eiI+PC9wYXRoPgo8cGF0aCBmaWxsPSIjMDAwIiBkPSJNNTEuMiAzODEuMTU2djY4LjI2N2g0MDMuOTExdi00MDMuOTExaC02OC4yNjd2Mjg0LjQ0NGwtMzI5Ljk1Ni0zMjkuOTU2LTQ1LjUxMSA1MS4yIDMyOS45NTYgMzI5Ljk1NnoiPjwvcGF0aD4KPHBhdGggZmlsbD0iIzAwMCIgZD0iTTM4Ni44NDQgNjgyLjY2N3YyOTAuMTMzaDY4LjI2N3YtNDAzLjkxMWgtNDAzLjkxMXY2OC4yNjdoMjg0LjQ0NGwtMzM1LjY0NCAzMjkuOTU2IDUxLjIgNTEuMnoiPjwvcGF0aD4KPC9zdmc+Cg=="></button></td><td></td></tr>' +
            '<table>';
        document.getElementById(domElementId).appendChild(zoomControlDiv);
        that.assignZoomControlListeners(zoomControlDiv);
        /* Zoom Control creation - End */
       
        document.getElementById(domElementId).appendChild(mainDiv);
        that.mainView = mainDiv;
        that.fabricCanvasInit();
    }
    assignNavigationListeners = function (navigationDiv, initialconfig) {
        var me = this,
            buttons = navigationDiv.querySelectorAll('button'),
            pages = initialconfig.pages,
            currentPageDiv = navigationDiv.querySelector('span[class="current-page"]');
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function (b) {
                var initialData = me.getMainView().initialData,
                    action = b.currentTarget.getAttribute('action');
                console.log(action, b);
                if(action == 'prev'){
                    initialconfig.currentPage = --initialconfig.currentPage;
                } else{
                    initialconfig.currentPage = ++initialconfig.currentPage;
                }
                if (pages[initialconfig.currentPage - 1]){
                    initialData.imageUrl = pages[initialconfig.currentPage - 1].imageUrl;
                    initialData.markups = pages[initialconfig.currentPage - 1].markups;
                    me.rerenderCanvas();
                }
                me.updateNavigationBar();
            });
        });
    }
    updateNavigationBar = function () {
        var me = this,
            initialconfig = this.getMainView().initialData,
            mainDiv = document.getElementById(me.domElementId),
            navigationDiv = mainDiv.querySelector('div[class="navigation-body-cls"]'),
            currentPageDiv = navigationDiv.querySelector('span[class="current-page"]');
        currentPageDiv.innerHTML = initialconfig.currentPage;
        var nextButtonDiv = mainDiv.querySelector('div[class="common-navigation-control right-navigation"]'),
        prevButtonDiv = mainDiv.querySelector('div[class="common-navigation-control"]'),
        prevButton = prevButtonDiv.querySelectorAll('button'),
        nextButton = nextButtonDiv.querySelectorAll('button');
        prevButton[0].setAttribute('class', 'prev-cls');
        nextButton[0].setAttribute('class', 'next-cls');
        if (initialconfig.currentPage == 1) {
            prevButton[0].setAttribute('class', 'prev-cls disabled-cls');
        } else if (initialconfig.currentPage == initialconfig.totalCount) {
            nextButton[0].setAttribute('class', 'next-cls disabled-cls');
        }
    }
    assignZoomControlListeners = function (zoomControl) {
        var me = this,
            buttons = zoomControl.querySelectorAll('button'),
            zoomwindowBtn = zoomControl.querySelector('button[action=zoomwindow]');
        me.dragZoomControl(zoomControl);
        function adjustCmpPosition(zoomControl) {
            var initialLeft = (me.mainView.getClientRects()[0].width + me.mainView.getClientRects()[0].x - 200) + 'px',
                initialTop = (me.mainView.getClientRects()[0].height + me.mainView.getClientRects()[0].y - 150) + 'px';
            zoomControl.style.left = initialLeft;
            zoomControl.style.top = initialTop;
            zoomControl.initialPosition = {
                left: initialLeft,
                top: initialTop
            };
            var closeBtn = zoomControl.querySelector('button[action=close]');
            closeBtn ? closeBtn.style.display = 'none' : false;
        }
        setTimeout(function () {
            adjustCmpPosition(zoomControl);
        }.bind(me), 100);
        window.addEventListener("orientationchange", function () {
            adjustCmpPosition(zoomControl);
        }, false);
        window.addEventListener("resize", function () {
            adjustCmpPosition(zoomControl);
        }, false);


        buttons.forEach(function (btn) {
            var action = btn.getAttribute('action');
            switch (action) {
                case "close":
                    btn.addEventListener('click', function (params) {
                        adjustCmpPosition(zoomControl);
                    });
                    break;
                case "zoomwindow":
                case "zoomin":
                case "pan":
                case "zoomout":
                case "zoomextent":
                    btn.addEventListener('click', function (evnt) {
                        var b = evnt.target;
                        b.pressed = !b.pressed; 
                        if (b.pressed && action === 'zoomwindow'){
                            b.classList.add("pressed-cls");
                        }else{
                            b.classList.remove("pressed-cls");
                            zoomwindowBtn.classList.remove("pressed-cls");
                            zoomwindowBtn.pressed = false;
                        }
                        b.action = action; 
                        me.onZoomActionBtnClick(b);
                    });
                    break;
            }
        });
    }
    dragZoomControl = function (zoomControl) {
        var me = this,
            panBtn = zoomControl.querySelector('button[action=pan]'),
            closeBtn = zoomControl.querySelector('button[action=close]'),
            pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        panBtn.onmousedown = dragMouseDown;
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            zoomControl.style.top = (zoomControl.offsetTop - pos2) + "px";
            zoomControl.style.left = (zoomControl.offsetLeft - pos1) + "px";
            closeBtn ? closeBtn.style.display = '' : false;
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    assignToolbarListeners = function (toolbar) {
        var me = this,
            buttons = toolbar.querySelectorAll('button');
        buttons.forEach(function (btn) {
            var action = btn.getAttribute('action');
            switch (action) {
                case "undo":
                case "redo":
                case "removeMarkup":
                    btn.addEventListener('click', function (params) {
                        me[action]();
                    });
                    break;
                case "markNewExtractionArea":
                    btn.addEventListener('click', function (params) {
                        me.markNewExtractionArea({
                            "data": {
                                "type": "New Markup"
                            },
                            "stroke": "#efb239",
                            showValidation: true
                        });
                    });
                    break;
                default:
                    break;
            }
        })
    }
    fabricCanvasInit = function () {
        var that = this,
            mainView = that.mainView,
            initialconfig = mainView.initialconfig;
        console.info("onAfterFabricCanvasInit", initialconfig, mainView);
        if (!that.drawingManager) {
            that.initializeAppManagers();
        }
        var viewProperties = {
            width: mainView.clientWidth,
            height: mainView.clientHeight,
            imageUrl: initialconfig.imageUrl
        };

        // if (this.drawingManager.initialized) return;

        this.drawingManager.init(mainView, ExtFallback.apply(viewProperties, {
            fabricController: this
        }, this.getMainView().initialData || {}));

        this.drawingManager.decorateCanvas();
        window.addEventListener("orientationchange", function () {
            that.rerenderCanvas();
        }, false);
        window.addEventListener("resize", function () {
            that.rerenderCanvas();
        }, false);
    }
    getMainView = function () {
        return this.mainView;
    }
    initializeAppManagers = function () {
        var mainView = this.mainView;

        this.drawingManager = mainView.drawingManager = DrawingManager;
        this.undoRedoManager = mainView.undoRedoManager = new UndoRedo();
    }
    onZoomActionBtnClick = function (btn) {
        var drawingManager = this.drawingManager,
            drawingContext = drawingManager.curContext;
        
        if (!drawingManager || !btn) return;

        var isViewMode = drawingManager.currentMode() === SketchConstants.modes.VIEW,
            btnStatus = ExtFallback.isFunction(btn.getPressed) ? btn.getPressed() : btn.pressed,
            initiateZoomAction = function (action, status) {

                drawingManager.applyZoom(action, status);

                if (ExtFallback.Array.contains(['zoomin', 'zoomout', 'zoomextent'], action)) {
                    ExtFallback.GlobalEvents.fireEvent(action, {
                        action: action,
                        appId: drawingContext.appId
                    });
                }
            };

        isViewMode ? initiateZoomAction(btn.action, btnStatus) : this.setCanvasMode("view", function () {
            initiateZoomAction(btn.action, btnStatus);
        }, true);

        this.fireEvent('zoombuttonclick');

    }
    setCanvasMode = function (mode, callback, statusBtnUpdated) {
        this.drawingManager && (mode === 'view' ? this.drawingManager.setCanvasViewMode(callback) : this.drawingManager.setCanvasSelectionMode(callback));
    }
    panToMarkups = function (markupsData) {
        this.drawingManager.panToMarkupsByMarkupData(markupsData);
    }

    panToMarkup = function (data) {
        this.drawingManager.panToMarkupByMarkupData(data);
    }

    navigateToPage = function (pageNo) {
        var me = this,
            initialconfig = this.getMainView().initialData,
            pages = initialconfig.pages;
        if (pages[pageNo - 1]) {
            initialconfig.imageUrl = pages[pageNo - 1].imageUrl;
            initialconfig.markups = pages[pageNo - 1].markups;
            initialconfig.currentPage = pageNo;
            me.rerenderCanvas(initialconfig);
            me.updateNavigationBar();
        }
    }
    resizeCanvas =function () {
        this.drawingManager.resizeCanvas({ width: this.mainView.clientWidth, height: this.mainView.clientHeight });
    }
    rerenderCanvas = function (initialData) {
        var me = this,
            initialconfig = this.getMainView().initialData,
            pages = initialconfig.pages.slice(),
            data = initialData || initialconfig,
            currentPageNo = data.currentPage - 1,
            currentPage = pages[currentPageNo];
        this.drawingManager.curContext.imageUrl = data.imageUrl;
        // if (!currentPage.markups && !currentPage.markupsLoaded){
            // event to get the markups by page;
            me.fireEvent('getMarkupsByPage', { currentPage: pages[currentPageNo], callback: function name(markupsData) {
                currentPage = Object.assign({}, currentPage, { markups: markupsData, markupsLoaded: true })
                pages[currentPageNo] = currentPage;
                initialconfig.pages = pages;
                initialconfig.markups = markupsData;
                me.drawingManager.curContext.markups = markupsData;
                me.drawingManager.rerenderCanvas({});
            }});
        // } 
        me.drawingManager.curContext.markups = currentPage.markups;
        me.drawingManager.rerenderCanvas({});
    }

    markNewExtractionArea = function (data) {
        this.drawingManager.setMarkup({
            action: 'extractionArea',
            data: data
        });
    }

    removeMarkup = function (data) {
        this.drawingManager.removeMarkup(data);
    }

    undo = function () {
        this.drawingManager.onUndo();
    }

    redo = function () {
        this.drawingManager.onRedo();
    }
    getController = function () {
        return this;
    }
    fireEvent = function (eventName, args) {
        console.log('fireEvent =====>', eventName, args)
        var me = this,
            initialconfig = this.getMainView().initialData,
            pages = initialconfig.pages,
            pageNo = initialconfig.currentPage,
            currentPage = pages && pages[pageNo - 1];
        args && ExtFallback.applyIf(args, {
            currentPage: currentPage
        });
        this.mainView.initialconfig && this.mainView.initialconfig.callback && this.mainView.initialconfig.callback(eventName, args)
    }
};
/* IQSketchLiteManager - End */

// export { IQSketchLiteManager };
// if (typeof exports !== 'undefined') {
//     exports.IQSketchLiteManager = IQSketchLiteManager;
// }
fabric.Object.prototype.resizeToScale = function () {
    // resizes an object that has been scaled (e.g. by manipulating the handles), setting scale to 1 and recalculating bounding box where necessary
    switch (this.type) {
        case "group":
            this.forEachObject(function (obj) {
                fabricResizeHelper(obj);
                IQEditorLogger.log(obj.type);
            });
            break;
        default:
            fabricResizeHelper(this);
            break;
    }
};

function fabricResizeHelper(thatTarget) {
    var isGrouped = thatTarget.group && thatTarget.group.markuptype != 'group';
    switch (thatTarget.type) {
        case "circle":
        case "arc":
            thatTarget.radius *= thatTarget.scaleX != 1 ? thatTarget.scaleX : thatTarget.scaleY;
            thatTarget.scaleX = 1;
            thatTarget.scaleY = 1;
            thatTarget.width = thatTarget.height = thatTarget.radius * 2;
            thatTarget.setCoords();
            !isGrouped && thatTarget.magnetised && thatTarget.updateMagnetisedCoords();
            break;
        case "ellipse":
            thatTarget.rx *= thatTarget.scaleX;
            thatTarget.ry *= thatTarget.scaleY;
            thatTarget.width = thatTarget.rx * 2;
            thatTarget.height = thatTarget.ry * 2;
            thatTarget.scaleX = 1;
            thatTarget.scaleY = 1;
            thatTarget.setCoords();
            !isGrouped && thatTarget.magnetised && thatTarget.updateMagnetisedCoords();
            break;
        case "polygon":
        case "polyline":
            var points = thatTarget.get('points');
            for (var i = 0; i < points.length; i++) {
                var p = points[i];
                if (i == points.length - 1 &&
                    (points[0].x == p.x && points[0].y == p.y)) continue;
                p.x *= thatTarget.scaleX
                p.y *= thatTarget.scaleY;
            }
            var bbox = thatTarget.getBoundingBox(),
                ltNew = bbox.tl;

            thatTarget.scaleX = 1;
            thatTarget.scaleY = 1;
            thatTarget.width = bbox.width;
            thatTarget.height = bbox.height;
            thatTarget.pathOffset = {
                x: ltNew.x + bbox.width / 2,
                y: ltNew.y + bbox.height / 2
            };
            thatTarget.minX = ltNew.x;
            thatTarget.minY = ltNew.y;
            thatTarget.setCoords();
            break;
        case "triangle":
        case "line":
        case "rect":
        case "rectCloud":
            thatTarget.width *= thatTarget.scaleX;
            thatTarget.height *= thatTarget.scaleY;
            thatTarget.scaleX = 1;
            thatTarget.scaleY = 1;
            thatTarget.setCoords();
            !isGrouped && thatTarget.magnetised && thatTarget.updateMagnetisedCoords();
            break;
        case "threePointArc":
            thatTarget.scaleX != 1 ? thatTarget.setRadius(thatTarget.radius * thatTarget.scaleX) : thatTarget.setRadius(thatTarget.radius * thatTarget.scaleY);
            thatTarget.scaleX = 1;
            thatTarget.scaleY = 1;
            thatTarget.setCoords();
            !isGrouped && thatTarget.magnetised && thatTarget.updateMagnetisedCoords();
            break;
        default:
            break;
    }
};


//extending fabric object to include geolocation, ID, markuptype, contextmenu
fabric.Object.prototype.toObject = (function (toObject, a) {

    return function (propertiesToInclude) {

        // TODO - Doubtful properties  - to be included if required only >> "geoLocation", "userDefined","mediaId"
        var customProperties = [
            "id", "markuptype", "markupValue", "contextMenuType",
            "createdBy", "createdDate", "updatedBy", "updatedDate",
            "strokeScale", "originalStrokeWidth", "arcDiameter",
            "locked", "magnetised", "magnetisedCoords", "tags", "metaData"
        ],
            specialProperties = {
                shadow: this.magnetised ? null : this.shadow,
                objectCaching: false
            };

        return fabric.util.object.extend(toObject.call(this,
            window.ExtFallback.Array.clean(customProperties.concat(propertiesToInclude))), specialProperties);

    };
})(fabric.Object.prototype.toObject);

// markups drawn in older version of fabric get shifted in newer version of fabric
fabric.Path.fromObject = (function (fromObject) {
    return function (object, callback, forceAsync) {

        // work around - using the property globalCompositeOperation to identify object got created in older version of fabric
        if (object.globalCompositeOperation == undefined &&
            object.pathOffset && object.pathOffset.x != undefined &&
            object.pathOffset.y != undefined &&
            object.pathOffset.x == 0 && object.pathOffset.y == 0) {
            object.pathOffset = {
                x: object.width / 2,
                y: object.height / 2
            };
        }
        fromObject.call(this, object, callback, forceAsync);
    };
})(fabric.Path.fromObject);


//enable touch support
fabric.isTouchSupported = true;
fabric.perfLimitSizeTotal = 16777216;

fabric.Object.prototype.set({
    transparentCorners: true,
    cornerColor: 'green',
    borderColor: 'green',
    cornerSize: 15,
    padding: 5,
    borderScaleFactor: 0.5,
    originX: 'center',
    originY: 'center',
    objectCaching: false
});

fabric.util.object.extend(fabric.Object.prototype, {
    tags: [],
    locked: false,
    magnetised: false,
    magnetisedCoords: [],
    magnets: [],

    _highlight: false,
    highlight: function (status, animate, options) {

        // if already highlighted return back
        if (status && !animate && window.ExtFallback.isDefined(this.highlighter)) {
            console.log('markup is already highlighted');
            return;
        }

        // if object is not highlighted and highlighter is not defined return back
        if (!status && !animate && !window.ExtFallback.isDefined(this.highlighter)) {
            return;
        }

        this._highlight = status;
        var that = this, canvas = this.canvas, markupObject = this;

        if (this.markuptype == 'paletteMarkup' && this.type === 'group') {
            var paletteMarkupObjects = this.getObjects();
            paletteMarkupObjects.length > 0 && paletteMarkupObjects[0].get('shadow') != null
                && (markupObject = paletteMarkupObjects[0]);
        }

        // on stop highlight reset the visiblity
        if (!status && !animate) {
            console.log('unhighlighting markup');
            clearTimeout(this.highlighter);
            window.ExtFallback.isDefined(this.unhighlightConfig) && markupObject.set(this.unhighlightConfig);

            delete this.unhighlightConfig;
            delete this.highlighter;

            canvas && canvas.renderAll();
            return;
        }


        // cache the current shadow
        if (!this.unhighlightConfig && !animate) {
            this.unhighlightConfig = { shadow: markupObject.get('shadow') };
            this.type != 'group' && window.ExtFallback.apply(this.unhighlightConfig, { fill: markupObject.fill, opacity: markupObject.opacity });
        }
        var hightlightColor = options && options.hightlightColor || '#4CAF50',
            highlightConfig = {
                shadow: window.ExtFallback.apply({
                    color: hightlightColor, blur: options && options.blur || 10,
                    offsetX: 0, offsetY: 0,
                    opacity: 1, fillShadow: false, strokeShadow: true, affectStroke: true
                }, window.ExtFallback.Array.contains(['paletteMarkup', 'paletteSymbolMarkup', 'anchor'], this.markuptype) ? { offsetX: 5, offsetY: 5 } : {})
            };

        this.type != 'group' && window.ExtFallback.apply(highlightConfig, { fill: hightlightColor, opacity: 0.5 });

        markupObject.set(!status && animate ? this.unhighlightConfig : highlightConfig);
        canvas && canvas.renderAll();

        this.highlighter = setTimeout(function () {
            that.highlight(!that._highlight, true);
        }, 200);
    }
});



/* End of Custom Shapes supported in IQ Sketch */


(function () {
    var RIGHT_CLICK = 3, MIDDLE_CLICK = 2, LEFT_CLICK = 1;

    function checkClick(e, value) {
        return e.button && (e.button === value - 1);
    }

    fabric.util.object.extend(fabric.Canvas.prototype, {

        selectionModes_: {
            multiselect: 0,
            single: 1
        },
        selectionType: 0,

        _isMultiSelectMode: function () {
            // user defined modes - Lock and Magnetise the selection mode will be single and hence objects won't be grouped
            return this.selectionType === this.selectionModes_.multiselect;
        },

        _shouldGroup: function (e, target) {
            var activeObject = this._activeObject,
                _shouldGroup = activeObject && (this._isSelectionKeyPressed(e) || this._isMultiSelectMode()) && target && target.selectable && this.selection &&
                    !(target.markuptype === "group") && (activeObject !== target || activeObject.type === 'activeSelection') && !target.onSelect({ e: e });

            activeObject && _shouldGroup && this.fire('before:selection:cleared', { target: activeObject });

            return _shouldGroup;
        },

        _shouldClearSelection: function (e, target) {
            var activeObjects = this.getActiveObjects(),
                activeObject = this._activeObject;

            return (
                !target
                ||
                (target &&
                    activeObject &&
                    (activeObject.type == 'activeSelection' ? false : activeObjects.length > 1) &&
                    activeObjects.indexOf(target) === -1 &&
                    activeObject !== target &&
                    !this._isSelectionKeyPressed(e))
                ||
                (target && !target.evented)
                ||
                (target &&
                    !target.selectable &&
                    activeObject &&
                    activeObject !== target) || !this._isMultiSelectMode()
            );
        },

        _checkTarget: function (pointer, obj, globalPointer) {
            if (obj &&
                obj.visible &&
                obj.evented &&
                // http://www.geog.ubc.ca/courses/klink/gis.notes/ncgia/u32.html
                // http://idav.ucdavis.edu/~okreylos/TAship/Spring2000/PointInPolygon.html

                /**
                 * customMode refers to the modes like lock, magnetise;
                 * To ensure lock mode we can select magnetised objects customMode has been introduced.
                 */
                (this.customMode === 'lock' ? true : !obj.locked) &&
                obj.containsPoint(pointer)
            ) {
                if ((this.perPixelTargetFind || obj.perPixelTargetFind) && !obj.isEditing) {
                    var isTransparent = this.isTargetTransparent(obj, globalPointer.x, globalPointer.y);
                    if (!isTransparent) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
        },

        __onMouseUp: function (e) {
            var target, transform = this._currentTransform,
                groupSelector = this._groupSelector, shouldRender = false,
                isClick = (!groupSelector || (groupSelector.left === 0 && groupSelector.top === 0));

            this.isMoveMode = false;

            this._cacheTransformEventData(e);
            target = this._target;
            this._handleEvent(e, 'up:before');
            // if right/middle click just fire events and return
            // target undefined will make the _handleEvent search the target
            if (checkClick(e, RIGHT_CLICK)) {
                if (this.fireRightClick) {
                    this._handleEvent(e, 'up', RIGHT_CLICK, isClick);
                }
                return;
            }

            if (checkClick(e, MIDDLE_CLICK)) {
                if (this.fireMiddleClick) {
                    this._handleEvent(e, 'up', MIDDLE_CLICK, isClick);
                }
                this._resetTransformEventData();
                return;
            }

            if (this.isDrawingMode && this._isCurrentlyDrawing) {
                this._onMouseUpInDrawingMode(e);
                return;
            }

            if (!this._isMainEvent(e)) {
                return;
            }
            if (transform) {
                this._finalizeCurrentTransform(e);
                shouldRender = transform.actionPerformed;
            }
            if (!isClick) {
                var targetWasActive = target === this._activeObject;
                this._maybeGroupObjects(e);
                if (!shouldRender) {
                    shouldRender = (
                        this._shouldRender(target) ||
                        (!targetWasActive && target === this._activeObject)
                    );
                }
            }
            if (target) {
                if (target.selectable && target !== this._activeObject && target.activeOn === 'up') {
                    this.setActiveObject(target, e);
                    shouldRender = true;
                }
                else {
                    var corner = target._findTargetCorner(
                        this.getPointer(e, true),
                        fabric.util.isTouchEvent(e)
                    );
                    var control = target.controls[corner],
                        mouseUpHandler = control && control.getMouseUpHandler(e, target, control);
                    if (mouseUpHandler) {
                        var pointer = this.getPointer(e);
                        mouseUpHandler(e, transform, pointer.x, pointer.y);
                    }
                }
                target.isMoving = false;
            }
            this._setCursorFromEvent(e, target);
            this._handleEvent(e, 'up', LEFT_CLICK, isClick);
            this._groupSelector = null;
            this._currentTransform = null;
            // reset the target information about which corner is selected
            target && (target.__corner = 0);
            if (shouldRender) {
                this.requestRenderAll();
            }
            else if (!isClick) {
                this.renderTop();
            }
        },

        __onMouseMove: function (e) {
            this._handleEvent(e, 'move:before');
            this._cacheTransformEventData(e);
            var target, pointer;

            if (this.isDrawingMode) {
                this._onMouseMoveInDrawingMode(e);
                return;
            }

            if (!this.isViewMode && !this.supportPanAndZoom && !this._isMainEvent(e)) {
                return;
            }

            var groupSelector = this._groupSelector;

            // We initially clicked in an empty area, so we draw a box for multiple selection
            if (groupSelector) {
                pointer = this._pointer;

                groupSelector.left = pointer.x - groupSelector.ex;
                groupSelector.top = pointer.y - groupSelector.ey;

                this.renderTop();
            }
            else if (!this._currentTransform) {
                target = this.findTarget(e) || this.findTargetUsingMousePointer(e) || null;
                this._setCursorFromEvent(e, target);
                this._fireOverOutEvents(target, e);
            }
            else {
                this._transformObject(e);
            }
            this._handleEvent(e, 'move');
            this._resetTransformEventData();
        },

        findTargetUsingMousePointer: function (e) {
            if (this.customMode != 'tag') {
                return;
            }

            var pointer = this.getPointer(e, true),
                objects = this.getObjects(),
                markup = null;

            /* Ext.each(objects, function (object) {
                if (object.containsPoint(pointer)) {
                    markup = object;
                    return false;
                }
            }); */
            for (var key in objects){
                var object = objects[key];
                if (!markup && object.containsPoint(pointer)) {
                    markup = object;
                }
            }

            return markup;
        },

        _setCursorFromEvent: function (e, target) {
            if (!target) {
                this.setCursor(this.defaultCursor);
                return false;
            }
            var hoverCursor = target.hoverCursor || this.hoverCursor,
                activeSelection = this._activeObject && this._activeObject.type === 'activeSelection' ?
                    this._activeObject : null,
                // only show proper corner when group selection is not active
                corner = (!activeSelection || !activeSelection.contains(target))
                    // here we call findTargetCorner always with undefined for the touch parameter.
                    // we assume that if you are using a cursor you do not need to interact with
                    // the bigger touch area.
                    && target._findTargetCorner(this.getPointer(e, true));

            if (!corner) {
                if (target.subTargetCheck) {
                    // hoverCursor should come from top-most subTarget,
                    // so we walk the array backwards
                    this.targets.concat().reverse().map(function (_target) {
                        hoverCursor = _target.hoverCursor || hoverCursor;
                    });
                }

                this.customMode && this.customMode === 'tag' && (hoverCursor = 'url("resources/img/pincursor.png"), auto');
                this.customMode && this.customMode === 'smartLabel' && (hoverCursor = 'pointer');
                this.setCursor(hoverCursor);
            }
            else {
                this.setCursor(this.getCornerCursor(corner, target, e));
            }
        },

    });

})();
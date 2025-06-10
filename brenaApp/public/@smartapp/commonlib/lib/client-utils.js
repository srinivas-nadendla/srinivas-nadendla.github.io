
const clientUtils = (function () {
    function htmlEncode(str) {
    	if(!str) return '';
        if(!str.replace) return '';
    	return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function escapeElementSelector(id) {
    	if(id){
    		id = id.replace(/~/g, "\\~");
    	}
    	return id;
    }

    function animateAsync(elm, keyframes, options) {
    	return new Promise((resolve) => {
    		const opts = Object.assign({fill: 'both'}, options);
    		let anim = elm.animate(keyframes, opts);
    		anim.addEventListener('finish', () => {
    			anim.commitStyles();
    			anim.cancel();
    			anim = null;
    			resolve();
    		});
    	});
    }
    function animateMove(startBox, endBox, duration = 900) {
    	let transferElm = document.createElement('div');
    	transferElm.className = 'ui-effects-transfer';
    	transferElm.setAttribute('style',['position:absolute;top:', startBox.top,';left:', startBox.left,';height:', startBox.height,';width:', startBox.width].join(''));
    	document.documentElement.appendChild(transferElm);

    	animateAsync(transferElm, [{opacity: '0.3', top: endBox.top, left: endBox.left, height: endBox.height, width: endBox.width}], {duration:duration, easing:'ease-in-out'}).then(()=>{
    		transferElm.remove();
    		transferElm = null;
    	});
    }

    function createStylesheet(styleId, atEnd) {
    	let prevElem = document.querySelectorAll(['STYLE[data-styleid=', styleId, ']'].join(""));
    	if (prevElem.length) {
    		prevElem[0].remove();
    		prevElem = null;
    	}
    	const styleElm = document.createElement('style');
    	styleElm.setAttribute('type', 'text/css');
    	styleElm.setAttribute('data-styleid', styleId);
    	if (styleElm.styleSheet) {
    		styleElm.styleSheet.cssText = '';
    	} else {
    		styleElm.appendChild(document.createTextNode(''));
    	}
    	const parent = document.getElementsByTagName('head')[0];
    	if(atEnd){
    		parent.appendChild(styleElm);
    	} else {
    		parent.insertBefore(styleElm, parent.firstChild);
    	}
    	return styleElm;
    }
    function getAppTypeCSSRule(className, image) {
    	const styles = [];
    	if(className && image){
    		styles.push('.');
    		styles.push(className);
    		styles.push('::before{background-image:url(');
    		styles.push(image);
    		styles.push(');} ');
    	}
    	return styles.join('');
    }
    function getAppTypeCssClassName(id) {
        if(id || id === 0){
            const strId = String(id);
            const safeId = strId.replace(/:/g, '_');
            return ['gantter-apptype-', safeId].join('');
        }
    }
    function getAppTypesCssImpl(taskTypes){
        const styles = [];
        const rootStyles = [];
        if(taskTypes && taskTypes.length){
            for (let i = taskTypes.length - 1; i >= 0; i--) {
                const taskType = taskTypes[i];
                const id = taskType.id;
                if(id){
                    const strId = String(id);
                    const image = taskType.image;
                    if(strId){
                        const safeId = strId.replace(/:/g, '_');
                        const className = ['gantter-apptype-', safeId].join('');
                        styles.push(getAppTypeCSSRule(className, image));
                        rootStyles.push("--adplgs-apptypeimg-", safeId, ":url('", image, "');");
                    }
                }
            }
        }
        if(rootStyles.length){
            styles.push(":root{");
            styles.push.apply(styles, rootStyles);
            styles.push("}");
        }
        return styles;
    }
    function addAppTypesCss(taskTypes){
    	const styleId = "app_types";
    	if(taskTypes && taskTypes.length){
    		const styles = getAppTypesCssImpl(taskTypes);
    		const styleElm = createStylesheet(styleId);
    		styleElm.innerHTML = styles.join('');
    	}
    }

    const UUID = (function(){
        const lut = [];
        for (let ix = 0; ix < 256; ix++) {
            lut[ix] = (ix < 16 ? '0' : '') + (ix).toString(16);
        }

        return { 
            uuid4: function uuid4 () {
                let d0 = Math.random() * 0x100000000 >>> 0;
                let d1 = Math.random() * 0x100000000 >>> 0;
                let d2 = Math.random() * 0x100000000 >>> 0;
                let d3 = Math.random() * 0x100000000 >>> 0;
                return [
                    lut[d0 & 0xff], lut[d0 >> 8 & 0xff], lut[d0 >> 16 & 0xff], lut[d0 >> 24 & 0xff], "-",
                    lut[d1 & 0xff], lut[d1 >> 8 & 0xff], "-",
                    lut[d1 >> 16 & 0x0f | 0x40], lut[d1 >> 24 & 0xff], "-",
                    lut[d2 & 0x3f | 0x80], lut[d2 >> 8 & 0xff], "-",
                    lut[d2 >> 16 & 0xff], lut[d2 >> 24 & 0xff], lut[d3 & 0xff], lut[d3 >> 8 & 0xff], lut[d3 >> 16 & 0xff], lut[d3 >> 24 & 0xff]
                ].join("");
            },
            uuid4Bytes: function uuid4Bytes () {
                let d0 = Math.random() * 0x100000000 >>> 0;
                let d1 = Math.random() * 0x100000000 >>> 0;
                let d2 = Math.random() * 0x100000000 >>> 0;
                let d3 = Math.random() * 0x100000000 >>> 0;
                return [
                    (d0 >> 24 & 0xff), (d0 >> 16 & 0xff), (d0 >> 8 & 0xff), (d0 & 0xff),
                    (d1 >> 8 & 0xff), (d1 & 0xff),
                    (d1 >> 24 & 0xff), (d1 >> 16 & 0x0f | 0x40),
                    (d2 & 0x3f | 0x80), (d2 >> 8 & 0xff),
                    (d2 >> 16 & 0xff), (d2 >> 24 & 0xff), (d3 & 0xff), (d3 >> 8 & 0xff), (d3 >> 16 & 0xff), (d3 >> 24 & 0xff)
                ];
            },
            uuid4Chars: function uuid4Chars () {
                let d0 = Math.random() * 0x100000000 >>> 0;
                let d1 = Math.random() * 0x100000000 >>> 0;
                let d2 = Math.random() * 0x100000000 >>> 0;
                let d3 = Math.random() * 0x100000000 >>> 0;
                return String.fromCharCode(
                    (d0 >> 24 & 0xff), (d0 >> 16 & 0xff), (d0 >> 8 & 0xff), (d0 & 0xff),
                    (d1 >> 8 & 0xff), (d1 & 0xff),
                    (d1 >> 24 & 0xff), (d1 >> 16 & 0x0f | 0x40),
                    (d2 & 0x3f | 0x80), (d2 >> 8 & 0xff),
                    (d2 >> 16 & 0xff), (d2 >> 24 & 0xff), (d3 & 0xff), (d3 >> 8 & 0xff), (d3 >> 16 & 0xff), (d3 >> 24 & 0xff)
                );
            }
        };
    })();


    const guidToBase64 = function(guid) {
        if(guid && guid.length === 36){
            const parts = guid.split('-');
            if(parts && parts.length === 5){
                const bytes = [];
                let index = 0;
                for(const number of parts){
                    if(index < 3){
                        for(let i = number.length-1; i>0 ; i=i-2){
                            const byte = number[i-1] + number[i];
                            bytes.push(parseInt(byte, 16));
                        }
                    } else {
                        for(let i = 0; i < number.length; i=i+2){
                            const byte = number[i] + number[i+1];
                            bytes.push(parseInt(byte, 16));
                        }
                    }
                    index++;
                }
                let data = btoa(String.fromCharCode.apply(null, bytes));
                data = data.substring(0, 22);
                // - . _ ~
                data = data.replace(/\//g, "-").replace(/\+/g, "~");
                return data;
            }
            console.warn("not a valid guid", guid);
        }
        return guid;
    };

    const guidfromBase64 = (function(){
        const revLookup = [];
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~-';
        for (let i = 0, len = chars.length; i < len; ++i) {
          revLookup[chars.charCodeAt(i)] = i;
        }

        function fromBase64(b64) {
            const guid = [];
            let val;
            let i;
            for (i = 0; i < 18; i += 4) {
                val = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | 
                        (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];

                guid.push((val >> 16) & 0xFF);
                guid.push((val >> 8) & 0xFF);
                guid.push(val & 0xFF);
            }
            // 2 placeholders
            val = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
            guid.push(val & 0xFF);
            return guid;
        }

        function pushHexStr(dec1, dec2, dec3, dec4, delim, guid) {
            const str1 = dec1.toString(16);
            if(str1.length === 1){
               guid.push("0");
            }
            guid.push(str1);

            const str2 = dec2.toString(16);
            if(str2.length === 1){
               guid.push("0");
            }
            guid.push(str2);

            if(delim) {
                guid.push(delim);
            }

            const str3 = dec3.toString(16);
            if(str3.length === 1){
               guid.push("0");
            }
            guid.push(str3);

            const str4 = dec4.toString(16);
            if(str4.length === 1){
               guid.push("0");
            }
            guid.push(str4);
        }

        return function guidfromBase64(base64GUid){
            if(base64GUid && base64GUid.length === 22){
                const text = fromBase64(base64GUid);
                const guid = [];
                pushHexStr(text[3], text[2], text[1], text[0], undefined, guid);
                guid.push("-");
                pushHexStr(text[5], text[4], text[7], text[6], "-", guid);
                guid.push("-");
                pushHexStr(text[8], text[9], text[10], text[11], "-", guid);
                pushHexStr(text[12], text[13], text[14], text[15], undefined, guid);
                return guid.join("");
            } else {
                return base64GUid;
            }
        };
    })();


    return {htmlEncode, escapeElementSelector, animateAsync, animateMove, createStylesheet, addAppTypesCss, getAppTypeCssClassName, UUID, guidfromBase64, guidToBase64};
})();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = clientUtils;
}
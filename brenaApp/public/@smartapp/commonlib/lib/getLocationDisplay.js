//IQ = IQ || {}; 

//if (!IQ.getLocationDisplay) {
    /**
     * The API formats the display of the location control text (backwards with ellipses)
     * The API will return the maximum text that can fit (all locations and delimiter) in one element (depends on the element width and font).
     */
    const getLocationDisplay = (function () {

        const fontToCharacterWidthMap = {};
        let canvas;

        const getTextWidth = function (text, font) {
            canvas = canvas || document.createElement("canvas");

            const context = canvas.getContext("2d");
            context.font = font;
            const metrics = context.measureText(text);
            const width = metrics.width;

            return Math.ceil(width);
        };

        const getTextWidthFromCharacters = function (text, characterWidthMap) {
            let result = 0;

            for (let i = 0, ii = text.length; i < ii; i++) {
                const char = text.charAt(i);
                result += characterWidthMap[char];
            }

            return result;
        };

        const getCharacterWidthMap = function (param, font) {
            const charactersUsed = new Set();
            charactersUsed.add('.');
            charactersUsed.add(' ');
            charactersUsed.add('-');

            if (param.delimiter && param.delimiter.text) {
                for (let i = 0, ii = param.delimiter.text.length; i < ii; i++) {
                    const char = param.delimiter.text.charAt(i);
                    charactersUsed.add(char);
                }
            }

            if (param.locations && param.locations.length) {
                for (let i = 0, ii = param.locations.length; i < ii; i++) {
                    const location = param.locations[i];

                    if (location) {
                        if (location.hierarchy && location.hierarchy.length) {
                            for (let j = 0, jj = location.hierarchy.length; j < jj; j++) {
                                const x = location.hierarchy[j];
                                for (let k = 0, kk = x.length; k < kk; k++) {
                                    const char = x.charAt(k);
                                    charactersUsed.add(char);
                                }
                            }
                        }
                    }
                }
            }

            const characterWidthMap = fontToCharacterWidthMap[font] || {};

            charactersUsed.forEach((char) => {
                if (characterWidthMap[char] == null) {
                    const width = getTextWidth(char, font);
                    characterWidthMap[char] = width;
                }
            });

            fontToCharacterWidthMap[font] = characterWidthMap;

            return characterWidthMap;
        };

        const displayTextForRemainingSpace = function (location, lengthUsed, availableWidth, characterWidthMap) {

            // if already started, then '...' has already been accounted for in lengthUsed
            let lengthOfShortenedString = (location.beginningArray.length > 0) ? 0 : (characterWidthMap['.'] * 3);

            if (lengthOfShortenedString < availableWidth - lengthUsed) {

                let beginning = !(location.beginningArray.length > 0 && location.endingArray.length == 0)
                let c = null;

                do {
                    if (c != null) {
                        if (beginning) {
                            location.arrayOfChars.shift()
                            location.beginningArray.push(c);
                        } else {
                            location.arrayOfChars.pop();
                            location.endingArray.unshift(c);
                        }

                        beginning = !beginning;

                        if (location.arrayOfChars.length == 0) {
                            lengthOfShortenedString -= characterWidthMap['.'] * 3;
                            break;
                        }
                    }

                    if (beginning) {
                        c = location.arrayOfChars[0];
                    } else {
                        c = location.arrayOfChars[location.arrayOfChars.length - 1];
                    }

                    lengthOfShortenedString += characterWidthMap[c];

                } while (lengthOfShortenedString < availableWidth - lengthUsed);

                lengthUsed += lengthOfShortenedString;
            }

            return lengthUsed;
        };

        return function (param, availableWidth, font, itemPadding) {
            param = param || {};
            availableWidth = availableWidth || 0;
            font = font || "Roboto";
            itemPadding = itemPadding || 0;

            const characterWidthMap = getCharacterWidthMap(param, font);

            const result = { delimiter: {}, locations: [] };

            let delimiterWidth = 0;
            if (param.delimiter && param.delimiter.text) {
                if (param.delimiter.txtInfo && param.delimiter.txtInfo[0]) {
                    delimiterWidth = param.delimiter.txtInfo[0];
                }
                delimiterWidth = getTextWidthFromCharacters(param.delimiter.text, characterWidthMap);

                result.delimiter.txtInfo = [delimiterWidth];
            }

            let tempLocations = [];
            if (param.locations && param.locations.length) {

                for (let i = 0, ii = param.locations.length; i < ii; i++) {
                    const location = param.locations[i];

                    if (location) {
                        const tempLocation = {
                            id: location.id,
                            hierarchy: location.hierarchy,
                            arrayOfChars: [],
                            txtInfo: [],
                            beginningArray: [],
                            endingArray: [],
                            text: ''
                        };

                        let hierarchySize = [];
                        if (location.txtInfo && location.txtInfo.length) {
                            hierarchySize = location.txtInfo;
                        } else {
                            for (let j = location.hierarchy.length - 1; j >= 0; j--) {
                                const block = location.hierarchy[j];
                                const blockWidth = getTextWidthFromCharacters(block, characterWidthMap);
                                hierarchySize.unshift(blockWidth);
                            }
                        }
                        tempLocation.txtInfo = hierarchySize;

                        let hierarchyReversed = location.hierarchy.slice();
                        let completeString = hierarchyReversed.join(' - ');
                        let arrayOfChars = [];
                        for (let j = 0, jj = completeString.length; j < jj; j++) {
                            let c = completeString.charAt(j);
                            arrayOfChars.push(c);
                        }
                        tempLocation.arrayOfChars = arrayOfChars;

                        tempLocations.push(tempLocation);
                    }
                }
            }

            const separatorSize1 = (characterWidthMap[' '] * 2) + characterWidthMap['-']; // " - "
            const separatorSize2 = (characterWidthMap['.'] * 3); // "..."

            // Display as many locations as we can with at least first and last of hierarchy
            let lengthUsed = 0;
            for (let i = 0, ii = tempLocations.length; i < ii; i++) {
                const location = tempLocations[i];

                if (location) {

                    if (i < (ii - 1)) {
                        lengthUsed += delimiterWidth;
                    }

                    const hierarchy = location.hierarchy.slice();
                    const hierarchySize = location.txtInfo.slice();

                    if (hierarchySize.length == 1 && hierarchySize[0] <= availableWidth - lengthUsed) {
                        location.beginningArray.push(hierarchy[0]);
                        lengthUsed += hierarchySize[0];

                        location.arrayOfChars = [];
                    } else if (hierarchySize.length == 2 && (hierarchySize[0] + hierarchySize[hierarchySize.length - 1] + separatorSize1) <= availableWidth - lengthUsed) {
                        location.beginningArray.push(hierarchy[0]);
                        location.beginningArray.push(' - ');
                        location.beginningArray.push(hierarchy[hierarchy.length - 1]);

                        lengthUsed += hierarchySize[0] + hierarchySize[hierarchySize.length - 1] + separatorSize1;

                        location.arrayOfChars = []
                    } else if (hierarchySize.length > 2 && (hierarchySize[0] + hierarchySize[hierarchySize.length - 1] + separatorSize2) <= availableWidth - lengthUsed) {
                        location.beginningArray.push(hierarchy[0]);
                        location.endingArray.push(hierarchy[hierarchy.length - 1]);

                        lengthUsed += hierarchySize[0] + hierarchySize[hierarchy.length - 1] + separatorSize2;

                        location.arrayOfChars = location.arrayOfChars.slice(hierarchy[0].length);
                        location.arrayOfChars = location.arrayOfChars.slice(0, location.arrayOfChars.length - (hierarchy[hierarchy.length - 1].length));
                    } else {
                        // display at least first if possible
                        if (hierarchySize.length > 2 && ((hierarchySize[0] + separatorSize2) <= (availableWidth - lengthUsed))) {
                            location.beginningArray.push(hierarchy[0]);
                            lengthUsed += (hierarchySize[0] + separatorSize2);
                            location.arrayOfChars = location.arrayOfChars.slice(hierarchy[0].length);
                        }

                        lengthUsed = displayTextForRemainingSpace(location, lengthUsed, availableWidth, characterWidthMap);
                    }
                }
            }

            for (let i = 0, ii = tempLocations.length; i < ii; i++) {
                const location = tempLocations[i];

                if (location) {
                    if (location.arrayOfChars.length > 0) {
                        lengthUsed = displayTextForRemainingSpace(location, lengthUsed, availableWidth, characterWidthMap);
                    }

                    if (location.beginningArray.length > 0) {
                        location.text = location.beginningArray.join('');
                        if (location.arrayOfChars.length > 0) {
                            location.text += '...';
                        }
                        location.text += location.endingArray.join('');
                    }
                }
            }

            result.locations = tempLocations.map(l => { return { id: l.id, text: l.text, txtInfo: l.txtInfo } });

            let resultText = '';
            const delimiterText = param.delimiter.text;

            const resultLocationsWithText = result.locations.filter((l) => l.text);
            for (let i = 0, ii = resultLocationsWithText.length; i < ii; i++) {
                let location = resultLocationsWithText[i];
                resultText += location.text;

                if (i < (ii - 1)) {
                    resultText += delimiterText;
                }
            }
            result.text = resultText;


            return result;
        };
    })();
//}
if (!(typeof module !== 'undefined' && typeof module.exports !== 'undefined')) {
    IQ = IQ || {};
    IQ.getLocationDisplay = getLocationDisplay;
} else {
    module.exports = getLocationDisplay;
}

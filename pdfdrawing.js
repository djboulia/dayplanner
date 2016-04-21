var doc = null;

var lineHelper = function (color, lineWidth) {

    var _lineTo = function (x1, y1, x2, y2) {
        doc.save();

        doc.strokeColor(color);
        doc.lineWidth(lineWidth);
        doc.moveTo(x1, y1);
        doc.lineTo(x2, y2);
        doc.stroke();

        doc.restore();
    };

    return {
        lineTo: _lineTo,

        horizontal: function (x, y, width) {
            _lineTo(x, y, x + width, y);
        },

        vertical: function (x, y, height) {
            _lineTo(x, y, x, y + height);
        },

        doubleLine: function (x1, y1, x2, y2) {
            doc.save();

            doc.strokeColor(color);
            doc.lineWidth(lineWidth * .25);

            doc.moveTo(x1, y1);
            doc.lineTo(x2, y2);

            doc.stroke();

            doc.strokeColor(color);
            doc.lineWidth(lineWidth * .75);

            doc.moveTo(x1 + 1.5, y1);
            doc.lineTo(x2 + 1.5, y2);

            doc.stroke();

            doc.restore();
        }

    };
}

var rectHelper = function (color, lineWidth) {
    return {
        halfRounded: function (x, y, w, h, r) {
            doc.strokeColor(color);
            doc.lineWidth(lineWidth);

            doc.moveTo(x + r, y);
            doc.lineTo(x + w, y);
            doc.lineTo(x + w, y + h);
            doc.lineTo(x + r, y + h);
            doc.quadraticCurveTo(x, y + h, x, y + h - r);
            doc.lineTo(x, y + r);
            doc.quadraticCurveTo(x, y, x + r, y);

            doc.stroke();
        },
        
        filled: function( x, y, w, h ) {
            doc.strokeColor(color);
            doc.lineWidth(lineWidth);

            doc.rect(x, y, w, h );

            doc.fill(color);
            doc.stroke();
        },

        filledQuarterRound: function( x, y, w, h, r ) {
            // do a filled box with the upper left corner 
            // rounded at radius r
            
            doc.strokeColor(color);
            doc.lineWidth(lineWidth);

            doc.moveTo(x + r, y);
            doc.lineTo(x + w, y);
            doc.lineTo(x + w, y + h);
            doc.lineTo(x, y + h);
            doc.lineTo(x, y + r);
            doc.quadraticCurveTo(x, y, x + r, y);

            doc.fill(color);
            doc.stroke();
        },

        dropShadow: function (x, y, w, h, shadowWidth) {
            doc.strokeColor(color);
            doc.lineWidth(lineWidth);

            doc.rect(x + w, y + shadowWidth, shadowWidth, h);
            doc.rect(x + shadowWidth, y + h, w, shadowWidth);

            doc.fill(color);
            doc.stroke();
        }

    }
}

var fontHelper = function (fontName, color, size, options) {
    var _width = function (str) {
        doc.fillColor(color);
        doc.font(fontName);
        doc.fontSize(size);

        return doc.widthOfString(str, options);
    };

    var _characterSpacing = function (str, width) {
        var stringWidth = _width(str);

        return (width - stringWidth) / (str.length - 1);
    };

    return {
        text: function (str, x, y) {
            doc.fillColor(color);
            doc.font(fontName);
            doc.fontSize(size);

            doc.text(str, x, y, options);
        },

        textSpaceToWidth: function (str, x, y, width) {
            doc.fillColor(color);
            doc.font(fontName);
            doc.fontSize(size);

            // find the appropriate character spacing for the desired width
            var charSpacing = _characterSpacing(str, width);

            var optionsCharSpacing = {};

            for (var prop in options) {
                if (options.hasOwnProperty(prop)) {
                    optionsCharSpacing[prop] = options[prop];
                }
            }
            optionsCharSpacing.characterSpacing = charSpacing;

            doc.text(str, x, y, optionsCharSpacing);
        },

        textScaleToWidth: function (str, x, y, width) {
            doc.fillColor(color);
            doc.font(fontName);
            doc.fontSize(size);

            // find the appropriate character spacing for the desired width
            var strWidth = _width(str);
            var scale = width / strWidth * 100;

            var optionsScaling = {};

            for (var prop in options) {
                if (options.hasOwnProperty(prop)) {
                    optionsScaling[prop] = options[prop];
                }
            }
            optionsScaling.horizontalScaling = scale;

            doc.text(str, x, y, optionsScaling);
        },

        height: function (str) {
            doc.fillColor(color);
            doc.font(fontName);
            doc.fontSize(size);

            return doc.currentLineHeight();
        },

        width: _width,

        characterSpacing: _characterSpacing
    };
}

module.exports = {
    init: function (theDoc) {
        doc = theDoc;
    },
    lineStyle: lineHelper,
    fontStyle: fontHelper,
    rectStyle: rectHelper
}
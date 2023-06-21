const lineObject = function (document, color, lineWidth) {
  const doc = document;

  this.lineTo = function (x1, y1, x2, y2) {
    doc.save();

    doc.strokeColor(color);
    doc.lineWidth(lineWidth);
    doc.moveTo(x1, y1);
    doc.lineTo(x2, y2);
    doc.stroke();

    doc.restore();
  };

  this.horizontal = function (x, y, width) {
    this.lineTo(x, y, x + width, y);
  };

  this.vertical = function (x, y, height) {
    this.lineTo(x, y, x, y + height);
  };

  this.doubleLineTo = function (x1, y1, x2, y2) {
    doc.save();

    doc.strokeColor(color);
    doc.lineWidth(lineWidth * 0.25);

    doc.moveTo(x1, y1);
    doc.lineTo(x2, y2);

    doc.stroke();

    doc.strokeColor(color);
    doc.lineWidth(lineWidth * 0.75);

    doc.moveTo(x1 + 1.5, y1);
    doc.lineTo(x2 + 1.5, y2);

    doc.stroke();

    doc.restore();
  };
};

const rectangleObject = function (document, color, lineWidth) {
  const doc = document;

  this.halfRounded = function (x, y, w, h, r) {
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
  };

  this.filled = function (x, y, w, h) {
    doc.strokeColor(color);
    doc.lineWidth(lineWidth);

    doc.rect(x, y, w, h);

    doc.fill(color);
    doc.stroke();
  };

  this.filledQuarterRound = function (x, y, w, h, r) {
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
  };

  this.dropShadow = function (x, y, w, h, shadowWidth) {
    doc.strokeColor(color);
    doc.lineWidth(lineWidth);

    doc.rect(x + w, y + shadowWidth, shadowWidth, h);
    doc.rect(x + shadowWidth, y + h, w, shadowWidth);

    doc.fill(color);
    doc.stroke();
  };

  this.shadowRect = function (x, y, w, h, shadowWidth, shadowColor) {
    doc.save();

    const rectShadow = new rectangleObject(doc, shadowColor, 0.75);
    rectShadow.dropShadow(x, y, w, h, shadowWidth);

    this.halfRounded(x, y, w, h, shadowWidth);

    doc.restore();
  };
};

const textObject = function (document, fontName, color, size, options) {
  const doc = document;

  this.width = function (str) {
    doc.fillColor(color);
    doc.font(fontName);
    doc.fontSize(size);

    return doc.widthOfString(str, options);
  };

  this.height = function (str) {
    doc.fillColor(color);
    doc.font(fontName);
    doc.fontSize(size);

    return doc.currentLineHeight();
  };

  this.characterSpacing = function (str, width) {
    const stringWidth = this.width(str);

    return (width - stringWidth) / (str.length - 1);
  };

  this.print = function (str, x, y) {
    doc.fillColor(color);
    doc.font(fontName);
    doc.fontSize(size);

    doc.text(str, x, y, options);
  };

  this.printSpaceToWidth = function (str, x, y, width) {
    doc.fillColor(color);
    doc.font(fontName);
    doc.fontSize(size);

    // find the appropriate character spacing for the desired width
    const charSpacing = this.characterSpacing(str, width);

    const optionsCharSpacing = {};

    for (let prop in options) {
      if (options.hasOwnProperty(prop)) {
        optionsCharSpacing[prop] = options[prop];
      }
    }
    optionsCharSpacing.characterSpacing = charSpacing;

    doc.text(str, x, y, optionsCharSpacing);
  };

  this.printScaleToWidth = function (str, x, y, width) {
    doc.fillColor(color);
    doc.font(fontName);
    doc.fontSize(size);

    // find the appropriate character spacing for the desired width
    const strWidth = this.width(str);
    const scale = (width / strWidth) * 100;

    const optionsScaling = {};

    for (let prop in options) {
      if (options.hasOwnProperty(prop)) {
        optionsScaling[prop] = options[prop];
      }
    }
    optionsScaling.horizontalScaling = scale;

    doc.text(str, x, y, optionsScaling);
  };
};

/**
 * render an array of SVG objects to a PDF
 *
 * currently this only supports path and circle objects
 * @param {Object} document PDFDocument object
 * @param {string} color RGB color string in format #RRGGBB
 * @param {float} scaleFactor amount to scale the SVG by. 1.0 is actual size
 */
const svgObject = function (document, color, scaleFactor) {
  const doc = document;

  this.render = function (parts, x, y) {
    // Render each part of the path
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (part.type === 'path') {
        doc.save();
        doc.translate(x, y);
        doc.scale(scaleFactor);
        doc.path(part.path); // render an SVG path

        if (part['stroke-width']) {
          doc.lineWidth(part['stroke-width']);
        }

        if (part.fill !== 'none' && part.stroke !== 'none') {
          doc.fillAndStroke(color ? color : part.fill, part.stroke);
        } else {
          if (part.fill === 'none') {
            doc.fill(color ? color : part.fill);
          }

          if (part.stroke === 'none') {
            doc.stroke(part.stroke);
          }
        }

        doc.restore();
      } else if (part.type === 'circle') {
        doc.save();
        doc.translate(x, y);
        doc.scale(scaleFactor);
        doc.circle(parseInt(part.cx), parseInt(part.cy), parseInt(part.r));

        if (part.fill && part.fill !== 'none') {
          doc.fill(color ? color : part.fill);
        }
        doc.restore();
      }
    }
  };
};

function PDFDrawing(document) {
  this.line = function (color, lineWidth) {
    return new lineObject(document, color, lineWidth);
  };

  this.rectangle = function (color, lineWidth) {
    return new rectangleObject(document, color, lineWidth);
  };

  this.text = function (fontName, color, size, options) {
    return new textObject(document, fontName, color, size, options);
  };

  this.svg = function (color, scaleFactor) {
    return new svgObject(document, color, scaleFactor);
  };
}

module.exports = PDFDrawing;

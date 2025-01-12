PDFDocument = require('pdfkit');

const PageDetails = require('../pagedetails.js');
const DefaultTheme = require('../themes/defaulttheme.js');
const mergeObjects = require('../utils/mergeobjects.js');

const getPageMargins = function () {
  // odd pages have an additional offset on the left
  // to allow for hole punching/binding
  const left = 15;
  const width = 585;

  const margin = {
    left: left,
    right: left + width,
    width: width,
    top: 15, // minimum we can start from top
    height: 820, // maximum height of page
  };

  return margin;
};

function SimplePlanner(theme) {
  let pageNumber = 1;

  theme = mergeObjects(DefaultTheme, theme);

  const getNotesStyles = function () {
    const stylesNotes = { lineHeight: theme.lineHeight };
    stylesNotes.color = theme.notes.header.colorBackground;
    stylesNotes.lineColor = theme.notes.rule.color;

    return stylesNotes;
  };

  const doc = new PDFDocument({
    size: 'letter',
  });

  this.open = function (stream) {
    doc.pipe(stream);
  };

  this.close = function () {
    doc.end();
  };

  this.newPage = function () {
    doc.addPage();
    pageNumber++;
  };

  const textAndLine = function (page, text, x, y, width, styles) {
    const lineHeight = 14;

    page.text(text, x, y, 100, {
      align: 'right',
      color: styles.width,
      lineHeight: lineHeight,
    });
    page.horizontalLine(x + 100 + 2, y + lineHeight - 4, width, {
      width: styles.width,
      color: styles.color,
    });
  };

  const headerSection = function (page, text, x, y, width, styles) {
    page.horizontalLine(x, y, width, {
      width: styles.width,
      color: styles.color,
    });

    page.text(text, x, y - 2, 100, {
      align: 'left',
      color: styles.color,
      lineHeight: 14,
    });
  };

  /**
   * renders a ruled page with a monthly calendar for the given date
   */
  this.renderNotes = function () {
    const page = new PageDetails(doc);
    const margin = getPageMargins();
    const lineWidth = 0.25;
    const topHeight = 60;

    const logo = theme.logo;
    if (logo && logo.svg) {
      page.logo(logo.svg, 20, margin.top + 5, { color: logo.color, scale: logo.scale });
    }

    const stylesNotes = getNotesStyles();

    textAndLine(page, 'DATE', margin.right - 280, margin.top + 5, 178, {
      width: lineWidth,
      color: stylesNotes.lineColor,
    });

    textAndLine(page, 'PURPOSE', margin.right - 280, margin.top + 5 + theme.lineHeight, 178, {
      width: lineWidth,
      color: stylesNotes.lineColor,
    });

    headerSection(page, 'CUE COLUMN', margin.left, margin.top + topHeight, margin.width, {
      width: lineWidth,
      color: stylesNotes.lineColor,
    });

    page.verticalLine(margin.left + 140, margin.top + topHeight, margin.height - topHeight - 149, {
      width: lineWidth,
      color: stylesNotes.lineColor,
    });

    page.text('NOTES', margin.left + 150, margin.top + topHeight - 2, 100, {
      align: 'left',
      color: stylesNotes.lineColor,
      lineHeight: 14,
    });

    page.rulerLines(
      margin.left + 150,
      margin.top + topHeight + theme.lineHeight,
      margin.width - 150,
      margin.height - 149,
      {
        width: lineWidth,
        height: stylesNotes.lineHeight,
        color: stylesNotes.lineColor,
      },
    );

    headerSection(page, 'SUMMARY', margin.left, margin.height - 135, margin.width, {
      width: lineWidth,
      color: stylesNotes.lineColor,
    });
  };
}

module.exports = SimplePlanner;

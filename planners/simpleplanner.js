PDFDocument = require('pdfkit');

const PageDetails = require('../pagedetails.js');
const DefaultTheme = require('../themes/defaulttheme.js');
const mergeObjects = require('../utils/mergeobjects.js');

const getPageMargins = function () {
  // odd pages have an additional offset on the left
  // to allow for hole punching/binding
  const left = 19;
  const width = 581;

  const margin = {
    left: left,
    right: left + width,
    width: width,
    top: 40, // minimum we can start from top
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
      color: styles.color,
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
    const topHeight = margin.top + 20;
    const COLUMN_RIGHT = 150;
    const NOTES_LEFT = COLUMN_RIGHT + 10;

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

    page.verticalLine(
      margin.left + COLUMN_RIGHT,
      margin.top + topHeight,
      margin.height - topHeight - 189,
      {
        width: lineWidth,
        color: stylesNotes.lineColor,
      },
    );

    page.text('NOTES', margin.left + NOTES_LEFT, margin.top + topHeight - 2, 100, {
      align: 'left',
      color: stylesNotes.lineColor,
      lineHeight: 14,
    });

    page.rulerLines(
      margin.left + NOTES_LEFT,
      margin.top + topHeight + theme.lineHeight,
      margin.width - 160,
      margin.height - 159,
      {
        width: lineWidth,
        height: stylesNotes.lineHeight,
        color: stylesNotes.lineColor,
      },
    );

    headerSection(page, 'SUMMARY', margin.left, margin.height - 150, margin.width, {
      width: lineWidth,
      color: stylesNotes.lineColor,
    });
  };
}

module.exports = SimplePlanner;

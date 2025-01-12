const DateUtils = require('./utils/date.js');
const PDFCalendar = require('./pdfcalendar.js');
const PDFDrawing = require('./pdfdrawing.js');
const mergeObjects = require('./utils/mergeobjects.js');

const RGB = require('./utils/rgb.js');

const dateutils = new DateUtils();

function PageDetails(document) {
  const pdf = new PDFDrawing(document);
  const pdfCalendar = new PDFCalendar(document);

  const lineHeight = 21;

  this.dayLabel = function (theDate, x, y, styles) {
    // default styles
    const baseStyles = {
      color: RGB.gray,
      size: 45,
      width: 70,
    };

    styles = mergeObjects(baseStyles, styles);

    pdfCalendar.dayLabel(theDate, x, y, styles);
  };

  this.monthLabel = function (theDate, x, y, styles) {
    const baseStyles = {
      color: RGB.gray,
      width: 90,
      size: 25,
    };

    styles = mergeObjects(baseStyles, styles);

    pdfCalendar.monthLabel(theDate, x, y, styles);
  };

  this.twoMonthCalendar = function (date, x, y, styles) {
    const baseStyles = {
      color: RGB.gray,
      size: 5,
    };

    styles = mergeObjects(baseStyles, styles);

    pdfCalendar.twoMonthCalendar(date, x, y, styles);
  };

  this.quarterCalendar = function (date, x, y, styles) {
    const baseStyles = {
      color: RGB.gray,
      highlightColor: RGB.mediumGray,
      backgroundColor: RGB.white,
      size: 5.5,
    };

    styles = mergeObjects(baseStyles, styles);

    pdfCalendar.quarterCalendar(date, x, y, styles);
  };

  /**
   *
   * build up the todo area, consisting of a header box
   * a vertical margin line on the left
   * and horizontal ruler lines for notes
   *
   * @param title - text for header
   * @param x - upper left x coord
   * @param y - upper left y coord
   * @param width - width of area
   * @param height - height of area
   * @param styles object with style info (see below)
   *
   */
  this.todoArea = function (title, x, y, width, height, styles) {
    const baseStyles = {
      color: RGB.mediumGray,
      lineColor: RGB.lightBlue,
      textColor: RGB.white,
      shadowColor: RGB.lightGray,

      lineHeight: lineHeight,
      marginWidth: 25,
    };

    styles = mergeObjects(baseStyles, styles);

    this.ruledArea(title, x, y, width, height, styles);

    // vertical margin line
    const line = pdf.line(styles.color, 1.0);

    line.doubleLineTo(x + styles.marginWidth, y, x + styles.marginWidth, y + height);
  };

  /**
   *
   * build up the todo area, consisting of a header box
   * a vertical margin line on the left
   * a wider, vertical margin line on the right
   * and horizontal ruler lines for notes
   *
   * @param title - text for header
   * @param x - upper left x coord
   * @param y - upper left y coord
   * @param width - width of area
   * @param height - height of area
   * @param styles object with style info (see below)
   *
   */
  this.todoWithDateArea = function (title, x, y, width, height, styles) {
    const baseStyles = {
      color: RGB.mediumGray,
      lineColor: RGB.lightBlue,
      textColor: RGB.white,
      shadowColor: RGB.lightGray,

      lineHeight: lineHeight,
      marginWidth: 25,
    };

    styles = mergeObjects(baseStyles, styles);

    this.ruledArea(title, x, y, width, height, styles);

    // vertical margin line
    const marginLine = pdf.line(styles.color, 1.0);

    marginLine.doubleLineTo(x + styles.marginWidth, y, x + styles.marginWidth, y + height);

    // vertical date line on right
    const dateLine = pdf.line(styles.color, 1.0);
    const xDatePos = x + width - styles.marginWidth * 4;

    dateLine.doubleLineTo(xDatePos, y, xDatePos, y + height);
  };

  /**
   * Draw a horizontal line with the current theme color and width
   *
   * @param {*} x uperr left x coord
   * @param {*} y upper left y coord
   * @param {*} w width
   */
  this.horizontalLine = function (x, y, w, styles) {
    const line = pdf.line(styles.color, styles.width);

    line.horizontal(x, y, w - 1);
  };

  /**
   * Draw ruler lines in the given area
   *
   * @param {*} x uperr left x coord
   * @param {*} y upper left y coord
   * @param {*} w width
   * @param {*} h height
   * @param {*} styles {width, height, color}
   */
  this.rulerLines = function (x, y, w, h, styles) {
    // empty ruler lines for notes

    const rulerLine = pdf.line(styles.color, styles.width);

    while (y < h) {
      rulerLine.horizontal(x, y, w - 1);

      y += styles.height;
    }
  };

  /**
   *
   * build up an area with a header and horiz ruler lines for notes
   *
   * @param title - text for header
   * @param x - upper left x coord
   * @param y - upper left y coord
   * @param width - width of area
   * @param height - height of area
   * @param styles object with style info (see below)
   *
   */
  this.ruledArea = function (title, x, y, width, height, styles) {
    const lineHeight = styles.lineHeight;

    const baseStyles = {
      color: RGB.mediumGray,
      lineColor: RGB.lightBlue,
      textColor: RGB.white,
      shadowColor: RGB.lightGray,

      lineHeight: lineHeight,
    };

    styles = mergeObjects(baseStyles, styles);

    const rectShadow = pdf.rectangle(styles.shadowColor, 0.75);
    rectShadow.dropShadow(x, y, width, height, 4);

    // header box
    const rect = pdf.rectangle(styles.color, 0.75);
    rect.filledQuarterRound(x, y, width, lineHeight, 4);

    const rectBorder = pdf.rectangle(styles.color, 0.75);
    rectBorder.halfRounded(x, y, width, height, 4);

    const fontHeader = pdf.text('Helvetica', styles.textColor, lineHeight / 2, {
      align: 'center',
      width: width,
      lineBreak: false,
    });

    fontHeader.print(title, x, y + lineHeight / 3);

    const yVal = y + lineHeight + lineHeight / 10;
    const yLine = yVal + lineHeight;

    this.rulerLines(x + 1, yLine, width, y + height, {
      width: 0.25,
      height: lineHeight,
      color: styles.lineColor,
    });
  };

  /**
   *
   * build up the notes area, consisting of a shadowed, rounded outer box
   * a vertical margin line on the left
   * and horizontal ruler lines for notes
   *
   */
  this.notesArea = function (x, y, width, height, styles) {
    const baseStyles = {
      color: RGB.gray,
      lineColor: RGB.lightBlue,
      shadowColor: RGB.lightGray,

      lineHeight: lineHeight,
      marginWidth: 77,
    };

    styles = mergeObjects(baseStyles, styles);

    const rect = pdf.rectangle(styles.color, 0.75);
    rect.shadowRect(x, y, width, height, 4, styles.shadowColor);

    // empty ruler lines for notes
    this.rulerLines(x + 1, y + styles.lineHeight, width, y + height, {
      width: 0.25,
      height: styles.lineHeight,
      color: styles.lineColor,
    });

    // vertical margin line
    const line = pdf.line(styles.color, 1.0);

    line.doubleLineTo(x + styles.marginWidth, y, x + styles.marginWidth, y + height);
  };

  /**
   * puts days left in quarter/year as text at x, y
   *
   * @param date - date to use for days left in year/quarter
   *  @param x - upper left x coord
   * @param y - upper left y coord
   * @param styles object with style info (see below)
   */
  this.daysLeft = function (date, x, y, styles) {
    const baseStyles = {
      color: RGB.mediumGray,
      size: 5.5,
    };

    styles = mergeObjects(baseStyles, styles);

    const text = pdf.text('Helvetica', styles.color, styles.size, {
      align: 'left',
      lineBreak: false,
    });

    let str = dateutils.daysRemainingInYearToString(date);
    text.print(str, x, y);

    const height = text.height(str);
    str = dateutils.daysRemainingInQuarterToString(date);
    text.print(str, x, y + height + styles.size / 5);
  };

  /**
   * renders SVG logo
   *
   * @param svg - an array of svg paths to render
   * @param x - upper left x coord
   * @param y - upper left y coord
   * @param styles object with style info (see below)
   */
  this.logo = function (svg, x, y, styles) {
    if (svg) {
      const path = pdf.svg(styles.color, styles.scale);

      path.render(svg, x, y);
    }
  };
}

module.exports = PageDetails;

var PDFDrawing = require('./pdfdrawing.js');
var IBMLogo = require('./ibmlogo.js');
var DateUtils = require('./dateutils.js');
var FontUtils = require('./fontutils.js');
var PDFCalendar = require('./pdfcalendar.js');

var dateutils = new DateUtils();

var RGB = {
    white: '#FFFFFF',
    black: '#000000',
    darkGray: '#333333',
    gray: '#666666',
    mediumGray: '#888888',
    lightGray: '#DDDDDD',
    lightBlue: '#BBDDEE'
};

var defaultStyles = {
    lineHeight: 21,

    rgb: RGB,

    color: {
        text: RGB.gray,
        background: RGB.white,
        month: RGB.black,
        monthHighlight: RGB.mediumGray,
        ruler: RGB.lightBlue,
        margin: RGB.gray,
        shadow: RGB.lightGray,
        noteBox: RGB.darkGray
    }
};



var applyStyles = function (defaultStyles, userStyles) {
    defaultStyles = defaultStyles || {};
    userStyles = userStyles || {};

    var mergedStyles = {};

    for (var attrname in defaultStyles) {
        mergedStyles[attrname] = defaultStyles[attrname];
    }

    // now apply any user defined styles.  note that any user styles
    // will override the default
    for (var attrname in userStyles) {
        mergedStyles[attrname] = userStyles[attrname];
    }

    return mergedStyles;
};


function PageDetails(document) {

    var pdf = new PDFDrawing(document);
    var pdfCalendar = new PDFCalendar(document);

    this.styles = defaultStyles;

    this.dayLabel = function (theDate, x, y, styles) {
        // default styles
        var baseStyles = {
            color: defaultStyles.color.text,
            size: 45,
            width: 70
        };

        styles = applyStyles(baseStyles, styles);

        pdfCalendar.dayLabel(theDate, x, y, styles);
    };

    this.monthLabel = function (theDate, x, y, styles) {

        var baseStyles = {
            color: defaultStyles.color.text,
            width: 90,
            size: 25
        };

        styles = applyStyles(baseStyles, styles);

        pdfCalendar.monthLabel(theDate, x, y, styles);
    };

    this.monthCalendar = function (date, x, y, styles) {
        var baseStyles = {
            color: defaultStyles.color.month,
            highlightColor: defaultStyles.color.monthHighlight,
            backgroundColor: defaultStyles.color.background,
            highlight: false,
            size: 5
        };

        styles = applyStyles(baseStyles, styles);

        pdfCalendar.monthCalendar(date, x, y, styles);

    };

    this.twoMonthCalendar = function (date, x, y, styles) {
        var baseStyles = {
            color: defaultStyles.color.month,
            size: 5
        };

        styles = applyStyles(baseStyles, styles);

        pdfCalendar.twoMonthCalendar(date, x, y, styles);
    };

    this.quarterCalendar = function (date, x, y, styles) {

        var baseStyles = {
            color: defaultStyles.color.text,
            highlightColor: defaultStyles.color.monthHighlight,
            backgroundColor: defaultStyles.color.background,
            size: 5.5
        };

        styles = applyStyles(baseStyles, styles);

        pdfCalendar.quarterCalendar(date, x, y, styles);
    };

    this.todoArea = function (title, x, y, width, height, styles) {
        /*
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
        var baseStyles = {
            lineHeight: defaultStyles.lineHeight,
            lineColor: RGB.lightBlue,
            textColor: RGB.white,
            shadowColor: RGB.lightGray,
            marginWidth: 25,
            color: RGB.mediumGray
        };

        styles = applyStyles(baseStyles, styles);

        this.ruledArea(title, x, y, width, height, styles);

        // vertical margin line
        var line = pdf.line(styles.color, 1.0);

        line.doubleLineTo(x + styles.marginWidth, y,
            x + styles.marginWidth, y + height);
    };

    /* private function */
    var rulerLines = function (x, y, w, h, lineWidth, lineHeight, color) {
        // empty ruler lines for notes

        var rulerLine = pdf.line(color, lineWidth);

        while (y < (h)) {
            rulerLine.horizontal(x, y, w - 1);

            y += lineHeight;
        }
    };

    this.ruledArea = function (title, x, y, width, height, styles) {
        /*
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

        var baseStyles = {
            lineHeight: defaultStyles.lineHeight,
            lineColor: RGB.lightBlue,
            textColor: RGB.white,
            shadowColor: RGB.lightGray,
            color: RGB.mediumGray
        };

        styles = applyStyles(baseStyles, styles);

        var rectShadow = pdf.rectangle(styles.shadowColor, .75);
        rectShadow.dropShadow(x, y, width, height, 4);


        var lineHeight = styles.lineHeight;

        // header box
        var rect = pdf.rectangle(styles.color, .75);
        rect.filledQuarterRound(x, y, width, lineHeight, 4);

        var rectBorder = pdf.rectangle(styles.color, .75);
        rectBorder.halfRounded(x, y, width, height, 4);

        var fontHeader = pdf.text('Helvetica',
            styles.textColor,
            lineHeight / 2, {
                align: 'center',
                width: width,
                lineBreak: false
            });

        fontHeader.print(title, x, y + lineHeight / 3);

        var yVal = y + lineHeight + lineHeight / 10;
        var yLine = yVal + lineHeight;

        rulerLines(x + 1, yLine, width, y + height, .25, lineHeight, styles.lineColor);

    };

    this.notesArea = function (x, y, width, height, styles) {
        /*
         *
         * build up the notes area, consisting of a shadowed, rounded outer box
         * a vertical margin line on the left
         * and horizontal ruler lines for notes
         *
         */

        var baseStyles = {
            lineHeight: defaultStyles.lineHeight,
            lineColor: RGB.lightBlue,
            shadowColor: RGB.lightGray,
            marginWidth: 77,
            color: RGB.gray
        };

        styles = applyStyles(baseStyles, styles);

        var rect = pdf.rectangle(styles.color, .75);
        rect.shadowRect(x, y, width, height, 4, styles.shadowColor);

        // empty ruler lines for notes
        rulerLines(x + 1, y + styles.lineHeight, width, y + height, .25,
            styles.lineHeight, styles.lineColor);

        // vertical margin line
        var line = pdf.line(styles.color, 1.0);

        line.doubleLineTo(x + styles.marginWidth, y,
            x + styles.marginWidth, y + height);
    };

    /* private function */
    var daysRemainingInYear = function (date) {
        var days = dateutils.daysRemainingInYear(date);
        var str = "";

        switch (days) {
        case 0:
            str = "Last day of the year";
            break;
        case 1:
            str = "1 day left this year";
            break;
        default:
            str = days.toString() + " days left this year";
        };

        return str;
    };

    /* private function */
    var daysRemainingInQuarter = function (date) {
        var days = dateutils.daysRemainingInQuarter(date);
        var str = "";

        switch (days) {
        case 0:
            str = "Last day of the quarter";
            break;
        case 1:
            str = "1 day left this quarter";
            break;
        default:
            str = days.toString() + " days left this quarter";
        }

        return str;
    };

    this.factoids = function (date, x, y, styles) {
        /*
         * puts informational text at x, y
         *
         * @param date - date to use for factoids
         * @param x - upper left x coord
         * @param y - upper left y coord
         * @param styles object with style info (see below)
         */

        var baseStyles = {
            color: RGB.mediumGray,
            size: 5.5
        };

        styles = applyStyles(baseStyles, styles);

        var text = pdf.text('Helvetica',
            styles.color,
            styles.size, {
                align: 'left',
                lineBreak: false
            });
        var str = daysRemainingInYear(date);

        text.print(str, x, y);


        var height = text.height(str);
        var str = daysRemainingInQuarter(date);

        text.print(str, x, y + height + styles.size / 5);
    }

    this.ibmLogo = function (x, y, styles) {
        /*
         * renders an IBM 8 bar logo via SVG paths
         *
         * @param x - upper left x coord
         * @param y - upper left y coord
         * @param styles object with style info (see below)
         */

        var baseStyles = {
            color: RGB.mediumGray
        };

        styles = applyStyles(baseStyles, styles);

        var ibmLogo = new IBMLogo(pdf);

        ibmLogo.color = styles.color;
        ibmLogo.scaleFactor = 0.05; // the logo at 100% is huge.. scale it down to 5%
        ibmLogo.draw(x, y);

    };


};


module.exports = PageDetails;

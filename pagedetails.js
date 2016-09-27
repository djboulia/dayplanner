var PDFDrawing = require('./pdfdrawing.js');
var ibmlogo = require('./ibmlogo.js');
var DateUtils = require('./dateutils.js');
var FontUtils = require('./fontutils.js');
var PDFCalendar = require('./pdfcalendar.js');
var doc = null;

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

    doc = document;
    var pdf = new PDFDrawing(document);
    var pdfCalendar = new PDFCalendar(pdf);

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


    this.shadowRect = function (x, y, w, h, styles) {
        var baseStyles = {
            shadowColor: RGB.lightGray,
            color: RGB.mediumGray
        };

        styles = applyStyles(baseStyles, styles);

        doc.save();

        var rectShadow = pdf.rectangle(styles.shadowColor, .75);
        rectShadow.dropShadow(x, y, w, h, 4)

        var rect = pdf.rectangle(styles.color, .75);
        rect.halfRounded(x, y, w, h, 4);

        doc.restore();
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

        this.shadowRect(x, y, width, height, styles);

        // empty ruler lines for notes
        var xLine = x + 1;
        var yLine = y + styles.lineHeight;

        var rulerLine = pdf.line(styles.lineColor, .25);

        while (yLine < (y + height)) {
            rulerLine.horizontal(xLine, yLine, width - 1);

            yLine += styles.lineHeight;
        }

        // vertical margin line
        var line = pdf.line(styles.color, 1.0);

        line.doubleLineTo(x + styles.marginWidth, y,
            x + styles.marginWidth, y + height);
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

        // empty ruler lines for notes
        var xLine = x + 1;
        var yLine = yVal + lineHeight;

        var rulerLine = pdf.line(styles.lineColor, .25);

        while (yLine < (y + height)) {
            rulerLine.horizontal(xLine, yLine, width - 1);

            yLine += lineHeight;
        }

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

        var font = pdf.text('Helvetica',
            styles.color,
            styles.size, {
                align: 'left',
                lineBreak: false
            });

        var days = dateutils.daysRemainingInYear(date);
        var str = days.toString() + " days left this year";

        switch (days) {
        case 0:
            str = "Last day of the year";
            break;
        case 1:
            str = "1 day left this year";
            break;
        }

        font.print(str, x, y);

        var days = dateutils.daysRemainingInQuarter(date);
        var height = font.height(str);
        var str2 = days.toString() + " days left this quarter";

        switch (days) {
        case 0:
            str2 = "Last day of the quarter";
            break;
        case 1:
            str2 = "1 day left this quarter";
            break;
        }

        font.print(str2, x, y + height + styles.size / 5);

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

        // Render each path that makes up the ibm logo
        for (var i = 0; i < ibmlogo.length; i++) {
            var part = ibmlogo[i];

            doc.save()
            doc.translate(x, y);
            doc.scale(0.05); // the actual logo is huge.. scale it down to 5%
            doc.path(part.path) // render an SVG path


            if (part['stroke-width']) {
                doc.lineWidth(part['stroke-width']);
            }

            if (part.fill != 'none' && part.stroke != 'none') {
                doc.fillAndStroke(styles.color, part.stroke);
            } else {

                if (part.fill == 'none') {
                    doc.fill(styles.color)
                }

                if (part.stroke == 'none') {
                    doc.stroke(part.stroke)
                }
            }

            doc.restore()
        }
    };


};


module.exports = PageDetails;

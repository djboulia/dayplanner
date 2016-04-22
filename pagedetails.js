var draw = require('./pdfdrawing.js');
var ibmlogo = require('./ibmlogo.js');
var doc = null;

var MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

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
    rgb: RGB,

    color: {
        text: RGB.gray,
        month: RGB.black,
        monthHighlight: RGB.gray,
        ruler: RGB.lightBlue,
        margin: RGB.gray,
        shadow: RGB.lightGray,
        noteBox: RGB.darkGray
    }
};

var daysInMonth = function (date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

var prevMonth = function (date) {
    // find last month
    var year = date.getMonth() > 0 ? date.getFullYear() : date.getFullYear() - 1;
    var month = date.getMonth() > 0 ? date.getMonth() - 1 : 11;
    return new Date(year, month, 1);
};

var nextMonth = function (date) {
    // find next month
    var year = date.getMonth() < 11 ? date.getFullYear() : date.getFullYear() + 1;
    var month = date.getMonth() < 11 ? date.getMonth() + 1 : 0;
    return new Date(year, month, 1);
};

var daysBetween = function( date1, date2 ) {
    //Calculate difference btw the two dates, and convert to days
    var oneDay = 1000*60*60*24; // in milliseconds
    var diffDays = Math.round(Math.abs((date1.getTime() -
                                        date2.getTime())/(oneDay)));
    return diffDays;
};

var isCurrentWeek = function(startOfWeek, date1) {
    // startOfWeek represents the date (1..31) of the beginning of the week
    // (Sunday) for the given month.

    var today = date1.getDate();

    if (today >= startOfWeek && today < startOfWeek+7) {
        return true;
    }

    return false;
};

var isToday = function(curDay, date1) {
    return curDay == date1.getDate();
};

var daysRemainingInYear = function(date) {
    var firstDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var endOfYear = new Date(date.getFullYear(), 11, 31);

    return daysBetween(firstDate, endOfYear);
};

var daysRemainingInQuarter = function(date) {
    var firstDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var month = date.getMonth();
    var currentQuarter = Math.ceil((month+1)/3);
    var endOfQuarter = new Date(date.getFullYear(), currentQuarter * 3, 0);
    
//    console.log("currentQuarter = " + currentQuarter + 
//                " endOfQuarter = " + endOfQuarter.toDateString());

    return daysBetween(firstDate, endOfQuarter);
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
    draw.init(doc);

    this.styles = defaultStyles;

    this.dayLabel = function (theDate, x, y, styles) {
        /**
         *  pretty print the current day of the month
         *
         * @param theDate : date object
         * @param x       : x coord
         * @param y       : y coord
         * @param styles  : object with style info (see below)
         *
         */

        // default styles
        var baseStyles = {
            color: defaultStyles.color.text,
            size: 45,
            width: 70
        };

        styles = applyStyles(baseStyles, styles);

        var day = theDate.getDate().toString();

        var font = draw.fontStyle('Times-Roman', styles.color, styles.size, {
            align: 'center',
            width: styles.width,
            lineBreak: false
        });

        font.text(day, x, y);
    }

    this.monthLabel = function (theDate, x, y, styles) {

        /**
         *  pretty print a month and year header for our notes sheet
         *  this ends up looking something like this:
         *
         *  D E C E M B E R
         *  ---------------
         *  2    0    1   2
         *  ---------------
         *
         * @param theDate date object to use for month/year
         * @param x upper left x coord
         * @param y upper left y coord
         * @param styles object with style info (see below)
         */

        var baseStyles = {
            color: defaultStyles.color.text,
            width: 90,
            size: 25
        };

        styles = applyStyles(baseStyles, styles);

        var month = MONTHS[theDate.getMonth()];
        var year = theDate.getFullYear().toString();
        var textWidth = styles.width;
        var fontMonth = draw.fontStyle('Times-Roman', styles.color, styles.size, {
            align: 'left'
        });
        var fontYear = draw.fontStyle('Helvetica', styles.color, styles.size / 3, {
            align: 'left'
        });

        fontMonth.textScaleToWidth(month, x, y, textWidth);

        y = y + fontMonth.height(month) - 2;

        var line = draw.lineStyle(styles.color, 0.25);
        line.horizontal(x, y, textWidth);

        fontYear.textSpaceToWidth(year, x, y + 1, textWidth);

        var height = fontYear.height(year);

        line.horizontal(x, y + height + 1, textWidth);

    }

    this.monthCalendar = function (date, x, y, styles) {
        /**
         * build a visual calendar at the specified x and y
         * coordinates for the month specified in date.
         * 
         * resulting calendar output looks roughly like this:
         * 
         * S  M  T  W  T  F  S
         *    1  2  3  4  5  6
         *  7 8  9  10 11 12 13
         * 14 15 16 17 18 19 20
         * 21 22 23 24 25 26 27
         * 28 29 30
         * 
         * @param date - the month and year for the calendar
         * @param x - upper left x coord
         * @param y - upper left y coord
         * @param styles object with style info (see below)
         * 
         */

        var baseStyles = {
            color: defaultStyles.color.month,
            colorHighlight: defaultStyles.color.monthHighlight,
            highlight: false,
            size: 5
        };

        styles = applyStyles(baseStyles, styles);

        var colWidth = styles.size + styles.size / 2;
        var rowHeight = styles.size + styles.size / 10;

        //        console.log("colWidth = " + colWidth + ", rowHeight = " + rowHeight);

        // init the day of week header and month number font styles
        // we want them centered within the specified column width
        // each character is placed individually, so we set the lineBreak to false
        // since we never want any word wrap across lines
        var fontHeader = draw.fontStyle('Times-Bold',
            styles.color,
            styles.size, {
                align: 'center',
                width: colWidth,
                lineBreak: false
            });

        var fontMonth = draw.fontStyle('Times-Roman',
            styles.color,
            styles.size, {
                align: 'center',
                width: colWidth,
                lineBreak: false
            });

        var fontMonthHighlight = draw.fontStyle('Times-Roman',
            RGB.white,
            styles.size, {
                align: 'center',
                width: colWidth,
                lineBreak: false
            });

        //        console.log("Header width = " + fontHeader.width("M") +
        //            ", height = " + fontHeader.height("M"));
        //        console.log("Month width = " + fontMonth.width("30") +
        //            ", height = " + fontMonth.height("30"));

        var xVal = x;

        var weekHeaders = ["S", "M", "T", "W", "T", "F", "S"];
        for (var i = 0; i < weekHeaders.length; i++) {
            fontHeader.text(weekHeaders[i], xVal, y);
            xVal += colWidth;
        }

        var days = daysInMonth(date);
        var firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        var curDay = ((firstOfMonth.getDay() + 1) * -1) + 2;

        //    console.log("Month = " + date.getMonth() + " DaysInMonth= " +
        //        days + " firstDay = " + firstOfMonth.getDay() + " curDay = " + curDay);

        var lineHeight = rowHeight;
        var yVal = y;
        var highlightWeek = false;

        for (var week = 0; week < 6; week++) {
            xVal = x;

            yVal += lineHeight;

            if (styles.highlight && isCurrentWeek(curDay, date)) {
                var fudge = styles.size / 10;

                // draw a highlight rectangle
                var rect = draw.rectStyle(styles.colorHighlight, .75);
                rect.filled(xVal, yVal-fudge, colWidth*7, lineHeight-fudge);

                highlightWeek = true;
            } else {
                highlightWeek = false;
            }

            for (var j = 1; j <= 7; j++) {
                var dayText = (curDay > 0 && curDay <= days) ? curDay.toString() : "";


                if (styles.highlight && highlightWeek) {
                    if (isToday(curDay, date)) {
                        var fudge = styles.size / 10;

                        // make current day the reverse of the rest of the week
                        var rect = draw.rectStyle(RGB.white, .75);
                        rect.filled(xVal, yVal-fudge, colWidth, lineHeight-fudge);

                        var lineWidth = fudge/5;
                        var line = draw.lineStyle(styles.colorHighlight, lineWidth);
                        line.horizontal(xVal, yVal-fudge+lineWidth/2, colWidth);
                        line.horizontal(xVal, yVal+lineHeight-fudge*2-lineWidth/2, colWidth);

                        fontMonth.text(dayText, xVal, yVal);
                    } else {
                        fontMonthHighlight.text(dayText, xVal, yVal);
                    }
                } else {
                    fontMonth.text(dayText, xVal, yVal);
                }

                xVal += colWidth; // advance to next column
                curDay++;
            }
        }

    };

    this.twoMonthCalendar = function (date, x, y, styles) {
        /**
         * Writes PDF for two small calendars side by side, one in the current month,
         * the other for the following month.  Will look roughly like this:
         * 
         * JAN  S M T W T F S   |   S M T W T F S  FEB
         *        1 2 3 4 5 6   |         1 2 3 4 
         *      7 8 9 ...       |   5 6 7 8 9 ...
         *     	 		        |
         *                      |
         * 
         * @param date - the month and year for the calendar
         * @param x - upper left x coord
         * @param y - upper left y coord
         * @param styles object with style info (see below)
         * 
         */

        var date2 = nextMonth(date);

        this.sideBySideCalendar(date, date2, x, y, styles);
    };

    this.quarterCalendar = function (date, x, y, styles) {
        /**
         * Writes PDF for the current month on top, with two small calendars 
         * side by side, below.  Top has current month, two bottom 
         * are previous and next months for total of 3 month view.  
         * Will look roughly like this:
         * 
         *                   JANUARY
         *                S M T W T F S 
         *                 1 2 3 4 5 6
         *                  7 8 9 ...
         *     	 		        
         *                      |
         * DEC  S M T W T F S   |   S M T W T F S  FEB
         *        1 2 3 4 5 6   |         1 2 3 4 
         *      7 8 9 ...       |   5 6 7 8 9 ...
         *     	 		        |
         *                      |
         * 
         * @param date - the month and year for the calendar
         * @param x - upper left x coord
         * @param y - upper left y coord
         * @param styles object with style info (see below)
         * 
         */

        var baseStyles = {
            color: defaultStyles.color.text,
            size: 5.5
        };

        styles = applyStyles(baseStyles, styles);

        var month = MONTHS[date.getMonth()];
        var colWidth = styles.size + styles.size / 2;
        var fontSize = styles.size + 1;
        var rowHeight = fontSize + fontSize / 5;

        var fontHeader = draw.fontStyle('Times-Roman',
            styles.color,
            fontSize, {
                align: 'center',
                width: colWidth * 7,
                lineBreak: false
            });

        fontHeader.text(month, x + 45, y);

        styles.highlight = true;        // turn on highlighting current month for top calendar

        this.monthCalendar(date, x + 45, y + rowHeight, styles);

        var datePrev = prevMonth(date);
        var dateNext = nextMonth(date);

        styles.highlight = false;

        this.sideBySideCalendar(datePrev, dateNext, x, y + rowHeight + 45, {
            color: styles.color,
            size: styles.size * .85
        });
    };

    this.sideBySideCalendar = function (date1, date2, x, y, styles) {
        /**
         * Writes PDF for two small calendars side by side, one in the date1,
         * the other for date2.  Will look roughly like this:
         * 
         * JAN  S M T W T F S   |   S M T W T F S  MAR
         *        1 2 3 4 5 6   |         1 2 3 4 
         *      7 8 9 ...       |   5 6 7 8 9 ...
         *     	 		        |
         *                      |
         * 
         * @param date1 - the month and year for the left calendar
         * @param date2 - the month and year for the right calendar
         * @param x - upper left x coord
         * @param y - upper left y coord
         * @param styles object with style info (see below)
         * 
         */

        var baseStyles = {
            color: defaultStyles.color.month,
            size: 5
        };

        styles = applyStyles(baseStyles, styles);

        var colWidth = styles.size + styles.size / 2;
        var rowHeight = styles.size + styles.size / 10;
        var spacer = styles.size;

        var xVal = x;

        var shortMonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        // text style for drawing the three letter month (e.g. JAN, FEB)
        // we specify a left alignment and no lineBreak since we don't
        // want this text to wrap
        var fontShortMonth = draw.fontStyle('Times-Roman',
            styles.color,
            styles.size + 1, {
                align: 'left',
                lineBreak: false
            });

        // this month
        fontShortMonth.text(shortMonths[date1.getMonth()], xVal, y);
        xVal += fontShortMonth.width(shortMonths[date1.getMonth()]);

        this.monthCalendar(date1, xVal + spacer, y, styles);

        xVal += spacer + colWidth * 7;

        // separator line between calendars
        xVal += spacer * 2;
        var line = draw.lineStyle(styles.color, 0.25);
        line.vertical(xVal,
            y + rowHeight,
            rowHeight * 5 - 2);

        xVal += spacer;

        // second month calendar
        this.monthCalendar(date2, xVal + spacer, y, styles);

        xVal += spacer + colWidth * 7;
        xVal += spacer;

        // second month three letter month
        fontShortMonth.text(shortMonths[date2.getMonth()], xVal, y);

    };

    this.shadowRect = function (x, y, w, h, styles) {
        var baseStyles = {
            shadowColor: RGB.lightGray,
            color: RGB.mediumGray
        };

        styles = applyStyles(baseStyles, styles);

        doc.save();

        var rectShadow = draw.rectStyle(styles.shadowColor, .75);
        rectShadow.dropShadow(x, y, w, h, 4)

        var rect = draw.rectStyle(styles.color, .75);
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
            lineHeight: 21,
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

        var rulerLine = draw.lineStyle(styles.lineColor, .25);

        while (yLine < (y + height)) {
            rulerLine.horizontal(xLine, yLine, width - 1);

            yLine += styles.lineHeight;
        }

        // vertical margin line
        var line = draw.lineStyle(styles.color, 1.0);

        line.doubleLine(x + styles.marginWidth, y,
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
            lineHeight: 21,
            lineColor: RGB.lightBlue,
            textColor: RGB.white,
            shadowColor: RGB.lightGray,
            marginWidth: 25,
            color: RGB.mediumGray
        };

        styles = applyStyles(baseStyles, styles);

        this.ruledArea(title, x, y, width, height, styles);

        // vertical margin line
        var line = draw.lineStyle(styles.color, 1.0);

        line.doubleLine(x + styles.marginWidth, y,
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
            lineHeight: 21,
            lineColor: RGB.lightBlue,
            textColor: RGB.white,
            shadowColor: RGB.lightGray,
            color: RGB.mediumGray
        };

        styles = applyStyles(baseStyles, styles);

        var rectShadow = draw.rectStyle(styles.shadowColor, .75);
        rectShadow.dropShadow(x, y, width, height, 4);


        var lineHeight = styles.lineHeight;

        // header box
        var rect = draw.rectStyle(styles.color, .75);
        rect.filledQuarterRound(x, y, width, lineHeight, 4);

        var rectBorder = draw.rectStyle(styles.color, .75);
        rectBorder.halfRounded(x, y, width, height, 4);

        var fontHeader = draw.fontStyle('Helvetica',
            styles.textColor,
            lineHeight / 2, {
                align: 'center',
                width: width,
                lineBreak: false
            });

        fontHeader.text(title, x, y + lineHeight / 3);

        var yVal = y + lineHeight + lineHeight / 10;

        // empty ruler lines for notes
        var xLine = x + 1;
        var yLine = yVal + lineHeight;

        var rulerLine = draw.lineStyle(styles.lineColor, .25);

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

        var font = draw.fontStyle('Helvetica',
            styles.color,
            styles.size, {
                align: 'left',
                lineBreak: false
            });

        var days = daysRemainingInYear(date);
        var str = days.toString() + " days left this year";

        switch(days) {
            case 0:
                str = "Last day of the year";
                break;
            case 1:
                str = "1 day left this year";
                break;
        }
        
        font.text(str, x, y);

        var days = daysRemainingInQuarter(date);
        var height = font.height(str);        
        var str2 = days.toString() + " days left this quarter";
        
        switch(days) {
            case 0:
                str2 = "Last day of the quarter";
                break;
            case 1:
                str2 = "1 day left this quarter";
                break;
        }
        
        font.text(str2, x, y+height+styles.size/5);

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
            doc.scale(0.05);    // the actual logo is huge.. scale it down to 5%
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

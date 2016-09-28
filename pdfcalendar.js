var PDFDrawing = require('./pdfdrawing.js');
var DateUtils = require('./dateutils.js');
var FontUtils = require('./fontutils.js');

var dateutils = new DateUtils();

var MONTHS = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

var PDFCalendar = function (document) {

    var pdf = new PDFDrawing(document);

    /**
     * draw headings for each day of the week as a row
     *
     * S  M  T  W  T  F  S
     */
    var drawMonthColumnHeaders = function (x, y, styles) {
        var fontUtils = new FontUtils(styles.size);
        var colWidth = fontUtils.columnWidth();

        var fontHeader = pdf.text('Times-Bold',
            styles.color,
            styles.size, {
                align: 'center',
                width: colWidth,
                lineBreak: false
            });

        var weekHeaders = ["S", "M", "T", "W", "T", "F", "S"];

        for (var i = 0; i < weekHeaders.length; i++) {
            fontHeader.print(weekHeaders[i], x, y);
            x += colWidth;
        }

    };

    /*
     * highlight this row by filling it with the highlight color
     */
    var highlightRow = function (x, y, width, styles) {
        var fontUtils = new FontUtils(styles.size);
        var whitespace = fontUtils.rowSpace();
        var height = styles.size;

        var rect = pdf.rectangle(styles.highlightColor, .75);
        rect.filled(x, y - whitespace, width, height);
    };

    /*
     * make current cell stand out by removing the highlight color
     * we do this because highlightRow() has already filled the
     * background color with the highlight color
     */
    var removeHighlightFromCell = function (x, y, styles) {
        var fontUtils = new FontUtils(styles.size);
        var colWidth = fontUtils.columnWidth();
        var whitespace = fontUtils.rowSpace();

        var height = styles.size;
        var border = whitespace / 5; // keep small border at top and bottom

        // draw white rectangle to erase highlight color for this day of the week
        var rect = pdf.rectangle(styles.backgroundColor, .75);
        rect.filled(x, y - whitespace + border, colWidth, height - border * 2);
    };

    /**
     * draw the days of a given week in a row format, e.g.
     *
     * 7  8  9  10  11  12  13
     *
     */
    var drawWeek = function (curDay, date, x, y, styles) {

        var days = dateutils.daysInMonth(date);

        var fontUtils = new FontUtils(styles.size);
        var colWidth = fontUtils.columnWidth();

        var highlightWeek = styles.highlight && dateutils.isCurrentWeek(curDay, date);

        // init the day of week header and month number font styles
        // we want them centered within the specified column width
        // each character is placed individually, so we set the lineBreak to false
        // since we never want any word wrap across lines

        var fontMonth = pdf.text('Times-Roman',
            styles.color,
            styles.size, {
                align: 'center',
                width: colWidth,
                lineBreak: false
            });

        var fontMonthHighlight = pdf.text('Times-Roman',
            styles.backgroundColor,
            styles.size, {
                align: 'center',
                width: colWidth,
                lineBreak: false
            });

        for (var j = 1; j <= 7; j++) {
            var dayText = (curDay > 0 && curDay <= days) ? curDay.toString() : "";

            if (styles.highlight && highlightWeek) {
                if (dateutils.isToday(curDay, date)) {
                    removeHighlightFromCell(x, y, styles);

                    fontMonth.print(dayText, x, y);
                } else {
                    fontMonthHighlight.print(dayText, x, y);
                }
            } else {
                fontMonth.print(dayText, x, y);
            }

            x += colWidth; // advance to next column
            curDay++;
        }
    };

    /**
     * draw all content of the weeks in the calendar, e.g.:
     *
     *    1  2  3  4  5  6
     *  7 8  9  10 11 12 13
     * 14 15 16 17 18 19 20
     * 21 22 23 24 25 26 27
     * 28 29 30
     *
     */
    var drawMonth = function (date, x, y, styles) {
        var fontUtils = new FontUtils(styles.size);
        var colWidth = fontUtils.columnWidth();
        var lineHeight = styles.size + fontUtils.rowSpace();

        //        console.log("colWidth = " + colWidth + ", lineHeight = " + lineHeight);

        var firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        var curDay = ((firstOfMonth.getDay() + 1) * -1) + 2;

        //    console.log("Month = " + date.getMonth() + " DaysInMonth= " +
        //        days + " firstDay = " + firstOfMonth.getDay() + " curDay = " + curDay);

        var yVal = y;

        // the max number of rows required to display the days of the month is
        // 6 based on how the first of the month lands and how many days are in the month.
        // we loop through each row and lay out the days of the month.
        var maxRows = 6;

        for (var row = 0; row < maxRows; row++) {

            yVal += lineHeight;

            if (styles.highlight && dateutils.isCurrentWeek(curDay, date)) {
                highlightRow(x, yVal, colWidth * 7, styles);
            }

            drawWeek(curDay, date, x, yVal, styles);

            curDay += 7;
        }
    };

    var monthCalendar = function(date, x, y, styles) {
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

        drawMonthColumnHeaders(x, y, styles);

        drawMonth(date, x, y, styles);
    };

    /* private function */
    var sideBySideCalendar = function (date1, date2, x, y, styles) {
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

        var fontUtils = new FontUtils(styles.size);
        var colWidth = fontUtils.columnWidth();
        var rowHeight = styles.size + fontUtils.rowSpace();
        var spacer = styles.size;

        var xVal = x;

        var shortMonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                           "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        // text style for drawing the three letter month (e.g. JAN, FEB)
        // we specify a left alignment and no lineBreak since we don't
        // want this text to wrap
        var fontShortMonth = pdf.text('Times-Roman',
            styles.color,
            styles.size + 1, {
                align: 'left',
                lineBreak: false
            });

        // this month
        fontShortMonth.print(shortMonths[date1.getMonth()], xVal, y);
        xVal += fontShortMonth.width(shortMonths[date1.getMonth()]);

        monthCalendar(date1, xVal + spacer, y, styles);

        xVal += spacer + colWidth * 7;

        // separator line between calendars
        xVal += spacer * 2;
        var line = pdf.line(styles.color, 0.25);
        line.vertical(xVal,
            y + rowHeight,
            rowHeight * 5 - 2);

        xVal += spacer;

        // second month calendar
        monthCalendar(date2, xVal + spacer, y, styles);

        xVal += spacer + colWidth * 7;
        xVal += spacer;

        // second month three letter month
        fontShortMonth.print(shortMonths[date2.getMonth()], xVal, y);

    };

    /** public functions of this object **/

    this.monthCalendar = monthCalendar;

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

        var date2 = dateutils.nextMonth(date);

        sideBySideCalendar(date, date2, x, y, styles);
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
         *                  1 2 3 4 5 6
         *                7 8 9 ...
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

        var month = MONTHS[date.getMonth()];

        var fontUtils = new FontUtils(styles.size);
        var colWidth = fontUtils.columnWidth();
        var fontSize = styles.size + 1;
        var rowHeight = fontSize + fontSize / 5;

        var fontHeader = pdf.text('Times-Roman',
            styles.color,
            fontSize, {
                align: 'center',
                width: colWidth * 7,
                lineBreak: false
            });

        fontHeader.print(month, x + 45, y);

        styles.highlight = true; // turn on highlighting current month for top calendar

        monthCalendar(date, x + 45, y + rowHeight, styles);

        var datePrev = dateutils.prevMonth(date);
        var dateNext = dateutils.nextMonth(date);

        styles.highlight = false; // no highlighting for the other months

        sideBySideCalendar(datePrev, dateNext, x, y + rowHeight + 45, {
            color: styles.color,
            size: styles.size * .85
        });
    };

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

        var day = theDate.getDate().toString();

        var font = pdf.text('Times-Roman', styles.color, styles.size, {
            align: 'center',
            width: styles.width,
            lineBreak: false
        });

        font.print(day, x, y);
    };

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

        var month = MONTHS[theDate.getMonth()];
        var year = theDate.getFullYear().toString();
        var textWidth = styles.width;
        var fontMonth = pdf.text('Times-Roman', styles.color, styles.size, {
            align: 'left'
        });
        var fontYear = pdf.text('Helvetica', styles.color, styles.size / 3, {
            align: 'left'
        });

        fontMonth.printScaleToWidth(month, x, y, textWidth);

        y = y + fontMonth.height(month) - 2;

        var line = pdf.line(styles.color, 0.25);
        line.horizontal(x, y, textWidth);

        fontYear.printSpaceToWidth(year, x, y + 1, textWidth);

        var height = fontYear.height(year);

        line.horizontal(x, y + height + 1, textWidth);

    };

};

module.exports = PDFCalendar;

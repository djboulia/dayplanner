PDFDocument = require('pdfkit');

var PageDetails = require('./pagedetails.js');
var topMargin = 13; // minimum we can start from top
var bottomMargin = 767; // maximum we can use at bottom
var leftMargin = 55;

function Todo(date) {
    var styles = { lineHeight : 23.75 };    // [djb 09/23/2016] originally lineHeight=21

    var doc = new PDFDocument({
        size: 'letter'
    });

    this.open = function (stream) {
        doc.pipe(stream);
    };

    this.close = function () {
        doc.end();
    };

    this.addPage = function () {
        doc.addPage();
    };


    this.frontPage = function () {
        var page = new PageDetails(doc);

        page.dayLabel(date, leftMargin, topMargin + 10, {
            color: page.colors.gray,
            size: 45,
            width: 80
        });

        page.monthLabel(date, leftMargin, topMargin + 50, {
            color: page.colors.gray,
            width: 80,
            size: 28
        });

        page.quarterCalendar(date, 150, topMargin);

        page.factoids(date, 425, topMargin);
        page.ibmLogo(525, topMargin);

        var startY = topMargin + 50 + 45;
        var todoHeight = styles.lineHeight*7;

        page.todoArea("Work Items", leftMargin, startY, 250, todoHeight, styles);

        var homeItemsHeight = styles.lineHeight*5;
        page.todoArea("Personal Items", 315,
            topMargin + 30,
            525 - 315 + leftMargin,
            homeItemsHeight,
            styles);

        page.ruledArea("Reminders", 315,
            topMargin + homeItemsHeight + 50,
            525 - 315 + leftMargin,
            startY + todoHeight - (topMargin + homeItemsHeight + 50),
            styles);

        todoHeight += 20;

        var stylesNotes = JSON.parse(JSON.stringify(styles));
        stylesNotes.color = page.colors.mediumGray;

        page.notesArea(leftMargin,
            startY + todoHeight,
            525,
            bottomMargin - startY - todoHeight,
            stylesNotes);

    };

    this.backPage = function () {
        var page = new PageDetails(doc);

        page.monthLabel(date, 30, topMargin, {
            color: page.colors.gray,
            width: 80,
            size: 28
        });

        page.twoMonthCalendar(date, 375, topMargin);

        page.notesArea(30, 52, 520, 715, styles);
    };

};


module.exports = Todo;

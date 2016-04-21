PDFDocument = require('pdfkit');

var PageDetails = require('./pagedetails.js');
var topMargin = 13; // minimum we can start from top
var bottomMargin = 767; // maximum we can use at bottom
var leftMargin = 55;

function Todo(date) {
    var doc = new PDFDocument({
        size: 'letter'
    });
    var page = new PageDetails(doc);

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
        page.dayLabel(date, leftMargin, topMargin + 10, {
            color: page.styles.rgb.gray,
            size: 45,
            width: 80
        });

        page.monthLabel(date, leftMargin, topMargin + 50, {
            color: page.styles.rgb.gray,
            width: 80,
            size: 28
        });

        page.quarterCalendar(date, 150, topMargin);

        page.factoids(date, 425, topMargin);
        page.ibmLogo(525, topMargin);

        var startY = topMargin + 50 + 45;
        var todoHeight = 170;

        page.todoArea("Work Items", leftMargin, startY, 250, todoHeight);

        var homeItemsHeight = 108;
        page.todoArea("Personal Items", 315,
            topMargin + 30,
            525 - 315 + leftMargin,
            homeItemsHeight);

        page.ruledArea("Reminders", 315,
            topMargin + homeItemsHeight + 50,
            525 - 315 + leftMargin,
            startY + todoHeight - (topMargin + homeItemsHeight + 50));

        todoHeight += 20;

        page.notesArea(leftMargin,
            startY + todoHeight,
            525,
            bottomMargin - startY - todoHeight, {
                color: page.styles.rgb.mediumGray
            });

    };

    this.backPage = function () {
        page.monthLabel(date, 30, topMargin, {
            color: page.styles.rgb.gray,
            width: 80,
            size: 28
        });

        page.twoMonthCalendar(date, 375, topMargin);

        page.notesArea(30, 52, 520, 715);
    };

};


module.exports = Todo;
PDFDocument = require('pdfkit');

var PageDetails = require('./pagedetails.js');


function Planner(date) {
    var styles = { lineHeight : 23.75 };    // [djb 09/23/2016] originally lineHeight=21

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
        page.monthLabel(date, 55, 13);

        page.twoMonthCalendar(date, 405, 13);

        page.notesArea(55, 52, 525, 715, styles);
    };

    this.backPage = function () {
        var topMargin = 13;

        page.monthLabel(date, 30, topMargin);

        page.twoMonthCalendar(date, 375, topMargin);

        page.notesArea(30, 52, 520, 715, styles);
    };

};


module.exports = Planner;

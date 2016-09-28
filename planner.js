PDFDocument = require('pdfkit');

var PageDetails = require('./pagedetails.js');

function Planner(date) {
    var pageNumber = 1;

    var getCurrentPageMargins = function () {
        var margin = {
            left: 30,
            width: 520,
            top: 13, // minimum we can start from top
            height: 767 // maximum height of page
        };

        // odd pages have an additional offset on the left
        // to allow for hole punching/binding
        if (pageNumber % 2 == 1) {
            margin.left += 25;
        };

        return margin;
    };

    var styles = {
        lineHeight: 23.75 // [djb 09/23/2016] originally lineHeight=21
    };

    var doc = new PDFDocument({
        size: 'letter'
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


    this.renderTodo = function () {
        var page = new PageDetails(doc);
        var margin = getCurrentPageMargins();

        page.dayLabel(date, margin.left, margin.top + 10, {
            color: page.colors.gray,
            size: 45,
            width: 80
        });

        page.monthLabel(date, margin.left, margin.top + 50, {
            color: page.colors.gray,
            width: 80,
            size: 28
        });

        page.quarterCalendar(date, margin.left + 95, margin.top);

        var rightMargin = margin.left + margin.width;

        // offset factoids and ibm logo from right margin
        page.factoids(date, rightMargin - 150, margin.top);
        page.ibmLogo(rightMargin - 50, margin.top);

        var startY = margin.top + 50 + 45;
        var todoHeight = styles.lineHeight * 7;
        var workItemsWidth = 250;

        page.todoArea("Work Items", margin.left, startY, workItemsWidth, todoHeight, styles);

        var homeItemsHeight = styles.lineHeight * 5;
        var secondColumn = margin.left + workItemsWidth + 10;

        page.todoArea("Personal Items", secondColumn,
            margin.top + 30,
            rightMargin - secondColumn,
            homeItemsHeight,
            styles);

        page.ruledArea("Reminders", secondColumn,
            margin.top + homeItemsHeight + 50,
            rightMargin - secondColumn,
            startY + todoHeight - (margin.top + homeItemsHeight + 50),
            styles);

        todoHeight += 20;

        var stylesNotes = JSON.parse(JSON.stringify(styles));
        stylesNotes.color = page.colors.mediumGray;

        page.notesArea(margin.left,
            startY + todoHeight,
            margin.width,
            margin.height - startY - todoHeight,
            stylesNotes);

    };

    this.renderNotes = function () {
        var page = new PageDetails(doc);
        var margin = getCurrentPageMargins();

        page.monthLabel(date, margin.left, margin.top, {
            color: page.colors.gray,
            width: 80,
            size: 28
        });

        page.twoMonthCalendar(date, margin.left + 345, margin.top);

        page.notesArea(margin.left, margin.top + 39, margin.width, margin.height - 52, styles);
    };

};


module.exports = Planner;

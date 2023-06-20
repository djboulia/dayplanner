PDFDocument = require('pdfkit');

var PageDetails = require('./pagedetails.js');

var RGB = require('./rgb.js');

function Planner(date, theme, logo) {
  var pageNumber = 1;

  if (!theme) {
    // default theme
    theme = {
      colorDay: RGB.gray,
      colorMonth: RGB.gray,
      colorCalendar: RGB.mediumGray,
      colorNotesHeader: RGB.mediumGray,
      colorNotesRulerLines: RGB.lightBlue,
      logo: {
        color: undefined,
        scale: 1.0,
        svg: undefined, // see IBMLogo.js or CNLogo.js for example
      },
    };
  }

  var getCurrentPageMargins = function () {
    // [djb 04/08/2020] moved top margin to 15 from 13 to avoid cutting
    //                  off the top of page on inkjet printers. (COVID-19)
    var margin = {
      left: 30,
      width: 520,
      top: 15, // minimum we can start from top
      height: 767, // maximum height of page
    };

    // odd pages have an additional offset on the left
    // to allow for hole punching/binding
    if (pageNumber % 2 == 1) {
      margin.left += 25;
    }

    return margin;
  };

  var styles = {
    lineHeight: 23.75, // [djb 09/23/2016] originally lineHeight=21
  };

  var doc = new PDFDocument({
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

  /**
   * renders a page with todo list at the top, note taking area below
   */
  this.renderTodoAndNotes = function () {
    var page = new PageDetails(doc);
    var margin = getCurrentPageMargins();

    page.dayLabel(date, margin.left, margin.top + 10, {
      color: theme.colorDay,
      size: 45,
      width: 80,
    });

    page.monthLabel(date, margin.left, margin.top + 50, {
      color: theme.colorMonth,
      width: 80,
      size: 28,
    });

    var stylesCalendar = JSON.parse(JSON.stringify(styles));
    stylesCalendar.color = theme.colorCalendar;
    stylesCalendar.highlightColor = theme.colorCalendar;
    stylesCalendar.backgroundColor = RGB.white;

    page.quarterCalendar(date, margin.left + 180, margin.top, stylesCalendar);

    var rightMargin = margin.left + margin.width;

    // offset factoids and  logo from right margin
    page.factoids(date, rightMargin - 150, margin.top, stylesCalendar);

    const logo = theme.logo;
    if (logo && logo.svg) {
      page.logo(logo.svg, rightMargin - 50, margin.top, { color: logo.color, scale: logo.scale });
    }

    var startY = margin.top + 50 + 45;
    var todoHeight = styles.lineHeight * 7;
    var workItemsWidth = 250;

    page.todoArea('Work Items', margin.left, startY, workItemsWidth, todoHeight, styles);

    var homeItemsHeight = styles.lineHeight * 5;
    var secondColumn = margin.left + workItemsWidth + 10;

    var stylesNotes = JSON.parse(JSON.stringify(styles));
    stylesNotes.color = theme.colorNotesHeader;
    stylesNotes.lineColor = theme.colorNotesRulerLines;

    page.todoArea(
      'Personal Items',
      secondColumn,
      margin.top + 30,
      rightMargin - secondColumn,
      homeItemsHeight,
      stylesNotes,
    );

    page.ruledArea(
      'Reminders',
      secondColumn,
      margin.top + homeItemsHeight + 50,
      rightMargin - secondColumn,
      startY + todoHeight - (margin.top + homeItemsHeight + 50),
      stylesNotes,
    );

    todoHeight += 20;

    page.notesArea(
      margin.left,
      startY + todoHeight,
      margin.width,
      margin.height - startY - todoHeight,
      stylesNotes,
    );
  };

  /**
   * lays out a To-do page where the To-do list occupies the full page
   */
  this.renderTodo = function () {
    var page = new PageDetails(doc);
    var margin = getCurrentPageMargins();

    page.dayLabel(date, margin.left, margin.top, {
      color: theme.colorDay,
      size: 45,
      width: 80,
    });

    page.monthLabel(date, margin.left, margin.top + 50, {
      color: theme.colorMonth,
      width: 80,
      size: 28,
    });

    var stylesCalendar = JSON.parse(JSON.stringify(styles));
    stylesCalendar.color = theme.colorCalendar;
    stylesCalendar.highlightColor = theme.colorCalendar;
    stylesCalendar.backgroundColor = RGB.white;

    page.quarterCalendar(date, margin.left + 180, margin.top, stylesCalendar);

    var rightMargin = margin.left + margin.width;

    // offset factoids and logo from right margin
    page.factoids(date, rightMargin - 160, margin.top + 53, stylesCalendar);

    const logo = theme.logo;
    if (logo && logo.svg) {
      page.logo(logo.svg, rightMargin - 75, margin.top, { color: logo.color, scale: logo.scale });
    }

    var startY = margin.top + 50 + 45;
    var todoHeight = styles.lineHeight * 7;
    var workItemsWidth = 250;

    var secondColumn = margin.left + workItemsWidth + 10;

    var stylesNotes = JSON.parse(JSON.stringify(styles));
    stylesNotes.color = theme.colorNotesHeader;
    stylesNotes.lineColor = theme.colorNotesRulerLines;

    page.todoArea('Personal Items', margin.left, startY, workItemsWidth, todoHeight, stylesNotes);

    page.ruledArea(
      'Reminders',
      secondColumn,
      startY,
      rightMargin - secondColumn,
      todoHeight,
      stylesNotes,
    );

    todoHeight += 20;

    page.todoWithDateArea(
      'Work Items',
      margin.left,
      startY + todoHeight,
      margin.width,
      margin.height - startY - todoHeight,
      stylesNotes,
    );
  };

  this.renderNotes = function () {
    var page = new PageDetails(doc);
    var margin = getCurrentPageMargins();

    page.monthLabel(date, margin.left, margin.top, {
      color: theme.colorMonth,
      width: 80,
      size: 28,
    });

    var stylesCalendar = JSON.parse(JSON.stringify(styles));
    stylesCalendar.color = theme.colorCalendar;
    stylesCalendar.highlightColor = theme.colorCalendar;
    stylesCalendar.backgroundColor = RGB.white;

    page.twoMonthCalendar(date, margin.left + 180, margin.top, stylesCalendar);

    var rightMargin = margin.left + margin.width;

    const logo = theme.logo;
    if (logo && logo.svg) {
      page.logo(logo.svg, rightMargin - 75, margin.top, { color: logo.color, scale: logo.scale });
    }

    var stylesNotes = JSON.parse(JSON.stringify(styles));
    stylesNotes.color = theme.colorNotesHeader;
    stylesNotes.lineColor = theme.colorNotesRulerLines;

    page.notesArea(margin.left, margin.top + 41, margin.width, margin.height - 54, stylesNotes);
  };
}

module.exports = Planner;

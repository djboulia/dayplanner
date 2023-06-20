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
        svg: undefined, // no logo by default - see IBMLogo.js or CNLogo.js for example
      },
    };
  }

  var getCurrentPageMargins = function () {
    // [djb 04/08/2020] moved top margin to 15 from 13 to avoid cutting
    //                  off the top of page on inkjet printers. (COVID-19)

    // odd pages have an additional offset on the left
    // to allow for hole punching/binding
    const left = pageNumber % 2 == 1 ? 55 : 30;
    const width = 520;

    const margin = {
      left: left,
      right: left + width,
      width: width,
      top: 15, // minimum we can start from top
      height: 767, // maximum height of page
    };

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

  const renderTopHeader = function (page, margin) {
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

    // offset factoids and logo from right margin
    page.factoids(date, margin.right - 60, margin.top + 70, stylesCalendar);

    const logo = theme.logo;
    if (logo && logo.svg) {
      page.logo(logo.svg, margin.right - 75, margin.top, {
        color: logo.color,
        scale: logo.scale,
      });
    }
  };

  /**
   * renders a page with todo list at the top, note taking area below
   */
  this.renderTodoAndNotes = function () {
    var page = new PageDetails(doc);
    var margin = getCurrentPageMargins();

    renderTopHeader(page, margin);

    var startY = margin.top + 50 + 45;
    var todoHeight = styles.lineHeight * 10;
    var workItemsWidth = 250;

    var stylesNotes = JSON.parse(JSON.stringify(styles));
    stylesNotes.color = theme.colorNotesHeader;
    stylesNotes.lineColor = theme.colorNotesRulerLines;

    page.todoArea('Work Items', margin.left, startY, workItemsWidth, todoHeight, stylesNotes);

    var homeItemsHeight = styles.lineHeight * 5;
    var secondColumn = margin.left + workItemsWidth + 10;

    const width = margin.width - secondColumn;
    console.log('secondColumn: ' + secondColumn + ' margin.width-secondColumn: ' + width);

    page.todoArea(
      'Personal Items',
      secondColumn,
      startY,
      margin.right - secondColumn,
      homeItemsHeight,
      stylesNotes,
    );

    page.ruledArea(
      'Reminders',
      secondColumn,
      startY + homeItemsHeight + 20,
      margin.right - secondColumn,
      startY + todoHeight - (startY + homeItemsHeight + 20),
      stylesNotes,
    );

    todoHeight += 20;

    console.log('margin.left ' + margin.left + ', margin.width ' + margin.width);
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

    renderTopHeader(page, margin);

    var startY = margin.top + 50 + 45;
    var todoHeight = styles.lineHeight * 7 + 3;
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
      margin.right - secondColumn,
      todoHeight,
      stylesNotes,
    );

    todoHeight += 20;

    page.todoWithDateArea(
      'Work Items',
      margin.left,
      startY + todoHeight,
      margin.width,
      margin.height - startY - todoHeight - 14,
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

    const logo = theme.logo;
    if (logo && logo.svg) {
      page.logo(logo.svg, margin.right - 75, margin.top, { color: logo.color, scale: logo.scale });
    }

    var stylesNotes = JSON.parse(JSON.stringify(styles));
    stylesNotes.color = theme.colorNotesHeader;
    stylesNotes.lineColor = theme.colorNotesRulerLines;

    page.notesArea(margin.left, margin.top + 41, margin.width, margin.height - 54, stylesNotes);
  };
}

module.exports = Planner;

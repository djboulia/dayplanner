PDFDocument = require('pdfkit');

const PageDetails = require('../pagedetails.js');
const DefaultTheme = require('../themes/defaulttheme.js');
const RGB = require('../utils/rgb.js');
const getPageMargins = require('../utils/margins.js');
const mergeObjects = require('../utils/mergeobjects.js');

function Planner(date, theme) {
  let pageNumber = 1;

  theme = mergeObjects(DefaultTheme, theme);

  const getCalendarStyles = function () {
    const stylesCalendar = { lineHeight: theme.lineHeight };
    stylesCalendar.color = theme.calendar.color;
    stylesCalendar.highlightColor = theme.calendar.color;
    stylesCalendar.backgroundColor = RGB.white;

    return stylesCalendar;
  };

  const getNotesStyles = function () {
    const stylesNotes = { lineHeight: theme.lineHeight };
    stylesNotes.color = theme.notes.header.colorBackground;
    stylesNotes.lineColor = theme.notes.rule.color;

    return stylesNotes;
  };

  const renderTopHeader = function (page, margin) {
    page.dayLabel(date, margin.left, margin.top, {
      color: theme.date.day.color,
      size: 45,
      width: 80,
    });

    page.monthLabel(date, margin.left, margin.top + 50, {
      color: theme.date.month.color,
      width: 80,
      size: 28,
    });

    const stylesCalendar = getCalendarStyles();

    page.quarterCalendar(date, margin.left + 180, margin.top, stylesCalendar);
    // offset factoids and logo from right margin
    page.daysLeft(date, margin.right - 60, margin.top + 70, stylesCalendar);

    const logo = theme.logo;
    if (logo && logo.svg) {
      page.logo(logo.svg, margin.right - 75, margin.top, {
        color: logo.color,
        scale: logo.scale,
      });
    }
  };

  const doc = new PDFDocument({
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
    const page = new PageDetails(doc);
    const margin = getPageMargins(pageNumber);

    renderTopHeader(page, margin);

    let todoHeight = theme.lineHeight * 10;
    const startY = margin.top + 50 + 45;
    const workItemsWidth = 250;

    const stylesNotes = getNotesStyles();

    page.todoArea('Work Items', margin.left, startY, workItemsWidth, todoHeight, stylesNotes);

    const homeItemsHeight = theme.lineHeight * 5;
    const secondColumn = margin.left + workItemsWidth + 10;

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
    const page = new PageDetails(doc);
    const margin = getPageMargins(pageNumber);

    renderTopHeader(page, margin);

    let todoHeight = theme.lineHeight * 7 + 3;
    const startY = margin.top + 50 + 45;
    const workItemsWidth = 250;

    const secondColumn = margin.left + workItemsWidth + 10;

    const stylesNotes = getNotesStyles();

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

  /**
   * renders a ruled page with a monthly calendar for the given date
   */
  this.renderNotes = function () {
    const page = new PageDetails(doc);
    const margin = getPageMargins(pageNumber);

    page.monthLabel(date, margin.left, margin.top, {
      color: theme.date.month.color,
      width: 80,
      size: 28,
    });

    const stylesCalendar = getCalendarStyles();

    page.twoMonthCalendar(date, margin.left + 180, margin.top, stylesCalendar);

    const logo = theme.logo;
    if (logo && logo.svg) {
      page.logo(logo.svg, margin.right - 75, margin.top, { color: logo.color, scale: logo.scale });
    }

    const stylesNotes = getNotesStyles();

    page.notesArea(margin.left, margin.top + 41, margin.width, margin.height - 54, stylesNotes);
  };
}

module.exports = Planner;

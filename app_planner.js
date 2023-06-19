/**
 *
 * outputs a PDF file with a DayPlanner style notes page on front and back
 * with a calendar for the given month
 *
 * @djboulia [12/8/2016]
 *
 **/

var Planner = require('./planner.js');
var fs = require('fs');

var DateUtils = require('./dateutils.js');
var dateutils = new DateUtils();

var CmdLine = require('./cmdline.js');
var cmdLine = new CmdLine();

var CNLogo = require('./cnlogo.js');

var config = cmdLine.parse();

if (!config) {
  cmdLine.printUsageAndExit();
}

var month = dateutils.getMonthName(config.date.getMonth());

console.log('Generating planner for month ' + month);

var CHARITY_NAVIGATOR = {
  green: '#89e260',
  blue: '#3f5df5',
  black: '#011936',
};

var theme = {
  dateDay: CHARITY_NAVIGATOR.blue,
  dateMonth: CHARITY_NAVIGATOR.black,
  calendar: CHARITY_NAVIGATOR.black,
  notesHeader: CHARITY_NAVIGATOR.black,
  notesRulerLines: CHARITY_NAVIGATOR.blue,
};

var logo = {
  color: undefined,
  scale: 0.125,
  svg: CNLogo,
};

var planner = new Planner(config.date, theme, logo);

planner.open(fs.createWriteStream(config.filename));

planner.renderNotes();

planner.close();

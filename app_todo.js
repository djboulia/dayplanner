/**
 *
 * outputs a PDF file with a DayPlanner style todo list on the front and a ruled
 * notes page on the back, tailored for the given date
 *
 * @djboulia [12/8/2016]
 *
 * Change History
 * 12/8/2016 -  Initial version
 * 8/27/2020 -  Modified to produce a single, full page todo for
 *              integration with Good Notes (iPad/Mac)
 *
 **/

var Planner = require('./planner.js');
var fs = require('fs');

var CmdLine = require('./cmdline.js');
var cmdLine = new CmdLine();
var CNLogo = require('./cnlogo.js');

var config = cmdLine.parse();

if (!config) {
  cmdLine.printUsageAndExit();
}

console.log('Generating todo sheet for date ' + config.date.toLocaleDateString());

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

planner.renderTodo();

planner.close();

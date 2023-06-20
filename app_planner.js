/**
 *
 * outputs a PDF file with a DayPlanner style notes page on front and back
 * with a calendar for the given month
 *
 * @djboulia [12/8/2016]
 *
 **/

var fs = require('fs');

var CmdLine = require('./cmdline.js');
var DateUtils = require('./dateutils.js');
var Planner = require('./planner.js');
var theme = require('./theme.js');

var cmdLine = new CmdLine();
var config = cmdLine.parse();
if (!config) {
  cmdLine.printUsageAndExit();
}

var dateutils = new DateUtils();
var month = dateutils.getMonthName(config.date.getMonth());

console.log('Generating planner for month ' + month);

var planner = new Planner(config.date, theme);

planner.open(fs.createWriteStream(config.filename));
planner.renderNotes();
planner.close();

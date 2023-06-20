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

var fs = require('fs');

var CmdLine = require('./cmdline.js');
var Planner = require('./planner.js');
var theme = require('./theme.js');

var cmdLine = new CmdLine();
var config = cmdLine.parse();
if (!config) {
  cmdLine.printUsageAndExit();
}

console.log('Generating todo sheet for date ' + config.date.toLocaleDateString());

var planner = new Planner(config.date, theme);

planner.open(fs.createWriteStream(config.filename));
planner.renderTodo();
planner.close();

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

const fs = require('fs');

const CmdLine = require('./utils/cmdline.js');
const Planner = require('./planners/planner.js');
const theme = require('./themes/cntheme.js');

const cmdLine = new CmdLine();
const config = cmdLine.parse();
if (!config) {
  cmdLine.printUsageAndExit();
}

console.log('Generating todo sheet for date ' + config.date.toLocaleDateString());

const planner = new Planner(config.date, theme);

planner.open(fs.createWriteStream(config.filename));
planner.renderTodo();
planner.close();

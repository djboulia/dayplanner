/**
 *
 * outputs a PDF file with a DayPlanner style notes page on front and back
 * with a calendar for the given month
 *
 * @djboulia [12/8/2016]
 *
 **/

const fs = require('fs');

const CmdLine = require('./utils/cmdline.js');
const DateUtils = require('./utils/date.js');
const Planner = require('./planners/planner.js');
const theme = require('./themes/cntheme.js');

const cmdLine = new CmdLine();
const config = cmdLine.parse();
if (!config) {
  cmdLine.printUsageAndExit();
}

const dateutils = new DateUtils();
const month = dateutils.getMonthName(config.date.getMonth());

console.log('Generating planner for month ' + month);

const planner = new Planner(config.date, theme);

planner.open(fs.createWriteStream(config.filename));
planner.renderNotes();
planner.close();

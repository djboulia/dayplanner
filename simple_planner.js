/**
 *
 * outputs a PDF file with a basic planner style page
 *
 **/

const fs = require('fs');

const CmdLine = require('./utils/cmdline.js');
const SimplePlanner = require('./planners/simpleplanner.js');
const theme = require('./themes/waketheme.js');

const cmdLine = new CmdLine();
const config = cmdLine.parse();
if (!config) {
  cmdLine.printUsageAndExit();
}

console.log('Generating simple planner');

const planner = new SimplePlanner(theme);

planner.open(fs.createWriteStream(config.filename));
planner.renderNotes();
planner.close();

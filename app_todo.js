/**
 *
 * outputs a PDF file with a DayPlanner style todo list on the front and a ruled
 * notes page on the back, tailored for the given date
 *
 * @djboulia [12/8/2016]
 *
 **/

var Planner = require('./planner.js');
var fs = require('fs');

var CmdLine = require('./cmdline.js');
var cmdLine = new CmdLine();

var config = cmdLine.parse();

if (!config) {
    cmdLine.printUsageAndExit();
}

console.log("Generating todo sheet for date " + config.date.toLocaleDateString());

var doc = new Planner(config.date);

doc.open(fs.createWriteStream(config.filename));

doc.renderTodo();
doc.newPage();
doc.renderNotes();

doc.close();

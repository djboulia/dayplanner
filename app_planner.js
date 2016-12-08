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

var config = cmdLine.parse();

if (config) {

    var month = dateutils.getMonthName(config.date.getMonth());

    console.log("Generating planner for month " + month);

    var planner = new Planner(config.date);

    planner.open(fs.createWriteStream(config.filename));

    planner.renderNotes();
    planner.newPage();
    planner.renderNotes();

    planner.close();

} else {
    cmdLine.printUsageAndExit();
}

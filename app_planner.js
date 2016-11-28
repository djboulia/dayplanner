var Planner = require('./planner.js');
var fs = require('fs');
var Config = require('./config.js');
var DateUtils = require('./dateutils.js');

var config = new Config();
var dateutils = new DateUtils();

if (config.parseCommandLine()) {

    console.log("Generating planner for month " + dateutils.getMonthName(config.date.getMonth()));

    var planner = new Planner(config.date);

    planner.open(fs.createWriteStream(config.filename));

    planner.renderNotes();

    planner.newPage();

    planner.renderNotes();

    planner.close();

} else {
    config.printUsageAndExit();
}

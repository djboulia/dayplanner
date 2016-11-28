var Planner = require('./planner.js');
var fs = require('fs');
var Config = require('./config.js');

var config = new Config();

if (config.parseCommandLine()) {

    console.log("Generating todo sheet for date " + config.date.toLocaleDateString());

    var doc = new Planner(config.date);

    doc.open(fs.createWriteStream(config.filename));

    doc.renderTodo();

    doc.newPage();

    doc.renderNotes();

    doc.close();

} else {
    config.printUsageAndExit();
}

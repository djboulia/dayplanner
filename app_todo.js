var Todo = require('./todoibm.js');
var fs = require('fs');

var usageAndExit = function (appName) {
    console.log("Usage: " + appName + " mm/dd/yyyy");
    process.exit(1);
}

var processArgs = function () {
    var appName = process.argv[1];
    appName = appName.substring(appName.lastIndexOf('/') + 1);

    var date = new Date();
    var args = process.argv.slice(2);

    if (args.length < 2) {
        if (args.length == 1) {

            if (args[0].toLowerCase() == 'help') {
                usageAndExit(appName);
            }

            date = new Date(args[0]);
            
            // check to see if an invalid date was supplied as an arg
            if (isNaN(date.getTime())) {
                console.log("Invalid date");
                usageAndExit(appName);
            }
        }
    } else {
        usageAndExit(appName);
    }

    // return an object with the configuration we 
    // parsed from the args
    return {
        date: date,
        filename: 'out.pdf'
    };
}

var config = processArgs();

console.log("Generating todo sheet for date " + config.date.toLocaleDateString());

var doc = new Todo(config.date);

doc.open(fs.createWriteStream(config.filename));

doc.frontPage();

doc.addPage();

doc.backPage();

doc.close();

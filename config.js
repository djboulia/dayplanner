var Config = function() {

    this.date = null;
    this.filename = "out.pdf";

    //
    // print a message to remind the user how the cmd line works, then exit
    //
    this.printUsageAndExit = function () {
        var appName = process.argv[1];
        appName = appName.substring(appName.lastIndexOf('/') + 1);

        console.log("Usage: " + appName + " mm/dd/yyyy");
        process.exit(1);
    };

    //
    //  return true if the command line was valid, false otherwise
    //
    this.parseCommandLine = function () {

        var date = new Date();
        var args = process.argv.slice(2);

        if (args.length < 2) {
            if (args.length == 1) {

                if (args[0].toLowerCase() == 'help') {
                    return false;
                }

                date = new Date(args[0]);

                // check to see if an invalid date was supplied as an arg
                if (isNaN(date.getTime())) {
                    console.log("Invalid date");

                    return false;
                }
            }
        } else {
            return false;
        }

        // set the date parsed from the command line
        this.date = date;

        return true;
    };

};

module.exports = Config;

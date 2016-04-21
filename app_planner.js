var Planner = require('./planner.js');
var fs = require('fs');

var date = new Date();
var planner = new Planner(date);

planner.open(fs.createWriteStream('out.pdf'));

planner.frontPage();

planner.addPage();

planner.backPage();

planner.close();
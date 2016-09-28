var Planner = require('./planner.js');
var fs = require('fs');

var date = new Date();
var planner = new Planner(date);

planner.open(fs.createWriteStream('out.pdf'));

planner.renderNotes();

planner.newPage();

planner.renderNotes();

planner.close();
